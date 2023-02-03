import { useState, useRef, useMemo } from "react";
import { Center, Group, Box, NativeSelect, Slider, Button, Modal, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import AudioMap from "../components/AudioMap";
import AudioEmbedCode from "../components/AudioEmbedCode";
import code from "../data/audio/code.md";

export async function getStaticProps() {
    const baseURI = "https://chennai.media.mit.edu/samplesets/";
    const drumURI = baseURI + "drum/";
    const vocalURI = baseURI + "vocal/";

    // Get list of samples and their 2D (unnormalized) x,y coordinates
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

const Audio = ({ uri, list, coords }) => {
    const [sampleSet, setSampleSet] = useState("");
    const [numSamples, setNumSamples] = useState(200); // Limit to rendering first 200 samples by default
    const [showCode, setShowCode] = useState(false);

    const { width, height } = useViewportSize();
    const ctx = useRef(new AudioContext());

    const audioData = useMemo(() => { // Create audio data map for relevant sample set (only re-compute when needed)
        if (sampleSet == "") return [];
        const offset = (x) => (x == 0) ? .000001 : x; // Small offset to avoid ever dividing by 0
    
        // x and y coordinates
        const x = coords[sampleSet].map((coord) => coord[0]);
        const y = coords[sampleSet].map((coord) => coord[1]);
        
        // Normalize x and y coordinates to [0, 1]
        const minX = offset(x.reduce((a, b) => Math.min(a, b)));
        const maxX = offset(x.reduce((a, b) => Math.max(a, b)));
        const minY = offset(y.reduce((a, b) => Math.min(a, b)));
        const maxY = offset(y.reduce((a, b) => Math.max(a, b)));
        const normalizeX = (x) => (x - minX) / (maxX - minX);
        const normalizeY = (y) => (y - minY) / (maxY - minY);
        
        return list[sampleSet].map((sample, i) => {
            return {
                sample: sample,
                // Scale x and y coordinates to appear within designates area (full screen with 200px padding on each side)
                x: normalizeX(coords[sampleSet][i][0]) * (width - 400) + 200,
                y: normalizeY(coords[sampleSet][i][1]) * (height - 400) + 200,
                audio: uri[sampleSet] + sample // Make URI for audio
            }
        });
    }, [uri, list, coords, sampleSet, width, height]);
    
    return (
        <>
            <Center>
                <Group grow>
                    <NativeSelect // For selecting sample set
                        data={[...Object.keys(uri).map((key) => key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase()), ""]}
                        value={sampleSet.slice(0, 1).toUpperCase() + sampleSet.slice(1).toLowerCase()}
                        label={"Sample Set"}
                        onChange={(event) => setSampleSet(event.currentTarget.value.toLowerCase())}
                        style={{width: 400}}
                    />
                    <Box>
                        <Text size={"sm"}>Num. Samples</Text>
                        <Slider // For selecting sample count
                            min={Math.min(100, audioData.length)}
                            max={audioData.length}
                            step={100}
                            disabled={audioData.length == 0}
                            value={numSamples}
                            onChangeEnd={(value) => setNumSamples(value)}
                            style={{wifth: 400}}
                        />
                    </Box>
                    <Button // Show code for embedding audio files into 2D
                        size={"sm"}
                        variant={"gradient"}
                        onClick={() => setShowCode((showCode) => !showCode)}
                    >
                        Code for Audio Embedding
                    </Button>
                </Group>
            </Center>
            <AudioMap // Render the audio map
                audioData={audioData.slice(0, numSamples)} // Select the first numSamples audio clips
                ctx={ctx.current} // Pass reference to the audio context (to keep consistent across all sounds)
                stoppable={sampleSet == "vocal"} // Only make playback auto-stop if using the vocal sample set
            />
            <Modal
                opened={showCode}
                onClose={() => setShowCode(false)}
                title={"Code for embedding audio into 2D"}
                sizer={"100%"}
            >
                <AudioEmbedCode // Code for embedding audio into 2D
                    code={code}
                />
            </Modal>
        </>
    );
}

export default Audio;