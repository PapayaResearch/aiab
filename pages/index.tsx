import { Text, Title} from "@mantine/core";
import PageSwitcher from "../components/PageSwitcher";

const HomePage = () => {
    return (
        <>
            <Text mt={100} align={"center"}>Welcome to</Text>
            <Title mb={200} align={"center"}>
                    How to Put Almost Anything in a Browser
            </Title>
            <PageSwitcher/>
        </>
    );
}

export default HomePage;