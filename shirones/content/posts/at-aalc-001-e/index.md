---
title: AALC001 E RGB 题解
published: 2026-10-19
description: 普通线段树维护特定样式出现次数
tags: [AtCoder, AALC, 线段树]
category: 题解
lang: zh_CN
draft: false
---

> 来源：[AAL Contest 001: Let's use segtree! E - RGB](https://atcoder.jp/contests/aalc001/tasks/aalc001_e)

**题意：** 给定长度为 $n$ 的 `RGB` 串与数列 $a_i$，每次单点修改后，求所有下标递增且字符依次为 `R`、`G`、`B` 的三元组 $(i,j,k)$ 的 $a_ia_ja_k$ 之和（对 $998244353$ 取模）。

## 思路及核心代码

不难发现这个性质是群性质，$f_{\mathrm{rgb}} = f_{\mathrm{rgb}}^{l} + f_{\mathrm{rgb}}^{r} + f_{\mathrm{r}}^{l} f_{\mathrm{gb}}^{r} + f_{\mathrm{rg}}^{l} f_{\mathrm{b}}^{r}$，其他类似可以简单维护。记得取模。

```cpp
const int mod = 998244353;
struct V {
    array<ll, 6> v { }; // r g b rg gb rgb
    int l = 0, r = 0;
    V(const array<ll, 6>& v = { }, int l = 0, int r = 0) : v(v), l(l), r(r) { }
    void operator+=(const V& o) { v = o.v; }
};
V operator+(V l, V r) {
    V ans(array<ll, 6>(), l.l, r.r);
    for (int i = 0; i < 6; ++i) ans.v[i] = (l.v[i] + r.v[i]) % mod;
    ans.v[3] = (ans.v[3] + l.v[0] * r.v[1] % mod) % mod;
    ans.v[4] = (ans.v[4] + l.v[1] * r.v[2] % mod) % mod;
    ans.v[5] = (ans.v[5] + l.v[0] * r.v[4] % mod + l.v[3] * r.v[2] % mod) % mod;
    return ans;
}
```