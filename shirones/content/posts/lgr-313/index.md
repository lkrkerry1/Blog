---
title: "LGR-313(Div. 2) 做题记录"
published: 2026-11-07
description: 贪心、构造、Catalan数+容斥
tags: [洛谷, 模拟赛, "Div. 2"]
category: 题解
lang: zh_CN
draft: false
---
比较简单（？）的一场 div2，感觉打得还行。

## [A Su通ki信yu题ri](https://www.luogu.com.cn/problem/P17853)

**题意：** 给定一个 $1\dots n$ 的子集 $S$，每次取 S 中未配对的最小元素与不在 S 中且未配对的最小元素配对。将 S 中元素全部配对后剩下的未配对元素为 $x$。给你 $\{x\}\cup S$，求所有可能的 $x$。

手模样例后不难发现某个 $S_i$ 为答案当仅前面的空位数等于 $|S|$，直接统计，前缀和即可。

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<int> a(m + 1), d(m + 1), ans;
    frn(a, m), ranges::sort(a);
    for (int i = 1; i <= m; ++i) d[i] = a[i] - a[i - 1] - 1;
    for (int i = 1; i <= m; ++i) d[i] += d[i - 1];
    for (int i = 1; i <= m; ++i)
        if (d[i] == m - 1) ans.emplace_back(a[i]);
    fwn(ans.size()), fwn(ans);
}
```

## [B 凌云沐雨](https://www.luogu.com.cn/problem/P17854)

**题意：** 交互题。你需要猜出一个长度为 $n$ 的排列，每次询问给出一个 $1\dots n$ 的子集，交互库将对应位置的排列取出并离散化后返回产生的排列的置换环个数。询问次数不超过 $n-1$。

很有意思的题。假设我们已经知道前 $i$ 个数的大小顺序，我们直接按照从小到大放置这些数，然后在后面补上 $i+1$，于是手模发现这样得到的结果恰好就是 $p_{i+1}$ 在前 $i+1$ 个元素的大小顺序。于是我们可以这样逐步求出每个数的大小顺序，最后得出整个排列。

```cpp
void solve() {
    int n, k;
    cin >> n >> k;
    vector<int> cur(n + 1), ans(n + 1);
    ranges::iota(cur, 0);
    for (int i = 2, r; i <= n; ++i) {
        cout << "? " << i << ' ';
        for (int j = 1; j <= i; ++j) cout << cur[j] << ' ';
        cout << endl, cin >> r;
        for (int j = r; j <= i; ++j) swap(cur[i], cur[j]);
    }
    for (int i = 1; i <= n; ++i) ans[cur[i]] = i;
    cout << "! ";
    for (int i = 1; i <= n; ++i) cout << ans[i] << ' ';
    cout << endl;
}
```

## [D 奶龙游戏](https://www.luogu.com.cn/problem/P17856)

**题意：** 将 $1\dots 2n$ 的数分给 AB 两个人，每回合 B 先出，A 可以观察 B 出的数再出。如果 A 出的数比 B 大的次数恰好为 $k$ 次那么 A 胜。如果双方最优进行游戏，求 A 拿到每一种数的组合等概率的情况下的胜率。

Catalan 总会在你意想不到的地方出现。

发现这个就是一个另类的括号匹配，考虑转变为从 $(0,0)$ 走到 $(n,n)$，第 $i$ 步向上代表将 $i$ 分给 B，向右就是分给 A。不难求出 A 能获得的最大最小胜回合数：最大当且仅当对于 B 出的每个数取比他大的最小值，如果不存在就取最小数；最小同理。于是最大值就是 $n-\max(a-b)$，最小值就是 $\max(b-a)$，$(a,b)$ 为按照题意走格子后形成的折线上的每个点。

于是可以用 Catalan 方法计算。做对称点，然后容斥即可知道答案为：
$$
\binom{2n}{n}-\binom{2n}{n-k-1}-\binom{2n}{k-1}  
$$
刚好本来要加回去的项取不到，是 $0$。

```cpp
const int mod = 998244353;
void solve() {
    int n;
    fr(n);
    auto bfp = [&](ll a, ll b = mod - 2) {
        ll ans = 1;
        for (a %= mod; b; b >>= 1, a = a * a % mod)
            if (b & 1) ans = (lll)ans * a % mod;
        return ans;
    };
    vector<ll> fac(n << 1 | 1, 1), invf(n << 1 | 1, 1);
    for (int i = 1; i <= (n << 1); ++i) fac[i] = fac[i - 1] * i % mod;
    invf[n << 1] = bfp(fac[n << 1]);
    for (int i = (n << 1); i > 1; --i) invf[i - 1] = invf[i] * i % mod;
    auto C = [&](int n, int m) -> lll {
        if (n < 0 || m < 0 || n < m) return 0;
        return (lll)fac[n] * invf[m] % mod * invf[n - m] % mod;
    };
    for (int k = 0; k <= n; ++k) {
        fwn(((C(n << 1, n) - C(n << 1, n - k - 1) - C(n << 1, k - 1)) % mod
                    * bfp(C(n << 1, n)) % mod
                + mod)
            % mod);
    }
}
```