let NUMBERS = /[0-9]/;
const Numeric = "Numeric";
const Punctuator = "Punctuator";

let tokens = [];
/**
 *
 * start 表示开始状态
 * 它是一个函数, 接受一个字符,返回下一个状态函数
 */
let currentToken;
// 确定一个新token
function emit(token) {
  currentToken = { type: "", value: "" };
  tokens.push(token);
}

function start(char) {
  //char =1
  if (NUMBERS.test(char)) {
    // 如果char是一个数字的话
    currentToken = { type: Numeric, value: "" };
  }
  // 进入新的状态, 收集number数字的状态
  return number(char);
}

function number(char) {
  if (NUMBERS.test(char)) {
    // 如果char是一个数字的话
    currentToken.value += char;
  } else if (char === "+" || char === "-") {
    emit(currentToken);
    emit({
      type: Punctuator,
      value: char,
    });
    currentToken = { type: Numeric, value: "" };
  }
  return number;
}

function tokenizer(input) {
  // 刚开始的时候是char的状态
  let state = start;
  for (let char of input) {
    state = state(char);
  }
  if (currentToken.value.length > 0) {
    emit(currentToken);
  }
}
// 10 + 20
tokenizer("10+20");
console.log(tokens);
