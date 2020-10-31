import fs from "fs";

const fileLocation = "data/balances";

export async function get(req, res, next) {
  fs.readFile(`${fileLocation}.json`, (err, file) => {
    if (err) {
      res.end({});
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(file);
    }
  });
}

export async function post(req, res, next) {
  const balances = JSON.stringify(req.body);
  fs.rename(
    `${fileLocation}.json`,
    `${fileLocation}-${Date.now()}.json`,
    () => {
      fs.writeFile(`${fileLocation}.json`, balances, (err) => {
        if (err) throw err;
        res.end(balances);
      });
    }
  );
}
