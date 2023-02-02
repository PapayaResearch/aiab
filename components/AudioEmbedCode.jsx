import { Title, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const AudioEmbedCode = ({ code }) => {
    const mdComponents = { // Independent components
        h2: (props) => <Title {...props} order={3} variant="gradient" opacity={0.8} style={{paddingBottom: 10}}/>,
        h4: (props) => <Title {...props} order={5} variant="gradient" style={{paddingTop: 20, paddingBottom: 0}}/>,
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