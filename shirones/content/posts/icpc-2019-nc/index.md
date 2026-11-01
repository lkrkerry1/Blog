---
title: "ICPC 2019 区域赛南昌站重现赛 做题记录"
published: 2026-10-31
updated: 2026-11-01
description: "二进制统计+简单组合、贪心+最大生成树、树上启发式合并（dsu on tree）、拉格朗日插值"
tags: [模拟赛, 洛谷, xCPC]
category: 题解
lang: zh_CN
draft: false
---
打得还行，不过后面吃饭去了。虽然扫了一眼应该也写不出了。

## [C And and Pair](https://www.luogu.com.cn/problem/P17806)

**题意：** 求满足 $0 \le j \le i \le n$、$i \operatorname{and} n = n$、$i \operatorname{and} j = 0$ 的数对 $(i,j)$ 的个数。

直接枚举 $n$ 内的 $1$ 位，此位之后的 $0$ 均可分给 $j$。于是可以统计答案。

```cpp
const int mod = 1e9 + 7;
void solve() {
    string s;
    fr(s), ranges::reverse(s);
    vector<int> cnt(s.size());
    for (auto [i, c] : s | views::enumerate) { cnt[i] += (c == '1'); }
    for (int i = 1; i < s.size(); ++i) cnt[i] += cnt[i - 1];
    ll ans = 1;
    auto bfp = [](ll a, ll b = mod - 2) {
        ll ans = 1;
        for (; b; b >>= 1, a = a * a % mod)
            if (b & 1) ans = ans * a % mod;
        return ans;
    };
    for (int l = 0; l < s.size(); ++l) {
        if (s[l] == '0') continue;
        ans = (ans
                  + bfp(2, l + 1) % mod * bfp(3, cnt[l]) % mod
                      * bfp(bfp(2), cnt[l]) % mod * bfp(3) % mod)
            % mod;
    }
    fwn(ans);
}
```

## [E Bob's Problem](https://www.luogu.com.cn/problem/P17808)

**题意：** 给定无向带权（正）图，边初始为黑白两色。求最大生成连通图使得白边条数不超过 $k$，且边权和最大。

直接贪心取所有黑色边，随后在剩下的边取连通块数减一条做最大生成树。再补到 $k$ 条即可。

```cpp
void solve() {
    int n, m, k;
    fr(n, m, k);
    vector<array<int, 3>> ed;
    vector<int> fa(n + 1);
    ranges::iota(fa, 0);
    auto getf = [&](this auto&& self, int u) -> int {
        return u == fa[u] ? u : fa[u] = self(fa[u]);
    };
    ll ans = 0;
    for (int u, v, w, c; m--;) {
        fr(u, v, w, c);
        if (!c) ans += w, fa[getf(u)] = getf(v);
        else ed.emplace_back(array { w, u, v });
    }
    int cnt = 0;
    for (int i = 1; i <= n; ++i) cnt += (i == getf(i));
    ranges::sort(ed, greater { });
    vector<bool> vis(ed.size());
    for (int i = 0; i < ed.size(); ++i) {
        auto [w, u, v] = ed[i];
        if (getf(u) != getf(v))
            vis[i] = 1, --k, fa[getf(u)] = getf(v), ans += w;
        if (!k) break;
    }
    for (int i = 0; i < ed.size(); ++i) {
        auto [w, u, v] = ed[i];
        if (!vis[i]) vis[i] = 1, ans += w, --k;
        if (!k) break;
    }
    for (int i = 2; i <= n; ++i)
        if (getf(i) != getf(i - 1)) return fwn(-1);
    fwn(ans);
}
```

## [G Eating Plan](https://www.luogu.com.cn/problem/P17810)

**题意：** 给定 $[1,n]$ 的排列 $a_i$ 和 $m$ 次查询，每次查询给一个 $k$，求最短区间阶乘和（$\sum_i a_i!$）模 $998857459$ 的余数达到 $k$。

神秘乱搞题。

注意到 $998857459=461\times773\times2803$，所以所有超过 $2803$ 的阶乘的余数都是 $0$。直接预处理非零值的位置，然后暴力计算该区间长度的最大阶乘和。由于总共最多 $2803$ 个位置，复杂度仅为 $2803^2$。之后再二分就行。

```cpp
const int mod = 998857459;
void solve() {
    vector<ll> fac(2803, 1);
    for (int i = 1; i < 2803; ++i) fac[i] = fac[i - 1] * i % mod;
    int n, m;
    fr(n, m);
    vector<ll> a(n + 1), pos, ans(n + 1);
    for (int i = 1; i <= n; ++i) {
        fr(a[i]), a[i] = a[i] < 2803 ? fac[a[i]] : 0;
        if (a[i]) pos.emplace_back(i);
        a[i] = ((ll)a[i] + a[i - 1]) % mod;
    }
    for (int l : pos) {
        for (int r : pos) {
            if (l > r) continue;
            ans[r - l + 1] = max(ans[r - l + 1], (a[r] - a[l - 1] + mod) % mod);
        }
    }
    for (int i = 2; i <= n; ++i) ans[i] = max(ans[i - 1], ans[i]);
    for (int k, tmp; m--;) {
        fr(k), tmp = ranges::lower_bound(ans, k) - ans.begin(),
               fwn(tmp <= n ? tmp : -1);
    }
}
```

## [K Tree](https://www.luogu.com.cn/problem/P17814)

**题意：** 求点权树上的有序点对数：路径长度不超过 $k$、两端点非祖先关系，且路径点权和等于 LCA 点权的两倍。

这是一道统计类树上问题，并且与子树相关，考虑树上启发式合并。

对每种点权，开一个树状数组，将对应点权的深度离散化之后插入，每次查询只需查找对应点权的深度前缀和即可。离散化后深度最多 $n$ 个，最终复杂度为 $O(n\log^2n)$。记得乘二。

```cpp
struct FWT {
    vector<int> t;
    int n = 0;
    FWT(int n = 0) : n(n) { t.resize(n + 1); }
    inline void c(int p, int d) {
        for (; p <= n; p += p & -p) t[p] += d;
    }
    inline int q(int p) {
        int ans = 0;
        for (; p; p -= p & -p) ans += t[p];
        return ans;
    }
};
void solve() {
    int n, k;
    fr(n, k);
    vector<int> va(n + 1);
    frn(va, n);
    vector<vector<int>> gr(n + 1), dl(n + 1);
    for (int u, i = 2; i <= n; ++i) fr(u), gr[u].emplace_back(i);
    vector<FWT> tr;
    vector<int> sz(n + 1), son(n + 1), dep(n + 1), pos(n + 1);
    auto dfs = [&](this auto&& self, int u) -> void {
        sz[u] = 1;
        for (int v : gr[u]) {
            dep[v] = dep[u] + 1, self(v), sz[u] += sz[v];
            if (sz[v] > sz[son[u]]) son[u] = v;
        }
    };
    ll ans = 0;
    auto dsu = [&](this auto&& self, int u, bool f) -> void {
        auto update = [&](this auto&& self, int u, int d) -> void {
            tr[va[u]].c(pos[u], d);
            for (int v : gr[u]) self(v, d);
        };
        auto calc = [&](this auto&& self, int u, int z) -> void {
            ans += [&](int w, int d) {
                if (w < 0 || w > n || d < 0) return 0;
                return tr[w].q(ranges::upper_bound(dl[w], d) - dl[w].begin());
            }((va[z] << 1) - va[u], (dep[z] << 1) + k - dep[u]);
            for (int v : gr[u]) self(v, z);
        };
        for (int v : gr[u])
            if (v != son[u]) self(v, false);
        if (son[u]) self(son[u], true);
        for (int v : gr[u])
            if (v != son[u]) calc(v, u), update(v, 1);
        tr[va[u]].c(pos[u], 1);
        if (!f) update(u, -1);
    };
    dfs(1);
    for (int i = 1; i <= n; ++i) dl[va[i]].emplace_back(dep[i]);
    for (auto [i, d] : dl | views::enumerate) {
        ranges::sort(d), d.erase(unique(d.begin(), d.end()), d.end());
        tr.emplace_back(d.size());
    }
    for (int i = 1; i <= n; ++i) {
        pos[i] = ranges::lower_bound(dl[va[i]], dep[i]) - dl[va[i]].begin() + 1;
    }
    dsu(1, true), fwn(ans << 1);
}
```

## [L Who is the Champion](https://www.luogu.com.cn/problem/P17815)

**题意：** 给定 $n$ 支队伍之间的进球数，胜者得 $3$ 分，负者不得分，平局各 $1$ 分。分数相同比较净胜球数。求总冠军。

模拟题。就依题意模拟即可。

```cpp
void solve() {
    int n;
    fr(n);
    vector<vector<int>> s(n + 1, vector<int>(n + 1));
    vector<int> g(n + 1), p(n + 1);
    for (int i = 1; i <= n; ++i) { frn(s[i], n); }
    for (int i = 1; i <= n; ++i) {
        for (int j = i + 1; j <= n; ++j) {
            if (s[i][j] > s[j][i]) p[i] += 3;
            else if (s[i][j] < s[j][i]) p[j] += 3;
            else ++p[i], ++p[j];
        }
    }
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= n; ++j) g[i] += s[i][j] - s[j][i];
    int mx = 1;
    bool f = 0;
    for (int i = 2; i <= n; ++i) {
        if (p[i] > p[mx] || (p[i] == p[mx] && g[i] > g[mx])) mx = i, f = 0;
        else if (p[i] == p[mx] && g[i] == g[mx]) f = 1;
    }
    if (f) fwn("play-offs");
    else fwn(mx);
}
```

## [M XOR Sum](https://www.luogu.com.cn/problem/P17816)

**题意：** 求 $\sum_{k=1}^t\sum_{i=x}^y\operatorname{xor}_{j=1}^{i^k}j$。

首道独立完成的紫题！相当多细节的拉格朗日插值练习题。

先交换求和顺序，由异或前缀和的结论可知：
$$
\sum_{k=1}^t\operatorname{xor}_{j=1}^{i^k}=
\begin{cases}
\dfrac{i^{t+1}-i}{i-1}, & i\equiv 0 \pmod 4 \\
t, & i\equiv 1 \pmod 4 \\
\dfrac{i^{t+1}-1}{i-1}, & i\equiv 2 \pmod 4 \\
\left\lfloor\dfrac t2\right\rfloor, & i\equiv 3 \pmod 4
\end{cases}
$$

我们发现这是个最高 $t$ 次的多项式，再套上外层求和后至多为 $t+1$ 次。考虑求出上式的前缀和 $G(n)$，于是答案为 $G(y)-G(x-1)$。

按模 $4$ 的余数把 $[1,n]$ 内的整数分类计数，分别用插值求出对应点值，然后相加即可。此处插值需要 $t+2$ 个点，复杂度为 $O(t\log y)$。

这里其实余数为 $1,3$ 可以不用插值直接算，但我为了写着方便一起做了。

```cpp
const int mod = 1e9 + 7;
void solve() {
    ll t, l, r;
    fr(t, l, r);
    vector<ll> fact(t + 3, 1);
    array<vector<ll>, 4> f;
    for (auto& x : f) x.resize(t + 3);
    for (int i = 1; i <= t + 2; ++i) fact[i] = fact[i - 1] * i % mod;
    auto bfp = [&](ll a, ll b = mod - 2) {
        ll ans = 1;
        for (a %= mod; b; b >>= 1, a = a * a % mod)
            if (b & 1) ans = ans * a % mod;
        return ans;
    };
    for (int i = 1; i <= t + 2; ++i) {
        f[0][i]
            = (bfp(i << 2, t + 1) - (i << 2) + mod) * bfp((i << 2) - 1) % mod;
        f[1][i] = t;
        f[2][i] = (bfp(i << 2 | 2, t + 1) - 1 + mod) * bfp(i << 2 | 1) % mod;
        f[3][i] = (t >> 1);
    }
    f[1][0] = t, f[2][0] = bfp(2, t + 1) - 1, f[3][0] = t >> 1;
    for (auto& x : f)
        for (int i = 1; i < x.size(); ++i) { x[i] = (x[i - 1] + x[i]) % mod; }
    auto g = [&](const vector<ll>& f, ll n) -> ll {
        if (n < 0) return 0;
        if (n < f.size()) return f[n];
        if (n % mod < f.size()) return f[n % mod];
        ll pre = 1, ans = 0, k = f.size() - 1;
        for (int i = 1; i <= k; ++i) pre = pre * ((n - i) % mod) % mod;
        for (int i = 1, s = ((k - i) & 1) ? -1 : 1; i <= k; ++i, s = -s) {
            ans = (ans
                      + f[i] * pre % mod * bfp(n - i) % mod * bfp(fact[i - 1])
                          % mod * bfp(fact[k - i]) * s % mod)
                % mod;
        }
        return ans;
    };
    auto calc = [&](ll n) -> ll {
        ll ret = 0;
        for (int i = 0; i < 4; ++i)
            ret = (ret + (n >= i ? g(f[i], (n - i) >> 2) : 0)) % mod;
        return ret;
    };
    fwn(((calc(r) - calc(l - 1)) % mod + mod) % mod);
}
```
