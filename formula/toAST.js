let nodeTypes = require("./nodeTypes");
let ASTNode = require("./ASTNode");
let tokenTypes = require("./tokenTypes");

/**
 * 2+3*4
additive -> minus | minus + additive  
minus -> multiple | multiple - minus 
multiple -> divide | divide * multiple
divide -> primary | primary / divide
primary -> NUMBER | (additive) 基础规则
 */
function toAST(tokenReader) {
  let rootNode = new ASTNode(nodeTypes.Program);
  // 开始推导 加法乘法 先推导加法, 加法权重高
  // 每一个规则都是一个函数 additive对应加法规则
  let child = additive(tokenReader);
  if (child) rootNode.appendChild(child);
  return rootNode;
}

// additive -> minus | minus + additive
function additive(tokenReader) {
  let child1 = minus(tokenReader);
  // 用node 存child 是因为 第二段 minus + additive   是两个规则产生的
  let node = child1;

  let token = tokenReader.peek(); // 看下一个符号 +
  if (child1 !== null && token !== null) {
    if (token.type === tokenTypes.PLUS) {
      // 如果后面是加号
      token = tokenReader.read(); // 把加号读出来并消耗掉
      // add -> multiple | multiple + add
      // 加号后是add, 就要递归自身
      let child2 = additive(tokenReader);
      if (child2 !== null) {
        node = new ASTNode(nodeTypes.Additive);
        node.appendChild(child1);
        node.appendChild(child2);
      }
    }
  }
  return node;
}

function minus(tokenReader) {
  let child1 = multiple(tokenReader);
  let node = child1;
  let token = tokenReader.peek(); // 看下一个符号 +
  if (child1 !== null && token !== null) {
    if (token.type === tokenTypes.MINUS) {
      // 如果后面是加号
      token = tokenReader.read(); // 把加号读出来并消耗掉
      // add -> multiple | multiple + add
      // 加号后是add, 就要递归自身
      let child2 = minus(tokenReader);
      if (child2 !== null) {
        node = new ASTNode(nodeTypes.Minus);
        node.appendChild(child1);
        node.appendChild(child2);
      }
    }
  }
  return node;
}

// multiple -> NUMBER | NUMBER * multiple
function multiple(tokenReader) {
  const child1 = divide(tokenReader); // 先匹配迟来NUMBER, 但是乘法规则并没有匹配结束

  // node 可能匹配到一个子节点规则,那么就是node, 如果有多个子节点, 那么node就是父节点
  let node = child1;
  let token = tokenReader.peek(); // + *
  if (child1 !== null && token !== null) {
    if (token.type === tokenTypes.MULTIPLY) {
      // 2+3*
      token = tokenReader.read(); // 读取下一个token *
      let child2 = multiple(tokenReader); // 4
      if (child2 !== null) {
        node = new ASTNode(nodeTypes.Multiplicative);
        node.appendChild(child1);
        node.appendChild(child2);
      }
    }
  }
  return node;
}

// divide -> primary | primary / divide
function divide(tokenReader) {
  const child1 = primary(tokenReader); // 先匹配迟来NUMBER, 但是乘法规则并没有匹配结束

  // node 可能匹配到一个子节点规则,那么就是node, 如果有多个子节点, 那么node就是父节点
  let node = child1;
  let token = tokenReader.peek(); // + *
  if (child1 !== null && token !== null) {
    if (token.type === tokenTypes.DIVIDE) {
      // 2+3*
      token = tokenReader.read(); // 读取下一个token *
      let child2 = divide(tokenReader); // 4
      if (child2 !== null) {
        node = new ASTNode(nodeTypes.Divide);
        node.appendChild(child1);
        node.appendChild(child2);
      }
    }
  }
  return node;
}

// primary -> NUMBER | (additive) 基础规则
function primary(tokenReader) {
  let node = number(tokenReader);
  // 不用 node 存 child 是因为两个规则只会产生一个值
  if (!node) {
    let token = tokenReader.peek();
    if (token !== null && token.type === tokenTypes.LEFT_PARA) {
      tokenReader.read();
      node = additive(tokenReader);
      tokenReader.read();
    }
  }
  return node;
}

function number(tokenReader) {
  let node = null;
  let token = tokenReader.peek(); //查看当前的token
  // 如果能取到token, 并且token的类型时数字的话就匹配上的
  if (token !== null && token.type === tokenTypes.NUMBER) {
    token = tokenReader.read(); // 读取并消耗掉这个token
    node = new ASTNode(nodeTypes.Numeric, token.value); // 2
  }
  return node;
}

module.exports = toAST;
