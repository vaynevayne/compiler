let esprima = require("esprima");
let estraverse = require("estraverse-fb");
let sourceCode = `<h1 id='title'><span>hello</span> world </h1>`;

let ast = esprima.parseModule(sourceCode, { jsx: true, tokens: true }); // 打印token

// console.log(ast);
let ident = 0;
function padding() {
  return "  ".repeat(ident);
}
// visitor访问器
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + "进入");
    ident += 2;
  },
  leave(node) {
    ident -= 2;
    console.log(padding() + node.type + "离开");
  },
});

/**
 * 1. 把源代码进行分词, 得到一个token数组
 * 2. 把token数组转成一个抽象语法树
 * [
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'JSXIdentifier', value: 'id' },
    { type: 'Punctuator', value: '=' },
    { type: 'String', value: "'title'" },
    { type: 'Punctuator', value: '>' },
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'hello' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: ' world ' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'Punctuator', value: '>' }
  ]
 */
