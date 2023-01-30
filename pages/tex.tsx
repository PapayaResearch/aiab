import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { Text, Title, Anchor, Space, Box, Image, Center, Group, Table, HoverCard } from "@mantine/core";
import { parseTeX } from "../lib/utils";
import * as Ast from "@unified-latex/unified-latex-types";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import paper from "../data/tex/main.tex";
import { parseBibFile, BibEntry, normalizeFieldValue } from "bibtex";
import { MathJax } from "better-react-mathjax";

const TeX = () => {
    const [parsed, setParsed] = useState<ReactNode[]>([]);
    const [bib, setBib] = useState<{ [key: string]: { entry: BibEntry, i: number } }>({});

    // Get list of figures and tables so all references can be made (either before or after the environment is established)
    const figures = Object.fromEntries([...paper.matchAll(/\\label{fig:([^}]+)}/g)].map((x: string[], i: number) => ["fig:" + x[1], i + 1]));
    const tables = Object.fromEntries([...paper.matchAll(/\\label{tab:([^}]+)}/g)].map((x: string[], i: number) => ["tab:" + x[1], i + 1]));
    const algorithms = Object.fromEntries([...paper.matchAll(/\\label{algo:([^}]+)}/g)].map((x: string[], i: number) => ["algo:" + x[1], i + 1]));

    const render = useCallback((node: Ast.GenericNode, key: number): ReactNode => {
        switch (node.type) {
            case "macro":
                switch (node.content) {
                    case "title": return <Title key={key} align={"center"} pt={"lg"} pb={"xl"} order={1}>{node.args[node.args.length - 1].content.map(render)}</Title>;
                    case "author":
                        let authors: Ast.GenericNode[][] = [];
                        node.args[0].content.forEach((x: Ast.GenericNode, i: number) => {
                            if (i == 0 || x.content == "and") {
                                authors.push([]);
                            }
                            authors[authors.length - 1].push(x);
                        });
                        return <Group key={key} pb={"xl"} grow>{authors.map((author: Ast.GenericNode[], i: number) => <Title key={i} align={"center"} order={5}>{author.map(render)}</Title>)}</Group>;
                    // Section headings
                    case "section": return <Title key={key} pt={"lg"} pb={0} order={2}>{node.args[node.args.length - 1].content.map(render)}</Title>;
                    case "subsection": return <Title key={key} pt={"lg"} pb={0} order={4}>{node.args[node.args.length - 1].content.map(render)}</Title>;
                    case "subsubsection": return <Title key={key} pt={"lg"} pb={0} order={5}>{node.args[node.args.length - 1].content.map(render)}</Title>;
                    case "paragraph": return <Title key={key} pt={"lg"} pb={0} order={5}>{node.args[node.args.length - 1].content.map(render)}</Title>;
                    // Text decoration
                    case "textit": return <i key={key}>{node.args[node.args.length - 1].content.map(render)}</i>;
                    case "textbf": return <b key={key}>{node.args[node.args.length - 1].content.map(render)}</b>;
                    case "textsc": return <span key={key} style={{fontVariant: "small-caps"}}>{node.args[node.args.length - 1].content.map(render)}</span>;
                    // Vertical space
                    case "medskip": return <Space key={key} h="md"/>
                    case "smallskip": <Space key={key} h="sm"/>
                    // Punctuation, etc.
                    case "\\": return <br key={key}/>;
                    case "\&": return <span key={key}>&</span>;
                    case "leq": return <span key={key}>{"≤"}</span>;
                    case "geq": return <span key={key}>{"≥"}</span>;
                    // Other types
                    case "href":
                        if (node.args.length < 2) {
                            return node.args[0].content;
                        }
                        return <Anchor key={key} href={node.args[node.args.length - 2].content.map((x: Ast.GenericNode) => x.content).join("")}>
                                {node.args[node.args.length - 1].content.map(render)}
                            </Anchor>
                    case "label":
                        const labelId = node.args[node.args.length - 1].content.map((x: Ast.GenericNode) => x.content).join("");
                        return <span key={key} id={labelId}></span>;
                    case "times": return <span key={key}>x</span>;
                    case "years": return node.args[0].content.length ? <Box key={key} pt={"xs"} style={{width: 100, display: "inline-block", transform: "translate(-125px, -9px)", position: "absolute"}}><Text size={"sm"} align={"right"}><b>{node.args[0].content.map(render)}</b></Text></Box> : null;
                    case "oplus": return "⊕";
                    case "tilde": return "~";
                    case "epsilon": return "ε";
                    case "sigma": return "σ";
                    case "mu": return "μ";
                    case "lambda": return "λ";
                    case "beta": return "ß";
                    case "eta": return "η";
                    case "lvert": case"rvert": return "|";
                    case "log": return "log";
                    case "KwIn": return <Title key={key} order={6}><br/>In:</Title>;
                    case "KwOut": return <Title key={key} order={6}><br/>Out:</Title>;
                    case "For": return <Title key={key} display={"inline"} order={6}><br/>For </Title>;
                    case "^": return <sup key={key}>{node.args[0].content.map(render)}</sup>;
                    case "hline": return undefined;
                    case "cite":
                        const ref = node.args[1].content[0].content.toLowerCase();
                        if (!bib[ref]) {
                            return undefined;
                        }
                        const n = bib[ref].i;
                        const entry = bib[ref].entry;
                        return <HoverCard key={key}>
                            <HoverCard.Target>
                                <Text display={"inline"}><Anchor href={"#ref:" + n}>{"[" + n + "]"}</Anchor></Text>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Box p={"md"} style={{width: 400}}>
                                    <Title order={6}><b>{normalizeFieldValue(entry.fields.title)}</b></Title>
                                    <Text size={"sm"}><b>{normalizeFieldValue(entry.fields.author) + "."}</b></Text>
                                    <Text size={"sm"}><b>{normalizeFieldValue(entry.fields.year)}</b></Text>
                                </Box>
                            </HoverCard.Dropdown>
                        </HoverCard>;
                    case "ref":
                        const refName: string = node.args[node.args.length - 1].content.map((x: Ast.GenericNode) => x.content).join("");
                        const refType: string = refName.split(":")[0];
                        const refSet = {fig: figures, tab: tables}[refType];
                        if (refSet) {
                            return <Anchor key={key} href={"#" + refName}>{refSet[refName]}</Anchor>
                        }
                    default: console.log(node); return undefined;

                }
            case "string": return <Text key={key} display={"inline"}>{node.content}</Text>;
            case "whitespace": return " ";
            case "group": return node.content.map(render);
            case "parbreak": return null; // These are tricky without some logic to "normalize" (e.g. when there are a list of many) so we ignore it for now
            case "comment": return null; // Comments could be used for additional content but we ignore for now
            case "inlinemath": return <MathJax key={key} inline={true}>{"\\(" + printRaw(node as Ast.Node).replace(/\$/g, "") + "\\)"}</MathJax>;
            case "environment":
                switch (node.env) {
                    case "itemize": return <ul key={key}>{node.args.map((x: Ast.GenericNode) => <li>{x.content.map(render)}</li>)}</ul>;
                    case "enumerate": return <ol key={key}>{node.args.map((x: Ast.GenericNode) => <li>{x.content.map(render)}</li>)}</ol>;
                    case "figure": case "figure*":
                        const fig = node.content.filter((x: Ast.GenericNode) => x.content === "includegraphics")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map((x: Ast.GenericNode) => x.content).join("");
                        const width = node.content.filter((x: Ast.GenericNode) => x.content === "includegraphics")[0].args.filter((x: Ast.GenericNode) => x.openMark === "[")[0].content;
                        const wScale = (width.length == 4) ? +width[2].content : 1;
                        const caption = node.content.filter((x: Ast.GenericNode) => x.content === "caption")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map(render);
                        const figName = node.content.filter((x: Ast.GenericNode) => x.content === "label")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map((x: Ast.GenericNode) => x.content).join("");
                        return <Center key={key} id={figName}>
                                <Box pb={"xl"} pt={"sm"} style={{maxWidth: `calc(${node.env === "figure*" ? "100%" : "50%"} * ${wScale})`}}>
                                    <Image src={"/tex/" + fig} alt={fig}/>
                                    <Text size={"sm"} color={"dimmed"} align={"justify"}><b>Figure {figures[figName]}. </b>{caption}</Text>
                                </Box>
                            </Center>;
                     case "strip":
                        const content = node.content.filter((x: Ast.GenericNode) => x.content === "includegraphics")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map((x: Ast.GenericNode) => x.content).join("");
                        const sCaption = node.content[6].content.map(render);
                        const sName = node.content.filter((x: Ast.GenericNode) => x.content === "label")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map((x: Ast.GenericNode) => x.content).join("");

                        return <Center key={key} id={sName}>
                                <Box pb={"xl"} pt={"sm"} style={{maxWidth: "100%"}}>
                                    <Image src={"/tex/" + content} alt={content}/>
                                    <Text size={"sm"} color={"dimmed"} align={"justify"}><b>Figure {figures[sName]}. </b>{sCaption}</Text>
                                </Box>
                            </Center>;
                    case "table": case "table*":
                        const tabular = node.content.filter((x: Ast.GenericNode) => x.env === "tabular")[0];
                        const numCols = tabular.args[1].content[0].content.replace("|", "").length;
                        const tabularFull = tabular.content
                            .map((x: Ast.GenericNode, i: number) => (x.type === "string" || x.content === "\\") ? x.content : render(x, i))
                            .filter((x: any) => x && x !== " ");
                        let cells: any[] = [];
                        var lastI: number = 0;
                        const tabName = node.content.filter((x: Ast.GenericNode) => x.content === "label")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map((x: Ast.GenericNode) => x.content).join("");
                        const tabCaption: string = node.content.filter((x: Ast.GenericNode) => x.content === "caption")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map(render);

                        for (let i = 0; i < tabularFull.length; i += 1) {
                            if (["&", "\\"].includes(tabularFull[i])) {
                                const cell = tabularFull.slice(lastI, i).map((x: any, j: number) => x.content ? render(x, j) : x);
                                cells = [...cells, cell];
                                lastI = i + 1;
                            }
                        }
                        cells = [...cells, tabularFull.slice(lastI, tabularFull.length).map((x: any, j: number) => x.content ? render(x, j) : x)];

                        let rows: any[] = [];
                        for (let i = 0; i < cells.length; i += numCols) {
                            const chunk = cells.slice(i, i + numCols);
                            rows = [...rows, chunk];
                        }
                        return <Center key={key} id={tabName}>
                                <Box pb={"xl"} pt={"sm"} style={{maxWidth: node.env === "table*" ? "100%" : "50%"}}>
                                    <Text size={"sm"} color={"dimmed"} align={"justify"}><b>Table {tables[tabName]}. </b>{tabCaption}</Text>
                                    <Table pt={"xl"}>
                                        <thead>
                                            <tr>{rows[0].map((x: any, i: number) => <th key={i}>{x}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {rows.slice(1).map((x: any, i: number) => <tr key={i}>{x.map((y: any, j: number) => <td key={j}>{y}</td>)}</tr>)}
                                        </tbody>
                                    </Table>
                                </Box>
                            </Center>
                    case "abstract":
                        return <Center key={key}><Box pt={"xl"} pb={"xl"} style={{maxWidth: "90%"}}><Text size={"sm"}><b>Abstract. </b>{node.content.map(render)}</Text></Box></Center>;
                    case "algorithm":
                        console.log(node.content);
                        const aCaption = node.content.filter((x: Ast.GenericNode) => x.content === "caption")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map(render);
                        const algoName = node.content.filter((x: Ast.GenericNode) => x.content === "label")[0].args.filter((x: Ast.GenericNode) => x.openMark === "{")[0].content.map((x: Ast.GenericNode) => x.content).join("");
                        return <Center key={key}>
                            <Box style={{maxWidth: 800, backgroundColor: "rgba(120, 120, 120, 0.2)", padding: 10, marginBottom: 20, borderRadius: 8}}>
                                <Text size={"sm"} color={"dimmed"} align={"justify"}><b>Algorithm {algorithms[algoName]}. </b>{aCaption}</Text>
                                <br/>
                                <Text size={"sm"}>{node.content.map(render)}</Text>
                            </Box>
                        </Center>;
                    default: console.log(node); return undefined;
                }
            case "mathenv":
                return <Center key={key}>
                    <Box style={{maxWidth: 800}}>
                        <MathJax>
                            {printRaw(node.content[0])}
                        </MathJax>
                    </Box>
                </Center>;
            default: console.log(node); return undefined;
        }
    }, [bib]);

    useEffect(() => {
        const data = paper;
        parseTeX(data)
            .then((parsedData) => setParsed(parsedData?.content.map(render) || []));
    }, [paper, render]);

    useEffect(() => {
        const bibFile = paper.matchAll(/\\bibliography{(.*)}/g).next().value[1];
        import(`../data/tex/${bibFile}.bib`)
            .then((data) => {
                const entries: { [key: string]: BibEntry } = parseBibFile(data.default).entries$;
                const bibEntries = Object.fromEntries(Object.entries(entries).map(([key, value]: [string, BibEntry], i: number) => [key, {entry: value, i: i + 1}]));
                setBib(bibEntries);
            });
    }, [paper]);

    if (!bib) {
        return null;
    }

    return (
        <>
            <Text mt={100} align={"center"}>Welcome to</Text>
            <Title mb={200} align={"center"}>
                    How to Put Almost Anything in a Browser
            </Title>
            {parsed}
            <br/><br/>
            <Title order={2}>References</Title>
            {Object.values(bib).map((value: { entry: BibEntry, i: number }) =>
                <Text id={"ref:" + value.i} key={value.i} size={"sm"} color={"dimmed"} align={"justify"}><b>{"[" + value.i + "]"} </b><i>{normalizeFieldValue(value.entry.fields.title)}</i> {". " + normalizeFieldValue(value.entry.fields.author) + " " + normalizeFieldValue(value.entry.fields.year) + "."}</Text>
            )}
        </>
    );
}

export default TeX;