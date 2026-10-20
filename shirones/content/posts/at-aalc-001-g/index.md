---
title: AALC001 G Sum of k-th Powers 题解
published: 2026-10-20
description: 普通线段树维护区间加、区间次方和
tags: [AtCoder, AALC, 线段树]
category: 题解
lang: zh_CN
draft: false
---

> 来源：[AAL Contest 001: Let's use segtree! G - Sum of k-th Powers](https://atcoder.jp/contests/aalc001/tasks/aalc001_g)

**题意：** 给定长度为 $n$ 的序列，每次操作对一段区间每个元素增加 $x$ 或者求区间内每个元素的 $k$ 次方和。

## 思路与核心代码

显然这是线段树，考虑如何与懒标记合并。我们可以将懒标记合并后的结果与合并前的结果对比，不难发现结论（以下以 $4$ 次方为例，其中 $L$ 表示懒标记值，$p_i$ 表示维护的 $i$ 次方和，$p_0$ 即区间长度；代码按 $k \le 4$ 写，更大的 $k$ 同理扩数组即可）。

$$
p_4=p_4+4p_3L+6p_2L^2+4p_1L^3+p_0L^4
$$

记得取模。

```cpp
struct L {
    ll v = 0;
    void operator+=(L o) { v = (v + o.v) % mod; }
};
struct V {
    int l = 0, r = 0;
    array<ll, 5> v;
    V(ll v = 0, int l = 0, int r = 0) : l(l), r(r) {
        for (ll c = 1, i = 0; i < 5; ++i, c = c * v % mod) this->v[i] = c;
    };
    void operator+=(L o) {
        v[4] = (v[4] + o.v * v[3] * 4 % mod + o.v * o.v % mod * v[2] * 6 % mod
                   + o.v * o.v % mod * o.v % mod * v[1] * 4 % mod
                   + o.v * o.v % mod * o.v % mod * o.v % mod * v[0] % mod)
            % mod;
        v[3] = (v[3] + o.v * v[2] * 3 % mod + o.v * o.v % mod * v[1] * 3 % mod
                   + o.v * o.v % mod * o.v % mod * v[0] % mod)
            % mod;
        v[2] = (v[2] + o.v * v[1] * 2 % mod + o.v * o.v % mod * v[0] % mod)
            % mod;
        v[1] = (v[1] + o.v * v[0] % mod) % mod;
    }
};
V operator+(V l, V r) {
    V ans(0, l.l, r.r);
    for (int i = 0; i < 5; ++i) ans.v[i] = (l.v[i] + r.v[i]) % mod;
    return ans;
}
```
