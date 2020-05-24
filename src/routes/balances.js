import path from "path";
import fs from "fs";

const fileLocation = "data/balances.json";

export async function get(req, res, next) {
  fs.readFile(path.resolve("static", fileLocation), (err, file) => {
    if (err) {
      res.end({});
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(file);
    }
  });
}

export async function post(req, res, next) {
  fs.writeFile(
    path.resolve("static", fileLocation),
    JSON.stringify(req.body),
    (err) => {
      if (err) throw err;
      res.end();
    }
  );
}
