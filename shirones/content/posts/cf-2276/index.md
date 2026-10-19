---
title: CF2276(Div. 2) 做题记录
published: 2026-10-15
description: 贪心签到、01 串压缩、子段整除计数、二分图染色、模式串子串计数
tags: [模拟赛, Codeforces, Div. 2]
category: 题解
lang: zh_CN
draft: false
---


发挥很奇怪的一场：前期跳了 B，但 D 比想象中简单，省下的时间反而让我把 E 也做出来了。

## [A. Perfect Sandwiches](https://codeforces.com/contest/2276/problem/A)



**题意：** 给定 $a$ 片奶酪和 $b$ 片火腿用于制作三明治，要求每个三明治都要有两种材料，并且奶酪要多于火腿。在用完所有材料的前提下求最多能做多少三明治。

贪心签到题。


不难发现最优情况就是奶酪恰好比火腿多一片，则最多做 $a-b$ 个。同时还要保证火腿够用，也就是最多做 $b$ 个。记得特判。

```cpp
void solve() {
    int a, b;
    fr(a, b);
    if (a <= b) return fwn(-1);
    fwn(min(a - b, b));
}
```



## [B. Replace and Compress](https://codeforces.com/contest/2276/problem/B)

**题意：** 给一个 $01$ 字符串，你可以将不是首尾的某个元素修改，然后将所有连续的相同子段压缩为相同的那个数。问压缩完最终有几个不相等的结果。

贪心+构造，明明挺简单当时想岔了浪费了不少时间。


注意到答案只可能是 $1,2,3$，因为最终压缩的结果是一个 $01$ 交替的串，修改一个不是首尾位置最多使该串长度增加或减少 $2$。总共最多三种情况。考虑何时产生新结果：如果有 `010` 或 `101`，修改中间那个显然会让长度减少二，答案增加；如果有 `111` 或者 `000`，修改中间的那个可以让长度加二，答案增加。

```cpp
void solve() {
    string s;
    int n;
    fr(s), n = s.size(), s = ' ' + s;
    int ans = 1;
    for (int i = 2; i < n; ++i) {
        if (s[i] == s[i - 1] && s[i] == s[i + 1]) {
            ++ans;
            break;
        }
    }
    for (int i = 2; i < n; ++i)
        if (s[i] != s[i - 1] && s[i] != s[i + 1]) {
            ++ans;
            break;
        }
    fwn(ans);
}
```


## [C. Subarrays](https://codeforces.com/contest/2276/problem/C)



**题意：** 给定一个序列，和一个正整数 $k$，求长度大于 $k$ 且和能被 $k$ 整除的子段个数。

签到题。

考虑开一个大小为 $k$ 的桶存之前的前缀和模 $k$ 的余数相等个数。一遍维护 $k$ 个之前的前缀和，一遍维护当前前缀和并累计答案就行。

```cpp
void solve() {
    int n, k;
    fr(n, k);
    vector<int> a(n + 1);
    frn(a, n);
    unordered_map<ll, int> cnt;
    ll ans = 0;
    for (ll sl = 0, sr = 0, i = 1; i <= n; ++i) {
        sr = (sr + a[i]) % k;
        if (i > k) { sl = (sl + a[i - k - 1]) % k, ++cnt[sl], ans += cnt[sr]; }
    }
    fwn(ans);
}

```




## [D. Caveman](https://codeforces.com/contest/2276/problem/D)


**题意：** 给一张无向图的顶点染两种颜色，要求每个顶点至少有一个相邻顶点与其颜色相反。求染色方案（特别地，如果方案数大于 $2$ 你只需判断出来即可）

构造题，当时随便画几个图直接秒了。~~（暴论：签到题）~~

注意到答案为 $0$ 当仅存在孤立点，答案不可能为 $1$，如果整张图恰好是一个菊花图，答案为 $2$，其他情况下答案都大于 $2$。

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<vector<int>> gr(n + 1);
    vector<bool> vis(n + 1);
    vector<int> dg(n + 1);
    for (int u, v; m--;) {
        fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
        vis[u] = vis[v] = 1, ++dg[u], ++dg[v];
    }
    for (int i = 1; i <= n; ++i)
        if (!vis[i]) return fwn("Brain Melt");
    if (n == 2 && dg[1] == dg[2]) return fwn(2);
    int p = 0;
    for (int i = 1; i <= n; ++i) {
        if (dg[i] > 1) {
            if (p) {
                p = -1;
                break;
            } else p = i;
        }
    }
    auto dfs = [&](this auto&& self, int u) -> void {
        vis[u] = 0;
        for (int v : gr[u])
            if (vis[v]) self(v);
    };
    dfs(1);
    for (int i = 1; i <= n; ++i)
        if (vis[i]) return fwn("Many");
    if (p && p != -1) return fwn(2);
    fwn("Many");
}
```




## [E. Good Substrings](https://codeforces.com/contest/2276/problem/E)


**题意：** 给一个数字字符串，对每个位置，求包含自己的且含有 `2026` 或者不含 `2025` 的子串个数。

有一定难度的数数题。


考虑正难则反，分别维护每个位置开始的下一个 `0,2,5,6` 位置，于是可以快速计算下一个 `2025` 和 `2026` 的位置，不难发现不满足的右端点在 `5` 和 `6` 之间。考虑这一段对每个位置的贡献，对于当前位置到 `5`，这一段答案都要增加 `5` 到 `6` 的长度；对于 `5` 到 `6`，这一段答案增加 `5` 到当前位置的长度，这是一个等差数列，可以再维护一个差分求解。复杂度 $O(n)$

```cpp
void solve() {
    int n;
    fr(n);
    string s;
    fr(s), s = ' ' + s;
    auto calc = [&](char c) {
        vector<int> nxt(n + 2, n + 1);
        for (int i = n; i >= 1; --i) nxt[i] = s[i] == c ? i : nxt[i + 1];
        return nxt;
    };
    string tmp("20256");
    array<vector<int>, 5> nxt;
    for (int i = 0; i < 5; ++i) nxt[i] = calc(tmp[i]);
    vector<int> f(n + 1, n + 1), g(n + 1, n + 1);
    for (int i = 1; i <= n; ++i) {
        f[i] = g[i] = i - 1;
        for (int j = 0; j < 3; ++j) {
            f[i] = f[i] <= n ? nxt[j][f[i] + 1] : n + 1;
            g[i] = g[i] <= n ? nxt[j][g[i] + 1] : n + 1;
        }
        f[i] = f[i] <= n ? nxt[3][f[i] + 1] : n + 1;
        g[i] = (g[i] <= n ? nxt[4][g[i] + 1] : n + 1) - 1;
    }
    vector<ll> d1(n + 3), d2(n + 3), d3(n + 3);
    for (int i = 1; i <= n; ++i) {
        if (f[i] > g[i]) continue;
        d1[i] += g[i] - f[i] + 1, d1[f[i] + 1] -= g[i] - f[i] + 1;
        if (f[i] + 1 <= g[i]) {
            d2[f[i] + 1] += g[i] + 1, d2[g[i] + 1] -= g[i] + 1;
            d3[f[i] + 1]++, d3[g[i] + 1]--;
        }
    }
    for (ll i = 1, s1 = 0, s2 = 0, s3 = 0; i <= n; ++i) {
        s1 += d1[i], s2 += d2[i], s3 += d3[i];
        fw(i * (n - i + 1) - s1 - s2 + i * s3), fw(" \n"[i == n]);
    }
}
```
