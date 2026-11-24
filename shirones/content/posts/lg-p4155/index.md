---
title: "P4155 [SCOI2015] 国旗计划"
published: 2026-11-24
description: 倍增+双指针+贪心维护环形区间覆盖
tags: [洛谷, 倍增, 双指针, 贪心]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P4155](https://www.luogu.com.cn/problem/P4155)

**题意：** 给一个有 $m$ 个点的环，上面站着 $n$ 个人，给每个人范围的 $[l_i,r_i]$，分别求出在该人必须保留的前提下最少需要的覆盖整个环的人数。（任意两个人范围不完全包含彼此）

## 思路

先拆环，将人覆盖的范围复制一份增加 $m$，处理环形结构。然后按照左端点从小到大排序。因为题目说不存在完全包含，于是左端点递增时右端点递增。可以双指针贪心得到每个人与自己重叠的最右边的人。将这个放到倍增表上，然后维护从每个人开始贪心移动 $2^k$ 步到的人。

查询答案时只需要贪心向右跳直到达到初始位置左端点加 $m$，也就是覆盖了左端点结束。注意要加二，因为自己必选而且结束位置再向后跳才是结束。

## 代码

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<array<int, 3>> a(n << 1);
    for (int i = 0, x, y; i < n; ++i) {
        fr(x, y);
        if (x > y) y += m;
        a[i] = { x, y, i }, a[n + i] = { x + m, y + m, i };
    }
    ranges::sort(a);
    vector<array<int, 20>> f(n << 1);
    for (int i = 0, j = 0; i < (n << 1); ++i) {
        for (; j + 1 < (n << 1) && a[j + 1][0] <= a[i][1]; ++j);
        f[i][0] = j;
    }
    for (int i = 1; i < 20; ++i)
        for (int j = 0; j < (n << 1); ++j) f[j][i] = f[f[j][i - 1]][i - 1];
    vector<int> ans(n, 2);
    for (int i = 0, k, j; i < n; ++i) {
        for (k = i, j = 19; j >= 0; --j)
            if (a[f[k][j]][1] < a[i][0] + m)
                k = f[k][j], ans[a[i][2]] += (1 << j);
    }
    fwn(ans);
}
```
