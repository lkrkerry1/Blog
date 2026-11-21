---
title: "P3645 [APIO2015] 雅加达的摩天楼"
published: 2026-11-18
description: '根号分治估计隐式建图的状态数不超过 $(n+m)\sqrt n$，用 bitset 去重后直接 bfs，求 $0$ 号把消息传到 $1$ 号的最少跳跃步数'
tags: [洛谷, 根号分治, BFS]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P3645](https://www.luogu.com.cn/problem/P3645)

**题意：** $n$ 个点上有 $m$ 个人，第 $i$ 个人初始在 $b_i$ 点，可以向左右移动恰好 $p_i$ 个点。第 $0$ 个人将信息传递给 $1$ 最少需要移动几次。 

## 思路

本质暴力优化。

如果 $p_i\le\sqrt n$ 那么对于固定的 $p$ 最多有 $n$ 个不同位置；如果 $p_i>\sqrt n$，那么每个人最多在 $\sqrt n$ 个位置上。于是如果维护状态 $(b,p)$ 代表位于 $b$ 且移动范围为 $p$ 的人，最多有 $(n+m)\sqrt n$ 个。

于是直接隐式建图暴力 bfs，用 bitset 维护状态是否出现过进行去重即可。

如果一个点是第一次被访问，就将上面所有的人都去重后加入队列。否则只将当前点加入队列。

## 代码

```cpp
const int N = 3e4 + 5;
void solve() {
    int n, m, s, t;
    fr(n, m);
    vector<vector<int>> d(n);
    vector<bitset<N>> vis(n + 1);
    for (int i = 0, b, p; i < m; ++i) {
        fr(b, p), d[b].emplace_back(p);
        if (!i) s = b;
        if (i == 1) t = b;
    }
    if (s == t) return fwn(0);
    queue<tuple<int, int, int>> q;
    for (int u : d[s]) q.emplace(s, u, 0);
    auto insert = [&](int b, int p, int x) -> void {
        if (!vis[n][b]) {
            vis[n][b] = 1;
            for (int p : d[b])
                if (!vis[b][p]) vis[b][p] = 1, q.emplace(b, p, x);
        }
        if (!vis[b][p]) vis[b][p] = 1, q.emplace(b, p, x);
    };
    while (q.size()) {
        auto [b, p, x] = q.front();
        q.pop();
        if (abs(b - t) == p) return fwn(x + 1);
        if (b + p < n) insert(b + p, p, x + 1);
        if (b - p >= 0) insert(b - p, p, x + 1);
    }
    fwn(-1);
}
```
