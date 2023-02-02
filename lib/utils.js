import { unified } from "unified";
import { unifiedLatexAstComplier, unifiedLatexFromString } from "@unified-latex/unified-latex-util-parse";
import { visit } from "@unified-latex/unified-latex-util-visit";
import { unifiedLatexAttachMacroArguments } from "@unified-latex/unified-latex-util-arguments";
import { expandUnicodeLigatures } from "@unified-latex/unified-latex-util-ligatures";
import { trimRenderInfo } from "@unified-latex/unified-latex-util-render-info";


/********************************************************************************
    View Utils
*********************************************************************************/

export const scrollIntoView = (viewId) => document.getElementById(viewId)?.scrollIntoView({behavior: "smooth"});

/********************************************************************************
    LaTeX Utils
*********************************************************************************/

export const getDocument = (root) => {
    const docNode = root.content.filter((x) => {
        if (x.type === "environment") {
            return x.env === "document";
        }
    });
    return docNode[0];
}

const unifiedLatexExpandLigatures = () => {
    return (tree) => visit(tree, (nodes) => expandUnicodeLigatures(nodes), { includeArrays: true, test: Array.isArray });
}


export const parseTeX = async (texString) => {
    const r = await unified()
        .use(unifiedLatexFromString)
        .use(unifiedLatexExpandLigatures)
        .use(unifiedLatexAstComplier)
        .process(texString)
        .then((x) => trimRenderInfo(x.result))
        .then(getDocument);
    return r;
}