---
title: "P3435 [POI 2006] OKR-Periods of Words"
published: 2026-11-25
description: "KMP 思想计算最长“周期”串"
tags: [洛谷, KMP]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P3435](https://www.luogu.com.cn/problem/P3435)

**题意：** 给长度为 $n$ 的字符串，对于其每个前缀，求最长前缀使得前缀重复一遍的前缀是原串。

## 思路

画个图就会发现这个相当于求最短的前后缀相等的串。回忆 kmp 求 nxt 的过程，就会发现求出的是最大前后缀相等的串，但当失配时依次取 `j,nxt[j],nxt[nxt[j]],...` 都是前后缀相等的串，于是直接递推维护最小值即可。

答案就是当前前缀长度减去上述最小值。代码极其简单。

## 代码

```cpp
void solve() {
    int n;
    fr(n);
    string s;
    fr(s), s = ' ' + s;
    vector<int> nxt(n + 1), mn(n + 1);
    ll ans = 0;
    for (int i = 2, j = 0; i <= n; ++i) {
        while (j && s[i] != s[j + 1]) j = nxt[j];
        if (s[i] == s[j + 1]) ++j;
        nxt[i] = j;
    }
    for (int i = 2; i <= n; ++i)
        if (nxt[i]) mn[i] = mn[nxt[i]] ? mn[nxt[i]] : nxt[i], ans += i - mn[i];
    fwn(ans);
}
```
