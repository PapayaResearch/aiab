import { Box, Center, Image, Table, Text, Title, Anchor, HoverCard } from "@mantine/core";
import { normalizeFieldValue } from "bibtex";
import config from "../next.config";

export const TeXCitation = ({ node, bib }) => {
    const ref = node.args[1].content[0].content.toLowerCase();
    if (!bib[ref]) {
        return undefined;
    }

    const n = bib[ref].i;
    const entry = bib[ref].entry;
    return (
        <HoverCard>
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
        </HoverCard>
    );
}

export const TeXTable =  ({ node, tables, render }) => {
    const tabular = node.content.filter((x) => x.env === "tabular")[0];
    const numCols = tabular.args[1].content[0].content.replace("|", "").length;
    const tabularFull = tabular.content
        .map((x, i) => (x.type === "string" || x.content === "\\") ? x.content : render(x, i))
        .filter((x) => x && x !== " ");
    let cells= [];
    var lastI = 0;
    const tabName = node.content.filter((x) => x.content === "label")[0].args.filter((x) => x.openMark === "{")[0].content.map((x) => x.content).join("");
    const tabCaption = node.content.filter((x) => x.content === "caption")[0].args.filter((x) => x.openMark === "{")[0].content.map(render);

    for (let i = 0; i < tabularFull.length; i += 1) {
        if (["&", "\\"].includes(tabularFull[i])) {
            const cell = tabularFull.slice(lastI, i).map((x, j) => x.content ? render(x, j) : x);
            cells = [...cells, cell];
            lastI = i + 1;
        }
    }
    cells = [...cells, tabularFull.slice(lastI, tabularFull.length).map((x, j) => x.content ? render(x, j) : x)];

    let rows= [];
    for (let i = 0; i < cells.length; i += numCols) {
        const chunk = cells.slice(i, i + numCols);
        rows = [...rows, chunk];
    }
    return (
        <Center id={tabName}>
            <Box pb={"xl"} pt={"sm"} style={{maxWidth: node.env === "table*" ? "100%" : "50%"}}>
                <Text size={"sm"} color={"dimmed"} align={"justify"}><b>Table {tables[tabName]}. </b>{tabCaption}</Text>
                <Table pt={"xl"}>
                    <thead>
                        <tr>{rows[0].map((x, i) => <th key={i}>{x}</th>)}</tr>
                    </thead>
                    <tbody>
                        {rows.slice(1).map((x, i) => <tr key={i}>{x.map((y, j) => <td key={j}>{y}</td>)}</tr>)}
                    </tbody>
                </Table>
            </Box>
        </Center>
    );
}

export const TeXFigure = ({ node, figures, render }) => {
    const fig = node.content.filter((x) => x.content === "includegraphics")[0].args.filter((x) => x.openMark === "{")[0].content.map((x) => x.content).join("");
    const width = node.content.filter((x) => x.content === "includegraphics")[0].args.filter((x) => x.openMark === "[")[0].content;
    const wScale = (width.length == 4) ? +width[2].content : 1;
    const caption = node.content.filter((x) => x.content === "caption")[0].args.filter((x) => x.openMark === "{")[0].content.map(render);
    const figName = node.content.filter((x) => x.content === "label")[0].args.filter((x) => x.openMark === "{")[0].content.map((x) => x.content).join("");
    return (
        <Center id={figName}>
            <Box pb={"xl"} pt={"sm"} style={{maxWidth: `calc(${node.env === "figure*" ? "100%" : "50%"} * ${wScale})`}}>
                <Image src={"https://web.media.mit.edu/~nsingh1/files/tex/" + fig} alt={fig}/>
                <Text size={"sm"} color={"dimmed"} align={"justify"}><b>Figure {figures[figName]}. </b>{caption}</Text>
            </Box>
        </Center>
    );
}

export const TeXStripFigure = ({ node, figures, render }) => {
    const content = node.content.filter((x) => x.content === "includegraphics")[0].args.filter((x) => x.openMark === "{")[0].content.map((x) => x.content).join("");
    const sCaption = node.content[6].content.map(render);
    const sName = node.content.filter((x) => x.content === "label")[0].args.filter((x) => x.openMark === "{")[0].content.map((x) => x.content).join("");

    return (
        <Center id={sName}>
            <Box pb={"xl"} pt={"sm"} style={{maxWidth: "100%"}}>
                <Image src={"https://web.media.mit.edu/~nsingh1/files/tex/" + content} alt={content}/>
                <Text size={"sm"} color={"dimmed"} align={"justify"}><b>Figure {figures[sName]}. </b>{sCaption}</Text>
            </Box>
        </Center>
    );
}

export const TeXAlgorithm = ({ node, algorithms, render }) => {
    const aCaption = node.content.filter((x) => x.content === "caption")[0].args.filter((x) => x.openMark === "{")[0].content.map(render);
    const algoName = node.content.filter((x) => x.content === "label")[0].args.filter((x) => x.openMark === "{")[0].content.map((x) => x.content).join("");
    
    return (
        <Center>
            <Box style={{maxWidth: 800, backgroundColor: "rgba(120, 120, 120, 0.2)", padding: 10, marginBottom: 20, borderRadius: 8}}>
                <Text size={"sm"} color={"dimmed"} align={"justify"}><b>Algorithm {algorithms[algoName]}. </b>{aCaption}</Text>
                <br/>
                <Text size={"sm"}>{node.content.map(render)}</Text>
            </Box>
        </Center>
    );
}