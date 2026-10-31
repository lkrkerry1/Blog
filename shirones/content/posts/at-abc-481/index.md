---
title: "ABC 481 做题记录"
published: 2026-10-31
description: 最短路、极角排序+双指针、分层图dp
tags: [AtCoder, 模拟赛, ABC]
category: 题解
lang: zh_CN
draft: false
---
上周时间和 CF2277 撞了，遂补题（仅补了 DEF）。总体来说比较简单，虽然这个 G 不会。

## [D - Autopilot](https://atcoder.jp/contests/abc481/tasks/abc481_d)

**题意：** 给一个有向图，每个点到最小的点边权为 $0$，到其他点边权为 $1$。求 $s$ 到 $t$ 最短路。

直接建图跑 `dijkstra` 即可。

```cpp
void solve() {
    int n, m, s, t;
    fr(n, m, s, t);
    vector<vector<int>> gt(n + 1);
    vector<vector<pair<int, int>>> gr(n + 1);
    for (int u, v; m--;) fr(u, v), gt[u].emplace_back(v);
    for (int i = 1; i <= n; ++i) {
        ranges::sort(gt[i]);
        if (gt[i].size()) gr[i].emplace_back(gt[i][0], 0);
        for (int j = 1; j < gt[i].size(); ++j) gr[i].emplace_back(gt[i][j], 1);
    }
    vector<int> dis(n + 1, 1e9);
    dis[s] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.emplace(0, s);
    while (pq.size()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d != dis[u]) continue;
        for (auto [v, w] : gr[u]) {
            if (dis[v] > dis[u] + w) pq.emplace(dis[v] = dis[u] + w, v);
        }
    }
    fwn(dis[t] >= 1e9 ? -1 : dis[t]);
}
```

## [E - Most Brilliant Starry Sky](https://atcoder.jp/contests/abc481/tasks/abc481_e)

**题意：** 给定平面上的 $n$ 个不共线的整点，求过原点的一条直线将这些点分成两半后较多的一半点数量的最大值。

极角排序。先根据 $\frac yx$ 和半平面排序，于是所有点就都是逆时针方向排列的了。接下来只需要用叉乘 $x_1y_2>x_2y_1$ 就能判断两个点逆时针角是否在 $180^\circ$ 内，于是可以双指针。不难发现向右移动合法左端点时右端点也向右，于是可以维护。复杂度 $O(n\log n)$，$\log$ 来自于排序。注意要先将点集复制一遍构成环再开始双指针。

```cpp
void solve() {
    int n;
    fr(n);
    vector<pair<int, int>> p(n);
    for (auto& [x, y] : p) fr(x, y);
    auto cmp = [](const auto& a, const auto& b) {
        return (ll)a.second * b.first < (ll)a.first * b.second;
    };
    auto div = [](const auto& a) {
        return a.second > 0 || (!a.second && a.first > 0);
    };
    ranges::sort(p, [&](const auto& a, const auto& b) {
        return div(a) != div(b) ? div(a) < div(b) : cmp(a, b);
    });
    p.resize(n << 1);
    for (int i = n; i < (n << 1); ++i) p[i] = p[i - n];
    int ans = 0;
    for (int l = 0, r = 1; l < n; ++l) {
        for (r = max(r, l + 1); r < l + n && cmp(p[l], p[r]); ++r);
        ans = max(ans, r - l);
    }
    fwn(ans);
}
```

## [F - Evil Shortest Path](https://atcoder.jp/contests/abc481/tasks/abc481_f)

**题意：** 给定有向图，边权为 $[1,9]$ 的正整数。求 $1$ 到其他每个节点的最短路，这里的路径长度为每条边的边权 **直接连接** 起来。

bfs 分层图，随后 dp。感觉挺简单？

我们先从 $1$ 开始跑 bfs 建立分层图。然后对于每个点，判断自己的上一个节点且在上一层的点中的路径最小的（这里只需比较祖先的编号，再比较新边权即可）。存储这些路径最小的上一个点。从这些点走回去就是最短的路径。

```cpp
const int mod = 998244353;
void solve() {
    int n, m;
    fr(n, m);
    vector<vector<pair<int, int>>> gr(n + 1), rg(n + 1);
    for (int u, v, w; m--;)
        fr(u, v, w), gr[u].emplace_back(v, w), rg[v].emplace_back(u, w);
    vector<int> dis(n + 1, -1);
    queue<int> q({ 1 });
    dis[1] = 0;
    for (int u; q.size();) {
        u = q.front(), q.pop();
        for (auto [v, w] : gr[u])
            if (dis[v] == -1) dis[v] = dis[u] + 1, q.emplace(v);
    }
    int d = *ranges::max_element(dis);
    vector<vector<int>> gl(d + 1);
    for (int i = 1; i <= n; ++i) gl[dis[i]].emplace_back(i);
    vector<int> rk(n + 1), pre(n + 1), cur(n + 1);
    for (int i = 1, r = 0; i <= d; ++i) {
        vector<pair<pair<int, int>, int>> tmp;
        for (int v : gl[i]) {
            pair p { INT_MAX, INT_MAX };
            int bu = -1, bw = -1;
            for (auto [u, w] : rg[v]) {
                if (dis[u] != i - 1) continue;
                pair c { rk[u], w };
                if (c < p) p = c, bu = u, bw = w;
            }
            pre[v] = bu, cur[v] = bw, tmp.emplace_back(p, v);
        }
        ranges::sort(tmp);
        for (auto [i, t] : tmp | views::enumerate) {
            if (i && t.first != tmp[i - 1].first) ++r;
            rk[t.second] = r;
        }
    }
    vector<ll> ans(n + 1);
    for (int i = 1; i <= d; ++i)
        for (int v : gl[i]) ans[v] = (ans[pre[v]] * 10 + cur[v]) % mod;
    for (int i = 2; i <= n; ++i) fwn(ans[i]);
}
```