import { Title, Text, Code } from "@mantine/core";
import { Prism } from "@mantine/prism";
import myTheme from "../data/theme.yaml";
import * as yaml from "js-yaml";

const YAML = () => {
    return (
        <>
            <Title order={1}>YAML</Title>
            <Text>
                YAML is a human-readable and human-editable data serialization language, which is commonly used for configuring applications. We use a simple YAML file to configure the theme for our Mantine components, which you can find in the <Code>data/theme.yaml</Code> file. The current theme configuration looks like:
            </Text>
            <Prism language="yaml" style={{ marginTop: 20, marginBottom: 20 }}>
                {yaml.dump(myTheme)}
            </Prism>
        </>
    );
}

export default YAML;