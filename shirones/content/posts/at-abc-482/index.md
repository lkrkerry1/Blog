---
title: "ABC 482 做题记录"
published: 2026-10-31
description: 离散化+二分边界、贪心构造、树的中心+直径
tags: [AtCoder, 模拟赛, ABC]
category: 题解
lang: zh_CN
draft: false
---
AB 是签到，跳过。这场前面很快，但在 E 卡了很久。不过 F 比较难，所以最后 perf 也有 1600+。

## [C - Band Count](https://atcoder.jp/contests/abc482/tasks/abc482_c)

**题意：** 给定 $n$ 个整点，$q$ 组询问，每次询问 $[l,r]$ 行内或列内的点个数。

离散化，随后二分查询即可。要注意左端点使用 `lower_bound` 查询，因为如果存在该点，直接查到当前位置，减一之后刚好符合闭区间；若不存在，查到下一个位置，减一之后也符合。

右端点使用 `upper_bound`，而且要减一。因为如果存在该点，使用 `lower_bound` 会漏掉该点；如果不存在，使用 `lower_bound` 如果不减一就多包含了一个点。因此使用 `upper_bound`。

```cpp
void solve() {
    int h, w, n, q;
    fr(h, w, n, q);
    vector<int> r(n), c(n), rs(n + 1), cs(n + 1);
    for (int i = 0; i < n; ++i) fr(r[i], c[i]);
    {
        auto rt = r, ct = c;
        ranges::sort(r), ranges::sort(c);
        r.erase(unique(r.begin(), r.end()), r.end());
        c.erase(unique(c.begin(), c.end()), c.end());
        for (auto& x : rt) ++rs[ranges::lower_bound(r, x) - r.begin()];
        for (auto& x : ct) ++cs[ranges::lower_bound(c, x) - c.begin()];
    }
    for (int i = 1; i <= n; ++i) rs[i] += rs[i - 1], cs[i] += cs[i - 1];
    for (int op, lf, rt; q--;) {
        fr(op, lf, rt);
        if (op == 1) {
            lf = ranges::lower_bound(r, lf) - r.begin();
            rt = ranges::upper_bound(r, rt) - r.begin();
            fwn(rs[rt - 1] - (lf ? rs[lf - 1] : 0));
        } else {
            lf = ranges::lower_bound(c, lf) - c.begin();
            rt = ranges::upper_bound(c, rt) - c.begin();
            fwn(cs[rt - 1] - (lf ? cs[lf - 1] : 0));
        }
    }
}
```

## [D - Wannabe Zombie](https://atcoder.jp/contests/abc482/tasks/abc482_d)

**题意：** 数轴的 $n$ 个整数点站着人，分别让每个人初始是僵尸，每个人或僵尸每轮可以向左右走一格，人和僵尸到同一格时人变成僵尸。问将所有人变为僵尸所需的最小轮数。

贪心。注意到最优情况就是先感染相邻的人，随后向左右扩展。此时答案为（以右侧相邻为例）：
$$
\frac{a_{k+1}-a_k}2+\frac{\max(a_n-a_{k+1},a_k-a_1)}2
$$

```cpp
void solve() {
    int n;
    fr(n);
    vector<int> a(n + 1), ans(n + 1);
    frn(a, n), ans[1] = ans[n] = (a[n] - a[1]) >> 1;
    for (int i = 2; i < n; ++i) {
        ans[i] = min(((a[i + 1] - a[i]) >> 1)
                + max((a[n] - a[i + 1]) >> 1, (a[i] - a[1]) >> 1),
            ((a[i] - a[i - 1]) >> 1)
                + max((a[n] - a[i]) >> 1, (a[i - 1] - a[1]) >> 1));
    }
    for (int i = 1; i <= n; ++i) fwn(ans[i]);
}
```

## [E - Diameter Endpoint Colors](https://atcoder.jp/contests/abc482/tasks/abc482_e)

**题意：** 给一棵节点上有色的树，求该树直径两端颜色相同的条数。

相当麻烦的树论题。

首先注意到所有直径都过中间的一个或两个点，先两次 dfs 求出直径，根据直径奇偶分类：

如果直径是偶数，那么中心仅有一个，于是我们遍历该点的子树，分别求出子树内深度为 $d/2$（$d$ 为直径）每个颜色的出现次数，随后累计并去除子树内自己的匹配。

如果直径是奇数，那么中心有两个，分别遍历它们的子树，类似的求出深度为 $d/2$ 的每个颜色出现次数，对应匹配求出对数。

为了保证复杂度正确，遍历时要维护不同的颜色个数，清空时只清空这一部分，而不是直接 `assign`。

```cpp
void solve() {
    int n, r = 1, r2, d;
    fr(n);
    vector<vector<int>> gr(n + 1);
    for (int u, v, i = 1; i < n; ++i)
        fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
    vector<int> c(n + 1), dis(n + 1, -1), f(n + 1), path;
    frn(c, n);
    auto dfs = [&](this auto&& self, int u, int fa) -> void {
        f[u] = fa, dis[u] = dis[fa] + 1;
        if (dis[u] > dis[r]) r = u;
        for (int v : gr[u])
            if (v != fa) self(v, u);
    };
    dfs(r, 0), dfs(r2 = r, 0), d = dis[r];
    ll ans = 0;
    for (int p = r; p; p = f[p]) path.emplace_back(p);
    ranges::reverse(path);
    int rad = d >> 1;
    vector<int> cnt(n + 1), vis;
    auto dfs2 = [&](this auto&& self, int u, int fa, int dep) -> void {
        if (dep == rad) {
            if (!cnt[c[u]]) vis.emplace_back(c[u]);
            return ++cnt[c[u]], void();
        }
        for (int v : gr[u])
            if (v != fa) self(v, u, dep + 1);
    };
    if (d & 1) {
        int a = path[rad], b = path[rad + 1];
        dfs2(a, b, 0);
        auto cnt1 = cnt;
        for (auto v : vis) cnt[v] = 0;
        dfs2(b, a, 0);
        for (int i = 1; i <= n; ++i) ans += (ll)cnt[i] * cnt1[i];
    } else {
        int a = path[rad];
        vector<int> tmp(n + 1);
        for (int b : gr[a]) {
            vis.clear(), dfs2(b, a, 1);
            for (int i : vis) {
                ans -= (ll)cnt[i] * (cnt[i] - 1) / 2, tmp[i] += cnt[i];
                cnt[i] = 0;
            }
        }
        for (int i = 1; i <= n; ++i) ans += (ll)tmp[i] * (tmp[i] - 1) / 2;
    }
    fwn(ans);
}
```