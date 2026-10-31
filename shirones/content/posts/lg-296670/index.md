---
title: "洛谷 CXOI Round 7 (Div. 2) 做题记录"
published: 2026-10-25
updated: 2026-10-26
description: 贪心构造异或序列、树形 DP 在取模下维护大小关系、线段树维护括号序列的前缀和最值
tags: [模拟赛, 洛谷, "Div. 2"]
category: 题解
lang: zh_CN
draft: false
---

个人目前最喜欢的一场模拟赛。除了因为后面出去玩了没看 E 看起来可做有点可惜以外，rk 10 是我目前的最佳成绩。遇上了推式子题和简单 DS，直接爽了！

## [A 追忆岁月](https://www.luogu.com.cn/problem/P17796)

**题意：** 给定正整数 $n$ 构造两个长度为 $n$ 的正整数递增序列使任意小于 $2^n$ 的整数都可以由某一个序列中的某几个数按位异或得到。求和最小与和最大的序列。

简单贪心。不难发现必须保证存在一个数的某一位与其他均不同。所以和最小的就对应 $2^k$，而和最大就是二进制全填 $1$，某一位填 $0$（除了最高位），然后再带上全填 $1$ 的。注意题目要求如果有解先输出 `1`。

```cpp
void solve() {
    int n;
    fr(n), fwn(1);
    for (int i = 0; i < n; ++i) fw(1ll << i), fw(' ');
    ll msk = (1ll << n) - 1;
    fw('\n');
    for (int i = n - 2; i >= 0; --i) { fw(msk - ((1ll) << i)), fw(' '); }
    fw(msk), fw('\n');
}
```

## [B 晴涵梦（Easy Version）](https://www.luogu.com.cn/problem/P17797)

**题意：** 有 $n$ 个关卡构成树形依赖关系，先完成子节点才能完成父节点。每个节点成功概率为 $1/p_i$，挑战一次需花费 $c_i$。你可以在挑战成功后额外花 $a_i$ 来在这里添加一个存档点。当挑战失败时，清除该点状态并判断所有子节点。如果子节点有存档，则只清除该子节点状态，跳过其子树；如果子节点没有存档，那么直接清空这个子树。求完成根节点的最小期望花费。

树形 DP。但个人感觉这题主要难点在于处理递推式中的 `min` 和取模的关系。

考虑设 $f(u)$ 为完成 $u$ 节点且不设存档点的最小期望，则有：

$$
f(u)=c_up_u+\sum_{v\in son(u)}\min(p_uf(v),f(v)+a_v+(p_u-1)c_vp_v)
$$

第一项表示 $u$ 节点成功的期望花费，最小值内第一项代表如果不设存档点完成 $u$ 需要完成 $v$ 的期望消耗，后一项就是如果设存档点的期望消耗。我们尝试化简这个最小值，当不设置存档点时：

$$
p_uf(v)<f(v)+a_v+(p_u-1)c_vp_v
$$
$$
(p_u-1)(f(v)-c_vp_v)<a_v
$$

我们只需要维护没有取模的 $c_vp_v$ 就能判断最小值取哪一边了。特别的，如果没有取模的值已经超过 $a_v \le 10^9$，就直接当作大于就行。

```cpp
const int mod = 998244353;
const int L = 1e9 + 7;
using lll = __int128_t;
void solve() {
    int n;
    fr(n);
    vector<vector<int>> gr(n + 1);
    for (int i = 1, u, v; i < n; ++i)
        fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
    vector<ll> a(n + 1), p(n + 1), c(n + 1);
    for (int i = 1; i <= n; ++i) fr(a[i], c[i], p[i]);
    vector<lll> r(n + 1), f(n + 1), s(n + 1);
    auto dfs = [&](this auto&& self, int u, int fa) -> void {
        r[u] = (lll)c[u] * p[u], f[u] = (lll)c[u] * p[u] % mod;
        for (int v : gr[u]) {
            if (v == fa) continue;
            self(v, u);
            bool sv = 1;
            if (p[u] == 1) sv = 0;
            else if (s[v] < L) sv = ((lll)(p[u] - 1) * s[v] > a[v]);
            lll det = 0;
            if (sv) {
                f[u] = (f[u] + f[v] + a[v] + (lll)(p[u] - 1) % mod * r[v] % mod)
                    % mod;
                if (s[v] >= L || r[v] >= L) det = L;
                else det = r[v] * p[u] + s[v] + a[v];
            } else {
                f[u] = (f[u] + (lll)p[u] * f[v] % mod) % mod;
                if (r[v] >= L || s[v] >= L) det = L;
                else det = (r[v] + s[v]) * p[u];
            }
            if (det >= L) det = L;
            if (s[u] >= (lll)L - det) s[u] = L;
            else s[u] += det;
        }
    };
    dfs(1, 0), fwn(f[1]);
}
```

std 做法：维护取模时可以直接全部用 `int128` 并且不取模，最后输出时再取模。可以证明最优解的情况答案不会溢出。因此只需特判 $p_uf_v>inf$ 即可。及其简单！

```cpp
using lll = __int128_t;
const int mod = 998244353;
const lll inf = 3e36;
void solve() {
    int n;
    fr(n);
    vector<vector<int>> gr(n + 1);
    for (int i = 1, u, v; i < n; ++i)
        fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
    vector<ll> a(n + 1), c(n + 1), p(n + 1);
    for (int i = 1; i <= n; ++i) fr(a[i], c[i], p[i]);
    vector<lll> f(n + 1);
    auto dfs = [&](this auto&& self, int u, int fa) -> void {
        f[u] = (lll)c[u] * p[u];
        for (int v : gr[u]) {
            if (v == fa) continue;
            self(v, u);
            if (inf / p[u] < f[v])
                f[u] += f[v] + a[v] + (lll)p[v] * c[v] * (p[u] - 1);
            else
                f[u] += min((lll)p[u] * f[v],
                    f[v] + a[v] + (lll)p[v] * c[v] * (p[u] - 1));
        }
    };
    dfs(1, 0), fwn(f[1] % mod);
}
```

## [D 晴天](https://www.luogu.com.cn/problem/P17799)

**题意：** 给定一个长度为 $n$ 的括号序列，你有两种操作：操作一将区间内左右括号交换，操作二询问两个端点的最短路长度，当所有合法括号子段左右端点对应的图上的点连长度为 $1$ 的边。

线段树！先考虑这个最短路的实质，我们发现两个点联通当仅中间的部分是合法括号序列。确切的说，就是比如左边是 `)`，右边是 `(`，那么就要在左端点的更左边找到一个位置与当前左端点构成合法括号序列，右边同理。然后中间的那一端（两端不含）也是合法括号序列，从而最短路径为 $3$。再考虑线段树如何维护合法括号序列，我们给左括号赋值 `1`，右括号赋值 `-1`，那么合法括号序列等价于和为 $0$ 且最小前缀和不小于 $0$。然后括号交换相当于区间乘以 $-1$，这个显然可以用线段树维护。

然后考虑如何确定左右仍有配对点，右边是显然的，只要右边的最小前缀和小于 $0$ 就说明存在多于 `)` 可供匹配。左边能够匹配当仅左端点不构成一个新的前缀和最小值，也就是前面的和不小于前缀和最小值。

复习注：留意判断左端点时特判 $l=1$（此处代码在返回前判断了，如果直接合并查询 $l-1$ 要提前判断）。

```cpp
struct L {
    int v = 1;
    void operator+=(L o) { v *= o.v; }
};
struct V {
    int s = 0, l = 0, r = 0, mn = 0, mx = 0;
    V(int x = 0, int l = 0, int r = 0) : s(x), l(l), r(r), mn(x), mx(x) { }
    void operator+=(L o) {
        s *= o.v;
        if (o.v == -1) mn *= o.v, mx *= o.v, swap(mn, mx);
    }
};
V operator+(V l, V r) {
    V ans = V(l.s + r.s, l.l, r.r);
    ans.mn = min(l.mn, l.s + r.mn);
    ans.mx = max(l.mx, l.s + r.mx);
    return ans;
}
void init() { }
void solve() {
    int n, q;
    fr(n, q);
    string s;
    fr(s), s = ' ' + s;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; ++i) a[i] = (s[i] == '(' ? 1 : -1);
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
        if (laz[x].v != 1) {
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
    auto calc = [&](int l, int r) {
        if (l == r) return fwn(0);
        if (l > r) swap(l, r);
        int lv = query(1, l, l).s, rv = query(1, r, r).s;
        auto check = [&](int l, int r) {
            if (l > r) return true;
            auto ret = query(1, l, r);
            return !ret.s && ret.mn >= 0;
        };
        auto cl = [&]() {
            return query(1, 1, l).s
                >= (l == 1 ? 0 : min(0, query(1, 1, l - 1).mn));
        };
        auto cr = [&]() {
            if (r == n) return false;
            return query(1, r + 1, n).mn <= -1;
        };
        if (lv == 1 && rv == -1 && check(l, r)) return fwn(1);
        if (lv == 1 && rv == 1 && check(l, r - 1) && cr()) return fwn(2);
        if (lv == -1 && rv == -1 && check(l + 1, r) && cl()) return fwn(2);
        if (lv == -1 && rv == 1 && check(l + 1, r - 1) && cl() && cr())
            return fwn(3);
        fwn(-1);
    };
    for (int op, l, r; q--;) {
        fr(op, l, r);
        if (op == 1) modify(1, l, r, L { -1 });
        else calc(l, r);
    }
}
```