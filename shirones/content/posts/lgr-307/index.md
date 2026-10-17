---
title: LGR-307 SCP2026 第二轮模拟
published: 2026-10-17
description: 洛谷的csp-s模拟赛的做题记录
tags: [模拟赛, 洛谷, 题解]
category: 题解
lang: zh_CN
draft: true
---


## [A 档案 / file](https://www.luogu.com.cn/problem/P17722)

**题意简述：** 给定序列 $a$，将 $m$ 个序列 $b_i$ 插入到 $a$ 中，保持顺序从小到大，每次插入代价为插入后 $a$ 的各个元素下标（从 $1$ 开始）之和，求最小代价。

简单二分题。

注意到插入每一个新的 $b_i$ 序列产生的代价增加量与插入顺序无关，仅与 $a$ 中大于他的数的个数有关，考虑二分求出这一代价，然后发现总代价是代价前缀和之和，显然当加入顺序的代价从小到大增加时最小。最终复杂度 $O(n \log n)$

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<int> a(n);
    fr(a), ranges::sort(a);
    vector<vector<int>> b(m);
    vector<ll> s(m);
    for (int i = 0, l; i < m; ++i) {
        fr(l), b[i].resize(l), fr(b[i]);
        for (int j = 0; j < l; ++j) {
            s[i] += a.end() - ranges::lower_bound(a, b[i][j]);
        }
    }
    ranges::sort(s);
    ll ans = 0, cur = (ll)n * (n + 1) >> 1;
    for (auto x : s) ans += (cur += x);
    fwn(ans);
}
```



## [B 函数 / func](https://www.luogu.com.cn/problem/P17723)

**题意：** 求 $\sum_{1\le l\le r\le n} OR(a_l,\dots,a_r)|MEX(a_l,\dots,a_r)$ 

比较有意思的贪心。

首先考虑按位或部分。分别考虑每一位，区间 $[l,r]$ 的按位或和在第 $k$ 位为 $1$ 当仅区间内存在一个元素该位为 $1$，所以只需枚举每一位，算出连续 $0$ 的区间个数，从总区间中减去并累计即可。

再考虑MEX部分。考虑什么时候或上MEX影响答案，我们发现只有MEX为 $2^k$ 且区间内任意一个数的第 $k$ 位均为 $0$ 时才会贡献一个 $2^k$。考虑枚举 $k$ 并使用双指针，统计当前区间内的不重复元素个数以及小于 $2^k$ 的每个数的出现次数，如果不重复个数恰好等于 $2^k$ 就可以一直右移左指针，随后右移右指针加入新的数，如果新的数第 $k$ 位为 $1$ 就跳过这一段，将左指针设为 $r+1$ 即可。每次左指针移动完后统计答案即可。复杂度 $O(n\log n+n\log a_i)$

```cpp
void solve() {
    int n;
    fr(n);
    ull ans = 0;
    vector<int> a(n + 1);
    frn(a, n);
    for (int j = 0; j < 30; ++j) {
        ull cur = (ull)n * (n + 1) >> 1, c = 0;
        for (int i = 1; i <= n; ++i) {
            if ((a[i] >> j) & 1) cur -= c * (c + 1) >> 1, c = 0;
            else ++c;
        }
        cur -= c * (c + 1) >> 1, ans += (cur << j);
    }
    vector<int> cnt(n + 1), vis;
    for (int j = 1; j <= n; j <<= 1) {
        for (int x : vis) cnt[x] = 0;
        vis.clear();
        for (int r = 1, lc = 1, l = 1; r <= n; ++r) {
            if (a[r] & j) {
                for (int x : vis) cnt[x] = 0;
                l = lc = r + 1, vis.clear();
                continue;
            }
            if (a[r] < j && !(cnt[a[r]]++)) vis.emplace_back(a[r]);
            if (vis.size() == j) {
                for (; l <= r; ++l) {
                    if (a[l] >= j) continue;
                    if (cnt[a[l]] == 1) break;
                    --cnt[a[l]];
                }
                ans += ((ull)l - lc + 1) * j;
            }
        }
    }
    fwn(ans);
}
```





