const fs = require("fs");
const onExitResult = require("./helpers.js");

class Product {
  static create(content) {
    const { name, picture = "", eanCode, size, expUnit, price } = content;
    let hashArr = [];
    for (const el of Array(15).fill(0)) {
      hashArr.push(Math.ceil(Math.random() * 10));
    }

    const product = {
      id: hashArr.join(""),
      name,
      picture,
      eanCode,
      size,
      expUnit,
      price,
    };

    console.log("product: ", product);

    if (!name || !eanCode || !size || !expUnit || !price)
      return onExitResult(false, "Missing params");

    const readContent = fs.readFileSync("Products.json", {
      encoding: "utf8",
      flag: "r",
    });

    if (!readContent) {
      const arr = [];
      arr.push(product);
      fs.writeFileSync("Products.json", JSON.stringify(arr));
    } else {
      const jsonReadContent = JSON.parse(readContent);
      jsonReadContent.push(product);
      fs.writeFileSync("Products.json", JSON.stringify(jsonReadContent));
    }
    return onExitResult(true, "success created");
  }
  static getByQuery(query) {
    const keys = Object.keys(query);
    const readContent = fs.readFileSync("Products.json", {
      encoding: "utf8",
      flag: "r",
    });
    if (!readContent)
      return onExitResult(false, "Cant get product within empty file");

    const products = JSON.parse(readContent);
    if (!keys || keys.length === 0) {
      return onExitResult(true, "All data send", products);
    }
    const result = products.filter((product) => {
      return keys.every((el) => query[el] === product[el]);
    });
    return onExitResult(true, "Data send", result);
  }
}

module.exports = Product;
