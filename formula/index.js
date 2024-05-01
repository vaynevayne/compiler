let parse = require("./parse");
let evaluate = require("./evaluate");

let sourceCode = "5-1+4/2/2*3"; // 10
let ast = parse(sourceCode);
console.log("ast", JSON.stringify(ast, null, 2));
let result = evaluate(ast);
console.log(result);
