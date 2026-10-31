---
title: "平衡树（一）普通平衡树 FHQ Treap"
published: 2026-10-30
description: "使用 FHQ Treap 完成普通平衡树"
tags: [模板]
category: 笔记
series: balanced-tree
seriesOrder: 1
lang: zh_CN
draft: false
---
平衡树是省选范围相当强大的数据结构，在支持线段树所有操作的前提下还支持了将序列的段落进行操作，比如翻转、查找前后驱等。这里实现的是 `FHQ Treap`，也就是无旋 Treap。

这里使用的时候记得调整数组大小，或者改成常数较大的动态开点。

## 模板代码

```cpp
mt19937 rd(time(0));
vector<int> pri(n + q + 1), sz(n + q + 1), val(n + q + 1), ls(n + q + 1),
    rs(n + q + 1);
auto addn = [&](int v) {
    return val[++tot] = v, sz[tot] = 1, pri[tot] = rd(), tot;
};
auto pushup = [&](int p) { sz[p] = sz[ls[p]] + sz[rs[p]] + 1; };
auto split = [&](this auto&& self, int p, int& x, int& y, int v) -> void {
    if (!p) return x = y = 0, void();
    if (val[p] <= v) x = p, self(rs[p], rs[p], y, v);
    else y = p, self(ls[p], x, ls[p], v);
    pushup(p);
};
auto merge = [&](this auto&& self, int x, int y) -> int {
    if (!x || !y) return x | y;
    if (pri[x] <= pri[y]) return rs[x] = self(rs[x], y), pushup(x), x;
    else return ls[y] = self(x, ls[y]), pushup(y), y;
};
auto insert = [&](int v) {
    int x, y;
    split(rt, x, y, v - 1), rt = merge(merge(x, addn(v)), y);
};
auto erase = [&](int v) {
    int x, y, z;
    split(rt, x, y, v), split(x, x, z, v - 1);
    if (z) z = merge(ls[z], rs[z]);
    rt = merge(merge(x, z), y);
};
auto get_rk = [&](int v) {
    int r = 1, p = rt;
    while (p) val[p] < v ? (r += sz[ls[p]] + 1, p = rs[p]) : p = ls[p];
    return r;
};
auto get_kth = [&](int k) {
    int l = sz[ls[rt]], p = rt;
    for (; l + 1 != k && p; l = sz[ls[p]])
        k <= l ? p = ls[p] : (k -= l + 1, p = rs[p]);
    return p ? val[p] : -1;
};
auto get_pre = [&](int v) {
    int p = rt, r = 0;
    while (p) val[p] < v ? (r = val[p], p = rs[p]) : p = ls[p];
    return r;
};
auto get_nxt = [&](int v) {
    int p = rt, r = 0;
    while (p) val[p] > v ? (r = val[p], p = ls[p]) : p = rs[p];
    return r;
};
```

## 部分原理说明

FHQ Treap 类似其他平衡树，都是给点赋值一个随机的 `priority`，根据这个值来维护小根/大根堆。但它与 Splay 等的区别就是不需要旋转，它通过 `split` 和 `merge` 进行修改和查找。

这里的 `split` 是 **按值分裂**，对当前位置判断是否小于等于目标值，是就切开分给左边同时递归右子树。反之亦然。

而 `merge` 固定优先度的大小关系，将根确定，随后取根的子树与另一半合并即可。

这里的 `get_kth` `get_pre` `get_nxt` 使用了非分裂合并而是平衡树上二分的形式书写，以最复杂的 `get_kth` 为例，$l$ 为左子树大小，若左子树大小加一恰好为目标尺寸，那么就是当前值。否则若剩余大小较小就递归左子树，否则递归右子树（注意更新目标尺寸）。

不难发现这样建出的树高度期望为 $O(\log n)$，于是单次操作复杂度就是 $O(\log n)$。

## 使用示例

以 [洛谷 P6136 【模板】普通平衡树（数据加强版）](https://www.luogu.com.cn/problem/P6136) 为例，该题要维护六大操作（单点插入、删除、查找排名、查找值、查前驱、后驱）并且强制在线。直接套用

```cpp
void solve() {
    int n, q, tot = 0, rt = 0;
    fr(n, q);
    mt19937 rd(time(0));
    vector<int> pri(n + q + 1), sz(n + q + 1), val(n + q + 1), ls(n + q + 1),
        rs(n + q + 1);
    auto addn = [&](int v) {
        return val[++tot] = v, sz[tot] = 1, pri[tot] = rd(), tot;
    };
    auto pushup = [&](int p) { sz[p] = sz[ls[p]] + sz[rs[p]] + 1; };
    auto split = [&](this auto&& self, int p, int& x, int& y, int v) -> void {
        if (!p) return x = y = 0, void();
        if (val[p] <= v) x = p, self(rs[p], rs[p], y, v);
        else y = p, self(ls[p], x, ls[p], v);
        pushup(p);
    };
    auto merge = [&](this auto&& self, int x, int y) -> int {
        if (!x || !y) return x | y;
        if (pri[x] <= pri[y]) return rs[x] = self(rs[x], y), pushup(x), x;
        else return ls[y] = self(x, ls[y]), pushup(y), y;
    };
    auto insert = [&](int v) {
        int x, y;
        split(rt, x, y, v - 1), rt = merge(merge(x, addn(v)), y);
    };
    auto erase = [&](int v) {
        int x, y, z;
        split(rt, x, y, v), split(x, x, z, v - 1);
        if (z) z = merge(ls[z], rs[z]);
        rt = merge(merge(x, z), y);
    };
    auto get_rk = [&](int v) {
        int r = 1, p = rt;
        while (p) val[p] < v ? (r += sz[ls[p]] + 1, p = rs[p]) : p = ls[p];
        return r;
    };
    auto get_kth = [&](int k) {
        int l = sz[ls[rt]], p = rt;
        for (; l + 1 != k && p; l = sz[ls[p]])
            k <= l ? p = ls[p] : (k -= l + 1, p = rs[p]);
        return p ? val[p] : -1;
    };
    auto get_pre = [&](int v) {
        int p = rt, r = 0;
        while (p) val[p] < v ? (r = val[p], p = rs[p]) : p = ls[p];
        return r;
    };
    auto get_nxt = [&](int v) {
        int p = rt, r = 0;
        while (p) val[p] > v ? (r = val[p], p = ls[p]) : p = rs[p];
        return r;
    };
    for (int x; n--;) fr(x), insert(x);
    int ret = 0;
    for (int op, x, lans = 0; q--;) {
        fr(op, x), x ^= lans;
        if (op == 1) insert(x);
        if (op == 2) erase(x);
        if (op == 3) ret ^= (lans = get_rk(x));
        if (op == 4) ret ^= (lans = get_kth(x));
        if (op == 5) ret ^= (lans = get_pre(x));
        if (op == 6) ret ^= (lans = get_nxt(x));
    }
    fwn(ret);
}
```