---
title: "洛谷 P1613 跑路"
published: 2026-11-22
description: "倍增+Floyd 基础练习题"
tags: [洛谷, 倍增, Floyd, 最短路]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P1613](https://www.luogu.com.cn/problem/P1613)

**题意：** 给定有向无权图，每次可以移动任意 $2^k$ 距离，求从 $1$ 到 $n$ 的最短用时。

## 思路

直接建个倍增表 $f(u,v,k)$ 表示 $u\rightarrow v$ 能否一次走 $2^k$ 到达，然后直接大力 Floyd 求最短路即可。

记得 Floyd 先枚举中转点，初始距离设为无穷大。

## 代码

```cpp
const int N = 64;
int dis[N][N], f[N][N][N];
void solve() {
    int n, m;
    fr(n, m), memset(dis, 0x3f, sizeof dis);
    for (int u, v; m--;) fr(u, v), dis[u][v] = f[u][v][0] = 1;
    for (int i = 1; i < N; ++i)
        for (int x = 1; x <= n; ++x)
            for (int u = 1; u <= n; ++u)
                for (int v = 1; v <= n; ++v)
                    if (f[u][x][i - 1] && f[x][v][i - 1])
                        f[u][v][i] = 1, dis[u][v] = 1;
    for (int x = 1; x <= n; ++x)
        for (int u = 1; u <= n; ++u)
            for (int v = 1; v <= n; ++v)
                dis[u][v] = min(dis[u][v], dis[u][x] + dis[x][v]);
    fwn(dis[1][n]);
}
```
