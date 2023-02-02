import React, { useState, useEffect, useCallback } from "react";
import { Text, Title, Anchor, Space, Box, Loader, Center, Group } from "@mantine/core";
import { parseTeX } from "../lib/utils";
import { printRaw } from "@unified-latex/unified-latex-util-print-raw";
import paper from "../data/tex/main.tex";
import { parseBibFile, normalizeFieldValue } from "bibtex";
import { MathJax } from "better-react-mathjax";
import { TeXTable, TeXFigure, TeXStripFigure, TeXAlgorithm, TeXCitation } from "../components/TeXEnvironments";

export async function getStaticProps() { return { props: {} } }

const TeX = () => {
    const [parsed, setParsed] = useState([]);
    const [bib, setBib] = useState({});

    // Get list of figures and tables so all references can be made (either before or after the environment is established)
    const figures = Object.fromEntries([...paper.matchAll(/\\label{fig:([^}]+)}/g)].map((x, i) => ["fig:" + x[1], i + 1]));
    const tables = Object.fromEntries([...paper.matchAll(/\\label{tab:([^}]+)}/g)].map((x, i) => ["tab:" + x[1], i + 1]));
    const algorithms = Object.fromEntries([...paper.matchAll(/\\label{algo:([^}]+)}/g)].map((x, i) => ["algo:" + x[1], i + 1]));

    const render = useCallback((node, key) => {
        switch (node.type) {
            case "macro":
                switch (node.content) {
                    case "title": return <Title key={key} align={"center"} pt={"lg"} pb={"xl"} order={1}>{node.args[node.args.length - 1].content.map(render)}</Title>;
                    case "author":
                        let authors = [];
                        node.args[0].content.forEach((x, i) => {
                            if (i == 0 || x.content == "and") {
                                authors.push([]);
                            }
                            authors[authors.length - 1].push(x);
                        });
                        return <Group key={key} pb={"xl"} grow>{authors.map((author, i) => <Title key={i} align={"center"} order={5}>{author.map(render)}</Title>)}</Group>;
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
                        return <Anchor key={key} href={node.args[node.args.length - 2].content.map((x) => x.content).join("")}>
                                {node.args[node.args.length - 1].content.map(render)}
                            </Anchor>
                    case "label":
                        const labelId = node.args[node.args.length - 1].content.map((x) => x.content).join("");
                        return <span key={key} id={labelId}></span>;
                    case "times": return <span key={key}>x</span>;
                    case "years": return node.args[0].content.length ? <Box key={key} pt={"xs"} style={{width: 100, display: "inline-block", transform: "translate(-125px, -9px)", position: "absolute"}}><Text size={"sm"} align={"right"}><b>{node.args[0].content.map(render)}</b></Text></Box> : null;
                    case "KwIn": return <Title key={key} order={6}><br/>In:</Title>;
                    case "KwOut": return <Title key={key} order={6}><br/>Out:</Title>;
                    case "For": return <Title key={key} display={"inline"} order={6}><br/>For </Title>;
                    case "^": return <sup key={key}>{node.args[0].content.map(render)}</sup>;
                    case "hline": return undefined;
                    case "cite": return <TeXCitation key={key} node={node} bib={bib}/>
                    case "ref":
                        const refName = node.args[node.args.length - 1].content.map((x) => x.content).join("");
                        const refType = refName.split(":")[0];
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
            case "inlinemath": return <MathJax key={key} inline={true}>{"\\(" + printRaw(node).replace(/\$/g, "") + "\\)"}</MathJax>;
            case "environment":
                switch (node.env) {
                    case "itemize": return <ul key={key}>{node.args.map((x, i) => <li key={i}>{x.content.map(render)}</li>)}</ul>;
                    case "enumerate": return <ol key={key}>{node.args.map((x, i) => <li key={i}>{x.content.map(render)}</li>)}</ol>;
                    case "figure": case "figure*": return <TeXFigure key={key} node={node} figures={figures} render={render}/>;
                    case "strip": return <TeXStripFigure key={key} node={node} figures={figures} render={render}/>;
                    case "table": case "table*": return <TeXTable key={key} node={node} tables={tables} render={render}/>;
                    case "algorithm": return <TeXAlgorithm key={key} node={node} algorithms={algorithms} render={render}/>;
                    case "abstract":
                        return <Center key={key}><Box pt={"xl"} pb={"xl"} style={{maxWidth: "90%"}}><Text size={"sm"}><b>Abstract. </b>{node.content.map(render)}</Text></Box></Center>;
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
    }, [bib, algorithms, figures, tables]);

    useEffect(() => {
        const data = paper;
        parseTeX(data)
            .then((parsedData) => setParsed(parsedData?.content.map(render) || []));
    }, [render]);

    useEffect(() => {
        const bibFile = paper.matchAll(/\\bibliography{(.*)}/g).next().value[1];
        import(`../data/tex/${bibFile}.bib`)
            .then((data) => {
                const entries = parseBibFile(data.default).entries$;
                const bibEntries = Object.fromEntries(Object.entries(entries).map(([key, value], i) => [key, {entry: value, i: i + 1}]));
                setBib(bibEntries);
            });
    }, []);

    if (!bib || !parsed || !Object.keys(bib).length || !Object.keys(parsed).length) {
        return <Center pt={400}><Loader sx={(theme) => ({color: theme.colors[theme.primaryColor][6]})}/></Center>;
    }

    return (
        <>
            {parsed}
            <br/><br/>
            <Title order={2}>References</Title>
            {Object.values(bib).map((value) =>
                <Text id={"ref:" + value.i} key={value.i} size={"sm"} color={"dimmed"} align={"justify"}><b>{"[" + value.i + "]"} </b><i>{normalizeFieldValue(value.entry.fields.title)}</i> {". " + normalizeFieldValue(value.entry.fields.author) + " " + normalizeFieldValue(value.entry.fields.year) + "."}</Text>
            )}
        </>
    );
}

export default TeX;