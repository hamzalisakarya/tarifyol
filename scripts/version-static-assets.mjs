import fs from "node:fs";
import path from "node:path";

const [sourceArg = "frontend", outputArg = "_site", versionArg = process.env.GITHUB_SHA || "local"] = process.argv.slice(2);
const sourceDir = path.resolve(sourceArg);
const outputDir = path.resolve(outputArg);
const version = /^[0-9a-f]{7,40}$/i.test(versionArg) ? versionArg.slice(0, 12) : versionArg;

if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory does not exist: ${sourceDir}`);
}
if (!version || version.includes("/") || version.includes("\\") || version.includes("?")) {
    throw new Error(`Invalid asset version: ${versionArg}`);
}
if (sourceDir === outputDir) {
    throw new Error("Source and output directories must be different.");
}
if (outputDir === path.dirname(sourceDir)) {
    throw new Error("Output directory must not be the source parent directory.");
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.cpSync(sourceDir, outputDir, { recursive: true });

const versionedAssets = new Set([
    "css/style.css",
    "js/app.js",
    "js/journeys.js",
    "../css/style.css",
    "../js/app.js",
    "../js/journeys.js"
]);
const assetAttributePattern = /\b(?:href|src)\s*=\s*(["'])([^"']+)\1/g;
let changedFiles = 0;
let changedReferences = 0;

function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            visit(entryPath);
            continue;
        }
        if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".html") {
            continue;
        }

        const original = fs.readFileSync(entryPath, "utf8");
        const rewritten = original.replace(assetAttributePattern, (match, quote, value) => {
            const queryIndex = value.indexOf("?");
            const assetPath = queryIndex === -1 ? value : value.slice(0, queryIndex);
            if (!versionedAssets.has(assetPath)) {
                return match;
            }
            changedReferences += 1;
            return match.replace(value, `${assetPath}?v=${version}`);
        });

        if (rewritten !== original) {
            fs.writeFileSync(entryPath, rewritten);
            changedFiles += 1;
        }
    }
}

visit(outputDir);
console.log(`Prepared ${changedFiles} HTML files and ${changedReferences} asset references with v=${version}.`);
