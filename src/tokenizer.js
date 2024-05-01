const LETTERS = /[a-z0-9]/;
const tokenTypes = require("./tokenTypes");
let currentToken = { type: "", value: "" };

const tokens = [];
function emit(token) {
  currentToken = { type: "", value: "" };
  tokens.push(token);
}

function start(char) {
  if (char === "<") {
    emit({ type: tokenTypes.LeftParentheses, value: "<" });
    return foundLeftParentheses; // 找到<
  }
  throw new Error("第一个字符必须是<");
}
// end of fire
function eof() {
  if (currentToken.value.length > 0) {
    emit(currentToken);
  }
}
function foundLeftParentheses(char) {
  // h1
  console.log("foundLeftParentheses", char);
  if (LETTERS.test(char)) {
    // 如果char是一个小写字母或数字
    currentToken.type = tokenTypes.JSXIdentifier;
    currentToken.value += char; // h
    return jsxIdentifier; // 继续收集标识符
  } else if (char === "/") {
    emit({ type: tokenTypes.BackSlash, value: "/" });
    console.log("tokens", tokens);
    return foundLeftParentheses; // 这里借助左边的来找
  }
}

function jsxIdentifier(char) {
  if (LETTERS.test(char)) {
    currentToken.value += char;
    return jsxIdentifier;
  } else if (char === " ") {
    // 遇到空格
    emit(currentToken);
    return attribute;
  } else if (char === ">") {
    // 说明没有属性 直接结束
    emit(currentToken);
    emit({ type: tokenTypes.RightParentheses, value: ">" });
    return foundRightParentheses;
  }
  //   return eof;
}

function attribute(char) {
  // i
  if (LETTERS.test(char)) {
    // 将会是key
    currentToken.type = tokenTypes.AttributeKey;
    currentToken.value += char;
    return attributeKey;
  }
  throw new TypeError("Error");
}

function attributeKey(char) {
  if (LETTERS.test(char)) {
    currentToken.value += char;
    return attributeKey;
  } else if (char === "=") {
    // 属性key的名字已经结束了
    emit(currentToken);
    return attributeValue;
  }
}

function attributeValue(char) {
  // char = "
  if (char === '"') {
    currentToken.type = tokenTypes.AttributeStringValue;
    currentToken.value = char;
    return attributeStringValue; // 开始读字符串属性值
  } else if (char === "{") {
    currentToken.type = tokenTypes.AttributeExpressionValue;
    currentToken.value = char;
    return attributeExpressionValue;
  }
}
function attributeExpressionValue(char) {
  if (LETTERS.test(char)) {
    currentToken.value += char;
    return attributeExpressionValue;
  } else if (char === "}") {
    // 说明字符串的值结束了
    currentToken.value += char;
    emit(currentToken); // {type:'AttributeStringValue', value:'title' }
    return tryLeaveAttribute;
  }
  throw new TypeError("Error");
}
function attributeStringValue(char) {
  // t
  if (LETTERS.test(char)) {
    currentToken.value += char;
    return attributeStringValue;
  } else if (char === '"') {
    // 说明字符串的值结束了
    currentToken.value += char;
    emit(currentToken); // {type:'AttributeStringValue', value:'title' }
    return tryLeaveAttribute;
  }
  throw new TypeError("Error");
}
// 后面可能是一个新属性,也坑是开始标签的结束
function tryLeaveAttribute(char) {
  if (char === " ") {
    return attribute; // 后面是空格, 说明后面是一个新属性
  } else if (char === ">") {
    // '<h1 id="title">
    emit({
      type: tokenTypes.RightParentheses,
      value: ">",
    });
    return foundRightParentheses;
  }
}
function foundRightParentheses(char) {
  if (char === "<") {
    // '<h1 id="title"><
    emit({ type: tokenTypes.LeftParentheses, value: "<" });
    return foundLeftParentheses; // 找到<
  } else {
    // <h1 id='title'><span>h
    currentToken.type = tokenTypes.JSXText;
    currentToken.value += char;
    return jsxText;
  }
}
function jsxText(char) {
  if (char === "<") {
    emit(currentToken); // {type:'JSXText',value:'hello'}
    emit({ type: tokenTypes.LeftParentheses, value: "<" });
    return foundLeftParentheses;
  } else {
    currentToken.value += char;
    return jsxText;
  }
}

function tokenizer(input) {
  let state = start;
  for (let char of input) {
    if (state) state = state(char);
  }
  return tokens;
}

module.export = {
  tokenizer,
};

let sourceCode = `<h1 id="title" name={name}><span>hello</span>world</h1>`;
console.log(tokenizer(sourceCode));
