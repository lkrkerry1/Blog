---
title: "P1640 [SCOI2010] 连续攻击游戏"
published: 2026-11-18
description: 二分图最大匹配：属性值连向装备编号，按 $1,2,3,\dots$ 的顺序找增广路，求最多能连续匹配到几
tags: [洛谷, 二分图, 图论建模]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P1640](https://www.luogu.com.cn/problem/P1640)

**题意：** 给 $n$ 个无序数对，求满足条件的最长序列：第 $i$ 个数对中存在 $i$。

## 思路

谁能想到这是图论题呢（

我们如此建图，将每个数对的值连向它的数对序号，于是这就形成了一个二分图。题目所求就是对序号进行匹配，然后求出最后一个可以匹配的连续位置。

然后直接粘贴模板。

由于第一次出现二分图匹配，这里具体写一下。先维护了一个时间戳避免重复 memset 导致超时，然后每个位置先贪心地匹配，如果匹配不到就去匹配的点寻找其是否还有没有匹配的选项（也就是寻找增广路）。如果能找到就更换匹配。

## 代码

```cpp
const int N = 1e6 + 5;
vector<int> gr[N];
int col[N], tm[N], now;
inline bool dfs(int u) {
    for (int v : gr[u]) {
        if (tm[v] == now) continue;
        tm[v] = now;
        if (!col[v] || dfs(col[v])) return col[v] = u, true;
    }
    return false;
}
void solve() {
    int n;
    fr(n);
    for (int i = 1, a, b; i <= n; ++i)
        fr(a, b), gr[a].emplace_back(i), gr[b].emplace_back(i);
    for (now = 1; now < N; ++now)
        if (!dfs(now)) break;
    fwn(now - 1);
}
```
