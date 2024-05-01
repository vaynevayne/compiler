let tokenize = require("./tokenize");
let toAST = require("./toAST");
/**
 * 代码转抽象语法树
 */
function parse(script) {
  // 分词处理
  let tokenReader = tokenize(script);
  let ast = toAST(tokenReader);
  return ast;
}

module.exports = parse;
