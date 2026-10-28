---
title: "P7771 【模板】欧拉路径"
published: 2026-10-27
description: 欧拉路径模板题
tags: [洛谷, 欧拉回路, 模板]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P7771](https://www.luogu.com.cn/problem/P7771)

**题意：** 给定一个有向图，求其字典序最小的欧拉路径（经过每条边且不重复的路径）。

## 思路

先建图，维护出度入度并对每个点的后继者排序。不难知道如果出入度差值超过 $1$，那么不可能存在欧拉路径，而且最多有一个点出度比入度多 $1$，一个点入度比出度多 $1$ 分别为起点和终点（如果全部点出度入度相等就取 $1$ 为出发点，字典序最小）。

然后从起点开始 dfs，记得维护当前访问到了哪条边即可。复杂度 $O(n+m)$。

## 代码

```cpp
void solve() {
    int n, m, s = 0, e = 0;
    fr(n, m);
    vector<vector<int>> gr(n + 1);
    vector<int> ideg(n + 1), odeg(n + 1);
    for (int u, v; m--;) fr(u, v), gr[u].emplace_back(v), ++ideg[v], ++odeg[u];
    for (int i = 1; i <= n; ++i) {
        ranges::sort(gr[i]);
        if (abs(ideg[i] - odeg[i]) > 1) return fwn("No");
        if (ideg[i] > odeg[i]) {
            if (e) return fwn("No");
            e = i;
        } else if (ideg[i] < odeg[i]) {
            if (s) return fwn("No");
            s = i;
        }
    }
    if ((!s) ^ (!e)) return fwn("No");
    else if (!s) s = 1;
    vector<int> cur(n + 1), ans;
    auto dfs = [&](this auto&& self, int u) -> void {
        for (; cur[u] < gr[u].size();) self(gr[u][cur[u]++]);
        ans.emplace_back(u);
    };
    dfs(s), ranges::reverse(ans), fwn(ans);
}
```
