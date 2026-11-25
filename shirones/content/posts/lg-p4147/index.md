---
title: "P4147 玉蟾宫"
published: 2026-11-25
description: 单调栈维护最大矩形
tags: [洛谷, 单调栈]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P4147](https://www.luogu.com.cn/problem/P4147)

**题意：** 给一个 01 矩阵，求最大连续的 1 子矩形，输出其面积的 $3$ 倍。

## 思路

逐行求出该位置向上最多能延伸长度，然后问题就变为给一系列高度求最大矩形，这是单调栈板子，直接求出左右最近的高度小于自己的位置即可。

代码做麻烦了，不需要做两边单调栈，直接从左到右扫，出栈时右侧是新元素，左侧是新栈顶，再插入新元素即可。

## 代码

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<vector<int>> a(n + 1, vector<int>(m + 1));
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            char c;
            fr(c), a[i][j] = (c == 'F');
        }
    }
    vector<int> h(m + 1);
    int ans = 0;
    for (int i = 1; i <= n; ++i) {
        vector<int> s(m + 1, m + 1), p(m + 1);
        for (int j = 1; j <= m; ++j) h[j] = (a[i][j] ? h[j] + 1 : 0);
        stack<int> st;
        for (int j = 1; j <= m; ++j) {
            while (st.size() && h[st.top()] > h[j]) s[st.top()] = j, st.pop();
            st.emplace(j);
        }
        while (st.size()) st.pop();
        for (int j = m; j >= 1; --j) {
            while (st.size() && h[st.top()] > h[j]) p[st.top()] = j, st.pop();
            st.emplace(j);
        }
        for (int j = m; j >= 1; --j) ans = max(ans, h[j] * (s[j] - p[j] - 1));
    }
    fwn(ans * 3);
}
```
