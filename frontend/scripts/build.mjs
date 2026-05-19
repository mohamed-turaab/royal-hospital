import { mkdir, readFile, readdir, cp, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "..");
const rootDir = path.resolve(frontendDir, "..");
const backendPublicDir = path.join(rootDir, "backend", "public");
const frontendPublicDir = path.join(frontendDir, "public");
const srcDir = path.join(frontendDir, "src");
const require = createRequire(import.meta.url);

const { rollup } = require(path.join(frontendDir, "node_modules", "rollup"));
const resolve = require(path.join(frontendDir, "node_modules", "resolve"));
const sucrase = require(path.join(frontendDir, "node_modules", "sucrase"));
const postcss = require(path.join(frontendDir, "node_modules", "postcss"));
const tailwindcss = require(path.join(frontendDir, "node_modules", "tailwindcss"));
const autoprefixer = require(path.join(frontendDir, "node_modules", "autoprefixer"));

const sourceHtml = await readFile(path.join(frontendDir, "index.html"), "utf-8");
const sourceCss = await readFile(path.join(srcDir, "styles.css"), "utf-8");
const tailwindConfig = {
  darkMode: "class",
  content: [
    path.join(frontendDir, "index.html"),
    path.join(frontendDir, "src", "**", "*.{js,jsx}"),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        royalBlue: {
          DEFAULT: "#1b75bb",
          50: "#e8f1f9",
          100: "#c5dcf0",
          200: "#9ec5e5",
          300: "#6eaadb",
          400: "#4793d0",
          500: "#1b75bb",
          600: "#1766a5",
          700: "#12538a",
          800: "#0d3f6b",
          900: "#082c4d",
          950: "#041a2f",
        },
        navyBlue: {
          DEFAULT: "#071B34",
          50: "#f0f4f9",
          100: "#d9e2ee",
          200: "#b3c5dd",
          300: "#8ca8cc",
          400: "#668bbb",
          500: "#406eab",
          600: "#335889",
          700: "#264267",
          800: "#192c45",
          900: "#0d1623",
          950: "#071B34",
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

await mkdir(path.join(backendPublicDir, "assets"), { recursive: true });
await mkdir(path.join(backendPublicDir, "vendor"), { recursive: true });

const cssResult = await postcss([
  tailwindcss(tailwindConfig),
  autoprefixer(),
]).process(sourceCss, {
  from: path.join(srcDir, "styles.css"),
  to: path.join(backendPublicDir, "assets", "app.css"),
});

await writeFile(path.join(backendPublicDir, "assets", "app.css"), cssResult.css);

const externalGlobals = new Map([
  ["react", "React"],
  ["react-dom", "ReactDOM"],
  ["react-dom/client", "ReactDOM"],
  ["react/jsx-runtime", "React"],
  ["react/jsx-dev-runtime", "React"],
  ["axios", "axios"],
  ["react-router-dom", "ReactRouterDOM"],
  ["recharts", "Recharts"],
]);

const bundle = await rollup({
  input: path.join(srcDir, "main.jsx"),
  external: (id) => externalGlobals.has(id),
  onwarn(warning, warn) {
    if (
      warning.code === "THIS_IS_UNDEFINED" ||
      warning.code === "MODULE_LEVEL_DIRECTIVE"
    ) {
      return;
    }

    warn(warning);
  },
  plugins: [
    {
      name: "source-jsx",
      resolveId(source, importer) {
        if (externalGlobals.has(source)) {
          return { id: source, external: true };
        }
        try {
          const baseDir = importer ? path.dirname(importer) : frontendDir;
          const resolved = resolve.sync(source, {
            basedir: baseDir,
            extensions: [".mjs", ".js", ".jsx", ".json"],
            packageFilter(pkg) {
              if (pkg.module) {
                pkg.main = pkg.module;
              }
              return pkg;
            },
          });
          return resolved;
        } catch {
          if (source.startsWith(".") || path.isAbsolute(source)) {
            return null;
          }
          return null;
        }
      },
      load(id) {
        if (id.includes("node_modules")) {
          // Only transform files that are not already transpiled
          if (!id.endsWith(".js") && !id.endsWith(".mjs")) return null;
        }
        const code = require("node:fs").readFileSync(id, "utf8");
        const transformed = sucrase.transform(code, {
          filePath: id,
          transforms: ["jsx", "typescript"],
        });
        return transformed.code;
      },
    },
  ],
});

await bundle.write({
  file: path.join(backendPublicDir, "assets", "app.js"),
  format: "iife",
  name: "HospitalManagementApp",
  globals: Object.fromEntries(externalGlobals),
  sourcemap: false,
});

const cssLink = `    <link rel="stylesheet" href="/assets/app.css?v=${Date.now()}" />\n`;
const reactScript = '    <script src="/vendor/react.production.min.js"></script>\n';
const reactDomScript = '    <script src="/vendor/react-dom.production.min.js"></script>\n';
const reactIsScript = '    <script src="/vendor/react-is.production.min.js"></script>\n';
const axiosScript = '    <script src="/vendor/axios.min.js"></script>\n';
const remixRouterScript = '    <script src="/vendor/remix-router.umd.min.js"></script>\n';
const reactRouterScript = '    <script src="/vendor/react-router.production.min.js"></script>\n';
const routerScript = '    <script src="/vendor/react-router-dom.production.min.js"></script>\n';
const rechartsScript = '    <script src="/vendor/recharts.js"></script>\n';
const appScript = `    <script src="/assets/app.js?v=${Date.now()}"></script>\n`;
const processShim = '    <script>window.process = { env: { NODE_ENV: "production" } };</script>\n';
const jsxShim = '    <script>if (window.React && !window.React.jsx) { window.React.jsx = window.React.createElement; window.React.jsxs = window.React.createElement; window.React.jsxDEV = window.React.createElement; }</script>\n';
const html = sourceHtml
  .replace('<script type="module" src="/src/main.jsx"></script>', "")
  .replace(
    "</head>",
    `${processShim}${cssLink}${reactScript}${jsxShim}${reactDomScript}${reactIsScript}${axiosScript}${remixRouterScript}${reactRouterScript}${routerScript}${rechartsScript}</head>`,
  )
  .replace(
    "</body>",
    `${appScript}</body>`,
  );

await writeFile(path.join(backendPublicDir, "index.html"), html);

await cp(
  path.join(frontendDir, "node_modules", "react", "umd", "react.production.min.js"),
  path.join(backendPublicDir, "vendor", "react.production.min.js"),
  { force: false },
);
await cp(
  path.join(frontendDir, "node_modules", "react-dom", "umd", "react-dom.production.min.js"),
  path.join(backendPublicDir, "vendor", "react-dom.production.min.js"),
  { force: false },
);
await cp(
  path.join(frontendDir, "node_modules", "axios", "dist", "axios.min.js"),
  path.join(backendPublicDir, "vendor", "axios.min.js"),
  { force: false },
);
await cp(
  path.join(frontendDir, "node_modules", "react-router-dom", "dist", "umd", "react-router-dom.production.min.js"),
  path.join(backendPublicDir, "vendor", "react-router-dom.production.min.js"),
  { force: false },
);
await cp(
  path.join(frontendDir, "node_modules", "@remix-run", "router", "dist", "router.umd.min.js"),
  path.join(backendPublicDir, "vendor", "remix-router.umd.min.js"),
  { force: false },
);
await cp(
  path.join(frontendDir, "node_modules", "react-router", "dist", "umd", "react-router.production.min.js"),
  path.join(backendPublicDir, "vendor", "react-router.production.min.js"),
  { force: false },
);
await cp(
  path.join(frontendDir, "node_modules", "recharts", "umd", "Recharts.js"),
  path.join(backendPublicDir, "vendor", "recharts.js"),
  { force: false },
);

for (const item of await readdir(frontendPublicDir, { withFileTypes: true })) {
  const source = path.join(frontendPublicDir, item.name);
  const target = path.join(backendPublicDir, item.name);
  await cp(source, target, { recursive: true, force: false });
}

console.log("Frontend built into backend/public");
