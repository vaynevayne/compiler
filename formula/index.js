let parse = require("./parse");
let evaluate = require("./evaluate");

let sourceCode = "(3-2)*3*(2+2)"; // 12
let ast = parse(sourceCode);
console.log("ast", JSON.stringify(ast, null, 2));
let result = evaluate(ast);
console.log(result);
