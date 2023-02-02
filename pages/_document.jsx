import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";
import myTheme from "../data/theme.yaml";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
    static getInitialProps = getInitialProps;

    render() {
        return (
            <Html>
                <link href={"https://fonts.googleapis.com/css2?family=" + myTheme.fontFamily} rel="stylesheet"/>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
