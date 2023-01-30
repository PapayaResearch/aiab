import { unified } from "unified";
import * as Ast from "@unified-latex/unified-latex-types";
import { Plugin } from "unified";
import { unifiedLatexAstComplier, unifiedLatexFromString, PluginOptions } from "@unified-latex/unified-latex-util-parse";
import { visit } from "@unified-latex/unified-latex-util-visit";
import { unifiedLatexAttachMacroArguments } from "@unified-latex/unified-latex-util-arguments";
import { expandUnicodeLigatures } from "@unified-latex/unified-latex-util-ligatures";
import { trimRenderInfo } from "@unified-latex/unified-latex-util-render-info";


/********************************************************************************
    View Utils
*********************************************************************************/

export const scrollIntoView = (viewId: string) => document.getElementById(viewId)?.scrollIntoView({behavior: "smooth"});

/********************************************************************************
    LaTeX Utils
*********************************************************************************/

export const getDocument = (root: Ast.Root): Ast.Environment | undefined => {
    const docNode: Ast.Environment[] = root.content.filter((x: Ast.GenericNode) => {
        if (x.type === "environment") {
            x = x as Ast.Environment;
            return x.env === "document";
        }
    }).map((x) => x as Ast.Environment);
    return docNode[0];
}

const unifiedLatexExpandLigatures: Plugin<PluginOptions[], Ast.Root, Ast.Root> = () => {
    return (tree) => visit(tree, (nodes) => expandUnicodeLigatures(nodes), { includeArrays: true, test: Array.isArray });
}


export const parseTeX = async (texString: string): Promise<Ast.Environment| undefined> => {
    const r = await unified()
        .use(unifiedLatexFromString)
        .use(unifiedLatexExpandLigatures)
        .use(unifiedLatexAstComplier)
        .process(texString)
        .then((x) => trimRenderInfo(x.result as Ast.Root))
        .then(getDocument);
    return r;
}