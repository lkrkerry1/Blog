---
title: "P2607 [ZJOI2008] 骑士（基环树上dp模板题）"
published: 2026-10-27
description: 在基环树（每个点最多在一个环上）上求解最大带权独立集
tags: [洛谷, DP, 并查集]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P2607](https://www.luogu.com.cn/problem/P2607)

**题意：** 给定一个有 $n$ 个节点和 $n$ 条边的图，每个点有一个权值。在每个点与其相邻点不能同时选的前提下求最大总权值。

## 思路

发现该题中每个点最多位于一个环上。考虑先将环拆开成为树（森林），在树上是容易的，直接 dp 就行。我们只需要在输入边时判断这两个点是否原本就连通。如果连通就是环边，设为 $u,v$，那么分别以 $u,v$ 为根计算独立集，且取其不选时的最大值即可。

因为这两个点不能同时选，每次钦定一个点不选就能枚举出所有情况（如果钦定一个点选可能导致两个点都选上）。

## 代码

```cpp
void solve() {
    int n;
    fr(n);
    vector<ll> fa(n + 1), a(n + 1);
    ranges::iota(fa, 0);
    auto getf = [&](this auto&& self, int x) -> int {
        return x == fa[x] ? x : fa[x] = self(fa[x]);
    };
    vector<vector<int>> gr(n + 1);
    vector<pair<int, int>> cir;
    vector<array<ll, 2>> f(n + 1);
    for (int i = 1, x; i <= n; ++i) {
        fr(a[i], x);
        if (getf(x) == getf(i)) {
            cir.emplace_back(i, x);
            continue;
        }
        gr[x].emplace_back(i), gr[i].emplace_back(x), fa[getf(x)] = getf(i);
    }
    auto dfs = [&](this auto&& self, int u, int fa) -> void {
        f[u] = { 0, a[u] };
        for (int v : gr[u])
            if (v != fa) {
                self(v, u), f[u][0] += max(f[v][0], f[v][1]);
                f[u][1] += f[v][0];
            }
    };
    ll ans = 0, tmp = 0;
    for (auto [u, v] : cir) {
        dfs(u, 0), tmp = f[u][0], dfs(v, 0), ans += max(tmp, f[v][0]);
    }
    fwn(ans);
}
```
