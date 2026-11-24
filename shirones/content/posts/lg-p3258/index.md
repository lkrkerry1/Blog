---
title: "P3258 [JLOI2014] 松鼠的新家"
published: 2026-11-23
description: 树上差分模板（？）
tags: [洛谷, 倍增, 差分]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P3258](https://www.luogu.com.cn/problem/P3258)

**题意：** 给一棵树，和一段点序号，依次对这些相邻点对在树上的链加一，求最后的值（最后一个点不用加）。

## 思路

一眼树上差分。先预处理出倍增祖先表，然后每段路径就相当于 `++d[u],++d[v],--d[lca],--d[fa]` 其中 $fa$ 为 $lca$ 的父节点。然后 dfs 统计一下子树和即可。

## 代码

```cpp
void solve() {
    int n;
    fr(n);
    vector<int> a(n + 1), d(n + 1), dep(n + 1, -1);
    frn(a, n);
    vector<vector<int>> gr(n + 1);
    for (int i = 1, u, v; i < n; ++i)
        fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
    vector<array<int, 32>> f(n + 1, { 0 });
    auto dfs = [&](this auto&& self, int u, int fa) -> void {
        f[u][0] = fa, dep[u] = dep[fa] + 1;
        for (int k = 1; k < 32; ++k) f[u][k] = f[f[u][k - 1]][k - 1];
        for (int v : gr[u]) v != fa ? self(v, u) : void();
    };
    dfs(1, 0);
    auto lca = [&](int u, int v) {
        if (dep[u] < dep[v]) swap(u, v);
        for (int k = 31; k >= 0; --k)
            if (dep[f[u][k]] >= dep[v]) u = f[u][k];
        if (u == v) return u;
        for (int k = 31; k >= 0; --k)
            if (f[u][k] != f[v][k]) u = f[u][k], v = f[v][k];
        return f[u][0];
    };
    for (int i = 1, lc; i < n; ++i) {
        ++d[a[i]], lc = lca(a[i], a[i + 1]), --d[lc];
        --d[f[lc][0]], ++d[f[a[i + 1]][0]];
    }
    auto dfs2 = [&](this auto&& self, int u) -> void {
        for (int v : gr[u]) v != f[u][0] ? self(v), d[u] += d[v] : 0;
    };
    dfs2(1);
    for (int i = 1; i <= n; ++i) fwn(d[i]);
}
```
