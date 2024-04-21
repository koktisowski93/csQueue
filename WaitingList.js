const fs = require("fs");
const onExitResult = require("./helpers.js");

class WaitingList {
  static pushBack(content) {
    const { quantity, creationDate, productId } = content;
    let hashArr = [];
    for (const el of Array(15).fill(0)) {
      hashArr.push(Math.ceil(Math.random() * 10));
    }

    const item = {
      id: hashArr.join(""),
      quantity,
      creationDate,
      productId,
    };

    if (!quantity || !creationDate || !productId)
      return onExitResult(false, "Missing params");

    const readContent = fs.readFileSync("WaitingList.json", {
      encoding: "utf8",
      flag: "r",
    });

    if (!readContent) {
      const arr = [];
      arr.push(item);
      fs.writeFileSync("WaitingList.json", JSON.stringify(arr));
    } else {
      const jsonReadContent = JSON.parse(readContent);
      jsonReadContent.push(item);
      fs.writeFileSync("WaitingList.json", JSON.stringify(jsonReadContent));
    }
    return onExitResult(true, "success created");
  }
  static get() {
    const readContent = fs.readFileSync("WaitingList.json", {
      encoding: "utf8",
      flag: "r",
    });
    if (!readContent) return onExitResult(true, "List is currently empty", []);

    const items = JSON.parse(readContent);
    return onExitResult(true, "Data send", items);
  }
  static export() {
    const historyContent = fs.readFileSync("HistoryLists.json", {
      encoding: "utf8",
      flag: "r",
    });

    const listContent = this.get();
    if (listContent?.data?.length === 0)
      return onExitResult(false, "nothing to export");

    if (!historyContent) {
      const arr = [];
      arr.push(listContent.data);
      fs.writeFileSync("HistoryLists.json", JSON.stringify(arr));
    } else {
      const jsonHistoryContent = JSON.parse(historyContent);
      jsonHistoryContent.push(listContent.data);
      fs.writeFileSync("HistoryLists.json", JSON.stringify(jsonHistoryContent));
    }
    fs.writeFileSync("WaitingList.json", '');
    return onExitResult(true, "success exported");
  }
}

module.exports = WaitingList;
