---
title: 线性筛
published: 2026-10-21
description: 使用线性筛快速计算常见数论函数
tags: [模板, 线性筛]
category: 笔记
lang: zh_CN
draft: false
---

线性筛除了可以 $O(n)$ 预处理素数外还可以计算数论函数（广义），即大部分满足积性的函数。

## 代码

```cpp
void init() {
    vector<int> prime;
    phi[1] = miu[1] = 1;
    for (int i = 2; i < N; ++i) {
        if (!phi[i]) phi[i] = i - 1, miu[i] = -1, prime.emplace_back(i);
        for (int p : prime) {
            if (p * i >= N) break;
            if (i % p == 0) {
                phi[i * p] = phi[i] * p, miu[i * p] = 0;
                break;
            }
            phi[i * p] = phi[i] * (p - 1), miu[i * p] = -miu[i];
        }
    }
}
```

## 原理

先定义初始值，之后每次如果没有被标记过就是质数，根据质数计算。随后枚举所有质数，如果该质数 $p$ 整除该数 $i$，就是质因数分解的质数次数大于 $1$ 的分支，根据函数进行计算，随后退出防止重复标记。其他情况就是枚举到的质数是一个新因子，按照要求计算。每个数只会被枚举到一次，所以是 $O(n)$。