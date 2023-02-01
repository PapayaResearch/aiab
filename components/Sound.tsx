import { useState, useEffect, useRef } from "react";
import { Tooltip, ActionIcon } from "@mantine/core";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons";

const Sound = (props: { sample: string, x: number, y: number, audio: string }) => {
    const [audioContent, setAudioContent] = useState<AudioBufferSourceNode | null>(null);
    const ctx = new window.AudioContext();

    useEffect(() => {
        fetch(props.audio, { method: "GET" })
            .then((res) => res.arrayBuffer())
            .then((res) => ctx.decodeAudioData(res))
            .then((res) => {
                const source = ctx.createBufferSource();
                source.buffer = res;
                source.connect(ctx.destination);
                setAudioContent(source);
            })
            .catch((error) => {
                setAudioContent(null);
                console.error(error);
            });
    }, [props.audio]);

    const toggleAudio = (play: boolean) => {
        if (play) {
            audioContent?.start();
        }
        else {
            audioContent?.stop();
        }
    }

    if (!audioContent) {
        return null;
    }

    return (
        <>
            <ActionIcon onMouseEnter={() => toggleAudio(true)} onMouseLeave={() => toggleAudio(false)} style={{position: "fixed", left: props.x, top: props.y}}>
                <IconPlayerPlay size={12}/>
            </ActionIcon>
        </>
    );

}
export default Sound;