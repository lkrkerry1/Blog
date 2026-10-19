---
title: LGR-309(Div. 2) 做题记录
published: 2026-10-11
description: 模条件构造、数列拆分合并的最少操作次数。
tags: [模拟赛, 洛谷, Div. 2]
category: 题解
lang: zh_CN
draft: false
---




前两题还行，后两题没做出来。

## [A 风之子](https://www.luogu.com.cn/problem/P17690)

**题意：** 给定 $a,b$ 求最小的大于 $a+b$ 的整数满足模 $a$ 的余数为 $b$，模 $b$ 的余数为 $a$。

签到题，注意到答案为 $a+b+\gcd(a,b)$。



## [B 彩虹鱼](https://www.luogu.com.cn/problem/P17691)


**题意：** 给定两个数列 $a_i,b_i$，每次操作可以选择 $a_i$ 中的两个元素将其替换为他们的和或是将某个元素替换为两个和为原数的数。求将 $a$ 变成 $b$ 的最少操作次数。

经典贪心。

考虑求出 $a,b$ 的前缀和，发现操作相当于向序列中插入或删除一个元素。我们只需保留 $a,b$ 的前缀和的最长公共子序列，其他数之间全部删掉再补充回来即可。确切的说，答案为 $n+m-\operatorname{LCS}(a,b)*2$。


```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<ll> a(n + 1), b(m + 1);
    frn(a, n), frn(b, m);
    for (int i = 1; i <= n; ++i) a[i] += a[i - 1];
    for (int i = 1; i <= m; ++i) b[i] += b[i - 1];
    if (a[n] != b[m]) return fwn(-1);
    vector<array<int, 2>> f(m + 1);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            if (a[i] == b[j]) f[j][i & 1] = f[j - 1][(i & 1) ^ 1] + 1;
            else f[j][i & 1] = max(f[j - 1][i & 1], f[j][(i & 1) ^ 1]);
        }
    }
    fwn(n + m - ((f[m][n & 1]) << 1));
}
```
