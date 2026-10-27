---
title: AALC001 H Add and Mod 题解
published: 2026-10-24
description: 普通线段树维护单点修改，根据条件取模
tags: [AtCoder, AALC, 线段树]
category: 题解
lang: zh_CN
draft: false
---

> 来源：[AAL Contest 001: Let's use segtree! H - Add and Mod](https://atcoder.jp/contests/aalc001/tasks/aalc001_h)

**题意：** 给长度为 $n$ 的序列 $a_i$，每次操作修改单点或给区间 $[l,r]$ 以及整数 $x$，对于区间内的每个 $a_i$，若其为零，则将当前 $x$ 对 $998244353$ 取模；否则加上 $a_i$。对每次第二种操作求值。

## 思路

数据范围明显是线段树（这题树状数组可做），考虑如何合并信息。考虑每个节点维护 $a,b$ 以及一个标记表示是否要取模，表示先加上 $a$，取模，然后再加上 $b$。那么合并时如果晚一点的操作要取模，就可以忽略掉早一点操作的取模，直接合并相加；反之如果早一点的操作要取模，那就取模之后加两次。

$$
\mathrm{ADD}_b \circ \mathrm{ADD}_a = \mathrm{ADD}_{a+b}
$$
$$
\mathrm{ADD}_c \circ G_{a,b} = G_{a,b+c}
$$
$$
G_{b,c} \circ \mathrm{ADD}_a = G_{a+b,c}
$$
$$
G_{c,d} \circ G_{a,b} = G_{a+b+c,d}
$$

## 核心代码

```cpp
const int mod = 998244353;
struct V {
    ll a, b;
    bool m;
    int l = 0, r = 0;
    void operator+=(V o) { a = o.a, b = o.b, m = o.m; }
};
V operator+(V l, V r) {
    if (r.m) return V { (l.a + l.b + r.a) % mod, r.b, true, l.l, r.r };
    if (l.m) return V { l.a, l.b + r.a, true, l.l, r.r };
    return V { l.a + r.a, 0, 0, l.l, r.r };
}
```