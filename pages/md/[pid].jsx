import { useRouter } from "next/router";
import { Text, Title, Anchor, Center, Button, Image } from "@mantine/core";
import { YouTubeEmbed } from "react-social-media-embed";
import { IconArrowLeft } from "@tabler/icons";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export async function getStaticProps({ params }) {
    const { getOneYAMLMarkdownFromFile } = await import("../../lib/staticutils");
    const data = await getOneYAMLMarkdownFromFile("../data/posts/" + params.pid + ".md");

    return {
        props: {
            pageContent: data?.content
        }
    }
}

export async function getStaticPaths() {
    const { getPathsFromDir } = await import("../../lib/staticutils");
    
    return {
        paths: (await getPathsFromDir("../data/posts")).map((path) => "/md/" + path),
        fallback: false
    }
}

const ProjectPage = ({ pageContent }) => {
    const router = useRouter();

    
    const mdComponents = { // Independent components
        h2: (props) => <Title {...props} order={3} variant="gradient" opacity={0.8} style={{paddingBottom: 10}}/>,
        h4: (props) => <Title {...props} order={5} variant="gradient" style={{paddingTop: 20, paddingBottom: 0}}/>,
        p: (props) => <Text {...props} style={{paddingTop: 10, paddingBottom: 10}}/>,
        a: (props) => <Anchor {...props}/>,
        img: (props) => <Image alt={""} width={"100%"} {...props}/>,
        youtubeembed: ({ url }) => <Center><YouTubeEmbed width={"100%"} height={400} url={url}/></Center>
    };
    
    return (
        <>
            <Title align={"center"}>Posts</Title>
            <Center>
                <Button
                    mb={"xl"}
                    mt={"sm"}
                    leftIcon={<IconArrowLeft size={16}/>}
                    variant={"gradient"}
                    size={"xs"}
                    onClick={() => router.push("/md")}
                >
                    Back to All Posts
                </Button>
            </Center>
            <ReactMarkdown rehypePlugins={[rehypeRaw]} components={mdComponents}>
                {pageContent}
            </ReactMarkdown>
        </>
    );
}

export default ProjectPage;