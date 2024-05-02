const { tokenizer } = require("./tokenizer");
const tokenTypes = require("./tokenTypes");
const nodeTypes = require("./nodeTypes");

/**
 * 
 * 先定义文法结构
  jsxElement => <JSXIdentifier attribute*>child</JSXIdentifier>
  attribute => AttributeKey='AttributeStringValue'
  child => jsxElement | JSXText
 */
function parser(sourceCode) {
  let tokens = tokenizer(sourceCode); // tokens 数组
  let pos = 0; // 当前token的数组索引

  function walk(parent) {
    debugger;
    let token = tokens[pos]; // 取出当前token 不消耗
    let nextToken = tokens[pos + 1]; // 取出下一个token 不消耗
    // < && h1
    // jsxElement 规则
    if (
      token.type === tokenTypes.LeftParentheses &&
      nextToken.type === tokenTypes.JSXIdentifier
    ) {
      let node = {
        type: nodeTypes.JSXElement,
        openingElement: null,
        children: [],
        closingElement: null,
      };
      // 第一步给开始标签赋值
      token = tokens[++pos]; // h1
      node.openingElement = {
        type: nodeTypes.JSXOpeningElement,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value,
        },
        attributes: [],
      };
      token = tokens[++pos]; // 走一步 到下一个attributeKey
      // 循环取 attribute 的token
      while (token.type === tokenTypes.AttributeKey) {
        node.openingElement.attributes.push(walk());
        token = tokens[pos];
      }
      // while 结束以后, 下一个是大于号,即pos指到>
      token = tokens[++pos]; // 跳过大于号,取到<号
      nextToken = tokens[pos + 1]; // span 的s
      // !== <  就匹配到 <span>hello 文本节点的子节点
      // 对应元素类型的子节点
      // 推导 child => jsxElement | JSXText
      while (
        token.type !== tokenTypes.LeftParentheses ||
        (token.type === tokenTypes.LeftParentheses &&
          nextToken.type !== tokenTypes.BackSlash)
      ) {
        node.children.push(walk());
        token = tokens[pos];
        nextToken = tokens[pos + 1];
      }
      node.closingElement = walk(node);
      return node;
      // attribute 规则
    } else if (token.type === tokenTypes.AttributeKey) {
      let nextToken = tokens[++pos];
      let node = {
        type: nodeTypes.JSXAttribute,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value, // id
        },
        value: {
          type: nodeTypes.Literal,
          value: nextToken.value,
        },
      };
      pos++;
      return node;
    } else if (token.type === tokenTypes.JSXText) {
      // hello
      pos++;
      return {
        type: nodeTypes.JSXText,
        value: token.value,
      };
      // 结束标签
    } else if (
      parent &&
      token.type === tokenTypes.LeftParentheses &&
      nextToken.type === tokenTypes.BackSlash
    ) {
      pos++; // 跳过 <,到 /
      pos++; // 跳过 /,到 span 的s
      token = tokens[pos]; // span h1
      pos++; // 跳过 span
      pos++; // 跳过</span> 的 >, 到 world 的 w
      if (parent.openingElement.name.name !== token.value) {
        throw new TypeError(
          `开始标签${parent.openingElement.name.name}不匹配结束标签${token.value}`
        );
      }
      return {
        type: nodeTypes.JSXClosingElement,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value,
        },
      };
    }
    throw new Error("不可能走到这");
  }

  let ast = {
    type: nodeTypes.Program,
    body: [
      {
        type: nodeTypes.ExpressionStatement,
        expression: walk(),
      },
    ],
  };
  return ast;
}
module.exports = {
  parser,
};

let sourceCode = `<h1 id="title"><span>hello</span>world</h1>`;

console.log(JSON.stringify(parser(sourceCode), null, 2));

/**
 
 [
  { type: 'LeftParentheses', value: '<' },
  { type: 'JSXIdentifier', value: 'h1' },
  { type: 'AttributeKey', value: 'id' },
  { type: 'AttributeStringValue', value: '"title"' },
  { type: 'RightParentheses', value: '>' },
  { type: 'LeftParentheses', value: '<' },
  { type: 'JSXIdentifier', value: 'span' },
  { type: 'RightParentheses', value: '>' },
  { type: 'JSXText', value: 'hello' },
  { type: 'LeftParentheses', value: '<' },
  { type: 'BackSlash', value: '/' },
  { type: 'JSXIdentifier', value: 'span' },
  { type: 'RightParentheses', value: '>' },
  { type: 'JSXText', value: 'world' },
  { type: 'LeftParentheses', value: '<' },
  { type: 'BackSlash', value: '/' },
  { type: 'JSXIdentifier', value: 'h1' },
  { type: 'RightParentheses', value: '>' }
]
 */
