---
title: "P2375 [NOI2014] 动物园"
published: 2026-11-25
description: 通过 KMP 维护长度不过半的公共前后缀个数
tags: [洛谷, KMP]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P2375](https://www.luogu.com.cn/problem/P2375)

**题意：** 给长度为 $n$ 的字符串，求每个前缀的不重合公共前后缀个数（原题为减少输出求加一后的积）。

## 思路

先 kmp 求出 nxt 数组，然后暴力做法是显然的，直接每次从 `nxt[i]` 往回跳直到长度满足要求。但这样是 $O(n^2)$ 的，考虑模仿 kmp 过程均摊复杂度。

考虑 j 指针不移动，再次进行匹配过程，这时从 `nxt[i-1]` 往回跳，并且判断当前位置是否合适。跳到合适位置时再判断长度，此时由于上一个位置长度是合法的，所以最多会跳一次。

确切地说，上一轮处理完之后 $j\le \frac i2$，然后之后再增加一位，匹配长度最多加一，于是只需最多跳一次即可，并且必然合法，不会出现更长匹配（否则上一轮就应该出现）。

## 代码

```cpp
void solve() {
    int n;
    string s;
    fr(s), n = s.size(), s = ' ' + s;
    vector<int> nxt(n + 1), cnt(n + 1), num(n + 1);
    for (int i = 2, j = 0; i <= n; ++i) {
        while (j && (s[i] != s[j + 1])) j = nxt[j];
        if (s[i] == s[j + 1]) ++j;
        nxt[i] = j, cnt[i] = cnt[j] + (j > 0);
    }
    for (int i = 2, j = 0; i <= n; ++i) {
        while (j && s[i] != s[j + 1]) j = nxt[j];
        if (s[i] == s[j + 1]) ++j;
        if (j * 2 > i) j = nxt[j];
        num[i] = cnt[j] + (j > 0);
    }
    ll ans = 1;
    const int mod = 1e9 + 7;
    for (int i = 2; i <= n; ++i) ans = ans * (num[i] + 1) % mod;
    fwn(ans);
}
```
