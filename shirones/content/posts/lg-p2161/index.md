---
title: "P2161 [SHOI2009] 会场预约"
published: 2026-11-04
description: "使用 STL set 的重载运算符快速保留无重叠区间"
tags: [洛谷, STL技巧]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P2161](https://www.luogu.com.cn/problem/P2161)

**题意：** 维护一些区间，有两种操作：增加一个区间，并删除与其有重叠部分的所有区间并输出删除的数量；查询当前一共有多少区间。

## 思路

比较奇技淫巧。注意到 set 可以传入一个比较函数，而 set 判断两个元素等价的依据是 $\neg(a<b)\wedge\neg(b<a)$。于是我们定义一个自定义比较，判断 $a.r < b.l$，这样所有有重叠的区间都会被判定为相同，直接 find 然后 erase 即可。

## 代码

```cpp
void solve() {
    int n;
    fr(n);
    set<pair<int, int>, decltype([](const auto& a, const auto& b) {
        return a.second < b.first;
    })>
        s;
    while (n--) {
        char op;
        int l, r;
        fr(op);
        if (op == 'A') {
            fr(l, r);
            int cnt = 0;
            for (auto it = s.find({ l, r }); it != s.end();
                it = s.find({ l, r }))
                s.erase(it), ++cnt;
            fwn(cnt), s.emplace(l, r);
        } else fwn(s.size());
    }
}
```
