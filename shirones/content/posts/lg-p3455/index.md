---
title: P3455 ZAP-Queries（莫比乌斯反演）
published: 2026-10-21
description: 莫反模板题
tags: [洛谷, 模板, 莫比乌斯反演]
category: 题解
lang: zh_CN
draft: false
---


> 来源：[P3455 [POI 2007] ZAP-Queries](https://www.luogu.com.cn/problem/P3455)

**题意：** 给定正整数 $n,m,k$，求 $\sum_{i=1}^n\sum_{j=1}^m[\gcd(i,j)=k]$。

## 思路及核心代码

先化简该式子：

$$
\begin{aligned}
\sum_{i=1}^{n} \sum_{j=1}^{m} [\gcd(i,j)=k] 
&= \sum_{i=1}^{\lfloor n/k \rfloor} \sum_{j=1}^{\lfloor m/k \rfloor} [\gcd(i,j)=1] \\
&= \sum_{i=1}^{\lfloor n/k \rfloor} \sum_{j=1}^{\lfloor m/k \rfloor} \sum_{d \mid i, d \mid j} \mu(d) \\
&= \sum_{i=1}^{\lfloor n/k \rfloor} \sum_{j=1}^{\lfloor m/k \rfloor} \sum_{d} [d \mid i][d \mid j] \mu(d) \\
&= \sum_{d} \mu(d) \sum_{i=1}^{\lfloor n/k \rfloor} [d|i] \sum_{j=1}^{\lfloor m/k \rfloor} [d|j] \\
&= \sum_{d} \mu(d) \left\lfloor \frac{\lfloor n/k \rfloor}{d} \right\rfloor \left\lfloor \frac{\lfloor m/k \rfloor}{d} \right\rfloor
\end{aligned}
$$

发现这两个分式可以数论分块，莫比乌斯函数的值可以前缀和，于是可以求出。线性筛预处理 $O(n)$，单次询问 $O(\sqrt n)$，共 $T$ 组询问时总复杂度 $O(n + T\sqrt n)$。

```cpp
void solve() {
    ll n, m, k, ans = 0;
    fr(n, m, k), n /= k, m /= k;
    if (n < m) swap(n, m);
    for (int l = 1, r = 0; l <= m; l = r + 1) {
        r = min(n / (n / l), m / (m / l));
        ans += (n / l) * (m / l) * (sum[r] - sum[l - 1]);
    }
    fwn(ans);
}
```
