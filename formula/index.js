let parse = require("./parse");
let evaluate = require("./evaluate");

let sourceCode = "2+3*4"; // 10
let ast = parse(sourceCode);
console.log("ast", JSON.stringify(ast, null, 2));
let result = evaluate(ast);
console.log(result); // 14
