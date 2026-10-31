---
title: "ICPC 2019 区域赛南昌站重现赛 做题记录"
published: 2026-10-31
description: "二进制统计+简单组合、贪心+最大生成树、Ad-hoc 乱搞题、小模拟"
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