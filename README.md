这样的文法, add 写左边 ,结合性是正确的, 计算顺序是从左到右

add -> add| add+multiple
multiple -> multiple|multiple\*NUMBER

但是会出现左递归问题, add -> add

如果改成这样, 就不会出现左递归问题,但是结合性又不对了
add -> multiple | multiple + add
multiple -> NUMBER | NUMBER \* multiple

需要非常复杂的解决方法
