const { parser } = require("./parser");
const { traverse } = require("./traverse");
const nodeTypes = require("./nodeTypes");
// const t = require('babel-types')

class t {
  static nullLiteral() {
    return { type: nodeTypes.NullLiteral };
  }
  static stringLiteral(value) {
    return { type: nodeTypes.StringLiteral, value };
  }
  static identifier(name) {
    return { type: nodeTypes.Identifier, name };
  }
  static objectExpression(properties) {
    return { type: nodeTypes.ObjectExpression, properties };
  }
  static property(key, value) {
    return { type: nodeTypes.Property, key, value };
  }
  static callExpression(callee, _argument) {
    return { type: nodeTypes.CallExpression, callee, argument: _argument };
  }
  static memberExpression(object, property) {
    return { type: nodeTypes.MemberExpression, object, property };
  }
  static isJSXElement(node) {
    return node.type === nodeTypes.JSXElement;
  }
  static isJSXText(node) {
    return node.type === nodeTypes.JSXText;
  }
}

function transformer(ast) {
  traverse(ast, {
    JSXElement(nodePath, parent) {
      // 传入一个JSXElement语法树节点, 返回一个方法调用的新节点
      function transform(node) {
        if (!node) return t.nullLiteral(); // null
        // 递归处理子节点, 会接受子节点, 所以需要判断
        if (t.isJSXElement(node)) {
          // 如果要转换的是一个JSXElement, 转成方法调用
          let memberExpression = t.memberExpression(
            t.identifier("React"),
            t.identifier("createElement")
          );
          let _arguments = [];
          let elementType = t.stringLiteral(node.openingElement.name.name);
          let attributes = node.openingElement.attributes;
          let objectExpression;
          if (attributes.length > 0) {
            objectExpression = t.objectExpression(
              attributes.map((attr) =>
                t.property(
                  t.identifier(attr.name.name),
                  t.stringLiteral(attr.value.value)
                )
              )
            );
          } else {
            objectExpression = t.nullLiteral();
          }
          _arguments = [
            elementType,
            objectExpression,
            node.children.map((child) => transform(child)),
          ];
          return t.callExpression(memberExpression, _arguments);
        } else if (t.isJSXText(node)) {
          return t.stringLiteral(node.value);
        }
      }

      let newNode = transform(nodePath.node);
      nodePath.replaceWith(newNode);
    },
  });
}

module.exports = {
  transformer,
};

let code = `<h1 id="title"><span>hello</span>world</h1>`;
let ast = parser(code);
transformer(ast);

console.log(JSON.stringify(ast, null, 2));
