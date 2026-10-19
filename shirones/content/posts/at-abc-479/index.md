---
title: ABC479 做题记录
published: 2026-10-11
description: 五题题解：子集枚举、分段最短路、树上的边操作、走廊移动与分数最优化。
tags: [模拟赛, AtCoder, ABC]
category: 题解
lang: zh_CN
draft: false
---


这场是超常发挥的一场 ABC，差点就 AK 了。

## [C - Bento Packing](https://atcoder.jp/contests/abc479/tasks/abc479_c)


**题意：** 给定两个长为 $n$ 的数组 $a_i,b_i$ 以及一个正整数 $w$，求 $\sum b\le w$ 的前提下的对应的 $a_i$ 的和的最大值。（$n\le 20, a,b,w\le 10^9$）

签到题，直接二进制枚举选中的菜肴就行。

## [D - Back and Forth Distance](https://atcoder.jp/contests/abc479/tasks/abc479_d)


**题意：** 给定两个长为 $n$ 的正整数数组 $l_i,r_i$ 定义 $l_i$ 为从 $i$ 向左跳的代价，向右同理。对于 $q$ 组询问求出从某一点到另一点的最小代价。

签到题，维护前缀后缀最小值，比较直接跳过去和先向反方向跳再跳过去的代价就行。



## [E - Cut and Add](https://atcoder.jp/contests/abc479/tasks/abc479_e)


**题意：** 给一棵节点数为 $n$ 的树，每次切除某一条边并给两个连通块中较大的一块中的每一个节点加一再将边连回。求最后每个节点的值。

本质签到题，考虑先做一个 dfs，然后由于每一个子树内的 dfn 连续，该问题等效于在 dfn 数组上做区间修改单点查询。最终复杂度 $O(n)$。

```cpp
void solve() {
    int n, t = 0;
    fr(n);
    vector<vector<pair<int, int>>> gr(n + 1);
    for (int u, v, i = 1; i < n; ++i) {
        fr(u, v), gr[u].emplace_back(v, i), gr[v].emplace_back(u, i);
    }
    vector<int> dfn(n + 1), sz(n + 1);
    auto dfs1 = [&](this auto&& self, int u, int fa) -> void {
        dfn[u] = ++t, sz[u] = 1;
        for (auto [v, w] : gr[u])
            if (v != fa) self(v, u), sz[u] += sz[v];
    };
    dfs1(1, 0);
    vector<ll> ans(n + 2);
    auto dfs2 = [&](this auto&& self, int u, int fa) -> void {
        for (auto [v, w] : gr[u]) {
            if (v == fa) continue;
            if (sz[v] > n - sz[v]) {
                ans[dfn[v]] += w, ans[dfn[v] + sz[v]] -= w;
            } else {
                ans[1] += w, ans[dfn[v]] -= w, ans[dfn[v] + sz[v]] += w;
            }
            self(v, u);
        }
    };
    dfs2(1, 0);
    for (int i = 1; i <= n; ++i) ans[i] += ans[i - 1];
    for (int i = 1; i <= n; ++i) fw(ans[dfn[i]]), fw(' ');
    fw('\n');
}
```




## [F - Narrow Passage](https://atcoder.jp/contests/abc479/tasks/abc479_f)

**题意：** 有一个走廊上站着 $n$ 个人，每个人一次可以移动一步或是与相邻的人交换位置。求所有人到达他们的目标的最少移动次数。

好玩的贪心+构造。~~BA 走格子~~

注意到移动次数就是每个人到目标位置的空格数（也就是必须老老实实一步一步走的）+交换的次数（每次交换可以让两个人都走一步），而交换的次数就是两个人的逆序对数。直接离散化然后丢进树状数组统计就行。

```cpp
void solve() {
    int n;
    fr(n);
    vector<ll> s(n), t(n), ids(n), idt(n), rks(n), rkt(n), tr(n + 2);
    fr(s), fr(t), ranges::iota(ids, 0), ranges::iota(idt, 0);
    ranges::sort(ids, [&](ll a, ll b) { return s[a] < s[b]; });
    ranges::sort(idt, [&](ll a, ll b) { return t[a] < t[b]; });
    for (auto [i, x] : ids | views::enumerate) rks[x] = i;
    for (auto [i, x] : idt | views::enumerate) rkt[x] = i;
    ll ans = 0;
    for (int i = 0; i < n; ++i) ans += abs(s[i] - rks[i] - t[i] + rkt[i]);
    auto mod = [&](int p) {
        for (; p <= n; p += p & -p) ++tr[p];
    };
    auto qry = [&](int p) {
        ll ans = 0;
        for (; p; p -= p & -p) ans += tr[p];
        return ans;
    };
    for (int i = 0; i < n; ++i) {
        ans += i - qry(rkt[ids[i]] + 1), mod(rkt[ids[i]] + 1);
    }
    fwn(ans);
}
```


## [G - Tuning](https://atcoder.jp/contests/abc479/tasks/abc479_g)


**题意：** 给定两个整数数列 $a_i,b_i$，求满足对任意 $i,j$：$(a_i+c_i)(b_j+d_j)=(a_j+c_j)(b_i+d_i)$ 时的实数数列 $\displaystyle \sum_{i=1}^{N} \left ( |c_i|+|d_i| \right )$ 的最小值。

大数学题！第一次几乎场切的 ABC G 题。

化简该式，先将等式变量分离，

$$
\frac{a_i+c_i}{b_i+d_i}=Const=k
$$

即可将 $c_i$ 表示出来带回，即求

$$
\min \sum |d_i| + |k(b_i+d_i)-a_i|
$$

再由绝对值不等式并带入取等条件得到原式为

$$
\min\sum|d_i|
$$

（相当于证明了直接给 $c$ 或者 $d$ 取 $0$ 的确是最值）。带入后发现相当于求

$$
\min_k\sum|\frac{a_i}k-b_i|
$$



令 $x=1/k$ 换元即求 $\sum|a_i||x-\frac{b_i}{a_i}|$。这是一个经典问题（真吗）$x$ 取最小的满足 $\sum_{i=1}^j a_i\ge\frac {\sum_i^n a_i}2$ 的 $\sum_{i=1}^{j}\frac{b_i}{a_i}$ 时取到最小，模拟计算即可。 注意该题要保留分数。复杂度 $O(n\log n)$

```cpp
void solve() {
    int n;
    fr(n);
    vector<ll> a(n), b(n);
    fr(a), fr(b);
    auto calc = [&](const auto& a, const auto& b) {
        vector<array<ll, 3>> v;
        ll w = 0;
        for (int i = 0; i < n; ++i) {
            if (!b[i]) continue;
            ll p = a[i], q = b[i], g = gcd(abs(p), abs(q));
            if (q < 0) p = -p, q = -q;
            v.emplace_back(array { p / g, q / g, abs(b[i]) }), w += abs(b[i]);
        }
        if (!w) {
            ll ans = 0;
            for (ll x : a) ans += abs(x);
            return pair { ans, 1ll };
        }
        ranges::sort(v, [](const auto& a, const auto& b) {
            return (lll)a[0] * b[1] < (lll)a[1] * b[0];
        });
        ll cur = 0, p = 0, q = 0, ans = 0;
        for (auto [x, y, z] : v) {
            cur += abs(z);
            if ((cur << 1) >= w) {
                p = x, q = y;
                break;
            }
        }
        if (p > q) p = 1, q = 1;
        if (p < -q) p = -1, q = 1;
        for (int i = 0; i < n; ++i) ans += abs(b[i] * p - a[i] * q);
        ll g = gcd(ans, q);
        return pair { ans / g, q / g };
    };
    auto [p1, q1] = calc(a, b);
    auto [p2, q2] = calc(b, a);
    if ((lll)p1 * q2 < (lll)p2 * q1) fwn(p1, q1);
    else fwn(p2, q2);
}
```
