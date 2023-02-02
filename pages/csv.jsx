import { useState } from "react";
import { Title, Table, Text, Anchor, Center, Box, RangeSlider, Badge, HoverCard } from "@mantine/core";
import Papa from "papaparse";

export async function getStaticProps() {
    const fs = require("fs");
    const path = require("path");

    const f = path.resolve("./data", "csv", "nimevoice.csv");
    const data = fs.readFileSync(f, {encoding: "utf8", flag: "r"});
    
    const toNIMEPaper = (obj) => {
        return {
            Title: obj.Title.replace("\n", " "),
            Year: parseInt(obj.Year),
            "I/O": obj["I/O"].split("\n"),
            BM: obj.BM.split("\n"),
            PM: obj.PM.split("\n"),
            NUM: obj.NUM,
            SYNC: obj.SYNC,
            CATEGORY: obj.CATEGORY,
            SUBCATEGORY: obj.SUBCATEGORY
        }
    }
    
    const csv = Papa.parse(data).data;
    const headers = csv[0];
    const rows = csv.slice(1);
    const csvData = rows.map((row) => row.map((cell) => cell.trim()))
                        .map((row) => toNIMEPaper(Object.fromEntries(headers.map((header, i) => [header, row[i]]))))
    return {
        props: { csvData }
    }
}

const CSV = ({ csvData }) => {
    const minYear = Math.min(...csvData.map((paper) => paper.Year));
    const maxYear = Math.max(...csvData.map((paper) => paper.Year));
    const [yearRange, setYearRange] = useState([minYear, maxYear]);

    return (
        <>
            <Title order={1}>CSV Example</Title>
            <Text>Full app at <Anchor href={"https://nimevoice2022.vercel.app/"}><b>nimevoice2022</b>.vercel.app</Anchor></Text>
            <Center>
                <Box style={{ width: "100%", maxWidth: "32em" }} py={40}>
                    <Title order={4} align={"center"} style={{zIndex: 1}}>Filters</Title>
                    <Text size={"sm"}>Year</Text>
                    <RangeSlider
                        step={1}
                        min={minYear}
                        max={maxYear}
                        minRange={1}
                        radius={"xs"}
                        size={"xs"}
                        color={"gray"}
                        onChangeEnd={(value) => setYearRange(value)}
                        defaultValue={yearRange}
                        label={(value) => `${value}`}
                    />
                </Box>
            </Center>
            <Table>
                <tbody>
                    <tr>{Object.keys(csvData[0]).map((cell, j) => <td key={j}><Title order={4}>{cell}</Title></td>)}</tr>
                </tbody>
                <tbody>
                    {csvData.filter((paper) => paper.Year >= yearRange[0] && paper.Year <= yearRange[1]).map((paper, i) => (
                        <tr key={i}>
                            {Object.entries(paper).map(([k, v], j) => {
                                if (["I/O", "BM", "PM"].includes(k)) {
                                    return (
                                        <td key={j}>
                                            {v.map((tag, k) => (
                                                <HoverCard key={k}>
                                                    <HoverCard.Target>
                                                        <Badge display={"grid"} m={"xs"} variant={"gradient"} size={"xs"} key={k}>{tag}</Badge>
                                                    </HoverCard.Target>
                                                    <HoverCard.Dropdown>
                                                        <Text size={"sm"}>{tag}</Text>
                                                    </HoverCard.Dropdown>
                                                </HoverCard>
                                            ))}
                                        </td>
                                    );
                                }
                                return <td key={j}><Text>{v}</Text></td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default CSV;