---
title: "P2672 [NOIP 2015 普及组] 推销员"
published: 2026-11-24
description: 贪心+前缀和题
tags: [洛谷]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P2672](https://www.luogu.com.cn/problem/P2672)

**题意：** 给 $n$ 个人的位置 $s_i$ 和权值 $a_i$，你从 $0$ 出发，分别求出在不走多余路径时，领取 $k=1,2,\dots,n$ 个人的权值时的权值与移动距离之和的最大值。

## 思路

这个青吗？感觉难说，可能绿更好？

第一反应直接线段树（）维护每个点当前选择的增量，然后根据当前选择的最大位置分类讨论即可，这个没啥意思。

贪心做法：注意到最优情况只有两个，选择前 $k$ 大的 $a_i$ 和选择前 $k-1$ 大的 $a_i$ 并选择一个距离更远的但较小的 $a_i$。因为如果能够选不是前 $k$ 大的多于两个，那么这时较近的那一个换成第 $k-1$ 大肯定不会更差，于是得证。

按照权值从大到小排序，维护位置前缀最大值，权值前缀和，以及 $2s_i+a_i$ 的后缀最大值，直接查询答案即可。这个可比线段树好写多了。

## 代码

```cpp
void solve() {
    int n;
    fr(n);
    vector<pair<ll, ll>> s(n + 1);
    for (int i = 1; i <= n; ++i) fr(s[i].second);
    for (int i = 1; i <= n; ++i) fr(s[i].first);
    sort(s.begin() + 1, s.end(), greater { });
    vector<ll> pm(n + 1), ps(n + 1), sm(n + 2);
    for (int i = 1; i <= n; ++i)
        pm[i] = max(pm[i - 1], s[i].second), ps[i] = ps[i - 1] + s[i].first;
    for (int i = n; i >= 1; --i)
        sm[i] = max(sm[i + 1], (s[i].second << 1) + s[i].first);
    for (int i = 1; i <= n; ++i) {
        fwn(max(ps[i] + (pm[i] << 1), ps[i - 1] + sm[i + 1]));
    }
}
```
