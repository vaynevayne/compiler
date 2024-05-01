let nodeTypes = require("./nodeTypes");
let ASTNode = require("./ASTNode");
let tokenTypes = require("./tokenTypes");

/**
 * 2+3*4
additive -> multiple | multiple + additive 包含+-
multiple -> NUMBER | NUMBER * multiple 包含 * /
 */
function toAST(tokenReader) {
  let rootNode = new ASTNode(nodeTypes.Program);
  // 开始推导 加法乘法 先推导加法, 加法权重高
  // 每一个规则都是一个函数 additive对应加法规则
  let child = additive(tokenReader);
  if (child) rootNode.appendChild(child);
  return rootNode;
}

function additive(tokenReader) {
  let child1 = multiple(tokenReader);
  let node = child1;
  let token = tokenReader.peek(); // 看下一个符号 +
  if (child1 !== null && token !== null) {
    if (token.type === tokenTypes.PLUS || token.type === tokenTypes.MINUS) {
      // 如果后面是加号
      token = tokenReader.read(); // 把加号读出来并消耗掉
      // add -> multiple | multiple + add
      // 加号后是add, 就要递归自身
      let child2 = additive(tokenReader);
      if (child2 !== null) {
        node = new ASTNode(
          token.type === tokenTypes.PLUS ? nodeTypes.Additive : nodeTypes.Minus
        );
        node.appendChild(child1);
        node.appendChild(child2);
      }
    }
  }
  return node;
}

// multiple -> NUMBER | NUMBER * multiple
function multiple(tokenReader) {
  const child1 = number(tokenReader); // 先匹配迟来NUMBER, 但是乘法规则并没有匹配结束

  // node 可能匹配到一个子节点规则,那么就是node, 如果有多个子节点, 那么node就是父节点
  let node = child1;
  let token = tokenReader.peek(); // + *
  if (child1 !== null && token !== null) {
    if (
      token.type === tokenTypes.MULTIPLY ||
      token.type === tokenTypes.DIVIDE
    ) {
      // 2+3*
      token = tokenReader.read(); // 读取下一个token *
      let child2 = multiple(tokenReader); // 4
      console.log("child2", child2);
      if (child2 !== null) {
        node = new ASTNode(
          token.type === tokenTypes.MULTIPLY
            ? nodeTypes.Multiplicative
            : nodeTypes.Divide
        );
        node.appendChild(child1);
        node.appendChild(child2);
      }
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
