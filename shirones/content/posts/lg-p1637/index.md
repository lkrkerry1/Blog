---
title: "P1637 三元上升子序列"
published: 2026-11-19
description: 多个树状数组维护连续二维偏序
tags: [洛谷, 树状数组]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P1637](https://www.luogu.com.cn/problem/P1637)

**题意：** 给定长度为 $n$ 的正整数组，求长度为 $3$ 的上升子序列个数。

## 思路

一般这种题需要离散化，不过该题值域较小可以不离散化。

开两个树状数组，第一个维护长度为 $2$ 的上升子序列，然后将答案插入第二个树状数组。最终的答案就从第二个树状数组查询即可。记得查询要减一。

## 代码

```cpp
struct FWT {
    vector<ll> tr;
    int n;
    FWT(int n = 0) : n(n), tr(n + 1) { }
    inline void c(int p, ll x) {
        for (; p <= n; p += p & -p) tr[p] += x;
    }
    inline ll q(int p) {
        ll ans = 0;
        for (; p; p -= p & -p) ans += tr[p];
        return ans;
    }
};
void solve() {
    int n, mx;
    fr(n);
    vector<int> a(n + 1);
    frn(a, n), mx = *ranges::max_element(a);
    FWT t1(mx), t2(mx);
    ll ans = 0;
    for (int i = 1; i <= n; ++i) {
        ans += t2.q(a[i] - 1), t2.c(a[i], t1.q(a[i] - 1)), t1.c(a[i], 1);
    }
    fwn(ans);
}
```
