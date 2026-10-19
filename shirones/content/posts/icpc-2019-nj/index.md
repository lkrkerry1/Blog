---
title: ICPC 2019 区域赛南京站重现赛 做题记录
published: 2026-10-15
description: 因数倍数构造、棋盘路径染色计数、数字矩阵最长路径、真假话询问、三角形面积平分。
tags: [模拟赛, 洛谷, xCPC]
category: 题解
lang: zh_CN
draft: false
---


第一次在洛谷上 vp ICPC 的题，基本上会写的都写了，感觉还行。

## [A A Hard Problem](https://www.luogu.com.cn/problem/P17699)



**题意：** 给定一个正整数 $n$，求出最小的 $k$，使得 $1,2,\dots,n$ 中的任意一个大小为 $k$ 的子集中存在两个数互为因数倍数。

签到题。

考虑最大的子集使得不存在互为因数倍数，发现直接取最大的 $\lceil \frac n2\rceil$ 即可，故答案为 $\lceil \frac n2\rceil+1$



## [B Chessboard](https://www.luogu.com.cn/problem/P17700)



**题意：** 给一个矩阵进行路径染色，染色过程中任意两个点经过染色区域的最短路径长度要与原来的曼哈顿距离相等。求染色方案数。

巧妙的组合题。

注意到原题条件相当于不能出现“凹”字形，也就是路径过程中只能形成矩形。由于形成矩形，终点在四个角上，从一个方格开始，每次增加一行或一列，总共 $n+m-2$ 次增加，选择其中的 $n-1$ 次增加行即可。即答案为 $4C_{n+m-2}^{n-1}$。




## [C Digital Path](https://www.luogu.com.cn/problem/P17701)

**题意：** 给一个数字矩阵，求其长度超过 $4$ 且最长的数值连续路径条数。


拓扑 dp。

考虑将数值和位置都相邻的格子连边，然后跑拓扑排序顺便 dp 即可。

```cpp
void solve() {
    int n, m;
    fr(n, m);
    vector<vector<int>> a(n + 1, vector<int>(m + 1)), gr(n * m + 1);
    for (int i = 1; i <= n; ++i) frn(a[i], m);
    auto id = [&](int x, int y) { return (x - 1) * m + y; };
    vector<pair<int, int>> d { { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 } };
    vector<int> idg(n * m + 1), odg(n * m + 1);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            for (auto [di, dj] : d) {
                int x = i + di, y = j + dj;
                if (x > n || x < 1 || y > m || y < 1) continue;
                if (a[i][j] + 1 == a[x][y]) {
                    ++idg[id(x, y)], ++odg[id(i, j)];
                    gr[id(i, j)].emplace_back(id(x, y));
                }
            }
        }
    }
    vector<array<ll, 5>> f(n * m + 1);
    queue<int> q;
    for (int i = 1; i <= n * m; ++i)
        if (!idg[i]) q.emplace(i), f[i][1] = 1;
    ll ans = 0;
    while (q.size()) {
        int u = q.front();
        q.pop();
        for (int v : gr[u]) {
            for (int i = 2; i <= 4; ++i)
                f[v][i] = (f[v][i] + f[u][i - 1]) % mod;
            f[v][4] = (f[u][4] + f[v][4]) % mod;
            if (!(--idg[v])) q.emplace(v);
        }
        if (!odg[u]) ans = (ans + f[u][4]) % mod;
    }
    fwn(ans);
}
```

## [H Prince and Princess](https://www.luogu.com.cn/problem/P17706)

**题意：** 有 $a$ 个人只说真话，$b$ 个人只说假话，$c$ 个人真假都说。求找到某个说真话的人的最少询问次数。

签到题。考虑直接把 $c$ 当作 $b$ 处理，随后问两倍的问题直接选择人数较多的答案，显然符合题意。即答案为 $2(b+c)+1$。记得特判仅有 $a=1$ 时不需询问任何问题。


## [K Triangle](https://www.luogu.com.cn/problem/P17709)

**题意：** 给定三角形三个点和另一个点，求一个在三角形边上的与该点连成的线段将三角形分为两个面积相等的部分。

二分+模拟。个人感觉非常麻烦的一题，有很多浮点数细节要注意。

先特判这个给定点是否在三角形上，然后注意到如果这个点在某条边上而且离该边的某个顶点最近，则另一个点就在这个顶点的对边上。直接做实数域二分答案即可。

```cpp
void solve() {
    pnt a, b, c, p;
    fr(a), fr(b), fr(c), fr(p);
    auto S = [](const pnt& a, const pnt& b, const pnt& p) {
        auto [x1, y1] = a;
        auto [x2, y2] = b;
        auto [x3, y3] = p;
        return 0.5
            * abs(x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2);
    };
    auto inl = [&](const pnt& a, const pnt& b, const pnt& p) {
        return S(a, b, p) < eps && min(a.first, b.first) <= p.first
            && max(a.first, b.first) >= p.first
            && min(a.second, b.second) <= p.second
            && max(a.second, b.second) >= p.second;
    };
    if (!inl(a, b, p) && !inl(b, c, p) && !inl(a, c, p)) return fwn(-1);
    auto mid = [](const pnt& a, const pnt& b) {
        return pnt { (a.first + b.first) * 0.5, (a.second + b.second) * 0.5 };
    };
    auto eq = [&](const pnt& a, const pnt& b) {
        return abs(a.first - b.first) < eps && abs(a.second - b.second) < eps;
    };
    auto dist = [](const pnt& a, const pnt& b) {
        return sqrt((a.first - b.first) * (a.first - b.first)
            + (a.second - b.second) * (a.second - b.second));
    };
    if (inl(b, c, p)) swap(a, c);
    else if (inl(a, c, p)) swap(b, c); // a p b
    if (eq(a, p)) return fwn(mid(b, c));
    if (eq(p, b)) return fwn(mid(a, c));
    if (eq(p, mid(a, b))) return fwn(c);
    if (dist(a, p) < dist(p, b)) swap(a, b); // a      p b
    ldb pa = dist(a, p), ac = dist(a, c), ti = dist(a, b) * ac, l = 0, r = ac;
    auto check = [&](ldb mid) { return (mid * pa * 2 <= ti); };
    while (r - l > eps) {
        ldb mid = (l + r) / 2;
        if (check(mid)) l = mid;
        else r = mid;
    }
    fwn(a.first - (a.first - c.first) * l / ac,
        a.second - (a.second - c.second) * l / ac);
}
```
