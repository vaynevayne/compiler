const nodeTypes = require("./nodeTypes");
const { parser } = require("./parser");

function replace(parent, oldNode, newNode) {
  if (parent) {
    for (const key in parent) {
      if (Object.hasOwn(parent, key)) {
        if (parent[key] === oldNode) {
          parent[key] = newNode;
        }
      }
    }
  }
}

function traverse(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach((child) => traverseNode(child, parent));
  }
  // 使用方式 转换 都是模拟的babel
  function traverseNode(node, parent) {
    let replaceWith = replace.bind(null, parent, node);
    let method = visitor[node.type];
    // 当开始遍历子节点的时候,执行进入方法
    if (method) {
      if (typeof method === "function") {
        method({ node, replaceWith }, parent);
      } else {
        method.enter({ node, replaceWith }, parent);
      }
    }
    switch (node.type) {
      case nodeTypes.Program:
        traverseArray(node.body, node);
        break;
      case nodeTypes.ExpressionStatement:
        traverseNode(node.expression, node);
        break;
      case nodeTypes.JSXElement:
        traverseNode(node.openingElement, node);
        traverseArray(node.children, node);
        traverseNode(node.closingElement, node);
        break;
      case nodeTypes.openingElement:
        traverseNode(node.name, node);
        traverseArray(node.attributes, node);
        break;
      case nodeTypes.JSXIdentifier:
      case nodeTypes.JSXText:
      case nodeTypes.Literal:
        break;
      case nodeTypes.JSXAttribute:
        traverseNode(node.name, node);
        traverseNode(node.value, node);
        break;
      case nodeTypes.closingElement:
        traverseNode(node.name, node);
        break;
      default:
        break;
    }
    // 当遍历完子节点离开的时候
    if (method && method.exit) {
      method.exit({ node, replaceWith }, parent);
    }
  }

  traverseNode(ast, null);
}

module.exports = {
  traverse,
};

let sourceCode = `<h1 id="title"><span>hello</span>world</h1>`;

// let ast = parser(sourceCode);
// traverse(ast, {
//   JSXOpeningElement: {
//     enter: (nodePath, parent) => {
//       console.log("进入开始", nodePath.node);
//     },
//     exit: (nodePath, parent) => {
//       console.log("离开开始", nodePath.node);
//     },
//   },
//   JSXClosingElement() {
//     console.log("进入JSXClosingElement");
//   },
// });
