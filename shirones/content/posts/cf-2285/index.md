---
title: "CF2285 (Div. 2) 做题记录"
published: 2026-11-18
description: 区间覆盖的字符串计数、唯一最大值替换计数、反向前缀和 + 组合数、等差子段贪心
tags: [Codeforces, 模拟赛, "Div. 2"]
category: 题解
lang: zh_CN
draft: false
---
出去玩去了，补的题。难度还行。A 是签到题跳过。

## [B. Diverse String](https://codeforces.com/contest/2285/problem/B)

**题意：** 给定长度为 $n$ 的 0/1 字符串，你可以翻转最多 $k$ 位。求在只选择一段区间将其覆盖为连续的 0 或 1 的最大不同字符串个数。

注意到翻转后区间覆盖产生的不同字符串个数与顺序无关，仅与 0/1 个数有关，确切地说，当 0 的个数为 $c$ 时种类数为 $\frac{c(c+1)}2+\frac{(n-c)(n-c+1)}2+1$。直接枚举翻转的个数即可。

```cpp
void solve() {
    int n, k, c = 0;
    fr(n, k);
    string s;
    fr(s), s = ' ' + s;
    for (int i = 1; i <= n; ++i) c += (s[i] == '1');
    ll ans = 0;
    for (ll m = max(0, c - k); m <= min(n, c + k); ++m)
        ans = max(m * (m + 1) / 2 + (n - m) * (n - m + 1) / 2 + 1, ans);
    fwn(ans);
}
```

## [C. Max Substitution](https://codeforces.com/contest/2285/problem/C)

**题意：** 给定长度为 $n$ 的正整数组，每次操作选择其中唯一的最大值并将其修改为小于原值的任意一个正整数。求任意操作次数后（含零次）的数组不同个数。

大力推式子即可。

先从大到小排序，设其为 $a_i$，求出第一个出现两次的位置 $k$。于是最大值最小为 $a_k$。第一个数可以修改为小于它的任意值，所以产生 $a_1-1$ 的贡献，如果要让第二个值可以修改，应该修改到小于 $a_2$，且第二个值继续修改，于是产生 $(a_2-1)^2$ 的贡献，于是总个数为：
$$
1+\sum_{i=1}^{k-1}(a_i-1)^i
$$

加一是因为可以不修改。然后直接计算即可。

```cpp
const int mod = 1e9 + 7;
void solve() {
    int n, k = 0;
    fr(n);
    vector<ll> a(n + 2);
    frn(a, n), ranges::sort(a, greater { });
    for (int i = 0; i <= n; ++i)
        if (a[i] == a[i + 1]) {
            k = i;
            break;
        }
    auto bfp = [&](ll a, ll b) -> ll {
        ll ans = 1;
        for (a %= mod; b; b >>= 1, a = a * a % mod)
            if (b & 1) ans = ans * a % mod;
        return ans;
    };
    ll ans = 1;
    for (int i = 0; i < k; ++i) ans = (ans + bfp(a[i] - 1, i + 1)) % mod;
    fwn(ans);
}
```

## [D. Reverse Partition](https://codeforces.com/contest/2285/problem/D)

**题意：** 给定长度为 $n$ 的数组 $a_i$ 和正整数 $m$，进行 $q$ 次 **独立** 的查询，每次暂时将 $a_i$ 增加 $v$，随后将数组拆分为 $m$ 段求和，要求正序和倒序对应位置的段落和对应相等。求拆分个数。

先前缀和，于是某一个点 $i$ 可以拆开满足 $s_i=s_n-s_{n-i}$。于是我们开一个桶将 $s_i+s_n-s_{n-i}$ 放进去，只需查询为 $0$ 的个数 $c$ 然后答案就是 $\binom c{m-1}$。

考虑如何处理暂时修改，如果 $i\le n-i$，那么在区间 $[i,n-i]$ 内所有前缀和差值都会增加 $v$；如果 $i>n-i$，那么在区间 $[n-i+1,i-1]$ 内所有差值减少 $v$。我们只需要先减去差值为 $0$ 的且在该区间中的个数，再加上修改后变为 $0$ 的在区间中的个数即可。这里可以二分快速求出对应长度。

```cpp
const int mod = 1e9 + 7, N = 2e5 + 5;
ll fac[N], invf[N];
inline ll bfp(ll a, ll b = mod - 2) {
    ll ans = 1;
    for (a %= mod; b; b >>= 1, a = a * a % mod)
        if (b & 1) ans = ans * a % mod;
    return ans;
}
void init() {
    fac[0] = 1;
    for (int i = 1; i < N; ++i) fac[i] = fac[i - 1] * i % mod;
    invf[N - 1] = bfp(fac[N - 1]);
    for (int i = N - 1; i >= 1; --i) invf[i - 1] = invf[i] * i % mod;
}
inline ll C(int n, int m) {
    if (n < 0 || m < 0 || n < m) return 0;
    return fac[n] * invf[m] % mod * invf[n - m] % mod;
}
void solve() {
    int n, m, q;
    fr(n, m, q);
    vector<ll> a(n + 1), s(n + 1);
    frn(a, n);
    for (int i = 1; i <= n; ++i) s[i] = s[i - 1] + a[i];
    unordered_map<ll, vector<int>> id;
    for (int i = 1; i < n; ++i) id[s[i] + s[n - i] - s[n]].emplace_back(i);
    const auto& z = id[0];
    ll ans = z.size();
    for (int i, v; q--;) {
        fr(i, v);
        if (i <= n - i) {
            const auto& z2 = id[-v];
            ll tmp = ranges::upper_bound(z, n - i) - ranges::lower_bound(z, i),
               t2 = ranges::upper_bound(z2, n - i) - ranges::lower_bound(z2, i);
            fwn(C(ans - tmp + t2, m - 1));
        } else {
            const auto& z2 = id[v];
            ll tmp = ranges::upper_bound(z, i - 1)
                - ranges::lower_bound(z, n - i + 1),
               t2 = ranges::upper_bound(z2, i - 1)
                - ranges::lower_bound(z2, n - i + 1);
            fwn(C(ans - tmp + t2, m - 1));
        }
    }
}
```

## [E. Arithmetic Subarray](https://codeforces.com/contest/2285/problem/E)

**题意：** 给定长度为 $n$ 的整数组，最多修改 $k$ 个数，求修改后的最长等差子段长度。

相当有趣的贪心题。

先考虑固定保留左端点作为不会修改的位置，然后贪心地向右移动右端点，移动过程中，需要修改的个数单调不降，所以可以如此移动。

移动过程中维护 $d=\frac{a_r-a_l}{r-l}$ 的出现个数，只有相同的位置才能加入等差，否则需要修改，于是出现最多的就是最理想的公差。移到最右端后会贡献答案 $cnt_d+k+1$。

如果众数的出现次数已经超过了 $k$，那么其他公差不可能超过该次数，于是固定此公差继续向右移动，最终贡献答案为 $r-l-b+k$，其中 $b$ 为途中不合法的个数。

移动端点时如果遇到是等差数列的段落可以一口气跳过，于是要先预处理等差子段。倒序枚举，然后对比公差更新即可。

```cpp
void solve() {
    int n, k;
    fr(n, k);
    vector<int> a(n + 1), f(n + 1, n);
    frn(a, n);
    for (int i = n - 2; i >= 1; --i) {
        f[i] = a[i + 1] - a[i] == a[i + 2] - a[i + 1] ? f[i + 1] : i + 1;
    }
    int ans = k + 1;
    for (int l = 1; l <= n; ++l) {
        unordered_map<int, int> cnt;
        int r = l + 1, d = 0;
        if (f[l] - l > k) cnt[d = a[r] - a[l]] = f[l] - l, r = f[l];
        else {
            for (int d2; r <= n; ++r) {
                if ((a[r] - a[l]) % (r - l) == 0
                    && ++cnt[d2 = (a[r] - a[l]) / (r - l)] > cnt[d])
                    d = d2;
                if (r - l - cnt[d] > k || cnt[d] > k) break;
            }
        }
        ans = max(ans, cnt[d] + k + 1);
        if (r > n || cnt[d] <= k) continue;
        int b = r - l - cnt[d];
        for (++r; r <= n;) {
            if (a[r] - a[l] == (ll)d * (r - l))
                r = (r < n && a[r + 1] - a[r] == d ? f[r] : r) + 1;
            else if (b >= k) break;
            else ++b, ++r;
        }
        ans = max(ans, r - l - b + k);
    }
    fwn(min(n, ans));
}
```