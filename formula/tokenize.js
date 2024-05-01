// + * - /
let RegExpObject = /([0-9]+)|(\+)|(\*)|(-)|(\/)/g;
let tokenTypes = require("./tokenTypes");
let tokenNames = [
  tokenTypes.NUMBER,
  tokenTypes.PLUS,
  tokenTypes.MULTIPLY,
  tokenTypes.MINUS,
  tokenTypes.DIVIDE,
];

/**
 *
 * 一段代码转成
 */
function* tokenizer(script) {
  let result;
  while (true) {
    result = RegExpObject.exec(script);
    if (!result) break;
    let index = result.findIndex((item, index) => index > 0 && !!item);
    let token = {};
    token.type = tokenNames[index - 1];
    token.value = result[0]; // 第一项是匹配的内容, 后几项是分组信息
    yield token;
  }
}

function tokenize(script) {
  let tokens = [];
  for (let token of tokenizer(script)) tokens.push(token);
  return new TokenReader(tokens);
}

class TokenReader {
  constructor(tokens) {
    this.tokens = tokens; // token数组
    this.pos = 0; // 索引
  }
  // 读取当前位置上的token,并消耗
  read() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++]; // 读完后自增, 消耗token
    }
    return null;
  }

  peek() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos]; // 读完后不自增
    }
    return null;
  }
  // 恢复,倒退
  unread() {
    if (this.pos > 0) {
      this.pos--;
    }
  }
}

// const tokenReader = tokenize("2+3+4");
// console.log(tokenReader.peek()); // 2
// console.log(tokenReader.peek()); // 2
// console.log(tokenReader.peek()); // 2
// console.log(tokenReader.read()); // 2
// console.log(tokenReader.read()); // 3
// console.log(tokenReader.peek()); // 3
// tokenReader.unread();
// console.log(tokenReader.peek()); // +

module.exports = tokenize;
