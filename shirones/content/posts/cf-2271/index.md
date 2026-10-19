---
title: CF2271(Div. 1+2) 做题记录
published: 2026-10-11
description: 打表找规律、MEX 博弈、异或子区间性质、区间重叠判定。
tags: [模拟赛, Codeforces, Div. 2]
category: 题解
lang: zh_CN
draft: false
---


依旧是一个钟写完 ABC，剩下两个钟全砸在 D 上。

## [A. Robot Odd Moves](https://codeforces.com/contest/2271/problem/A)


**题意：** 有一个机器人从 $(0,0)$ 开始移动，每次可以向右上或右下移动一个对角线格，问移到 $(x,y)$ 需要几次。

签到题。

打表不难发现有明显规律，如表：

$$

\begin{matrix}
   \vdots&  \\
  -1& -1 & -1 & -1 & 5 &5&7&7&\cdots& \\
  -1& -1 & -1 & 4 &4  &6&6&8&\cdots& \\
  -1&  -1&  3&  3&  5& 5& 7& 7& \cdots&\\
  -1&  2&  2&  4&  4& 6& 6& 8& \cdots&\\
  1&  1&  3&  3&  5& 5& 7& 7& \cdots& \\
  0&  2&  2&  2&  4& 4& 6& 6& \cdots&
\end{matrix}
$$

直接算出最下方元素，然后加上纵坐标。随后代码是自然的。

```cpp
void solve() {
    int x, y;
    fr(x, y);
    if (y - x > 1) return fwn(-1);
    fwn((((x - y + 1) >> 1) << 1) + y);
}
``` 


## [B. MEX Game](https://codeforces.com/contest/2271/problem/B)

**题意：** 给定 $n$ 个正整数 $a_i$，两个人轮流从里面拿数，先手目标使自己最小的出现不超过给定正整数 $k$ 次的数与后手不相等，而后手目标相等。求拿完后的获胜方。

简单贪心+博弈论。

由于 MEX 只与较小的数有关，不难发现最优策略就是拿到 $k$ 个直接去拿下一个，如果少于 $2k-1$ 个，则直接结束（两个人都无法使答案继续变大）；如果大于等于 $2k$ 个，两个人都能使答案增加；如果恰好等于 $2k-1$，那么只有先手可以增加答案，即先手胜出。

```cpp
void solve() {
    int n, k;
    fr(n, k);
    vector<int> cnt(n + 1), a(n);
    fr(a);
    for (auto x : a) ++cnt[x];
    for (int i = 0; cnt[i] >= (k << 1) - 1 && i <= n; ++i)
        if (cnt[i] == (k << 1) - 1) return fwn("YES");
    fwn("NO");
}
```



## [C. XOR Problem](https://codeforces.com/contest/2271/problem/C)



**题意：** 给定正整数 $n$，求 $\max(|A|-f(A))$ 以及当取到最大值时的最长的 $A$，其中 $A$ 为一个整数数列，每个数在 $[0,n]$ 范围，$|A|$ 为 $A$ 的长度，$f(A)$ 为 $A$ 中按位异或和为 $0$ 的子区间个数。

打表+构造题。

考场纯尝试了前几个先猜后证的规律，考虑这个规律的来源。我们发现目标是让序列尽量长并且少产生异或和的区间，我们尝试每次只对异或前缀和加入一个二进制位，这恰好对应每个数的二进制位的最低位！例如 $n=2$ 时可以构造 `1210121`，$n=4$ 时可以照搬过来有 `121412101214121`。再进一步还可以有 `12141218...` 以此类推。我们只需要输出每个 $lowbit(i)=i\&(-i)$ 即可。注意特判不要超过 $n$。

```cpp
void solve() {
    int n;
    fr(n), fwn((1 << (__lg(n) + 2)) - 1);
    for (int i = 1; i < (1 << (__lg(n) + 2)); ++i)
        fw((i & (-i)) > n ? 0 : (i & (-i))), fw(' ');
    fw('\n');
}

```


## [D. Target Infection](https://codeforces.com/contest/2271/problem/D)

**题意：** 给 $n$ 对互不重叠的闭区间，求一个有 $k$ 个位置与前面的区间重叠的长度为 $m$ 的闭区间的左端点。

相当复杂的双指针综合题。

考场做法比后面看到的做法多个 $\log$ 遂省去，讲讲线性做法。

首先我们可以考虑维护这个长度为 $m$ 的区间的前缀和，然后判断 $k$ 是否在其中就行。不难发现由于区间互不重叠，区间内前缀和的变化量绝对值最大为 $1$。考虑什么时候这个变化量会改变：只有进入区间和离开区间的时候。我们将这些位置存下来排个序，从小到大扫过去，每次改变斜率之后都可以尝试解一个一元一次方程来计算 $k$ 是否存在即可。每一次解完后都直接跳到下一个区间就能保证线性的复杂度。有一定实现压力。

```cpp
void solve() {
    ll n, m, k;
    fr(n, m, k);
    vector<pair<ll, int>> sp;
    for (ll l, r; n--;) {
        fr(l, r), sp.emplace_back(l - m + 1, 1);
        sp.emplace_back(min(l, r - m + 1) + 1, -1);
        sp.emplace_back(max(l + 1, r - m + 2), -1);
        sp.emplace_back(r + 2, 1);
    }
    if (!k) return fwn((ll)1e18);
    ranges::sort(sp);
    for (ll v = 0, d = 0, i = 0, l, r; i < sp.size() - 1;
        ++i, v += (r - l + 1) * d) {
        d += sp[i].second, l = sp[i].first, r = sp[i + 1].first - 1;
        if (l > r) continue;
        if (!d && k == v && r - l + 1 >= 1 && r >= 1) return fwn(r);
        if (!d) continue;
        int len = (k - v) / d;
        if (len >= 1 && len <= r - l + 1 && l + len - 1 >= 1)
            return fwn(l + len - 1);
    }
    fwn(-1);
}
```
