---
title: "P1390 公约数的和"
published: 2026-11-25
description: 莫比乌斯反演简单练习，虽然此题直接做也行
tags: [洛谷, 莫反]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P1390](https://www.luogu.com.cn/problem/P1390)

**题意：** 给定正整数 $n$，求 $\sum_i^n\sum_{j>i}^n\gcd(i,j)$。

## 思路

先去重变成 $\sum\sum\gcd$，然后直接带公式即可：
$$
\begin{aligned}
\sum\sum\gcd &= \sum_dd\sum_i\sum_j[\gcd(i,j)=d] \\
             &= \sum_dd\sum_i^{n/d}\sum_j^{n/d}[\gcd(i,j)=1] \\
             &= \sum_dd\sum\sum\sum_{k|i,k|j}\mu(k) \\
             &= \sum_dd\sum_k\mu(k)\lfloor\frac n{kd}\rfloor^2 \\
             &= \sum_d\lfloor\frac n{d}\rfloor^2\sum_{k|d}\frac{d}{k}\mu(k) \\
             &= \sum_d\varphi(d)\lfloor\frac n{d}\rfloor^2
\end{aligned}
$$

然后这题数据小，不分块也行。

## 代码

```cpp
void solve() {
    ll n;
    fr(n);
    vector<ll> phi(n + 1), prime;
    phi[1] = 1;
    for (int i = 2; i <= n; ++i) {
        if (!phi[i]) phi[i] = i - 1, prime.emplace_back(i);
        for (int p : prime) {
            if (i * p > n) break;
            if (i % p == 0) {
                phi[i * p] = phi[i] * p;
                break;
            }
            phi[i * p] = phi[i] * (p - 1);
        }
    }
    for (int i = 2; i <= n; ++i) phi[i] += phi[i - 1];
    ll ans = 0;
    for (int i = 1, j; i <= n; i = j + 1) {
        j = n / (n / i), ans += (phi[j] - phi[i - 1]) * (n / i) * (n / i);
    }
    fwn((ans - n * (n + 1) / 2) / 2);
}
```
