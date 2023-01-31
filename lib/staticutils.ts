import { Markdown } from "./types";

/********************************************************************************
    Static Utils
*********************************************************************************/

export const getOneYAMLMarkdownFromFile = async (filepath: string): Promise<Markdown | undefined> => {
    const fs = require("fs");
    const path = require("path");
    const yaml = require("js-yaml");

    const f = path.resolve("./public", filepath);
    const data = fs.readFileSync(f, {encoding: "utf8", flag: "r"});
    const metaRegExp = new RegExp(/^---[\n\r](((?!---).|[\n\r])*)[\n\r]---$/m); // Extract the YAML header
    const [rawYamlHeader, yamlVariables] = metaRegExp.exec(data) ?? [];
    if (!yamlVariables || !yamlVariables.length) {
        return;
    }
    const info: { [key: string]: any } = await yaml.load(yamlVariables); // Parse YAML
    const content: string = data.replace(rawYamlHeader, "");
    return { info, content, path: path.parse(f).name } as Markdown;
}

export const getAllYAMLMarkdownFromFolder = async (dirpath: string): Promise<Markdown[]> => {
    const fs = require("fs");
    const path = require("path");
    const yaml = require("js-yaml");

    const dirRelativeToPublicFolder = dirpath;
    const dir = path.resolve("./public", dirRelativeToPublicFolder);
    const filenames = fs.readdirSync(dir); // Get list of files

    const data: Markdown[] = await Promise.all( // Read all the files
        filenames.map(async (filename: string) => {
            const f = path.join(dir, filename);
            return getOneYAMLMarkdownFromFile(f);
        })
    );

    return data.filter(Boolean);
}

export const getPathsFromDir = async (dirpath: string): Promise<string[]> => {
    const fs = require("fs");
    const path = require("path");

    const dir = path.resolve("./public", dirpath);
    const paths: string[] = fs.readdirSync(dir).map((f: string) => path.parse(f).name); // Get list of files without extension

    return paths;
}