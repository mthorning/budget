import fs from "fs";
import path from "path";

const fileLocation = "data/balances";

export async function get(req, res, next) {
  fs.readFile(path.resolve(fileLocation, ".json"), (err, file) => {
    if (err) {
      res.end(JSON.stringify(err));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(file);
    }
  });
}

export async function post(req, res, next) {
  const balances = JSON.stringify(req.body);
  fs.rename(
    path.resolve(fileLocation, ".json"),
    path.resolve(`${fileLocation}-${Date.now()}`, ".json"),
    () => {
      fs.writeFile(`${fileLocation}.json`, balances, (err) => {
        if (err) throw err;
        res.end(balances);
      });
    }
  );
}
