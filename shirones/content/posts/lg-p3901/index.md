---
title: "P3901 数列找不同"
published: 2026-11-04
description: "$O(n)$ 预处理后 $O(1)$ 判断区间互异"
tags: [洛谷, Ad-hoc]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P3901](https://www.luogu.com.cn/problem/P3901)

**题意：** 给定 $n$ 个正整数，以及 $q$ 组询问，每次询问区间 $[l,r]$ 内的数是否互不相同。

## 思路

比较有意思的想法。首先维护每个位置上一个与自己相同的地方在哪，然后求一个前缀最大值。显然该值就是以当前点为右端点的互不相同的最左端。然后询问时直接比较即可。

## 代码

```cpp
void solve() {
    int n, q;
    fr(n, q);
    vector<int> a(n + 1), pre(n + 1), pos(n + 1);
    frn(a, n);
    for (int i = 1; i <= n; ++i) pre[i] = pos[a[i]], pos[a[i]] = i;
    for (int i = 1; i <= n; ++i) pre[i] = max(pre[i], pre[i - 1]);
    for (int l, r; q--;) fr(l, r), fwn(pre[r] < l ? "Yes" : "No");
}
```
