const fs = require("fs");
const path = require("path");
const chroma = require("chroma-js");

const ACCENT_YELLOW = "#f7c948";

const paletteLight = {
    background: "#fafafa",
    foreground: "#1e1e1e",
    accent: ACCENT_YELLOW,
    textPrimary: "#333333",
    textSecondary: "#555555",
    surface0: "#ffffff",
    surface1: "#f0f0f0",
    border: "#e0e0e0",
    success: "#28a745",
    warning: ACCENT_YELLOW,
    error: "#e05661",
};

const paletteDark = {
    background: "#1e1e1e",
    foreground: "#d4d4d4",
    accent: ACCENT_YELLOW,
    textPrimary: "#e7e7e7",
    textSecondary: "#c5c5c5",
    surface0: "#252525",
    surface1: "#2d2d2d",
    border: "#3f3f46",
    success: "#2aa55a",
    warning: ACCENT_YELLOW,
    error: "#f48771",
};

const α = (color, opacity) => chroma(color).alpha(opacity).hex();

const tint = (color, amt = 0.12) =>
    chroma
        .mix(
            chroma(color).luminance() > 0.5 ? "#000" : "#fff",
            color,
            amt,
            "rgb"
        )
        .hex();

function getPalette(mode = "dark") {
    return mode === "dark" ? paletteDark : paletteLight;
}

function getTokenColors(p) {
    const c = { ...p };

    const bright = (color, amt = 0.5) => chroma(color).brighten(amt).hex();
    const shift = (color, deg = 45) =>
        chroma(color).set("hsl.h", `+${deg}`).hex();

    return [
        {
            scope: [
                "comment",
                "punctuation.definition.comment",
                "unused.comment",
                "comment.block",
                "comment.line",
            ],
            settings: {
                foreground: α(c.textSecondary, 0.7),
                fontStyle: "italic",
            },
        },

        {
            scope: [
                "string",
                "constant.other.symbol",
                "meta.embedded.assembly",
            ],
            settings: { foreground: c.success },
        },

        {
            scope: ["constant.numeric", "constant.language.boolean"],
            settings: { foreground: c.warning },
        },

        {
            scope: ["keyword", "storage", "storage.type", "storage.modifier"],
            settings: { foreground: c.accent, fontStyle: "bold" },
        },

        {
            scope: [
                "entity.name.function",
                "meta.function-call",
                "support.function",
                "variable.function",
            ],
            settings: { foreground: bright(c.accent) },
        },

        {
            scope: [
                "entity.name.type",
                "entity.name.class",
                "support.class",
                "variable.type",
            ],
            settings: { foreground: shift(c.accent, 45) },
        },

        {
            scope: [
                "variable",
                "meta.definition.variable.name",
                "meta.definition.parameter",
            ],
            settings: { foreground: c.foreground },
        },

        {
            scope: [
                "constant.language",
                "constant.character",
                "variable.other.constant",
                "entity.name.constant",
            ],
            settings: { foreground: c.warning },
        },

        {
            scope: ["invalid", "invalid.illegal", "invalid.deprecated"],
            settings: { foreground: c.error, fontStyle: "underline" },
        },
    ];
}

function asWorkbenchColors(p) {
    const c = { ...p };

    return {
        focusBorder: α(c.accent, 0.6),
        foreground: c.foreground,
        disabledForeground: α(c.foreground, 0.4),
        "widget.border": c.border,
        "widget.shadow": α("#000", 0.25),
        "selection.background": α(c.accent, 0.3),
        descriptionForeground: c.textSecondary,
        errorForeground: c.error,
        "icon.foreground": c.foreground,
        "sash.hoverBorder": c.accent,

        "window.activeBorder": c.accent,
        "window.inactiveBorder": c.border,

        "textBlockQuote.background": α(c.surface1, 0.8),
        "textBlockQuote.border": c.border,
        "textCodeBlock.background": c.surface1,
        "textLink.foreground": c.accent,
        "textLink.activeForeground": tint(c.accent, 0.15),
        "textPreformat.foreground": c.textPrimary,
        "textPreformat.background": c.surface0,
        "textSeparator.foreground": c.border,

        "toolbar.hoverBackground": α(c.surface1, 0.6),
        "toolbar.hoverOutline": c.border,
        "toolbar.activeBackground": α(c.surface1, 0.85),
        "editorActionList.background": c.surface0,
        "editorActionList.foreground": c.foreground,
        "editorActionList.focusForeground": c.foreground,
        "editorActionList.focusBackground": α(c.accent, 0.2),

        "button.background": c.accent,
        "button.foreground": c.background,
        "button.hoverBackground": tint(c.accent, 0.2),
        "button.border": α(c.accent, 0.5),
        "checkbox.background": c.surface0,
        "checkbox.foreground": c.accent,
        "radio.activeForeground": c.accent,
        "radio.activeBorder": c.accent,

        "dropdown.background": c.surface0,
        "dropdown.listBackground": c.surface1,
        "dropdown.border": c.border,
        "dropdown.foreground": c.foreground,

        "input.background": c.surface0,
        "input.border": c.border,
        "input.foreground": c.foreground,
        "input.placeholderForeground": c.textSecondary,
        "inputOption.activeBackground": α(c.accent, 0.25),
        "inputOption.activeBorder": c.accent,
        "inputOption.hoverBackground": α(c.accent, 0.15),
        "inputValidation.errorBackground": α(c.error, 0.15),
        "inputValidation.errorBorder": c.error,
        "inputValidation.infoBackground": α(c.accent, 0.15),

        "scrollbar.shadow": α("#000", 0.2),
        "scrollbarSlider.background": α(c.accent, 0.25),
        "scrollbarSlider.hoverBackground": α(c.accent, 0.4),
        "scrollbarSlider.activeBackground": α(c.accent, 0.6),

        "badge.foreground": c.background,
        "badge.background": c.accent,
        "progressBar.background": c.accent,

        "list.activeSelectionBackground": α(c.accent, 0.25),
        "list.activeSelectionForeground": c.foreground,
        "list.hoverBackground": α(c.accent, 0.12),
        "list.dropBackground": α(c.accent, 0.14),
        "list.inactiveSelectionBackground": α(c.accent, 0.15),
        "tree.tableOddRowsBackground": α(c.surface1, 0.55),

        "activityBar.background": c.background,
        "activityBar.foreground": c.foreground,
        "activityBar.inactiveForeground": α(c.foreground, 0.5),
        "activityBar.border": c.border,
        "activityBarBadge.background": c.accent,
        "activityBarBadge.foreground": c.background,
        "activityBar.activeBorder": c.accent,

        "sideBar.foreground": c.foreground,
        "sideBar.border": c.border,
        "sideBarTitle.foreground": c.textSecondary,
        "sideBarSectionHeader.background": c.surface1,
        "sideBarSectionHeader.border": c.border,

        "tab.activeBackground": c.surface0,
        "tab.activeForeground": c.foreground,
        "tab.inactiveBackground": c.surface1,
        "tab.inactiveForeground": c.textSecondary,
        "tab.border": c.border,
        "tab.activeModifiedBorder": c.accent,
        "editorGroup.border": c.border,
        "editorGroupHeader.tabsBackground": c.surface0,

        "editor.background": c.background,
        "editor.foreground": c.foreground,
        "editorLineNumber.foreground": c.textSecondary,
        "editorLineNumber.activeForeground": c.accent,
        "editorCursor.foreground": c.accent,
        "editor.selectionBackground": α(c.accent, 0.25),
        "editor.inactiveSelectionBackground": α(c.accent, 0.12),
        "editor.lineHighlightBackground": α(c.accent, 0.05),
        "editor.wordHighlightBackground": α(c.accent, 0.1),
        "editorLink.activeForeground": c.accent,
        "editorWhitespace.foreground": α(c.textSecondary, 0.4),

        "diffEditor.insertedTextBackground": α(c.success, 0.2),
        "diffEditor.deletedTextBackground": α(c.error, 0.22),

        "statusBar.background": c.surface0,
        "statusBar.foreground": c.foreground,
        "statusBar.border": c.border,
        "statusBar.debuggingBackground": c.error,
        "statusBar.debuggingForeground": c.background,
        "statusBar.noFolderBackground": c.surface1,
        "statusBarItem.prominentBackground": c.accent,
        "statusBarItem.prominentForeground": c.background,

        "terminal.ansiBlack": c.background,
        "terminal.ansiRed": c.error,
        "terminal.ansiGreen": c.success,
        "terminal.ansiYellow": c.warning,
        "terminal.ansiBlue": c.accent,
        "terminal.ansiMagenta": chroma(c.accent).set("hsl.h", "+60").hex(),
        "terminal.ansiCyan": chroma(c.accent).set("hsl.h", "+120").hex(),
        "terminal.ansiWhite": c.foreground,

        "notifications.background": c.surface0,
        "notifications.foreground": c.foreground,
        "notificationsErrorIcon.foreground": c.error,
        "notificationsWarningIcon.foreground": c.warning,
        "notificationsInfoIcon.foreground": c.accent,

        "editorGutter.modifiedBackground": c.accent,
        "editorGutter.addedBackground": c.success,
        "editorGutter.deletedBackground": c.error,
    };
}

function makeTheme({ mode = "dark", name = "My Theme" } = {}) {
    const p = getPalette(mode);
    return {
        name,
        colors: asWorkbenchColors(p),
        tokenColors: getTokenColors(p),
    };
}

function writeThemeFiles(outDir = "themes") {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const light = makeTheme({ mode: "light", name: "My Theme Light" });
    const dark = makeTheme({ mode: "dark", name: "My Theme Dark" });

    fs.writeFileSync(
        path.join(outDir, "my-theme-light.json"),
        JSON.stringify(light, null, 2)
    );
    fs.writeFileSync(
        path.join(outDir, "my-theme-dark.json"),
        JSON.stringify(dark, null, 2)
    );

    console.log(`✔ Theme files written to ./${outDir}/`);
}

if (require.main === module) {
    const outFlag = process.argv.indexOf("--out");
    const dest = outFlag !== -1 ? process.argv[outFlag + 1] : "themes";
    writeThemeFiles(dest);
}

module.exports = {
    getPalette,
    asWorkbenchColors,
    makeTheme,
};
