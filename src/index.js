const fs = require("node:fs").promises;
const path = require("path");
const { makeTheme } = require("./colors");

const variants = [
    {
        theme: "light",
        name: "Ons light",
        file: "ons-pallete-light.json",
    },
    {
        theme: "dark",
        name: "Ons dark",
        file: "ons-pallete-dark.json",
    },
];

async function build(outDir = "themes") {
    await fs.mkdir(outDir, { recursive: true });
    await Promise.all(
        variants.map(async ({ theme, name, file }) => {
            const t = makeTheme({ theme, name });
            const outPath = path.join(outDir, file);
            await fs.writeFile(outPath, JSON.stringify(t, null, 2), "utf8");
            console.log(`[OK] - Written: ${outPath}`);
        })
    );
}

if (require.main === module) {
    const outFlag = process.argv.indexOf("--out");
    const dest = outFlag !== -1 ? process.argv[outFlag + 1] : "themes";
    build(dest).catch((err) => {
        console.error("[ERROR] - Error while generating themes: ", err);
        process.exit(1);
    });
}

module.exports = { build };
