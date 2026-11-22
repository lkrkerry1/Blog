---
title: "ABC 485 做题记录"
published: 2026-11-21
description: 贪心模拟、图论bfs+二分重复区间
tags: [AtCoder, 模拟赛, ABC]
category: 题解
lang: zh_CN
draft: false
---
牢了这集，这个 F 不会可还行。然后 E 前面读错题然后又浪费好久。perf 1435。

## [D - ABC|ABC|ABC](https://atcoder.jp/contests/abc485/tasks/abc485_d)

**题意：** 给定长度为 $n$ 的 ABC 字符串，将其分为三段要求每段都包含三个不同字母。求分段方案数。

预处理每个点到下一个 ABC 都出现过的地方和上一个都出现过的地方，然后枚举分割的左端点然后答案就是 $\max(0,pre_n-nxt_i)$。

```cpp
void solve() {
    int n;
    fr(n);
    string s;
    fr(s), s = ' ' + s;
    vector<int> nxt(n + 1), pre(n + 1);
    array<int, 3> cnt { };
    for (int i = 1, j = 1; i <= n; ++i) {
        for (; j <= n && !(cnt[0] && cnt[1] && cnt[2]); ++j) ++cnt[s[j] - 'A'];
        if (cnt[0] && cnt[1] && cnt[2]) nxt[i] = j;
        else nxt[i] = n + 1;
        --cnt[s[i] - 'A'];
    }
    cnt[0] = cnt[1] = cnt[2] = 0;
    for (int i = n, j = n; i >= 1; --i) {
        for (; j >= 1 && !(cnt[0] && cnt[1] && cnt[2]); --j) ++cnt[s[j] - 'A'];
        if (cnt[0] && cnt[1] && cnt[2]) pre[i] = j;
        else pre[i] = 0;
        --cnt[s[i] - 'A'];
    }
    ll ans = 0;
    for (int i = nxt[1]; i <= n; ++i) { ans += max(0, pre[n] - nxt[i] + 2); }
    fwn(ans);
}
```

## [E - Colorful Route](https://atcoder.jp/contests/abc485/tasks/abc485_e)

**题意：** 给定 $n$ 个点，$m$ 条边的有向无权图，每条边上都有颜色，要求不能 **连续** 经过相同颜色的边，求从 $1$ 到 $n$ 的最短路。 

没招了，看错了没看到连续直接浪费 20min。而且本身这个玩意就比较麻烦。

直接 bfs，然后注意到如果某个点是第一次经过，那么就只有相同颜色的边不能去，按照颜色排序之后这就是一段连续区间，可以二分出来。直接跳过就行。

如果第二次通过不同的颜色进来，那么这时就已经可以去所有边了，直接补上这部分边即可。

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<vector<pair<int, int>>> gr(n + 1);
    for (int u, v, w; m--;) fr(u, v, w), gr[u].emplace_back(w, v);
    for (int i = 1; i <= n; ++i) ranges::sort(gr[i]);
    queue<tuple<int, int, int>> q({ { 1, 0, 0 } });
    vector<bool> vis(n + 1);
    vector<int> col(n + 1), l(n + 1), r(n + 1);
    while (q.size()) {
        auto [u, c, d] = q.front();
        q.pop();
        if (u == n) return fwn(d);
        if (!vis[u]) {
            vis[u] = 1, col[u] = c;
            l[u] = ranges::lower_bound(gr[u], pair { c, 0 }) - gr[u].begin();
            r[u] = ranges::upper_bound(gr[u], pair { c, 1e9 }) - gr[u].begin();
            for (int i = 0; i < l[u]; ++i)
                q.emplace(gr[u][i].second, gr[u][i].first, d + 1);
            for (int i = r[u]; i < gr[u].size(); ++i)
                q.emplace(gr[u][i].second, gr[u][i].first, d + 1);
        } else if (c != col[u]) {
            for (int i = l[u]; i < r[u]; ++i)
                q.emplace(gr[u][i].second, gr[u][i].first, d + 1);
            l[u] = r[u] = 0;
        }
    }
    fwn(-1);
}
```
