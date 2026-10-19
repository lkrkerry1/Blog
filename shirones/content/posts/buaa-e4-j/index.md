---
title: BUAA E4 J Lavender Edge
published: 2026-10-19
description: 按位与或的单调性 trick
tags: [buaa, 位运算, Ad-hoc]
category: 题解
lang: zh_CN
draft: false
---

**题意：** 给定两个长为 $n$ 的正整数组 $a_i,b_i$，求 $\sum_{l,r}\operatorname{and}(a_l,\dots,a_r)\times\operatorname{or}(b_l,\dots,b_r)$。

神题！极其优秀的 trick。

## 思路

注意到按位与只能使二进制位减少，按位或只能使二进制位增加。考虑固定右端点并维护到右端点前的后缀与/或，发现增加一个右端点只能改变极少的一部分后缀和值，直接暴力更新这部分值并累加答案，复杂度为 $O(n \log a)$！

```cpp
#include <bits/stdc++.h>

using namespace std;
using ll = long long;

const int N = 1e6 + 5, mod = 1e9 + 7;

int a[N], b[N];

int main() {
    cin.tie(0)->sync_with_stdio(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) cin >> b[i];
    ll ans = 0, cur = 0;
    for (int r = 1; r <= n; ++r) {
        for (int l = r; --l;) {
            int va = a[l] & a[r], vb = b[l] | b[r];
            if (va == a[l] && vb == b[l]) break;
            cur = (cur - (ll)a[l] * b[l] % mod + (ll)va * vb % mod + mod) % mod;
            a[l] = va, b[l] = vb;
        }
        cur = (cur + a[r] * b[r] % mod) % mod, ans = (ans + cur) % mod;
    }
    cout << ans;
    return 0;
}
```