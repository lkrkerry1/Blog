---
title: "ARC234 做题记录"
published: 2026-11-22
description: 大力推式子+递归
tags: [AtCoder, 模拟赛, ARC]
category: 题解
lang: zh_CN
draft: false
---
绷，2h 写出第一题。难死了已经。

## [A - Reverse, Recurse](https://atcoder.jp/contests/arc234/tasks/arc234_a)

**题意：** 给一个长度为 $n$ 的排列 $p_i$，当对区间 $[l,r]$ 进行操作时，如果 $p_l>p_r$，就将整段区间翻转。随后依次对区间 $[l,r-1],[l+1,r-1]$ 进行操作。求区间翻转次数。

观察可以发现（？）区间操作完成后相当于从小到大排序，于是在右边的这段区间操作是可以预测的，不妨设进行的操作次数为 $s(k,r)$ 代表对 $a_1<a_2<a_3<\dots<a_k,x$，操作，其中比 $x$ 小的数有 $r$ 个。模拟后发现：
$$
s(k,r)=s(k-r,0)=1+d(k)
$$

其中 $d(k)$ 代表对 $x<<b_k>b_{k-1}>\dots>b_1$ 进行操作的次数，再次模拟发现：
$$
d(k)=d(k-1)+s(k-1,0)
$$

带回上式，惊奇地发现 $s(k,r)=2^{k-r-2}$，如果变小数了就是 $0$。

然后考虑左边，由于每次展开只会产生一个新的左区间和右边的可以快速计算的值，所以直接模拟。考虑如何计算右区间的序号，发现可以用树状数组维护右区间有的值范围，每次操作完删去较大边界值即可。

```cpp
const int mod = 998244353;
void solve() {
    int n, d = 0;
    fr(n);
    vector<int> p(n + 1), tr(n + 1);
    frn(p, n);
    auto modify = [&](int p, int x) {
        for (; p <= n; p += p & -p) tr[p] += x;
    };
    auto query = [&](int p) {
        int ans = 0;
        for (; p; p -= p & -p) ans += tr[p];
        return ans;
    };
    vector<ll> pw(n + 1, 1);
    for (int i = 1; i <= n; ++i) pw[i] = pw[i - 1] * 2 % mod, modify(p[i], 1);
    auto pos = array { 1, n }, dt = array { 1, -1 };
    ll ans = 0;
    for (int f, r, t; pos[0] < pos[1];) {
        f = p[pos[d]] > p[pos[d ^ 1]], t = max(p[pos[0]], p[pos[1]]);
        r = max(query(t - 1) - 1, 0);
        if (r != pos[1] - pos[0] - 1)
            ans = (ans + pw[pos[1] - pos[0] - r - 2]) % mod;
        ans = (ans + f) % mod, modify(t, -1), d ^= f, pos[d ^ 1] += dt[d ^ 1];
    }
    fwn(ans);
}
```
