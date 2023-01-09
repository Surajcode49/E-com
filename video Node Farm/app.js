const fs = require("fs");
const http = require("http");
const url = require("url");
// const morgan = require('morgan')

const replaceTemplate = (temp, product) => {
  let info = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  info = info.replace(/{%IMAGE%}/g, product.image);
  info = info.replace(/{%FROM%}/g, product.from);
  info = info.replace(/{%ID%}/g, product.id);
  info = info.replace(/{%DESCRIPTION%}/g, product.description);
  info = info.replace(/{%NUTRITION%}/g, product.nutrients);
  info = info.replace(/{%PRICE%}/g, product.price);
  info = info.replace(/{%QUANTITY%}/g, product.quantity);

  if (!product.organic) info = info.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return info;
};

const indexTemp = fs.readFileSync(`${__dirname}/template/index.html`, "utf-8");
const cardTemp = fs.readFileSync(
  `${__dirname}/template/tempCard.html`,
  "utf-8"
);
const pageTemp = fs.readFileSync(`${__dirname}/template/page.html`, "utf-8");

// console.log(cardTemp);

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const port = 10000;
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardhtml = dataObj
      .map((el) => replaceTemplate(cardTemp, el))
      .join("");

    const outPut = indexTemp.replace("{%DSCRIPTION_CARD%}", cardhtml);
    res.end(outPut);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const product = dataObj[query.id];
    const outPut = replaceTemplate(pageTemp, product);
    res.end(outPut);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`App running on port ${port}`);
});
