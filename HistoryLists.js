const fs = require("fs");
const onExitResult = require("./helpers.js");

class HistoryLists {
    static getByQuery(query) {
      const keys = Object.keys(query);
      const readContent = fs.readFileSync("HistoryLists.json", {
        encoding: "utf8",
        flag: "r",
      });
      if (!readContent) return onExitResult(false, "No history of Queues");
  
      const nestedHistoryLists = JSON.parse(readContent);
      let results = [];
      if (!keys || keys.length === 0) {
        results = nestedHistoryLists.flat();
      } else {
        nestedHistoryLists.forEach(sublist => {
          sublist.forEach(item => {
            if (keys.every(key => query[key] === item[key])) {
              results.push(item);
            }
          });
        });
      }
      return onExitResult(true, "Valid data", results);
    }
  }

module.exports = HistoryLists;
