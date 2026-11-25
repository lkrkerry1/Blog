---
title: "ABC 484 做题记录"
published: 2026-11-14
updated: 2026-11-22
description: "贪心+模拟判别一次移动能否还原、计数去重、离散化+树状数组统计区间和在 [l,r] 内的子段数、线段树维护区间是否全同（-1 通配）"
tags: [AtCoder, 模拟赛, ABC]
category: 题解
lang: zh_CN
draft: false
---
出去吃饭的时候看的题，大概晚了半个钟开题，结果 F 是大水题，导致只有 1000 多名。

AB 签到，跳过。

## [C - Move One Card](https://atcoder.jp/contests/abc484/tasks/abc484_c)

**题意：** 给定两个长度为 $n$ 的数组 $a_i,b_i$，将 $a$ 中的某个数拿出来插入 $a$ 中的任意（包含边界）位置。判断一次操作能否使 $a$ 变为 $b$。

贪心+模拟即可。手模发现能变当仅前后对应相等，中间刚好偏差一位，于是枚举得到最左和最右的不同位置，然后直接判断中间是否偏差一位，两端是否相等即可。

```cpp
void solve() {
    int n, l = -1, r = -1;
    fr(n);
    vector<int> a(n), b(n);
    fr(a), fr(b);
    for (int i = 0; i < n; ++i) {
        if (a[i] != b[i]) {
            if (l == -1) l = i;
            else r = i;
        }
    }
    if (l == -1) return fwn("Yes");
    bool f = 1;
    for (int i = l; i < r; ++i)
        if (a[i] != b[i + 1]) f = 0;
    if (f && a[r] == b[l]) return fwn("Yes");
    f = 1;
    for (int i = l; i < r; ++i)
        if (b[i] != a[i + 1]) f = 0;
    if (f && a[l] == b[r]) return fwn("Yes");
    fwn("No");
}
```

## [D - Move One Card Left](https://atcoder.jp/contests/abc484/tasks/abc484_d)

**题意：** 给定长度为 $n$ 的数组 $a_i$，在 $a_i$ 中选出一个元素将其移到左边的任何一个位置（包含原来的位置），求能产生多少个不同序列。

发现产生不同序列当仅移动到与自己不同的位置前，并且自己与前一个位置不同。然后直接扫一遍就行。

```cpp
void solve() {
    int n;
    fr(n);
    vector<int> a(n + 1), cnt(n + 1), pre(n + 1);
    frn(a, n);
    for (int i = 1; i <= n; ++i) { pre[i] = cnt[a[i]]++; }
    ll ans = 1;
    for (int i = 2; i <= n; ++i)
        if (a[i] != a[i - 1]) ans += (i - 1 - pre[i]);
    fwn(ans);
}
```

## [E - Subsegment Sum Finder](https://atcoder.jp/contests/abc484/tasks/abc484_e)

**题意：** 给定长度为 $n$ 的整数序列，以及整数 $l,r$，求和在 $[l,r]$ 中的子段个数。

离散化+树状数组。比较经典的东西。先前缀和，然后移项得到 $s_j-r\le s_i\le s_j-l$，于是只需将前缀和离散化然后插进树状数组，每次查询时查找对应范围就行。

记住离散化的端点结论：当离散化使用 `lower_bound+1` 时，闭区间左端点为 `lower_bound`，右端点为 `upper_bound`。

```cpp
void solve() {
    ll n, l, r, ans = 0;
    fr(n, l, r);
    vector<ll> a(n + 1), s(n + 1), tr(n + 2), rk(n + 1);
    frn(a, n);
    for (int i = 1; i <= n; ++i) s[i] = s[i - 1] + a[i];
    auto t = s;
    ranges::sort(t), t.erase(unique(t.begin(), t.end()), t.end());
    for (int i = 0; i <= n; ++i)
        rk[i] = ranges::lower_bound(t, s[i]) - t.begin() + 1;
    auto mod = [&](int p, ll x) {
        for (; p <= n + 1; p += p & -p) tr[p] += x;
    };
    auto qry = [&](int p) {
        ll ans = 0;
        for (; p; p -= p & -p) ans += tr[p];
        return ans;
    };
    mod(rk[0], 1);
    for (int i = 1; i <= n; ++i) {
        int lf = ranges::upper_bound(t, s[i] - l) - t.begin(),
            rh = ranges::lower_bound(t, s[i] - r) - t.begin() + 1;
        ans += qry(lf) - qry(rh - 1), mod(rk[i], 1);
    }
    fwn(ans);
}
```

## [F - Make them monochrome](https://atcoder.jp/contests/abc484/tasks/abc484_f)

**题意：** 给定长度为 $n$ 的数组 $a$，对其进行 $q$ 次操作。操作一单点修改，操作二查询区间是否全部相同，$-1$ 可以当作任何数。

线段树板子。发现这个东西显然满足群性质，然后直接抄板子就行。节点上维护一个当前值和一个 flag 代表是否全部相同，合并时特判 $-1$，并且只有全是 $-1$ 时才将其作为区间值即可。

```cpp
struct V {
    int v = 0, l = 0, r = 0;
    bool f = 1;
    void operator+=(V o) { v = o.v; }
};
V operator+(V l, V r) {
    return { (l.v == -1 ? r.v : l.v), l.l, r.r,
        (l.v == r.v || l.v == -1 || r.v == -1) && l.f && r.f };
}
void solve() {
    int n, q;
    fr(n, q);
    vector<int> a(n + 1);
    frn(a, n);
    vector<V> val(n << 2 | 1);
    auto ls = [](int x) { return x << 1; };
    auto rs = [](int x) { return x << 1 | 1; };
    auto build = [&](this auto&& self, int x, int l, int r) -> void {
        if (l == r) return val[x] = V { a[l], l, r, 1 }, void();
        int m = (l + r) >> 1;
        self(ls(x), l, m), self(rs(x), m + 1, r);
        val[x] = val[ls(x)] + val[rs(x)];
    };
    auto query = [&](this auto&& self, int x, int l, int r) -> V {
        if (l <= val[x].l && val[x].r <= r) return val[x];
        int m = (val[x].l + val[x].r) >> 1;
        if (l > m) return self(rs(x), l, r);
        else if (r <= m) return self(ls(x), l, r);
        return self(ls(x), l, r) + self(rs(x), l, r);
    };
    auto modify = [&](this auto&& self, int x, int p, V v) -> void {
        if (val[x].l == val[x].r) return val[x] += v, void();
        int m = (val[x].l + val[x].r) >> 1;
        if (p <= m) self(ls(x), p, v);
        else self(rs(x), p, v);
        val[x] = val[ls(x)] + val[rs(x)];
    };
    build(1, 1, n);
    for (int op, p, x; q--;) {
        fr(op, p, x);
        if (op == 1) modify(1, p, V { x });
        else fwn(query(1, p, x).f ? "Yes" : "No");
    }
}
```