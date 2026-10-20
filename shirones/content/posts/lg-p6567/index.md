---
title: P6567 买表
published: 2026-10-08
description: 卡常，多重背包优化
tags: [洛谷, DP, 二进制技巧, 卡常]
category: 题解
lang: zh_CN
draft: false
---


> 来源：[P6567 [NOI Online #3 入门组] 买表](https://www.luogu.com.cn/problem/P6567)

**题意：** 给 $n$ 张纸币，$m$ 次询问，每次询问能否恰好用手上的纸币购买对应价值的物品。

传说中的 **一秒 1e9**，这个数据范围按理来讲是会 tle 的，但跑得飞快。

## 思路及代码

设 $f(v)$ 为价值为 $v$ 的物品能否被购买，显然有 $f(v)=\operatorname{or}_uf(v-uk_i)$，然后对给的纸币进行二进制优化，即每种纸币拆成 $\log k_i$ 个物品。但这样复杂度是 $O(nv\log k)$ 的，实际会跑到 $10^9$。我们可以把 `f` 丢进 `bitset` 里维护，减少一个 $32$ 的常数，然后就惊奇的过了，甚至跑得飞快。

```cpp
void solve() {
    bitset<500005> f;
    int n, m;
    fr(n, m), f[0] = 1;
    for (int k, a; n--;) {
        fr(k, a);
        for (int j = 1; j <= a; j <<= 1) f |= (f << (j * k)), a -= j;
        if (a) f |= (f << a * k);
    }
    for (int u; m--;) { fr(u), fwn(f[u] ? "Yes" : "No"); }
}
```