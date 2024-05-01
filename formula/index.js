let parse = require("./parse");
let evaluate = require("./evaluate");

let sourceCode = "2+3*4";
let ast = parse(sourceCode);

let result = evaluate(ast);
console.log(result); // 14
