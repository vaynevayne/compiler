let nodeTypes = require("./nodeTypes");
function evaluate(node) {
  let result;
  switch (node.type) {
    case nodeTypes.Program:
      for (let child of node.children) {
        result = evaluate(child); // 就一个 Additive
      }
      break;
    case nodeTypes.Additive: // 加法节点
      result = evaluate(node.children[0]) + evaluate(node.children[1]);
      break;
    case nodeTypes.Multiplicative: // 乘法节点
      result = evaluate(node.children[0]) * evaluate(node.children[1]);
      break;
    case nodeTypes.Numeric:
      result = parseFloat(node.value);
    default:
      break;
  }

  return result;
}

module.exports = evaluate;
