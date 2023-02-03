import { useRouter } from "next/router";
import { ActionIcon, Group } from "@mantine/core";
import { IconTex, IconMarkdown, IconTable, IconList, IconGrain, IconSourceCode } from "@tabler/icons";

const PageSwitcher = () => {
    const router = useRouter();

    const pages = {
        "tex": <IconTex size={200} stroke={1.5} />,
        "md": <IconMarkdown size={200} stroke={1.5} />,
        "csv": <IconTable size={200} stroke={1.5} />,
        "yaml": <IconList size={200} stroke={1.5} />,
        "audio": <IconGrain size={200} stroke={1.5} />,
        "mantine": <IconSourceCode size={200} stroke={1.5} />,
    }

    return (
        <Group position="center" mt="xl" grow>
            {Object.entries(pages).map(([key, value], i) =>
                <ActionIcon // Big button with corresponding icon for each page
                    key={i}
                    onClick={() => router.push(`/${key}`)}
                    size={180}
                    sx={(theme) => ({
                    backgroundColor:
                        theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.light,
                        color: theme.colors.yellow[4]
                    })}
                >
                    {value}
                </ActionIcon>)
            }
        </Group>
    );
}

export default PageSwitcher;
