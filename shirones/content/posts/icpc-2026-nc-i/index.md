---
title: "ICPC 2026 邀请赛南昌站重现赛 做题记录"
published: 2026-11-19
description: "min-max 矩阵卷积快速幂、状压换根 DP、欧拉路径合并、括号序列线段树"
tags: [xCPC, 模拟赛]
category: 题解
lang: zh_CN
draft: false
---
写了四题，感觉 CJ 可能有说法但写不动了。A 是签到跳过。

## [B UNO](https://www.luogu.com.cn/problem/P17889)

**题意：** 给 $4n$ 张卡片，四种颜色各 $n$ 张，每次可以交换相邻的同色卡牌或同值卡牌，要求颜色（RYGB）和数值都从小到大排序，问是否可行。

贪心！

手模可以发现，如此交换不会改变两张颜色数字都不同的卡牌，于是如果存在无法交换卡牌且顺序相反，就无解。

再证如果没有这种情况一定有解。如果有两张卡牌顺序相反，且颜色或数字相同，于是两张卡牌中间一定有一张与这两张中的某一张顺序相反，以此类推，于是一定能找到与这两张相邻且顺序相反的卡牌，交换即可。否则在前面判定时就应该无解。

```cpp
void solve() {
    int n;
    fr(n);
    vector<pair<int, int>> a(n << 2);
    unordered_map<char, int> mp;
    string s = "RYGB";
    for (auto [i, c] : s | views::enumerate) mp[c] = i;
    for (int i = 0, x, c; i < (n << 2); ++i) {
        fr(x, (char&)c), a[i] = { mp[c], x };
    }
    for (int i = 0; i < (n << 2); ++i) {
        for (int j = i + 1; j < (n << 2); ++j) {
            if (a[i] > a[j] && a[i].first != a[j].first
                && a[i].second != a[j].second)
                return fwn("NO");
        }
    }
    fwn("YES");
}
```

## [C Tourist](https://www.luogu.com.cn/problem/P17890)

**题意：** 给定 $n$ 个点 $m$ 条边构成的有向无权图，接下来每次操作增加一条边。再给出一个 $w$ 和 $q$ 组询问，每组询问给出 $u,v$，寻找最早在第几次操作后可以从 $u$ 走到 $v$ 且恰好移动 $w$。

高代题（）注意到 $n\le 200$，直接邻接表+Floyd，但这样会超时，于是考虑优化。写出式子：$f(i,j)=\min(\max(f(i,k),f(k,j)))$，发现这个就是矩阵卷积：$\min\circ\max$，然后发现这个东西有结合律，可以快速幂，于是可以完成。

注意，矩阵的零元应该是全部正无穷大（任意乘后均为零元），单位元应该是对角线负无穷大其余正无穷大（任意乘后不变）。

```cpp
struct Mat {
    int n;
    vector<vector<int>> a;
    Mat(int n) : n(n), a(n, vector<int>(n, 1e9)) { }
    Mat(int n, const auto& a) : n(n), a(a) { }
    void operator*=(const Mat& o) {
        auto ans = Mat(o.n);
        for (int i = 0; i < n; ++i) {
            for (int k = 0; k < n; ++k) {
                for (int j = 0; j < n; ++j) {
                    ans.a[i][j] = min(ans.a[i][j], max(a[i][k], o.a[k][j]));
                }
            }
        }
        return a = ans.a, void();
    }
};
inline Mat bfp(Mat a, ll b) {
    Mat ans(a.n);
    for (int i = 0; i < a.n; ++i) ans.a[i][i] = -1;
    for (; b; b >>= 1, a *= a)
        if (b & 1) ans *= a;
    return ans;
}
void solve() {
    int n, m, k, q, w;
    fr(n, m);
    Mat a(n + 1);
    for (int u, v; m--;) fr(u, v), a.a[u][v] = 0;
    fr(k);
    for (int i = 1, u, v; i <= k; ++i) fr(u, v), a.a[u][v] = min(i, a.a[u][v]);
    fr(q, w);
    auto ans = bfp(a, w);
    for (int u, v; q--;) fr(u, v), fwn(ans.a[u][v] >= 1e9 ? -1 : ans.a[u][v]);
}
```

## [D Eating Cherries](https://www.luogu.com.cn/problem/P17891)

**题意：** 给定一个 $n$ 个节点的无根树，每个节点上有若干樱桃。分别在以 $i=1,2,\dots,n$ 为根的情况下求出最少要调整多少个叶子（度为 $1$ 且不是根）的樱桃种类才能使每条从根到叶子的简单路径上出现过的樱桃种类相等。

注意到樱桃种类数不超过 $6$，于是状压成一个整数，于是转变为无根树上每个点有一个小于 $64$ 的权值，要求调整叶子最少次数使简单路径或全相等。

考虑以 $1$ 为根的情况，这是树形 DP，令 $f(u,k)$ 为以 $1$ 为根时，$u$ 到其子树的所有叶子的路径或和为 $k$ 的个数，于是有递推：$f(u,k|w_u)=\sum f(v,k)$。

再考虑换根，不妨设 $g(u,k)$ 为以 $u$ 为根时的简单叶子路径或和为 $k$ 的个数，于是 $g(1)=f(1)$。转移时用 $u$ 为根的结果，先减去 $v$ 子树的贡献（此处实际上多或了个 $w_u$ 所以不能合并，只能先减去再加回来），再算 $v$ 子树外的贡献，最后再把 $v$ 子树的贡献重新加回来。
$$
\begin{gathered}
g(v,w_u|k)\leftarrow g(u,w_u|k)-f(v,k) \\
g(v,k|w_v)\leftarrow \sum g(u,k) \\
g(v,k)\leftarrow g(v,k)+f(v,k)
\end{gathered}
$$
然后就行了。答案就是叶子数减去可以保留的最大叶子数，即 $\max[k=k|w_u|val]g(u,k)$，其中 $val$ 代表不是叶子的或和（这一部分必然出现在路径的或和中）。

代码的处理只保留了 $g$ 的当前根情况而不是保留所有情况，所以每次操作完要还原。

```cpp
using A = array<int, 64>;
void solve() {
    int n, m, lc = 0, val = 0;
    fr(n, m);
    vector<vector<int>> gr(n + 1);
    vector<int> w(n + 1), ans(n + 1);
    for (int i = 1, u, v; i < n; ++i)
        fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
    for (int i = 1, c; i <= n; ++i) {
        fr(c);
        for (int x; c--;) fr(x), w[i] |= (1 << (x - 1));
    }
    for (int i = 1; i <= n; ++i) gr[i].size() == 1 ? ++lc : val |= w[i];
    vector<A> f(n + 1, A { });
    A g { };
    auto dfs1 = [&](this auto&& self, int u, int fa) -> void {
        if (gr[u].size() == 1) f[u][w[u]] = 1;
        for (int v : gr[u])
            if (v != fa) {
                self(v, u);
                for (int k = 0; k < 64; ++k) f[u][k | w[u]] += f[v][k];
            }
    };
    auto dfs2 = [&](this auto&& self, int u, int fa) -> void {
        if (gr[u].size() == 1) --g[w[u]];
        for (int k = 0; k < 64; ++k)
            if (k == (k | w[u] | val)) ans[u] = max(ans[u], g[k]);
        if (gr[u].size() == 1) ++g[w[u]];
        for (int v : gr[u]) {
            if (v == fa) continue;
            A t = g, t2 { };
            for (int k = 0; k < 64; ++k) g[w[u] | k] -= f[v][k];
            for (int k = 0; k < 64; ++k) t2[k | w[v]] += g[k];
            for (int k = 0; k < 64; ++k) g[k] = t2[k] + f[v][k];
            self(v, u), g = t;
        }
    };
    dfs1(1, 0), g = f[1], dfs2(1, 0);
    for (int i = 1; i <= n; ++i) fw(lc - (gr[i].size() == 1) - ans[i]), fw(' ');
}
```

## [F One Touch Drawing](https://www.luogu.com.cn/problem/P17893)

**题意：** 在无向图上进行一笔画，有 $k$ 对传送点，每次从别的点到该点时跳到另一个位置。求一笔画方法。

梦回童年小游戏（）很明显是欧拉路径，考虑将这些传送点合在一起，于是当某对传送点度数之差超过 $2$ 时显然无解，刚好为 $2$ 时必然从较大出发回到该点，刚好为 $1$ 时与奇点类似，然后直接欧拉回路即可。

注意该图有自环，最优方案是用边序号 vis 数组来去重。而且在开始和终点不会跳跃，于是要特判开头结尾。

```cpp
void solve() {
    int n, m, k, s = 1, l = 0, r;
    fr(n, m, k);
    vector<vector<pair<int, int>>> gr(n + 1);
    vector<int> cur(n + 1), d(n + 1), p1, p2, o(n + 1), ans, p;
    vector<bool> vis(m);
    for (int u, v, i = 0; i < m; ++i) {
        fr(u, v), ++d[u], ++d[v], s = u;
        gr[u].emplace_back(v, i), gr[v].emplace_back(u, i);
    }
    bool flag = 1;
    for (int u, v; k--;) {
        fr(u, v), o[u] = v, o[v] = u;
        if ((d[u] + d[v]) & 1) p.emplace_back(u);
        if (d[u] < d[v]) swap(u, v);
        if (d[u] - d[v] > 2) flag = 0;
        else if (d[u] - d[v] == 2) p2.emplace_back(u);
        else if (d[u] - d[v] == 1) p1.emplace_back(u);
    }
    if (!flag) return fwn(-1);
    for (int i = 1; i <= n; ++i)
        if (!o[i] && (d[i] & 1)) p.emplace_back(i);
    if (p.size() && p.size() != 2) return fwn(-1);
    if (p.size() == 2 && p1.empty() && p2.empty()) s = p[0];
    else if (p.size() == 2 && p1.size() <= 2 && p2.empty()) s = p1[0];
    else if (p.empty() && p2.size() == 1) s = p2[0];
    else if (p.size() || p2.size()) return fwn(-1);
    auto dfs = [&](this auto&& self, int u) -> void {
        while (cur[u] < gr[u].size()) {
            auto [v, w] = gr[u][cur[u]++];
            if (!vis[w]) vis[w] = 1, self(o[v] ? o[v] : v);
        }
        ans.emplace_back(u);
        if (o[u]) ans.emplace_back(o[u]);
    };
    dfs(s), ranges::reverse(ans), r = ans.size();
    if (o[ans[0]]) ++l;
    if (o[ans[r - 1]]) --r;
    for (int i = 0; i < m; ++i)
        if (!vis[i]) return fwn(-1);
    fwn(r - l);
    for (int i = l; i < r; ++i) fw(ans[i]), fw(' ');
    fw('\n');
}
```

## [G The Meaning of the World](https://www.luogu.com.cn/problem/P17894)

**题意：** 维护括号序列，支持单点翻转和查询区间最长合法括号序列长度。

酥皮+神秘分块/毒瘤 ds。你是 lxl（？

线段树神题！

先考虑合法括号序列意味着什么，令左括号为 $1$，右括号为 $-1$，于是一段区间 $[l,r]$ 为合法区间当仅 $s_{l-1}=s_r=\min s$。于是这个有结合律，可以线段树。

考虑在线段树上维护前缀和（一直到整个序列开头，不是节点开头）最小值以及该值出现的最早位置和最晚位置（绝对位置）以及该区间内的答案。

考虑合并，前缀和最小值是简单的，直接取最小值。出现位置与较小的一侧的位置相同。如果相同就左边第一次出现是最早位置，右边最后一次是最晚位置。然后考虑如何合并答案。

相当于我们要找较小的一侧的最靠近分界点的与另一侧最小值相等的元素（必定存在，因为相邻位置前缀和变化量绝对值为 $1$），这个可以类似倍增的想法在线段树上跳（单侧递归/线段树上二分）。这样求出来的中间段长度就是最终答案。

注意查询时合法区间包含左端点，所以要给左端点减一，而且线段树要把 $0$ 号也建进去。

复杂度 $O(n\log^2n)$。

```cpp
const int N = 2e5 + 5;
int a[N];
inline constexpr int ls(int x) { return x << 1; }
inline constexpr int rs(int x) { return x << 1 | 1; }
struct L {
    int v = 0;
    void operator+=(L o) { v += o.v; }
} laz[N << 2];
struct V {
    int l, r, s = 0, e = 0, mn = 0, ans = 0;
    void operator+=(L o) { mn += o.v; }
} val[N << 2];
inline void pushdown(int x) {
    if (laz[x].v) {
        laz[ls(x)] += laz[x], laz[rs(x)] += laz[x];
        val[ls(x)] += laz[x], val[rs(x)] += laz[x], laz[x] = L { };
    }
}
inline int getfs(int x, int v) {
    if (val[x].l == val[x].r) return val[x].l;
    pushdown(x);
    return val[ls(x)].mn < v ? getfs(ls(x), v) : getfs(rs(x), v);
}
inline int getls(int x, int v) {
    if (val[x].l == val[x].r) return val[x].l;
    pushdown(x);
    return val[(rs(x))].mn < v ? getls(rs(x), v) : getls(ls(x), v);
}
V merge(V l, V r, int x) {
    V a { l.l, r.r };
    int u = l.s, v = r.e;
    if (l.mn < r.mn)
        a.mn = l.mn, a.s = l.s, a.e = l.e, u = getls(ls(x), r.mn) + 1;
    else if (l.mn > r.mn)
        a.mn = r.mn, a.s = r.s, a.e = r.e, v = getfs(rs(x), l.mn) - 1;
    else a.mn = l.mn, a.s = l.s, a.e = r.e;
    return a.ans = max({ l.ans, r.ans, v - u }), a;
}
inline void build(int x, int l, int r) {
    if (l == r) return val[x] = V { l, r, l, l, a[l] }, void();
    int m = (l + r) >> 1;
    build(ls(x), l, m), build(rs(x), m + 1, r);
    val[x] = merge(val[ls(x)], val[rs(x)], x);
}
inline void modify(int x, int l, int r, L o) {
    if (l <= val[x].l && val[x].r <= r) return val[x] += o, laz[x] += o;
    pushdown(x);
    int m = (val[x].l + val[x].r) >> 1;
    if (l <= m) modify(ls(x), l, r, o);
    if (r > m) modify(rs(x), l, r, o);
    val[x] = merge(val[ls(x)], val[rs(x)], x);
}
inline V query(int x, int l, int r) {
    if (l <= val[x].l && val[x].r <= r) return val[x];
    pushdown(x);
    int m = (val[x].l + val[x].r) >> 1;
    if (l > m) return query(rs(x), l, r);
    if (r <= m) return query(ls(x), l, r);
    return merge(query(ls(x), l, r), query(rs(x), l, r), x);
}
void solve() {
    int n, q;
    fr(n, q);
    string s;
    fr(s), s = ' ' + s;
    for (int i = 1; i <= n; ++i) a[i] = a[i - 1] + (s[i] == '(' ? 1 : -1);
    build(1, 0, n);
    for (int op, x, y; q--;) {
        fr(op, x);
        if (op == 1) {
            modify(1, x, n, L { s[x] == '(' ? -2 : 2 });
            s[x] = s[x] == '(' ? ')' : '(';
        } else fr(y), fwn(query(1, x - 1, y).ans);
    }
}
```

## [H BABA BOOEY](https://www.luogu.com.cn/problem/P17895)

**题意：** 给正整数 $n,k$，以及一个长度为 $n$ 的自然数组 $a_i$，两个人轮流操作，每次可以将某个数减去 $x$，$x\le k,x\le a_i$，并将 $k$ 变成 $x$。将所有数变成 $0$ 的人胜。求胜利方。

神奇的递归题。

先考虑 $k=1$，显然这时只能轮流取数，于是当数组总和为奇数时先手胜，反之亦然。

如果 $k>1$，如果总和为奇数仍然有先手胜，如果总和为偶数，双方都不愿意取奇数，否则直接变成前面的必胜情况，于是只能取偶数，于是这就相当于一个 $(k/2,a/2)$ 的子问题，将所有数除以二向下取整，于是这个问题与之前等价。这样最多递归 $\log V$ 次就能解出。

```cpp
void solve() {
    int n, k;
    fr(n, k);
    vector<ll> a(n);
    fr(a);
    ll s = accumulate(a.begin(), a.end(), 0ll);
    auto check = [&](this auto&& self) -> bool {
        if (s & 1) return 1;
        else if (k == 1) return 0;
        for (auto& x : a) x >>= 1;
        k >>= 1, s = accumulate(a.begin(), a.end(), 0ll);
        return self();
    };
    fwn(check() ? "Alice" : "Bob");
}
```

## [I Gotta Go Fast](https://www.luogu.com.cn/problem/P17896)

**题意：** 初始从 $0$ 出发且有四格。若当前在 $x$，每次可以减少一格并直接跳到 $x+d$ 处，或者走到 $x+1$ 并消耗 $t_i$ 的时间。求位置大于等于 $l$ 时的最小用时。

一眼 DP，直接设 $f(i,j)$ 为到 $i$ 且剩 $j$ 格的最小用时，于是：
$$
f(i,j)=\min(f(i-1,j)+t_i,f(i-d,j+1))
$$
然后注意一下枚举范围就行。（代码中 $t_i$ 是根据额外给的 $s_i$ 对应得出的）。

```cpp
void solve() {
    int l, d, t[3];
    fr(l, d, t[0], t[1], t[2]);
    string s;
    fr(s), s = ' ' + s;
    vector<array<ll, 5>> f(l + d);
    for (auto& x : f) ranges::fill(x, 1e18);
    f[0][1] = f[0][2] = f[0][3] = f[0][4] = 0;
    for (int i = 1; i < l + d; ++i) {
        for (int j = 1; j <= 4; ++j) {
            if (i <= l) f[i][j] = f[i - 1][j] + t[s[i] - '0'];
            if (i >= d && j < 4) f[i][j] = min(f[i][j], f[i - d][j + 1]);
        }
    }
    ll ans = 1e18;
    for (int i = l; i < l + d; ++i)
        for (auto x : f[i]) ans = min(ans, x);
    fwn(ans);
}
```

## [J Journey of GCD](https://www.luogu.com.cn/problem/P17897)

**题意：** 给定长度为 $n$ 的正整数组和 $n$ 个点的完全图，任意两个点之间边权为 $\gcd(a_i,a_j)$，给定 $q$ 组询问，求每组询问的 $u,v$ 间路径最大边权的最小值。

贪心+并查集。

考虑从大到小枚举答案并进行连通性合并，每次枚举因数，总复杂度是调和级数为 $n\log$ 级别，然后进行合并。这样是 $O(Vq)$ 的复杂度，无法通过。

考虑将查询挂到并查集的对应点上随并查集启发式合并，每次将较小的连通块合并到较大的上并将上面挂着的询问更新一遍，如果此时某个询问刚连接进入并查集就更新答案。此时复杂度为 $O(V\log q)$。

```cpp
const int N = 1e6 + 5;
int fa[N << 1], sz[N << 1], a[N], ans[N], col[N << 1], r = N - 1;
bool f[N];
vector<int> gr[N];
inline int getf(int x) { return x == fa[x] ? x : fa[x] = getf(fa[x]); }
inline void merge(int u, int v) {
    int x = getf(u), y = getf(v);
    if (x == y) return;
    if (sz[x] < sz[y]) swap(x, y);
    fa[y] = x, sz[x] += sz[y];
    for (int z : gr[y]) {
        gr[x].emplace_back(z), col[z] = x;
        if (col[z ^ 1] == x && !ans[z >> 1]) ans[z >> 1] = r;
    }
}
void solve() {
    int n, q;
    fr(n, q);
    for (int i = 1; i <= n; ++i) fr(a[i]), f[a[i]] = 1;
    for (int i = 1, x, y; i <= q; ++i) {
        fr(x, y);
        if (a[x] == a[y]) ans[i] = a[x];
        else {
            gr[a[x]].emplace_back(i << 1), col[i << 1] = a[x];
            gr[a[y]].emplace_back(i << 1 | 1), col[i << 1 | 1] = a[y];
        }
    }
    for (; r >= 1; --r) {
        fa[r] = r, sz[r] = gr[r].size();
        for (int j = r; j < N; j += r)
            if (f[j]) merge(j, r);
    }
    for (int i = 1; i <= q; ++i) fwn(ans[i]);
}
```