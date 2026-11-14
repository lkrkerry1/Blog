---
title: "BUAA E7 J Keep Your Distance"
published: 2026-11-06
description: 二分答案并维护合法区间
tags: [buaa, 二分]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[BUAA E7](https://accoding.buaa.edu.cn/contest-ng/index.html#/1344/problems)

**题意：** 给一个长度为 $n$ 的序列 $a_i$ 和一个长度为 $n-1$ 的序列 $l_i$，构造一个长为 $n$ 的序列 $b$ 满足 $|b_i-b_{i-1}|\ge l_i$。求 $\max|a_i-b_i|$ 的最小值。

## 思路

看到最大值最小，考虑二分答案。我们可以维护一个合法区间（初始为 $[a_1-m,a_1+m]$），之后不停的更新这个区间。如果每次都能在该区间内取出符合的数，就成功。否则失败。

维护过程相当于将一个可选区间与两段区间合并，相当于已知 $b_{i-1}\in[lf,r]$ 求与 $a_i$ 距离不超过 $m$ 的 $b_i$。若 $a_i-m\le b_{i-1}-l_i$，于是可以向左走，此时 $b_{i-1}=r$ 最有可能能够走通，于是如果能走通，那么 $b_i\ge a_i-m$。如果走不通，就只能走右边，右边能走的范围就是 $b_i\ge lf+l_i$ 并且 $b_i\ge a_i-m$。于是取 max 就是新的左端点。右边同理。这样就能 $O(n)$ 判断这个 $m$ 是否可行。

最终复杂度为 $O(n\log n)$，记得 long long。

## 代码

```cpp
inline void solve() {
    int n;
    cin >> n;
    vector<ll> a(n + 1), l(n + 1);
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 2; i <= n; ++i) cin >> l[i];
    auto check = [&](ll m) {
        for (ll i = 2, lf = a[1] - m, r = a[1] + m; i <= n; ++i) {
            bool f1 = a[i] - m <= r - l[i], f2 = lf + l[i] <= a[i] + m;
            if (!f1 && !f2) return false;
            if (f1) lf = a[i] - m;
            else lf = max(a[i] - m, lf + l[i]);
            if (f2) r = a[i] + m;
            else r = min(a[i] + m, r - l[i]);
        }
        return true;
    };
    ll lf = 1, r = 1e18;
    while (lf < r) {
        ll m = (lf + r) >> 1;
        if (check(m)) r = m;
        else lf = m + 1;
    }
    cout << lf << '\n';
}
```
