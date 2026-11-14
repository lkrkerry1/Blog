---
title: 连通性相关
published: 2026-11-11
description: 点双、边双、割点、割边、圆方树
tags: [图论, tarjan, 连通性]
category: 笔记
lang: zh_CN
draft: false
---
此为连通性的几个板子汇总以及一些对比记忆。

## 强连通分量

强连通分量就是“环”，判定条件是 `dfn[u]=low[u]`，即 u 能够回到自己。

```cpp
auto tarjan = [&](this auto&& self, int u) -> void {
    dfn[u] = low[u] = ++t, s.emplace(u), vis[u] = 1;
    for (int v : gr[u]) {
        if (!dfn[v]) self(v), low[u] = min(low[u], low[v]);
        else if (vis[v]) low[u] = min(low[u], dfn[v]);
    }
    if (dfn[u] == low[u] && ++c)
        for (; vis[u]; s.pop()) scc[s.top()] = c, vis[s.top()] = 0;
};
for (int u = 1; u <= n; ++u)
    if (!dfn[u]) tarjan(u);
```

## 点双

点双连通分量就是无向图中的“环”，判定条件是 `dfn[u]<=low[v]`，也就是从 v 开始只能到 u 下方，并且点双会共用点，所以是在子树循环中弹栈，并且弹掉 v，还要将 u 也放进点双中。

```cpp
stack<int> s;
auto tarjan = [&](this auto&& self, int u, int fa) -> void {
    dfn[u] = low[u] = ++t, s.emplace(u);
    int sz = 0;
    for (int v : gr[u]) {
        if (!dfn[v]) {
            self(v, u), low[u] = min(low[u], low[v]), ++sz;
            if (dfn[u] <= low[v]) {
                bcc[++c].emplace_back(u);
                for (int p = 0; p != v; s.pop())
                    bcc[c].emplace_back(p = s.top());
            }
        } else if (v != fa) low[u] = min(low[u], dfn[v]);
    }
    if (!fa && !sz) bcc[++c].emplace_back(u);
};
```

## 边双

边双连通分量是无向图中的“强连通分量”，注意使用边序号来避免回头即可，其余和强连通分量一致。边双不会共用点。

```cpp
stack<int> s;
auto tarjan = [&](this auto&& self, int u, int e) -> void {
    dfn[u] = low[u] = ++t, s.emplace(u);
    for (auto [v, w] : gr[u]) {
        if (!dfn[v]) self(v, w), low[u] = min(low[u], low[v]);
        else if ((w ^ e) != 1) low[u] = min(low[u], dfn[v]);
    }
    if (dfn[u] == low[u] && ++c)
        for (int p = 0; p != u; s.pop()) ecc[c].emplace_back(p = s.top());
};
```

## 割点

## 割边

边序号避免回头，条件是 `dfn_u<low_v`，也就是回不到这个点本身。

```cpp
set<int> s;
auto tarjan = [&](this auto&& self, int u, int e) -> void {
    dfn[u] = low[u] = ++t;
    for (auto [v, w] : gr[u]) {
        if (!dfn[v]) {
            self(v, w), low[u] = min(low[u], low[v]);
            if (dfn[u] < low[v]) s.emplace(w >> 1);
        } else if ((e ^ w) != 1) low[u] = min(low[u], dfn[v]);
    }
};
```

## 圆方树

