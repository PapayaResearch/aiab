import Sound from "./Sound";

const AudioMap = ({ audioData, ctx, stoppable }) => {
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