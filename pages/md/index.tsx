import { Anchor, Text, Grid } from "@mantine/core";
import { Markdown, PostData } from "../../lib/types";

export async function getStaticProps() {
    const { getAllYAMLMarkdownFromFolder } = await import("../../lib/staticutils");
    const projectData = (await getAllYAMLMarkdownFromFolder("../data/posts"))
        .map((info: Markdown) => info as PostData);

    return {
        props: {
            posts: projectData.sort((a, b) => Date.parse(a.info.date) > Date.parse(b.info.date) ? -1 : 1)
        }
    }
}

const Posts = ({ posts } : { posts: PostData[] }) => {
    if (!posts) {
        return null;
    }

    return (
        <>
            <Text>Some writing.</Text>
            <br/>
                {posts.map((post: PostData, i: number) => 
                    <Grid key={i} justify={"space-between"} p={"xs"}>
                        <Anchor href={"/md/" + post.path} target={"_self"} key={i}>
                            <Text size={"xl"}>{post.info.name}</Text>
                        </Anchor>
                        <Text size={"sm"}>
                            {post.info.date}
                        </Text>
                    </Grid>
                )}
        </>
    );
}

export default Posts;