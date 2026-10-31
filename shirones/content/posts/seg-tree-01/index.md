---
title: 线段树（一）普通线段树
published: 2026-10-19
description: "自用的函数内线段树板子，下标 1 开始，需 C++23"
tags: [模板, 线段树]
category: 笔记
series: seg-tree
seriesOrder: 1
lang: zh_CN
draft: false
---

线段树是提高组最常见的数据结构，其相当好写而且相当强大，依靠类似分治的思路可以在 $O(\log n)$ 时间维护任意群性质。

## 使用说明

该模板为 **普通线段树**，下标从 $1$ 开始，没有动态开点和更大空间，使用前默认已经输入了数组长度 $n$ 以及初始化数组 $a_i$，并且定义了类 `V` 和 `L` 以及 `V.operator+=(L)`，`V operator+(V,V)` 和 `L.operator+=(L)` 这几个用于维护性质的关键函数。`modify` 区间修改传入懒标记也就是一个 `L` 类，`query` 返回一个数值类，也就是 `V`。

## 模板代码

```cpp
vector<V> val(n << 2 | 1);
vector<L> laz(n << 2 | 1);
auto ls = [](int x) { return x << 1; };
auto rs = [](int x) { return x << 1 | 1; };
auto build = [&](this auto&& self, int x, int l, int r) -> void {
    if (l == r) return val[x] = V(a[l], l, r), void();
    int m = (l + r) >> 1;
    self(ls(x), l, m), self(rs(x), m + 1, r);
    val[x] = val[ls(x)] + val[rs(x)];
};
auto pushdown = [&](int x) {
    if (laz[x].v) {
        laz[ls(x)] += laz[x], laz[rs(x)] += laz[x];
        val[ls(x)] += laz[x], val[rs(x)] += laz[x], laz[x] = L();
    }
};
auto query = [&](this auto&& self, int x, int l, int r) -> V {
    if (l <= val[x].l && val[x].r <= r) return val[x];
    int m = (val[x].l + val[x].r) >> 1;
    pushdown(x);
    if (l > m) return self(rs(x), l, r);
    else if (r <= m) return self(ls(x), l, r);
    return self(ls(x), l, r) + self(rs(x), l, r);
};
auto modify = [&](this auto&& self, int x, int l, int r, L v) -> void {
    if (l <= val[x].l && val[x].r <= r) return val[x] += v, laz[x] += v;
    int m = (val[x].l + val[x].r) >> 1;
    pushdown(x);
    if (l <= m) self(ls(x), l, r, v);
    if (r > m) self(rs(x), l, r, v);
    val[x] = val[ls(x)] + val[rs(x)];
};
```


## 使用示例


以 [AtCoder AALC01 B](https://atcoder.jp/contests/aalc001/tasks/aalc001_b) 为例展示使用。

**题意：** 给定长度为 $n$ 的数列，维护区间增加和区间最小值。

```cpp
struct L {
    ll v = 0;
    void operator+=(const L& o) { v += o.v; }
};
struct V {
    ll v = 0, l = 0, r = 0;
    void operator+=(const L& o) { v += o.v; }
};
V operator+(const V& l, const V& r) { return V { min(l.v, r.v), l.l, r.r }; }
void solve() {
    int n, q;
    fr(n, q);
    vector<int> a(n + 1);
    frn(a, n);
    vector<V> val(n << 2 | 1);
    vector<L> laz(n << 2 | 1);
    auto ls = [](int x) { return x << 1; };
    auto rs = [](int x) { return x << 1 | 1; };
    auto build = [&](this auto&& self, int x, int l, int r) -> void {
        if (l == r) return val[x] = V(a[l], l, r), void();
        int m = (l + r) >> 1;
        self(ls(x), l, m), self(rs(x), m + 1, r);
        val[x] = val[ls(x)] + val[rs(x)];
    };
    auto pushdown = [&](int x) {
        if (laz[x].v) {
            laz[ls(x)] += laz[x], laz[rs(x)] += laz[x];
            val[ls(x)] += laz[x], val[rs(x)] += laz[x], laz[x] = L();
        }
    };
    auto query = [&](this auto&& self, int x, int l, int r) -> V {
        if (l <= val[x].l && val[x].r <= r) return val[x];
        int m = (val[x].l + val[x].r) >> 1;
        pushdown(x);
        if (l > m) return self(rs(x), l, r);
        else if (r <= m) return self(ls(x), l, r);
        return self(ls(x), l, r) + self(rs(x), l, r);
    };
    auto modify = [&](this auto&& self, int x, int l, int r, L v) -> void {
        if (l <= val[x].l && val[x].r <= r) return val[x] += v, laz[x] += v;
        int m = (val[x].l + val[x].r) >> 1;
        pushdown(x);
        if (l <= m) self(ls(x), l, r, v);
        if (r > m) self(rs(x), l, r, v);
        val[x] = val[ls(x)] + val[rs(x)];
    };
    build(1, 1, n);
    for (int op, l, r, x; q--;) {
        fr(op, l, r);
        if (op == 1) fr(x), modify(1, l, r, L { x });
        else fwn(query(1, l, r).v);
    }
}
```

## 弱化版本

特殊情况下可能会用到只做单点修改的题，这时候不需要思考懒标记。该版本线段树只需要提前定义 $n$，$a_i$ 以及 `V` 和其配套的 `V.operator+=(V)`，`V operator+(V,V)`。

```cpp
vector<V> val(n << 2 | 1);
auto ls = [](int x) { return x << 1; };
auto rs = [](int x) { return x << 1 | 1; };
auto build = [&](this auto&& self, int x, int l, int r) -> void {
    if (l == r) return val[x] = V(a[l], l, r), void();
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
```
