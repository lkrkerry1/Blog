---
title: "P4782 【模板】2-SAT"
published: 2026-10-27
description: "通过强连通分量计算 2-SAT 问题"
tags: [洛谷, 2-SAT, 连通性, 模板]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P4782](https://www.luogu.com.cn/problem/P4782)

**题意：** 给定 $m$ 组“或”关系，求出是否有矛盾。如无矛盾，输出一组可行解。

## 思路

先建图，开两倍的点代表真/假关系。边 $u\rightarrow v$ 代表 $u$ 为真时 $v$ 为真。那么或关系可以拆成两条边。然后不难发现图中的每一个强连通分量内真假关系相同。于是当 $u,u+n$ 位于同一个 scc 中时无解。

考虑如何构造可行解。当我们使用 tarjan 计算 scc 时，顺带计算了 dfn，显然将 dfn 逆序后，每一个点都不会影响之后的点的取值。而 scc 是逆序处理，也就是逆拓扑序。如果 $\neg x$ 的 scc 编号大于 $x$，那么 $x$ 拓扑序较早可以先定义，即取 $x$ 为真。

确切地说，对于某条边 $u\rightarrow v$，拓扑序：$u<v,\neg v<\neg u$ 那么就取 $v$ 为真。这样产生的限制极少不会产生矛盾。反之如果取 $u$ 为真，可能产生矛盾（按照该规则 $v$ 取假）。而对于每条边先取入点为真，也就是取逆拓扑序较大的点为真即可，即 scc 编号较小为真。**假大于真**。

## 代码

```cpp
void solve() {
    int n, m, c = 0, t = 0;
    fr(n, m);
    vector<vector<int>> gr(n << 1 | 1);
    for (int u, x, v, y; m--;) {
        fr(u, x, v, y), gr[u + (!x) * n].emplace_back(v + y * n);
        gr[v + (!y) * n].emplace_back(u + x * n);
    }
    vector<int> dfn(n << 1 | 1), low(n << 1 | 1), scc(n << 1 | 1);
    vector<bool> vis(n << 1 | 1);
    stack<int, vector<int>> s;
    auto tarjan = [&](this auto&& self, int u) -> void {
        s.emplace(u), vis[u] = 1, dfn[u] = low[u] = ++t;
        for (int v : gr[u]) {
            if (!dfn[v]) self(v), low[u] = min(low[u], low[v]);
            else if (vis[v]) low[u] = min(low[u], dfn[v]);
        }
        if (dfn[u] == low[u] && ++c)
            for (; vis[u]; s.pop()) scc[s.top()] = c, vis[s.top()] = 0;
    };
    for (int i = 1; i <= (n << 1); ++i)
        if (!dfn[i]) tarjan(i);
    for (int i = 1; i <= n; ++i)
        if (scc[i] == scc[i + n]) return fwn("IMPOSSIBLE");
    fwn("POSSIBLE");
    for (int i = 1; i <= n; ++i) fw(scc[i] > scc[i + n]), fw(' ');
}
```
