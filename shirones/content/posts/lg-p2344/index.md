---
title: "P2344 [USACO11FEB] Generic Cow Protests G"
published: 2026-11-18
description: '树状数组优化 DP：$f(i)=\sum_{j<i}[s_i\ge s_j]f(j)$，前缀和离散化后按 $s_i$ 顺序插入树状数组，答案对 $10^9+9$ 取模'
tags: [洛谷, 树状数组, DP]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P2344](https://www.luogu.com.cn/problem/P2344)

**题意：** 给定长度为 $n$ 的整数组，将其分成一些段使得每段和非负。求分段方案数。

## 思路

先前缀和，随后不难写出递推式（$f(i)$ 为处理到 $i$ 的分段方案数）
$$
f(i)=\sum_{j<i}[s_i\ge s_j]f(j)
$$
于是将 $s_i$ 离散化，随后将 $f(i)$ 插入树状数组的 $s_i$ 位置即可。记得先求值再插入，还要取模！

## 代码

```cpp
const int mi = 1e9 + 9;
void solve() {
    int n;
    fr(n);
    vector<int> a(n + 1), s(n + 1);
    frn(a, n);
    for (int i = 1; i <= n; ++i) s[i] = s[i - 1] + a[i];
    auto t = s;
    ranges::sort(t), t.erase(unique(t.begin(), t.end()), t.end());
    int m = t.size();
    for (auto& x : s) x = ranges::lower_bound(t, x) - t.begin() + 1;
    vector<ll> tr(m + 1), f(n + 1);
    auto mod = [&](int p, ll x) {
        for (; p <= m; p += p & -p) tr[p] = (tr[p] + x) % mi;
    };
    auto qry = [&](int p) {
        ll ans = 0;
        for (; p; p -= p & -p) ans = (ans + tr[p]) % mi;
        return ans;
    };
    mod(s[0], 1);
    for (int i = 1; i <= n; ++i) { f[i] = qry(s[i]), mod(s[i], f[i]); }
    fwn(f[n]);
}
```
