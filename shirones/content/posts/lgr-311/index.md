---
title: LGR-311(Div. 2) 做题记录
published: 2026-10-24
description: 构造、数论+图论建模、位运算技巧+贪心构造
tags: [模拟赛, 洛谷, Div. 2]
category: 题解
lang: zh_CN
draft: false
---

发挥超常（？）但排名不高，因为三点才开始写，前面上习题课去了。整体来讲非常好玩的一场，每道题都挺好玩。

## [A 极差 / Range](https://www.luogu.com.cn/problem/P17764)

**题意：** 构造两个长度为 $n$ 的整数数列 $a_i,b_i$，满足其任意子区间极差不超过 $1$，且对应位置差值不超过 $1$。

感谢题目提供的样例（

直接观察样例不难发现可行构造之一就是取 $a_i=1,3,5,7,\dots,2,4,6,8,\dots$，对应 $b_i$ 就是从第二个开始，然后把 $1$ 填到最后。不难发现其符合题意，且 $n\le4$ 无解。

```cpp
void solve() {
    int n;
    fr(n);
    if (n <= 4) return fwn(-1);
    vector<int> a(n);
    for (int i = 1; i <= n; i += 2) a[i >> 1] = i;
    for (int i = 2; i <= n; i += 2) a[(i >> 1) + ((n - 1) >> 1)] = i;
    fwn(a);
    for (int i = 1; i < n; ++i) fw(a[i]), fw(' ');
    fwn(a[0]);
}
```

## [B 平方数 / Square](https://www.luogu.com.cn/problem/P17765)

**题意：** 给定两个长度为 $n$ 的数列 $a_i,b_i$，构造一个尽量短的序列 $p_i$，使得 $a_{p_1},b_{p_m},a_{p_{i+1}}b_{p_i}$ 均为完全平方数。求最短长度。

非常巧妙的图论建模题。

考虑求出每个位置的奇数质因子之积 `spf`，显然这个数论函数有积性可以使用线性筛预处理。随后每个序列中的数相当于该值对应的 `spf` 对应的点，然后再将所有 $a_i$ 连向 $b_i$。题目所求就是一个从 $1$ 回到 $1$ 的路径。我们先特判掉从 $1$ 开始的自环，若自环个数达到 $2$，那么答案直接取 $2$ 就行。其他情况下自环只会使答案增大，于是我们只需从 $1$ 连接到的每个点跑 bfs 回到 $1$ 并更新答案即可。复杂度 $O(n^2)$。

```cpp
const int N = 1e5 + 5;
ll sp[N];
void init() {
    vector<int> prime;
    sp[1] = 1;
    for (int i = 2; i < N; ++i) {
        if (!sp[i]) sp[i] = i, prime.emplace_back(i);
        for (int p : prime) {
            if (p * i >= N) break;
            if (i % p == 0) {
                sp[i * p] = sp[i] % p ? sp[i] * p : sp[i] / p;
                break;
            }
            sp[i * p] = sp[i] * p;
        }
    }
}
void solve() {
    int n, mx = 0, l = 0;
    fr(n);
    vector<int> a(n), b(n);
    for (int i = 0; i < n; ++i) fr(a[i], b[i]), mx = max({ mx, a[i], b[i] });
    vector<vector<int>> gr(mx + 1);
    for (int i = 0; i < n; ++i) gr[sp[a[i]]].emplace_back(sp[b[i]]);
    for (int i = 0; i < n; ++i)
        if (sp[a[i]] == 1 && sp[b[i]] == 1) ++l;
    if (l >= 2) return fwn(2);
    auto bfs = [&](int s) {
        queue<int> q({ s });
        vector<int> dis(mx + 1, -1);
        dis[s] = 0;
        for (int u; q.size();) {
            u = q.front(), q.pop();
            for (int v : gr[u]) {
                if (dis[v] != -1) continue;
                dis[v] = dis[u] + 1;
                if (v == 1) return dis[v];
                q.emplace(v);
            }
        }
        return -1;
    };
    int ans = 1e9;
    for (int i = 0, d; i < n; ++i) {
        if (sp[a[i]] == 1 && sp[b[i]] != 1 && (d = bfs(sp[b[i]])) != -1)
            ans = min(ans, 1 + d);
    }
    fwn(ans >= 1e9 ? -1 : ans);
}
```

## [C 位运算 / Bit](https://www.luogu.com.cn/problem/P17766)

**题意：** 给定 $n,x,y,z$，构造乘积最大的 $n$ 个数满足按位与为 $x$，按位或为 $y$，按位异或为 $z$。

比较有趣的二进制技巧题。

首先关注 $x$ 的 $1$ 位，这个迫使所有这一位都填 $1$；然后是 $y$ 的 $0$ 位，迫使所有位填 $0$。在这两个基础上考虑 $z$ 对应位的奇偶进行判断就能排除掉无解的情况（也就是上述条件矛盾）。

剩下的位置都是 $x_k=0,y_k=1$，那么应该有 $[1,n-1]$ 个 $1$，由于要乘积尽量大，显然要 $1$ 尽量多。若 $z_k=(n-1) \operatorname{and} 1$，那么只需填一个 $0$，其他全填 $1$；反之就是两个零。求出总共的 $0$ 的个数 $m$，不难发现 $m\le120$。

为了便于维护，我们可以从 $y$ 上减去填 $0$ 的位置就直接得到了构造出的数。若 $n\ge m$，那么乘积最大时恰好是把每个 $0$ 均匀的填到每个位置上，枚举一遍求积就行。若 $n<m\le 120$，那么 $n$ 特别小，直接开个小根堆暴力维护，每次将所需的按从小到大取出，然后算上对应的零再放回去即可。注意模数是 $998244853$。

复习注：快速幂底数记得先取模，质数不要直接取模（这 sb 怎么对质数取模.jpg），堆元素不要直接取模，存原值！最后统计的时候记得先取模。情况一记得乘上剩余值！

```cpp
const int mod = 998244853;
void solve() {
    auto bfp = [](ull a, ull b = mod - 2) {
        ull ans = 1;
        for (; b; b >>= 1, a = a * a % mod)
            if (b & 1) ans = ans * a % mod;
        return ans;
    };
    ull n, x, y, z;
    fr(n, x, y, z);
    vector<pair<int, int>> zp;
    for (int i = 59; i >= 0; --i) {
        int a = (x >> i) & 1, b = (y >> i) & 1, c = (z >> i) & 1;
        if (a && (!b || (n & 1) != c)) return fwn(-1);
        if (!b && c) return fwn(-1);
        if (!a && b) {
            if (n == 1 || (n == 2 && !c)) return fwn(-1);
            zp.emplace_back(i, ((n - 1) & 1) == c ? 1 : 2);
        }
    }
    int sum = 0;
    for (auto [i, v] : zp) sum += v;
    ull ans = 1;
    if (n >= sum) {
        for (auto [i, v] : zp) {
            ull tmp = y - (1ull << i);
            tmp %= mod, ans = ans * tmp % mod;
            if (v == 2) ans = ans * tmp % mod;
        }
        ans = ans * bfp(y % mod, n - sum) % mod;
    } else {
        priority_queue<ull> pq;
        for (int i = 1; i <= n; ++i) pq.emplace(y);
        for (auto [i, v] : zp) {
            vector<ull> tmp(v);
            for (auto& t : tmp) t = pq.top(), pq.pop();
            for (auto& t : tmp) pq.emplace(t - (1ull << i));
        }
        while (pq.size()) ans = ans * (pq.top() % mod) % mod, pq.pop();
    }
    fwn(ans);
}
```