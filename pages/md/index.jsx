import { Anchor, Text, Grid } from "@mantine/core";

export async function getStaticProps() {
    const { getAllYAMLMarkdownFromFolder } = await import("../../lib/staticutils");
    const projectData = (await getAllYAMLMarkdownFromFolder("../data/posts"));

    return {
        props: {
            posts: projectData.sort((a, b) => Date.parse(a.info.date) > Date.parse(b.info.date) ? -1 : 1)
        }
    }
}

const Posts = ({ posts }) => {
    if (!posts) {
        return null;
    }

    return (
        <>
            <Text>Nothing inspires forgiveness quite like revenge.</Text>
            <br/>
            {posts.map((post, i) => (
                <Grid key={i} justify={"space-between"} p={"xs"}>
                    <Anchor href={"/md/" + post.path} target={"_self"} key={i}>
                        <Text size={"xl"}>{post.info.name}</Text>
                    </Anchor>
                    <Text size={"sm"}>
                        {post.info.date}
                    </Text>
                </Grid>
            ))}
        </>
    );
}

export default Posts;
