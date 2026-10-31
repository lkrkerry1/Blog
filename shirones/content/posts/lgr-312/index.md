---
title: LGR-312(Div. 3) 做题记录
published: 2026-10-24
description: 模拟、计数、手写链表
tags: [模拟赛, 洛谷, Div. 3]
category: 题解
lang: zh_CN
draft: false
---

首次 AK Div. 3，不过榜爷们太神了，勉强 rk48。T4 太神秘了，不知道为什么要考一道手写链表的题，写的非常难受。

## [A 生存大师](https://www.luogu.com.cn/problem/P17760)

签到题略。

```cpp
void solve() {
    int n, a, b;
    fr(n, a, b);
    vector<int> s(n + 1);
    frn(s, n);
    for (int i = 1; i <= n; ++i) {
        if (s[i] == 1) {
            if (a) --a;
            else if (b) --b;
            else return fwn(i - 1);
        } else {
            if (b) --b;
            else return fwn(i - 1);
        }
    }
    fwn(n);
}
```


## [B 红石大佬](https://www.luogu.com.cn/problem/P17761)

**题意：** 给一个 $2\times n$ 网格，在其中选择 $k$ 个格子。考虑其他空格，如果相邻 $4$ 格有被标记的，那么获得 $1$ 分。求最大分值。

有一定细节的模拟题。首先注意到一定要选 **恰好** $k$ 格，而不是不超过 $k$ 格。考虑根据 $n$ 奇偶分类，注意到最优摆法都是走“马”步，也就是摆一半的格子数。多余的格子就直接从答案里扣就行。记得特判，以及判断偶数情况是否顶到边上决定要不要减去一。

```cpp
void solve() {
    ll n, k;
    fr(n, k);
    if (!k) return fwn(0);
    if (k == (n << 1)) return fwn(0);
    if (n == 1 && k == 1) return fwn(1);
    if (n == 2 && k <= 2) return fwn(2);
    if (n & 1) {
        ll lf1 = max(0ll, k - (n >> 1) - 2), lf2 = max(0ll, k - ((n + 1) >> 1));
        fwn(max(min(k, n >> 1) * 3 - lf1, min(k, (n + 1) >> 1) * 3 - 2 - lf2));
    } else {
        ll lf = max(0ll, k - (n >> 1) - 1);
        fwn(3 * min(k, n >> 1) - (k >= (n >> 1)) - lf);
    }
}
```




## [C 跑酷大神](https://www.luogu.com.cn/problem/P17762)


**题意：** 给定长度为 $2n$ 的正整数数列，考虑其所有排列（注意相同的数交换位置算不同的排列）$b_i$ 中 $[b_{2k-1},b_{2k}]$ 的交集长度之和。

计数+贪心构造题。不难，但思路挺有意思。

首先排个序，不难发现最终交集为空或为 $[a_n,a_{n+1}]$，直接将 $n$ 前的元素和 $n$ 后的元素进行匹配，然后前后关系也无法确定。最终答案为 $|a_{n+1}-a_n|(n!)^22^n$。

```cpp
void solve() {
    int n;
    fr(n);
    vector<int> a(n << 1 | 1);
    frn(a, n << 1), ranges::sort(a);
    ll ans = abs(a[n + 1] - a[n]);
    for (int i = 1; i <= n; ++i) ans = ans * 2ll * i % mod * i % mod;
    fwn(ans);
}
```



## [D 建筑大佬](https://www.luogu.com.cn/problem/P17763)

**题意：** 给定长度为 $n$ 的三个正整数组 $a_i,b_i,c_i$，三种操作 $op,x,y,z$，操作一将所有 $a_i=x$ 对应位置的 $b_i$ 改为 $y$，$c_i$ 改为 $z$，其他操作同理。每次操作后分别求出当前三个数列的和。

这道题让我对这场比赛的印象差了不少，前面都是（尤其 C）是比较有意思的小清新题，这个题除了手写链表好像没有别的更好写的做法，写得我非常难受。

首先我们发现如果两个位置的三个数组对应相等，则之后的操作没办法将其分开，也就是说我们可以将三个数组压在一个 `ull` 里，每个记录包含的大小。此后的操作只能将多个 `ull` 段落合并而不能分裂。然后考虑如何快速寻找某一数列值为指定 $x$ 的位置。我们可以建立一个链表将这些相同元素的下标装进去，之后修改时只需要修改链表的表头连接到新的位置就行。答案更新只需要利用前面维护的大小就行。最终复杂度 $O(n\log n)$，因为处理前要排序方便寻找相同位置。

修改注：复习时使用了纯 stl 写法，据说常数很大但其实跑得飞快。由于写的时候滥用 stl 这里补充一下， `lst[i]` 存储了 `i` 位置值为特定值的块有哪些，`cnt` 就是块桶。然后就暴力。

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<array<int, 3>> v(n);
    for (int j = 0; j < 3; ++j)
        for (int i = 0; i < n; ++i) fr(v[i][j]);
    map<array<int, 3>, int> cnt;
    array<unordered_map<int, vector<array<int, 3>>>, 3> lst;
    array<ll, 3> s { };
    for (auto& x : v) {
        ++cnt[x];
        for (int i = 0; i < 3; ++i) s[i] += x[i];
    }
    for (auto& x : lst) x.reserve(cnt.size() << 1);
    for (auto& [x, v] : cnt) {
        for (auto [i, l] : lst | views::enumerate) l[x[i]].emplace_back(x);
    }
    for (int op, x, y, z; m--;) {
        fr(op, x, y, z), --op;
        auto it = lst[op].find(x);
        ll sum = 0;
        if (it != lst[op].end()) {
            for (auto& x : it->second) {
                auto cur = cnt.find(x);
                if (cur == cnt.end()) continue;
                for (int i = 0; i < 3; ++i)
                    if (i != op) s[i] -= (ll)cur->second * x[i];
                sum += cur->second, cnt.erase(cur);
            }
            it->second.clear();
        }
        if (sum) {
            array<int, 3> tmp;
            if (op == 0) tmp = { x, y, z }, s[1] += sum * y, s[2] += sum * z;
            if (op == 1) tmp = { y, x, z }, s[0] += sum * y, s[2] += sum * z;
            if (op == 2) tmp = { y, z, x }, s[0] += sum * y, s[1] += sum * z;
            cnt[tmp] += sum;
            for (auto [i, l] : lst | views::enumerate)
                l[tmp[i]].emplace_back(tmp);
        }
        fwn(s[0], s[1], s[2]);
    }
}
```

