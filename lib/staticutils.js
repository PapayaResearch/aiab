/********************************************************************************
    Static Utils
*********************************************************************************/

export const getOneYAMLMarkdownFromFile = async (filepath) => {
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
    const info = await yaml.load(yamlVariables); // Parse YAML
    const content = data.replace(rawYamlHeader, "");
    return { info, content, path: path.parse(f).name };
}

export const getAllYAMLMarkdownFromFolder = async (dirpath) => {
    const fs = require("fs");
    const path = require("path");
    const yaml = require("js-yaml");

    const dirRelativeToPublicFolder = dirpath;
    const dir = path.resolve("./public", dirRelativeToPublicFolder);
    const filenames = fs.readdirSync(dir); // Get list of files

    const data = await Promise.all( // Read all the files
        filenames.map(async (filename) => {
            const f = path.join(dir, filename);
            return getOneYAMLMarkdownFromFile(f);
        })
    );

    return data.filter(Boolean);
}

export const getPathsFromDir = async (dirpath) => {
    const fs = require("fs");
    const path = require("path");

    const dir = path.resolve("./public", dirpath);
    const paths = fs.readdirSync(dir).map((f) => path.parse(f).name); // Get list of files without extension

    return paths;
}