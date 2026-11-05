---
title: "P2357 守墓人"
published: 2026-11-04
description: '区间加、区间和的「超级树状数组」：用两棵 BIT 分别维护差分 $d_j$ 与 $jd_j$，以 $O(\log n)$ 同时支持区间加与区间和查询'
tags: [洛谷, 树状数组]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P2357](https://www.luogu.com.cn/problem/P2357)

**题意：** 维护序列区间加区间和。

## 思路

需要维护区间加区间和，不想写线段树，代码长常数大，怎么办？

介绍：超级树状数组！支持区间加区间和！而且是小常数 $O(\log n)$。

先用一个树状数组维护序列差分，区间加是容易的，考虑如何实现求区间和：
$$
\sum_{i=l}^ra_i=\sum_{i=l}^r\sum_{j=1}^id_j=(r-l+1)\sum_{j=1}^ld_j+\sum_{j=1}^{r-l}(r-l+1-j)d_{l+j}
$$

拆开化简之后发现只剩下了 $d_j$ 和 $jd_j$ 项，于是再用树状数组维护一个 $jd_j$ 即可。

## 代码

```cpp
void solve() {
    int n, q;
    fr(n, q);
    vector<ll> d(n + 2), kd(n + 2), a(n + 1);
    auto modify = [&](int l, int r, ll k) {
        auto c = [&](auto& tr, int p, ll x) {
            for (; p <= n + 1; p += p & (-p)) tr[p] += x;
        };
        c(d, l, k), c(d, r + 1, -k);
        c(kd, l, k * l), c(kd, r + 1, -k * (r + 1));
    };
    auto query = [&](int l, int r) -> ll {
        auto q = [&](const auto& tr, int p) -> ll {
            ll ans = 0;
            for (; p; p -= p & (-p)) ans += tr[p];
            return ans;
        };
        return q(d, r) * (r + 1) - q(kd, r) - q(d, l - 1) * l + q(kd, l - 1);
    };
    frn(a, n);
    for (int i = 1; i <= n; ++i) modify(i, i, a[i]);
    for (ll op, l, r, x; q--;) {
        fr(op);
        if (op == 1) fr(l, r, x), modify(l, r, x);
        else if (op == 2) fr(x), modify(1, 1, x);
        else if (op == 3) fr(x), modify(1, 1, -x);
        else if (op == 4) fr(l, r), fwn(query(l, r));
        else fwn(query(1, 1));
    }
}
```
