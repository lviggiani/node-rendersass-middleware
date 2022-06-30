import path from "path";
import fs from "fs/promises";
import HttpStatusCodes from "http-status-codes";
import sass from "sass";

const rendered = {},
      watching = {};

const watchFile = async (file, mainFile) => {
    if (watching[file]) return;

    watching[file] = fs.watch(file);
    for await (const e of watching[file])
        if (e.eventType === "change") delete rendered[mainFile];
}

export default (cssFolder = "css", scssFolder) => {

    scssFolder = scssFolder || path.join(process.cwd(), "scss");

    return async (req, res, next) => {
        // ignore non css files
        if (!req.path.endsWith(".css")) return next();
    
        const fileName = path.join(scssFolder, req.path.replace(cssFolder, ""))
            .replace(/\.css$/, ".scss");

        if (!await fs.stat(fileName).catch(_ => undefined)) return res.status(HttpStatusCodes.NOT_FOUND).end();

        rendered[fileName] = rendered[fileName] || await sass.compileAsync(fileName).catch(err => undefined);

        if (rendered[fileName]){
            res.header("content-type", "text/css");
            res.send(rendered[fileName].css.toString());
            rendered[fileName].loadedUrls.map(url => url.pathname).forEach(file => watchFile(file, fileName));
        } else {
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }
}
