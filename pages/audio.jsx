import { useState, useMemo } from "react";
import { NativeSelect } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import Sound from "../components/Sound";

export async function getStaticProps() {
    const baseURI = "https://web.media.mit.edu/~nsingh1/files/samplesets/";
    const drumURI = baseURI + "drum/";
    const vocalURI = baseURI + "vocal/";
    const drumList = await fetch(drumURI + "samples.txt").then((res) => res.text()).then((res) => res.split("\n").filter((line) => line.length));
    const vocalList = await fetch(vocalURI + "samples.txt").then((res) => res.text()).then((res) => res.split("\n").filter((line) => line.length));
    const drumCoords = await fetch(drumURI + "coords.txt").then((res) => res.text()).then((res) => res.split("\n").filter((line) => line.length).map((line) => line.split(" ").map((coord) => parseFloat(coord))));
    const vocalCoords = await fetch(vocalURI + "coords.txt").then((res) => res.text()).then((res) => res.split("\n").filter((line) => line.length).map((line) => line.split(" ").map((coord) => parseFloat(coord))));

    return {
        props: {
            uri: {
                drum: drumURI,
                vocal: vocalURI
            },
            list: {
                drum: drumList,
                vocal: vocalList
            },
            coords: {
                drum: drumCoords,
                vocal: vocalCoords
            }
        }
    }
}

const AudioMap = ({ uri, list, coords }: { uri: { [key: string]: string }, list: { [key: string]: string[] }, coords: { [key: string]: number[][] } }) => {
    const [sampleSet, setSampleSet] = useState("drum");

    const { width, height } = useViewportSize();

    const audioData = useMemo(() => {
        const offset = (x: number) => (x == 0) ? .000001 : x;
    
        const x = coords[sampleSet].map((coord) => coord[0]);
        const y = coords[sampleSet].map((coord) => coord[1]);
        const minX = offset(x.reduce((a: number, b: number) => Math.min(a, b)));
        const maxX = offset(x.reduce((a: number, b: number) => Math.max(a, b)));
        const minY = offset(y.reduce((a: number, b: number) => Math.min(a, b)));
        const maxY = offset(y.reduce((a: number, b: number) => Math.max(a, b)));
        const normalizeX = (x: number) => (x - minX) / (maxX - minX);
        const normalizeY = (y: number) => (y - minY) / (maxY - minY);
        
        return list[sampleSet].map((sample, i) => {
            return {
                sample: sample,
                x: normalizeX(coords[sampleSet][i][0]) * (width - 400) + 200,
                y: normalizeY(coords[sampleSet][i][1]) * (height - 400) + 200,
                audio: uri[sampleSet] + sample
            }
        });
    }, [uri, list, coords, sampleSet, width, height]);
    
    return (
        <>
            <NativeSelect
                data={Object.keys(uri).map((key: string) => key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase())}
                label={"Sample Set"}
                onChange={(event) => setSampleSet(event.currentTarget.value.toLowerCase())}
                withAsterisk
                />
            {
                audioData.map((audio, i) => {
                    return <Sound {...audio} key={i}/>
                })
            }
        </>
    );
}

export default AudioMap;