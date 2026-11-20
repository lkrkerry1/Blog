---
title: "P2163 [SHOI2007] 园丁的烦恼"
published: 2026-11-18
description: 矩形内点数查询：离线扫描线，把询问拆成四个二维前缀和，用树状数组维护纵坐标的前缀和
tags: [洛谷, 树状数组, 扫描线]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P2163](https://www.luogu.com.cn/problem/P2163)

**题意：** 给 $n$ 个整点，$q$ 次查询，每次查询一个闭区间矩形内的点个数。

## 思路

考虑扫描线。一般这种题都要对坐标离散化，但这题好像不用也行。

将修改视作坐标单点修改，查询拆成四个二维前缀和，全部离线存下来，然后根据坐标从小到大排序。注意要保证同样坐标先修改后查询使得确实是闭区间。

于是每次查询时只插入了横坐标不超过当前横坐标的值，只需要在树状数组中维护对应纵坐标的前缀和即可，查询对应。

实现使用了一些小技巧（将第三维加入排序并且区分正负）使得代码较为简洁。

## 代码

```cpp
const int N = 1e7 + 5;
ll tr[N];
inline void mod(int p, ll x) {
    for (++p; p < N; p += p & -p) tr[p] += x;
}
inline ll qry(int p) {
    ll ans = 0;
    for (++p; p; p -= p & -p) ans += tr[p];
    return ans;
}
void solve() {
    int n, q;
    fr(n, q);
    vector<tuple<int, int, int>> v;
    vector<ll> ans(q + 1);
    for (int x, y; n--;) fr(x, y), v.emplace_back(x, y, 0);
    for (int a, b, c, d, i = 1; i <= q; ++i) {
        fr(a, b, c, d), v.emplace_back(c, d, i);
        v.emplace_back(a - 1, b - 1, i);
        v.emplace_back(a - 1, d, -i), v.emplace_back(c, b - 1, -i);
    }
    ranges::sort(v, [&](const auto& a, const auto& b) {
        auto [a1, a2, a3] = a;
        auto [b1, b2, b3] = b;
        return tuple { a1, a2, abs(a3) } < tuple { b1, b2, abs(b3) };
    });
    for (auto [x, y, z] : v) {
        if (!z) mod(y, 1);
        else ans[abs(z)] += z / abs(z) * qry(y);
    }
    for (int i = 1; i <= q; ++i) fwn(ans[i]);
}
```
