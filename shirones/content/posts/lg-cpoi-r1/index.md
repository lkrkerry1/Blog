---
title: "洛谷 CPOI R1 做题记录"
published: 2026-11-22
description: 前缀和+双指针+贪心、二进制技巧、贪心构造
tags: [洛谷, 模拟赛, "Div. 2"]
category: 题解
lang: zh_CN
draft: false
---
前两个钟写了前两题然后就跑路了。T3 疑似可做？

## [A 传送石碑](https://www.luogu.com.cn/problem/P17910)

**题意：** 有 $n$ 个位置，相邻两个位置距离 $t_i$，有 $m$ 个传送点，位于 $a_i$ 位置，每个传送点可以消耗 $b_i+b_j$ 时间传送到 $a_j$，从某个位置走到另一个位置消耗时间等于距离。有 $q$ 组询问，每组询问求一个位置到另一个位置的最小用时。

贪心+前缀和。

令 $s$ 为 $t$ 的前缀和，然后 $x\rightarrow y$ 直接走过去用时为 $|s_{y-1}-s_{x-1}|$。然后考虑将传送的耗时分到两个点上，于是代价就是 $|s_{x-1}-s_{a_i-1}|+b_i+|s_{y-1}-s_{a_j-1}|+b_j$。直接分别考虑。

当 $a_i\le x$ 时，该部分等于 $s_{x-1}+\min(b_i-s_{a_i-1})$，$a_i\ge x$ 时，该部分等于 $\min(s_{a_i-1}+b_i)-s_{x-1}$。然后直接双指针，枚举过程中不断更新这个前缀最小值即可。

```cpp
void solve() {
    int n, m, q;
    fr(n, m, q);
    vector<ll> t(n), s(n), l(n + 1);
    vector<pair<int, ll>> ab(m);
    frn(t, n - 1), fr(ab);
    for (int i = 1; i < n; ++i) s[i] = s[i - 1] + t[i];
    ranges::sort(ab);
    for (ll i = 1, p = 1e18, j = 0; i <= n; ++i) {
        for (; j < m && ab[j].first <= i; ++j)
            p = min(ab[j].second - s[ab[j].first - 1], p);
        l[i] = s[i - 1] + p;
    }
    for (ll i = n, p = 1e18, j = m - 1; i >= 1; --i) {
        for (; j >= 0 && ab[j].first >= i; --j)
            p = min(ab[j].second + s[ab[j].first - 1], p);
        l[i] = min(l[i], p - s[i - 1]);
    }
    for (int x, y; q--;) {
        fr(x, y), fwn(min(abs(s[x - 1] - s[y - 1]), l[x] + l[y]));
    }
}
```

## [B 农夫暇事](https://www.luogu.com.cn/problem/P17911)

**题意：** 维护长度为 $n$ 的整数数组支持单点修改，全局异或，查询全局 $a_i<a_{i+1}$ 个数。

尝试后发现仅有异或值在 $a_i\oplus a_{i+1}$ 的最高位为 $1$ 时才会改变大小关系。于是直接开个桶维护当前的每一个二进制位有多少个满足。全局异或就直接用这个更新，并且维护当前的全部异或值，只在数组中保留原始值。所以单点修改时要先异或一下再放入。

```cpp
void solve() {
    int n, m, q, ans = 0, xs = 0;
    fr(n, m, q);
    vector<int> a(n + 1), cnt(32), cnt2(32);
    frn(a, n);
    auto upd = [&](int i, int d) {
        if (i <= 0 || i >= n || a[i] == a[i + 1]) return;
        if ((a[i] ^ xs) > (a[i + 1] ^ xs)) cnt2[__lg(a[i] ^ a[i + 1])] += d;
        else ans += d, cnt[__lg(a[i] ^ a[i + 1])] += d;
    };
    for (int i = 1; i < n; ++i) upd(i, 1);
    for (int op, x, y; q--;) {
        fr(op);
        if (op == 1) {
            fr(x, y), upd(x - 1, -1), upd(x, -1);
            a[x] = y ^ xs, upd(x - 1, 1), upd(x, 1);
        } else if (op == 2) {
            fr(x), xs ^= x;
            for (int i = 0; i < 32; ++i)
                if ((x >> i) & 1)
                    ans -= cnt[i] - cnt2[i], swap(cnt[i], cnt2[i]);
        } else fwn(ans);
    }
}
```

## [C 工业时代](https://www.luogu.com.cn/problem/P17912)

**题意：** 给一棵有 $n$ 个节点的树和一个正整数 $x$，在树的节点上填 $012$，要求 $1$ 的个数至少为 $x$，且每个子树中 $1$ 的个数不超过 $2$ 的个数。求最少的 $2$ 的个数以及任意一种构造。

确实不难？不会证明。

不难发现有解时最小个数就是 $x$，于是尝试在树上取点匹配。

直接贪心取深度最大的点和离他最近的未匹配的祖先，祖先处放 $1$，这样祖先及以上保证两个个数相等，祖先下显然能保证 $1$ 个数小于 $2$ 个数。如果找不够这样的配对就无解。结论是很符合直觉的。

考虑维护时用一个并查集存当前已经确定答案的连通块，然后找未匹配祖先就查父亲的并查集所在的父亲即可。合并时要顺带处理自己儿子已经确定答案的一起加入连通块。

并查集记得初始化！

```cpp
void solve() {
    int n, x;
    fr(n, x);
    vector<vector<int>> gr(n + 1);
    for (int i = 1, u, v; i < n; ++i)
        fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
    vector<int> dep(n + 1), fa(n + 1), f(n + 1), ans(n + 1), rk(n);
    auto dfs = [&](this auto&& self, int u, int fa) -> void {
        f[u] = fa, dep[u] = dep[fa] + 1;
        for (int v : gr[u]) v != fa ? self(v, u) : void();
    };
    auto getf = [&](this auto&& self, int x) -> int {
        return x == fa[x] ? x : fa[x] = self(fa[x]);
    };
    auto merge = [&](int u) {
        if (ans[f[u]]) fa[u] = f[u];
        for (int v : gr[u]) ans[v] && v != f[u] ? fa[v] = u : 0;
    };
    dfs(1, 0), ranges::iota(rk, 1), ranges::iota(fa, 0);
    ranges::sort(rk, [&](int a, int b) { return dep[a] > dep[b]; });
    for (int v : rk) {
        if (ans[v] || !x) continue;
        int u = getf(f[v]);
        if (ans[u]) u = f[u];
        if (!u) continue;
        ans[v] = 2, ans[u] = 1, merge(u), merge(v), --x;
    }
    if (x) return fwn("No");
    fwn("Yes");
    for (int i = 1; i <= n; ++i) fw(ans[i]), fw(' ');
}
```
