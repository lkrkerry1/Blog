---
title: "洛谷 P4421 [COCI 2017/2018 #1] Lozinke"
published: 2026-11-18
description: 有序对计数：把所有密码放进 map 后枚举每个串的全部子串查出现次数，桶去重后减掉自己
tags: [洛谷, STL]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P4421](https://www.luogu.com.cn/problem/P4421)

**题意：** 给定 $n$ 个小写字母串，求有多少对字符串满足一个是另一个的子串。（长度不超过 10）

## 思路

第一反应是 AC 自动机。但仔细一看发现这个直接用 `map` 暴力就行。将所有字符串放进桶中，然后查询时将所有不同的子串的结果相加（注意要再开一个桶去重子串）。最终答案会多统计自己，于是减去 $n$。

## 代码

```cpp
void solve() {
    int n;
    fr(n);
    vector<string> a(n);
    unordered_map<string, int> cnt;
    for (auto& x : a) fr(x), ++cnt[x];
    ll ans = 0;
    for (auto& x : a) {
        unordered_map<string, bool> tmp;
        for (int i = 0; i < x.size(); ++i)
            for (int l = 1; l <= x.size(); ++l) {
                auto s = x.substr(i, l);
                if (!tmp[s] && cnt.count(s)) tmp[s] = 1, ans += cnt[s];
            }
    }
    fwn(ans - n);
}
```
