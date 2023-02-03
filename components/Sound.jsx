import { useState, useEffect, useRef } from "react";
import { ActionIcon } from "@mantine/core";
import { IconCircleDot } from "@tabler/icons";

const Sound = (props) => {
    const [audioContent, setAudioContent] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const source = useRef(props.ctx.createBufferSource()); // Use ref to persist the node across renders for playback

    useEffect(() => {
        setAudioContent(null); // Clear sound
        fetch((!process.env.NODE_ENV || process.env.NODE_ENV === "development") ? `/api/audio?uri=${props.audio}` : props.audio) // Attempt to fetch audio directly if in production (assumes a CORS-enabled server, at least for the deployment requester)
            .then((res) => res.arrayBuffer())
            .then((res) => props.ctx.decodeAudioData(res))
            .then((res) => {
                setAudioContent(res);
            })
            .catch((error) => {
                setAudioContent(null);
                console.error(error);
            });
    }, [props.audio, props.ctx]);

    const toggleAudio = (play) => {
        if (!audioContent) return; // If no audio set
        if (play) {
            source.current = props.ctx.createBufferSource();
            source.current.buffer = audioContent;
            source.current.connect(props.ctx.destination);
            source.current.onended = () => setIsPlaying(false);
            source.current.start();
            setIsPlaying(true);
            setIsHovered(true);
        } else {
            setIsHovered(false);
            if (isPlaying && props.stoppable) {
                source.current.stop();
            }
        }
    }

    if (!audioContent) return null;

    return (
        <>
            <ActionIcon sx={(theme) => ({position: "fixed", left: props.x, top: props.y, color: isPlaying ? "red" : theme.colors[theme.primaryColor][6]})} onMouseEnter={() => toggleAudio(true)} onMouseLeave={() => toggleAudio(false)}>
                <IconCircleDot size={isHovered ? 30 : 12}/>
            </ActionIcon>
        </>
    );

}
export default Sound;