import { useState } from "react";
import { Title, Table, Text, Anchor, Center, Box, RangeSlider, Badge, HoverCard } from "@mantine/core";
import Papa from "papaparse";

interface NIMEPaper {
    Title: string,
    Year: number,
    "I/O": string[],
    BM: string[],
    PM: string[],
    NUM: string,
    SYNC: string,
    CATEGORY: string,
    SUBCATEGORY: string
}

export async function getStaticProps() {
    const fs = require("fs");
    const path = require("path");

    const f = path.resolve("./data", "csv", "nimevoice.csv");
    const data = fs.readFileSync(f, {encoding: "utf8", flag: "r"});
    
    const toNIMEPaper = (obj: { [key: string]: string }): NIMEPaper => {
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
    
    const csv = Papa.parse(data).data as string[][];
    const headers: string[] = csv[0];
    const rows: string[][] = csv.slice(1);
    const csvData: NIMEPaper[] = rows.map((row: string[]) => row.map((cell: string) => cell.trim()))
                        .map((row: string[]) => toNIMEPaper(Object.fromEntries(headers.map((header: string, i: number) => [header, row[i]]))))
    return {
        props: { csvData }
    }
}

const CSV = ({ csvData }: { csvData: NIMEPaper[] }) => {
    const minYear = Math.min(...csvData.map((paper: NIMEPaper) => paper.Year));
    const maxYear = Math.max(...csvData.map((paper: NIMEPaper) => paper.Year));
    const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);

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
                        onChangeEnd={(value: [number, number]) => setYearRange(value)}
                        defaultValue={yearRange}
                        label={(value: number) => `${value}`}
                    />
                </Box>
            </Center>
            <Table>
                <tbody>
                    <tr>{Object.keys(csvData[0]).map((cell: string, j: number) => <td key={j}><Title order={4}>{cell}</Title></td>)}</tr>
                </tbody>
                <tbody>
                    {csvData.filter((paper: NIMEPaper) => paper.Year >= yearRange[0] && paper.Year <= yearRange[1]).map((paper: NIMEPaper, i: number) => (
                        <tr key={i}>
                            {Object.entries(paper).map(([k, v]: [k: string, v: any], j: number) => {
                                if (["I/O", "BM", "PM"].includes(k)) {
                                    return (
                                        <td key={j}>
                                            {v.map((tag: string, k: number) => (
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