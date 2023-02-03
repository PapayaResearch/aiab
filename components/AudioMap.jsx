import Sound from "./Sound";

const AudioMap = ({ audioData, ctx, stoppable }) => { // Simple component just to map audio data to Sound components
    if (!audioData || !audioData.length) {
        return null;
    }
    
    return (
        <>
            {
                audioData.map((audio, i) => {
                    return <Sound {...audio} ctx={ctx} stoppable={stoppable} key={audio.audio}/>
                })
            }
        </>
    );
}

export default AudioMap;