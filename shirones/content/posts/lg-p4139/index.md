---
title: "洛谷 P4139 上帝与集合的正确用法"
published: 2026-10-30
description: "使用扩展欧拉定理计算 2↑↑∞ mod p"
tags: [洛谷, 数论, 扩展欧拉定理]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P4139](https://www.luogu.com.cn/problem/P4139)

**题意：** 计算 $2\uparrow\uparrow \infty \bmod p$。

## 思路

水蓝！题目说了幂塔高了之后值就固定了，于是直接递归。由扩展欧拉定理知道 $a^b \equiv a^{b \bmod (\varphi(p) + \varphi(p))} \bmod p$，于是直接递归就行。

## 代码

```cpp
const int N = 1e7 + 5;
int phi[N];
void init() {
    vector<int> prime;
    phi[1] = 1;
    for (int i = 2; i < N; ++i) {
        if (!phi[i]) phi[i] = i - 1, prime.emplace_back(i);
        for (int p : prime) {
            if (p * i >= N) break;
            if (i % p == 0) {
                phi[i * p] = phi[i] * p;
                break;
            }
            phi[i * p] = phi[i] * (p - 1);
        }
    }
}
void solve() {
    auto bfp = [&](ll a, ll b, ll p) {
        ll ans = 1;
        for (a %= p; b; b >>= 1, a = a * a % p)
            if (b & 1) ans = ans * a % p;
        return ans;
    };
    auto calc = [&](this auto&& self, int p) -> ll {
        if (p <= 1) return 0;
        return bfp(2, self(phi[p]) + phi[p], p);
    };
    int p;
    fr(p), fwn(calc(p));
}
```
