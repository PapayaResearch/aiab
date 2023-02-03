import { Text, Anchor } from "@mantine/core";
import { Prism } from "@mantine/prism";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const AudioEmbedCode = ({ code }) => {
    const mdComponents = { // How to render markdown elements as React components
        p: (props) => <Text {...props} style={{paddingTop: 10, paddingBottom: 10}}/>,
        a: (props) => <Anchor {...props}/>,
        code: (props) => <Prism language={"python"}>{props.children[0]}</Prism>
    };
    
    return (
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={mdComponents}>
            {code}
        </ReactMarkdown>
    );

}

export default AudioEmbedCode;
