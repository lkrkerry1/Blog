---
title: ABC480 做题记录
published: 2026-10-17
description: 字符串近似匹配、区间覆盖、前缀拼接后的区间和、等差数列计数
tags: [模拟赛, AtCoder, ABC]
category: 题解
lang: zh_CN
draft: false
---


发挥一般的一场 ABC，上把开场 40min 已经开 F 题了，这次还在调 C，最后压哨 E。前几题都是数学题居多，考察了很多细节（点名表扬 C 题吃了三发罚时才过）最后 perf 1398。

个人一直非常喜欢 AtCoder 的题，一般代码量都不大，而且都是一些没那么需要猜答案的数学题，相对来讲好想一点，不过 ABC 的考试时间真的好紧张。


## [B - Invalid Vote](https://atcoder.jp/contests/abc480/tasks/abc480_b)


**题意：** 给 $n$ 个名字，$m$ 个票，每个票如果与某个名字完全相同就给其票数+1，否则如果仅有一个名字与其差一个字符，就给那个人票数+1，求最终票数。

小模拟，但有一些细节需要注意。首先不要随便 break 掉遍历名字的循环，可能漏掉之后出现的完全匹配；其次未找到对应名字的占位符用 $-1$ 而不是 $0$ 否则可能与下标冲突。然后就模拟就行。

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<string> s(n), t(m);
    vector<int> ans(n);
    for (auto& x : s) fr(x);
    for (auto& x : t) fr(x);
    for (auto& x : t) {
        int id = -1;
        bool flag = 1;
        for (int i = 0; i < n; ++i) {
            if (s[i] == x) {
                ++ans[i], id = -1;
                break;
            }
            if (s[i].size() != x.size()) continue;
            int p = 0;
            for (int j = 0; j < s[i].size(); ++j) {
                if (s[i][j] != x[j]) { ++p; }
            }
            if (p == 1) {
                if (id == -1) id = i;
                else { flag = 0; }
            }
        }
        if (id != -1 && flag) ++ans[id];
    }
    for (auto x : ans) fwn(x);
}
```

## [C - Self-Stopping Shower](https://atcoder.jp/contests/abc480/tasks/abc480_c)

**题意：** 给 $n$ 个长度为 $k$ 的闭区间，至少增加几个长度为 $k$ 的闭区间使得这些区间覆盖 $[0, t]$。

最神秘签到题，一堆 corner case。

做法是显然的，每次考虑到 $t$ 或者下一个区间还需再增加几个区间，以此类推就行。但细节是繁多的。首先尽管当前操作可能超过下一个区间，其但下一个区间的右端点仍然可能超过当前位置需要考虑。其次给的区间可能相同，这时需判断当前处理的位置需不需要处理，但如果不需要处理不能简单 coninue 掉，你还要考虑这个区间带来的贡献。想清楚后代码是容易的：

```cpp
void solve() {
    int n, k, t, ans = 0, c = 0;
    fr(n, k, t);
    vector<int> a(n);
    fr(a), ranges::sort(a);
    for (int i = 0; i < n; ++i) {
        int nxt = min(t, a[i]);
        int r = nxt > c ? (nxt - c + k - 1) / k : 0;
        ans += r, c += r * k;
        c = max(c, a[i] + k);
        if (c > t) break;
    }
    if (c <= t) ans += (t - c + k - 1) / k;
    fwn(ans);
}
```


## [D - Concatenation of Prefixes](https://atcoder.jp/contests/abc480/tasks/abc480_d)

**题意：** 给定 $n$ 个整数 $a_i$，如此构造一个新序列 $b$：$i$ 从 $1$ 到 $n$，每次将 $a$ 的前 $i$ 项放到序列的最后。给定 $q$ 组询问，每组询问给出整数 $l,r$ 求新序列中 $\sum_{i=l}^rb_i$。 

考场上想麻烦了，其实是非常简单的二阶前缀和板子。

以下内容中记 $s_i=\sum_{j=1}^ia_i$，$ss_i=\sum_{j=1}^is_i$。

我们发现可以先分别求出 $b_i$ 的前缀和再相减。而求 $b$ 的前缀和可以将其拆分为整块的前缀和和散块的前缀和，其中整块的就是 $ss$ 的前缀和，散块的就是 $s$ 的前缀和。不妨设 $x$ 所在的整块下标是 $i$（从 $1$ 开始编号），那么有：

$$
\frac{i(i-1)}2<x\le\frac{i(i+1)}2
$$

我考场上妄图直接闭式求出 $i$ 浪费了一点时间，实际上我们只需要直接取 $i=\lfloor\sqrt x\rfloor$，随后上下调整直到符合题意就行，不难证明此处最多调整 $O(1)$ 次。而散块前缀和只需要用下标减去之前所有整块的长度之和即可，复杂度 $O(n+q)$

```cpp
void solve() {
    ll n, q;
    fr(n, q);
    vector<ll> a(n + 1), s(n + 1), s2(n + 1);
    frn(a, n);
    for (int i = 1; i <= n; ++i)
        s[i] = s[i - 1] + a[i], s2[i] = s2[i - 1] + s[i];
    auto pre = [&](ll x) {
        if (x <= 0) return 0ll;
        ll t = sqrt(x << 1);
        while ((((t + 1) * (t + 2)) / 2) <= x) ++t;
        while (((t * (t + 1)) / 2) > x) --t;
        return s2[t] + s[x - (t * (t + 1)) / 2];
    };
    for (ll l, r; q--;) { fr(l, r), fwn(pre(r) - pre(l - 1)); }
}
```

## [E - Product-Bounded Arithmetic Sequences](https://atcoder.jp/contests/abc480/tasks/abc480_e)

**题意：** 给定整数 $n$ 求长度大于 $2$ 且乘积不超过 $n$ 的递增等差数列个数。

挺好玩的贪心+二分答案练习，不算很板。

先考虑长度为 $3$，此时乘积为 $a(a^2-d^2)$，$a$ 为中项，$d$ 为公差。不难发现固定 $a$ 的情况下 $d$ 可行性存在单调性，可以直接二分。而在其他长度下也满足这一单调性。同时，当固定长度时，$a$ 的最大值快速下降，确切的说约为 $n^{1/l}$ 量级。而长度 $l$ 的阶乘不应超过 $n$ 否则无解。因此我们发现在 $10^{18}$ 量级下，$l$ 最大为 $19$ ，$a$ 最多枚举到 $10^6$，可以通过。此时最差复杂度约为 $O(n^{1/3}\log n)$

```cpp
void solve() {
    ll n;
    fr(n);
    lll ans = 0;
    auto check = [&](int l, lll a, lll d) {
        lll p = 1;
        for (int i = 0; i < l; ++i) {
            p *= (a + i * d);
            if (p > n) return false;
        }
        return true;
    };
    for (int l = 3; l < 20; ++l) {
        for (lll a = 1; check(l, a, 1); ++a) {
            lll lf = 1, r = 1;
            while (check(l, a, r)) r <<= 1;
            while (lf < r) {
                lll mid = (lf + r + 1) >> 1;
                if (check(l, a, mid)) lf = mid;
                else r = mid - 1;
            }
            ans += lf;
        }
    }
    fwn(ans);
}
```







