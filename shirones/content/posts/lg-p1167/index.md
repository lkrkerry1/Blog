---
title: P1167 刷题
published: 2026-10-19
description: 算日期的小模拟
tags: [模拟, 洛谷]
category: 题解
lang: zh_CN
draft: false
---


> 来源：[P1167 刷题](https://www.luogu.com.cn/problem/P1167)

**题意：** 给 $n$ 个时间为分钟的任务和开始结束时间（格式为 `yyyy-mm-dd hh:mm`），求最多可以完成几个任务。

sb 模拟题，之前一直想用 python 水过去，结果发现时间早于 1970 水不了直接红了。今天突然想起来给写了。

## 思路

直接模拟判断闰年计算总天数，然后排序任务贪心即可。关注一个细节：`0000` 年是闰年记得特判，最后不要忘记输出。

```cpp
void solve() {
    int n;
    fr(n);
    vector<ll> a(n);
    fr(a), ranges::sort(a);
    auto get_minutes = []() {
        ll t = 0;
        array<ll, 5> x;
        array md { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
        for (auto& v : x) fr(v);
        t += x[0] * 365 + (x[0] - 1) / 4 - (x[0] - 1) / 100 + (x[0] - 1) / 400
            + (x[0] > 0);
        for (int i = 1; i < x[1]; ++i) {
            t += md[i]
                + (i == 2 && x[0] % 4 == 0 && (x[0] % 100 || x[0] % 400 == 0));
        }
        return ((t + x[2]) * 24 + x[3]) * 60 + x[4];
    };
    ll t2 = get_minutes(), t = get_minutes();
    t -= t2;
    for (auto [i, x] : a | views::enumerate) {
        if (x <= t) t -= x;
        else return fwn(i);
    }
    fwn(n);
}

```