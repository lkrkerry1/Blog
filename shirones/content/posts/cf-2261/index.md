---
title: CF2261(Div. 1+2) 做题记录
published: 2026-10-18
description: 三个小时考试时间救了我属于是，两个钟硬啃E啃出来了之间飞到900名。喜提蓝名！
tags: [模拟赛, Codeforces, Div. 2,题解]
category: 题解
lang: zh_CN
draft: false
---


## [A. Hey, It's Me, Souvlakity](https://codeforces.com/contest/2261/problem/A)

**题意：** 初始将 $1$ 到 $n$ 的整数分给两个人，每轮A给B一个数，B再选一个给回来（可以选同一个数），A希望最终手上的元素中最大值-最小值最大，而B希望最小，问最终的结果是


简单博弈论。

如果A初始拥有的数超过三个，不难发现经过多少轮答案都不会改变，仍然为初始的最大值减最小值（只需一直给中间那个数，而B可以将其返回，且没有办法让答案更小）。如果初始的数只有两个，那么A给出任意一个，B就可以还回去一个与A手上的数相邻的，最终结果为 $1$。如果初始的数只有一个，最终也只有一个，结果为 $0$。

```cpp
void solve() {
    int n, mx = 0, mn = 100, cnt = 0;
    fr(n);
    for (int i = 1; i <= n; ++i) {
        char c;
        fr(c);
        if (c == '1') mx = max(mx, i), mn = min(mn, i), ++cnt;
    }
    fwn(cnt != 2 ? mx - mn : 1);
}
```


## [B. What's the Capital of France?](https://codeforces.com/contest/2261/problem/B)

**题意：** 给定 $n$ 个正整数 $a_i$，每次可以选择一对相邻的数，将较小的数加一，如果相同就不管。求进行任意次（含0）操作后序列按位或最大值。

挺好的贪心练习题，我当时交的时候其实也没把握对不对。

注意到序列顺序并不影响最终答案（因为最终最优情况肯定是变成一个单峰序列，如果变成单峰序列不难发现如果先排序再处理不会比单峰更劣，所以可以直接排个序）。于是我们排序，随后从大到小遍历，每次逐位比较当前数和相邻的更大数，找到第一个二进制位不同的地方。由于当前值较小，只可能是自己是 $0$，相邻位是 $1$，于是可以证明从这一位开始一直到最低位一定可以变成全 $1$。依次统计答案即可。

```cpp
void solve() {
    int n, ans = 0;
    fr(n);
    vector<int> a(n + 1);
    frn(a, n), ranges::sort(a), ans = a[n];
    for (int i = n - 1; i >= 1; --i) {
        for (int j = 30; j >= 0; --j) {
            if (((a[i] >> j) & 1) != ((a[i + 1] >> j) & 1)) {
                ans |= (1 << j) - 1;
                break;
            }
        }
    }
    fwn(ans);
}
```

## [C. I Know About a Million Things](https://codeforces.com/contest/2261/problem/C)

**题意：** 给定 $n$ 个正整数，两个人轮流取数，每次取数只能取 $1$ 个或者和为偶数的几个，没法取的人输。求胜者。

简单博弈论+贪心

不难发现关键情况就是一奇一偶，这是后手必胜，其他情况都可以转化到这个情况，于是先手必胜。再特判掉三个奇数的情况即可。

```cpp
void solve() {
    int n, c0 = 0, c1 = 0;
    fr(n);
    for (int x; n--;) {
        fr(x);
        if (x & 1) ++c1;
        else ++c0;
    }
    if (c0 == 1 && c1 == 1) return fwn("Larpity");
    if (!c0 && c1 == 3) return fwn("Larpity");
    fwn("Moggity");
}
```



## [D1. Come Be My Friend, Don't Be So Scared (Easy Version)](https://codeforces.com/contest/2261/problem/D1)

**题意：** 有一个位于 $[1,n]$ 的整数，你可以设置若干区间来试图找到他（每个区间如果覆盖他输出 $1$ 否则 $0$），求最少区间数。

优秀的构造题。

首先我们注意到一个关键点，一个新增区间能带来两次状态变化。换句话说，某个位置与相邻位置能够被区分相当于有至少一个区间只覆盖其中一个元素，即两者中间是区间端点。不难发现最多需要 $\frac{n+1}2$ 个区间。构造是容易的，只有没有区间端点重合就行。

```cpp
void solve() {
    int n, m, ans = 0;
    fr(n, m);
    if (n == 1) return fwn(0);
    fwn(ans = (n + 1) >> 1);
    for (int i = 1; i <= ans; ++i) fwn(i, i + ans - 1);
}
```



## [E. What Does the Cow Say?](https://codeforces.com/contest/2261/problem/E)

**题意：** 给定一个合法括号串和一个整数 $k$，每次对括号串操作时删除其中连续的一个 `()`，再将整个串包裹到一对括号中。求不超过 $k$ 次操作后串中的最长连续左括号长度是多少。

顶级构造+二分题，相当难的综合题。

首先我们发现这个问题可以进行等效成树上问题：将连续的 `()` 当成叶子节点，每个节点的子节点就是该对括号所包含的内容对应的节点。不难发现题目中的操作相当于将叶子节点删去，随后增加一个节点成为整个森林的根。


接下来再思考答案来源：最终的答案是从任意位置开始每次只向最早的子节点走的最长路径，答案只可能来源于原有的路径的并或是根上与增加的几个根节点的并。分开考虑，如果是内部链，如果长度为 $L$ 存在， $L-1$ 必然存在，即有单调性，可以二分答案查找是否存在长度为 $L$，代价不超过 $k$ 的内部链。若链为 $u\rightarrow v$，代价为 $dfn_v-dfn_u-L+1$。如果是到 $u$ 的长为 $L$ 的根部链（未计算增加的 $k$）则代价为 $u$ 之前点个数除去这条保留的链条， 即 $dfn_u-L$。即我们只需要关注某一个深度的点 `dfn` 最小是多少，记作 $mp_d$，显然有 $mp_{d+1}\ge mp_d+1$，所以 $mp_L-L$ 单调不降，可以二分得到符合条件的最大 $L$。

最终答案就是两种情况的较大值（根部链要加 $k$ 而且不能超过总的左括号个数）

```cpp
void solve() {
    int n, k, tot = 0;
    fr(n, k);
    string s;
    fr(s);
    vector<vector<int>> gr((n >> 1) + 1);
    vector<int> rt, st, dep((n >> 1) + 1);
    for (auto c : s) {
        if (c == '(') {
            dep[++tot] = st.size() + 1;
            if (st.size()) gr[st.back()].emplace_back(tot);
            else rt.emplace_back(tot);
            st.emplace_back(tot);
        } else st.pop_back();
    }
    auto check = [&](int mid) {
        vector<int> fa;
        auto dfs = [&](this auto&& self, int u) -> bool {
            fa.emplace_back(u);
            bool f = 0;
            if (fa.size() >= mid && u + 1 - fa[fa.size() - mid] - mid <= k)
                f = 1;
            else
                for (int v : gr[u])
                    if (!f && self(v)) f = 1;
            return fa.pop_back(), f;
        };
        for (int r : rt) {
            fa.clear();
            if (dfs(r)) return true;
        }
        return false;
    };
    int l = 1, r = n >> 1;
    while (l < r) {
        int mid = (l + r + 1) >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    int ans = l, maxd = *ranges::max_element(dep);
    vector<int> mp(maxd + 2, 1e9);
    for (int i = 1; i <= (n >> 1); ++i) mp[dep[i]] = min(mp[dep[i]], i);
    for (l = 1, r = maxd + 1; l < r;) {
        int mid = (l + r + 1) >> 1;
        if (mp[mid] <= k + mid) l = mid;
        else r = mid - 1;
    }
    fwn(max(ans, min(n >> 1, l + k)));
}
```