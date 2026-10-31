---
title: "ICPC 2019 区域赛徐州站重现赛 做题记录"
published: 2026-10-22
updated: 2026-10-30
description: 异或特性、质数判断、打表、树的重心
tags: [模拟赛, 洛谷, xCPC]
category: 题解
lang: zh_CN
draft: false
---


打这一场的时候状态比较差，早上刚体测完头很晕，写了三题就受不了了，开摆。

## [A Cat](https://www.luogu.com.cn/problem/P17731)

**题意：** 选择最长的区间 $[l,r]$ 使 $\operatorname{xor}_{i=l}^ri\le s$。

看清楚只能选一个区间！当时看成任意个区间浪费了一点时间，甚至这题直接吃了 $6$ 发罚时。

首先注意到任意 $2k$ 位置开始的连续长度为 $4$ 的区间异或和为 $0$。于是我们可以直接算出异或前缀和，然后枚举段落的开头和结尾。这里可以贪心，只需要枚举 $l$ 到 $l+5$ 作为左端，右端也是。因为任意长度超过 $6$ 的区间都会有连续区间可以取用。而如果长度小于 $6$ 可以直接暴力计算。最终复杂度 $O(T)$。补题时注：这题细节很多，注意加括号，留意前缀和边界是否 -1 等等。

```cpp
void solve() {
    ll l, r, s, ans = -1;
    fr(l, r, s);
    auto pre = [](ll n) -> ll {
        if ((n & 3) == 0) return n;
        if ((n & 3) == 1) return 1;
        if ((n & 3) == 2) return n + 1;
        else return 0;
    };
    if (r - l < 6) {
        for (ll x = l; x <= r; ++x)
            for (ll y = x, cur = 0; y <= r; ++y)
                if ((cur ^= y) <= s) ans = max(ans, y - x + 1);
    } else {
        for (ll x = l - 1; x <= min(l + 4, r - 1); ++x)
            for (ll y = max(l, r - 5); y <= r; ++y)
                if ((pre(x) ^ pre(y)) <= s) ans = max(ans, y - x);
    }
    fwn(ans);
}
```

## [C <3 numbers](https://www.luogu.com.cn/problem/P17733)

**题意：** 求给定区间内质数个数是否超过区间长度的三分之一。

签到题，对于较短的区间直接暴力判断，对于较小的端点直接预处理判断。较大的区间中质数出现频率极低可以直接认为超不过（当然我赛时求稳用了质数分布估计）。

```cpp
const int N = 2e6 + 5;
bool isp[N];
vector<int> prime;
int cs[N];
void init() {
    for (int i = 2; i < N; ++i) {
        if (!isp[i]) prime.emplace_back(i);
        for (int p : prime) {
            if (p * i >= N) break;
            isp[i * p] = 1;
            if (i % p == 0) break;
        }
    }
    for (int i = 1; i < N; ++i) cs[i] = cs[i - 1] + (!isp[i]);
}
void solve() {
    int l, r;
    fr(l, r);
    if (r - l <= 1e5) {
        int cnt = 0;
        for (int i = l; i <= r; ++i) {
            bool isp = 1;
            for (int p : prime) {
                if (p * p > i) break;
                if (i % p == 0) {
                    isp = 0;
                    break;
                }
            }
            cnt += isp;
        }
        if ((ll)cnt * 3 < (r - l + 1)) return fwn("Yes");
        else return fwn("No");
    }
    ldb cnt;
    if (r >= N) cnt = (ldb)r / log((ldb)r);
    else cnt = cs[r];
    if (l > 1 && l >= N) cnt -= (ldb)(l - 1) / log((ldb)l - 1);
    else cnt -= cs[l - 1];
    if (cnt * 3 < r - l + 1) return fwn("Yes");
    else fwn("No");
}
```



## [F The Answer to the Ultimate Question of Life, The Universe, and Everything.](https://www.luogu.com.cn/problem/P17736)

**题意：** 给定正整数 $n$ 求一对绝对值不超过 $5000$ 的三元组 $(a,b,c)$ 使得 $a^3+b^3+c^3=n$。

注意到 $n\le 200$，直接打表。源代码只有个表就不放了，这个是暴力程序：

```cpp
#include <bits/stdc++.h>

using namespace std;
using ll = long long;
using ldb = long double;

int main() {
    freopen("ans.txt", "w", stdout);
    for (ll i = 0; i <= 200; ++i) {
        bool f = 0;
        for (ll a = -5000; a <= 5000; ++a) {
            for (ll b = a; b <= 5000; ++b) {
                ll c = cbrt(i - a * a * a - b * b * b);
                if (abs(c) > 5000) continue;
                if (a * a * a + b * b * b + c * c * c == i) {
                    printf("ans[%d]={%d,%d,%d};\n", i, a, b, c);
                    f = 1;
                    break;
                }
            }
            if (f) break;
        }
        if (!f) printf("f[%d]=1;\n", i);
    }
}
```

## [M Kill the tree](https://www.luogu.com.cn/problem/P17743)

**题意：** 给一棵树，求每个子树的 **全部** 重心。

我场上混淆了这个和 CF685B（这个是求一个重心）。这一题也是利用类似的结论：子树重心位于根节点所在重链上。

于是我们先求出重链，然后从重儿子的子树重心往上跳，如果符合题意就是答案。特别地，如果恰好满足子树大小为总大小的一半，父亲节点也是重心（双重心情况）。由于这条重链每次只跳常数步，是均摊 $O(1)$ 的，最终复杂度为 $O(n\log n)$。

```cpp
void solve() {
    int n;
    fr(n);
    vector<vector<int>> gr(n + 1);
    for (int i = 1, u, v; i < n; ++i)
        fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
    vector<int> sz(n + 1), fa(n + 1), son(n + 1);
    vector<set<int>> ans(n + 1);
    auto dfs = [&](this auto&& self, int u) -> void {
        sz[u] = 1;
        for (int v : gr[u])
            if (v != fa[u]) {
                fa[v] = u, self(v), sz[u] += sz[v];
                if (sz[v] > sz[son[u]]) son[u] = v;
            }
        if (sz[u] == 1 || (sz[son[u]] << 1) < sz[u])
            return ans[u].emplace(u), void();
        for (int v : ans[son[u]]) {
            for (; v != u && (sz[v] << 1) < sz[u]; v = fa[v]);
            ans[u].emplace(v);
            if ((sz[v] << 1) == sz[u]) ans[u].emplace(fa[v]);
        }
    };
    dfs(1);
    for (int i = 1; i <= n; ++i, fw('\n'))
        for (int j : ans[i]) fw(j), fw(' ');
}
```