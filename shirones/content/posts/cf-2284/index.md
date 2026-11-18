---
title: "CF2284 (Div. 2) 做题记录"
published: 2026-11-07
updated: 2026-11-17
description: 数学、数论、构造、Ad-hoc
tags: [Codeforces, 模拟赛, "Div. 2"]
category: 题解
lang: zh_CN
draft: false
---
晚上打这场直接给我气笑了，全是数学猜结论。打完还给我掉分。最神秘。

## [A1. 15K4JR3B (Easy Version)](https://codeforces.com/contest/2284/problem/A1)

**题意：** 给定三个初始在原点的点，每次可以将一个点沿平行坐标轴方向移动一格，求移动不超过 $n$ 次形成的三角形面积最大值。

注意到最终三角形面积为某两个点的一个坐标方向差乘以另一个方向上的剩下一个点到这条边的距离（也就是铅锤高公式）。于是不难发现最优情况就是固定一个点在原点，其他两个点分别沿两个坐标轴移动。由均值不等式不难知道最优情况就是各走一半。

```cpp
void solve() {
    ll n;
    fr(n);
    fwn((n >> 1) * (n - (n >> 1)));
}
```

## [A2. 15K4JR3B (Hard Version)](https://codeforces.com/contest/2284/problem/A2)

**题意：** 在上题基础上给定一个长度为 $n$ 的数组 $a_i$，第 $i$ 步移动 $2^{a_i}$ 距离。求最终三角形面积最大值。

最优依旧是两个点走尽量相同的距离，也就是将这个 $2^{a_i}$ 数组分成最接近的两半。我们先求出总和，然后取一半，每次从数组中选择不超过当前和的最大的一个数，然后减去。类似二进制拆分，不难发现这样是最优的（因为二进制表示是唯一的，如果更大的能取，多个较小的不会更优，你可以先取较大的再用较小的填充空隙。于是可以从大到小贪心）。

```cpp
void solve() {
    int n;
    fr(n);
    vector<ll> a(n + 1);
    for (int i = 1; i <= n; ++i) fr(a[i]), a[i] = 1ll << a[i];
    ranges::sort(a);
    ll s = accumulate(a.begin(), a.end(), 0ll), tmp = 0, st = s >> 1;
    for (int i = n; i >= 1; --i)
        if (st >= a[i]) st -= a[i], tmp += a[i];
    fwn(tmp * (s - tmp));
}
```

## [B. Introduction to the Niche Internet](https://codeforces.com/contest/2284/problem/B)

**题意：** 给定长度为 $n$ 的整数数列 $a_i$，将其调整顺序使得恰好有 $k$ 个满足 $(i-1)a_i\ge\sum_{j=1}^{i-1}a_j$。

初见端倪。神秘构造题。

注意到我们可以直接让前 $k$ 个取递增的最大 $k$ 个数，于是之后只要倒序填数就不可能符合题意，前面递增也一定符合题意。这样就构造出来了。

```cpp
void solve() {
    int n, k;
    fr(n, k);
    vector<int> a(n), ans(n);
    fr(a), ranges::sort(a);
    for (int i = n - k; i < n; ++i) ans[i - n + k] = a[i];
    for (int i = n - k - 1; i >= 0; --i) ans[n - 1 - i] = a[i];
    for (ll i = 1, s = ans[0], t = 1; i < n; ++i) {
        if (i * ans[i] >= s) ++t;
        s += ans[i];
        if (t > k) return fwn("No");
    }
    fwn("Yes"), fwn(ans);
}
```

## [C1. Disgusting + GCD (Constructive Version)](https://codeforces.com/contest/2284/problem/C1)

**题意：** 给定一个长度为 $n$ 的数组 $a_i$，对其进行不超过 $n+10$ 次操作，每次操作选择一个与 $a_i$ 互质的 $x$，并将 $a_i$ 增加 $x$，要求所有 $x$ 的和不超过原本数组的和。操作后的数组应该两两互质或互为因数倍数。求一种可行结果。

神秘题。对每个数找到比他大的最小质数，由于质数之间肯定两两互质，并且和所有比自己小的数互质，于是 $\gcd(x,a_i)=\gcd(a_i+x,a_i)=1$，这个操作是可行的，而且仅需要不超过 $n$ 次。由伯特兰公设，任意正整数 $a$ 都存在质数 $p\in[a,2a]$，所以总和也不超过原本数组的和。

```cpp
const int N = 1e6 + 5;
bool isp[N];
int np[N];
void init() {
    vector<int> prime;
    for (int i = 2; i < N; ++i) {
        if (!isp[i]) prime.emplace_back(i);
        for (int p : prime) {
            if (p * i >= N) break;
            isp[p * i] = 1;
            if (i % p == 0) break;
        }
    }
    for (int i = 1; i < N; ++i) {
        auto it = ranges::lower_bound(prime, i);
        if (it != prime.end()) np[i] = *it;
    }
}
void solve() {
    int n;
    fr(n);
    vector<int> a(n);
    for (int i = 0, x; i < n; ++i) fr(x), a[i] = np[x];
    fwn(a);
}
```

## [C2. Disgusting + GCD (Checker Version)](https://codeforces.com/contest/2284/problem/C2)

**题意：** 给定两个正整数 $a,b$（$a\le b$），每次取 $\gcd(a,x)=1$，然后让 $a$ 增加 $x$，求让 $a$ 变为 $b$ 的最少操作次数，并给出一种操作方案。

最神秘题。

由 Jacobsthal 函数 $h(15)=100$，于是在该题范围中最多有 15 个不同质数的乘积，两个互质的数最大距离为 $100$，于是我们直接分类讨论。如果 $b-a>100$，那么答案是 $2$，直接找到中间的某个互质的数就行。反之，那么中间的数极少，直接暴力建图 bfs 即可。

```cpp
void solve() {
    int a, b;
    fr(a, b);
    if (a == b) return fwn(0);
    if (gcd(a, b) == 1) return fwn(1), fwn(b - a);
    if (b - a > 128) {
        fwn(2);
        for (int i = a + 1; i <= a + 128; ++i)
            if (gcd(a, i) == 1 && gcd(b, i) == 1) return fwn(i - a, b - i);
    } else {
        vector<vector<int>> gr(b - a + 1);
        for (int i = a; i <= b; ++i)
            for (int j = i + 1; j <= b; ++j)
                if (gcd(i, j) == 1) gr[i - a].emplace_back(j - a);
        vector<int> dis(b - a + 1, -1), pre(b - a + 1), ans;
        queue<int> q({ dis[0] = 0 });
        for (int u; q.size();) {
            u = q.front(), q.pop();
            for (int v : gr[u])
                if (dis[v] == -1) dis[v] = dis[u] + 1, q.emplace(v), pre[v] = u;
        }
        for (int p = b - a; p; p = pre[p]) ans.emplace_back(p - pre[p]);
        ranges::reverse(ans), fwn(ans.size()), fwn(ans);
    }
}
```

## [D. The Theorem of Two Cans](https://codeforces.com/contest/2284/problem/D)

**题意：** 通信题。第一次运行给一个长度为 $n-1$ 的 0/1 串，构造一个点数为 $n$ 的连通图（不包含重边、自环）输出。输出后可以进行任意次操作，每次操作选择一个长度为奇数的简单路径，将路径中的任意一条边切断，随后如果路径首尾没有连边就连一条边。第二次运行输入操作后的图，要求还原出原字符串。

第一次做通信题，读题都读半天。

注意到这个操作使路径奇偶不变，我们想到二分图的左右点集路径长度永远为奇数，于是将这些点根据字符串分类，钦定 $n$ 点为 $0$ 就可以建立二分图。如果全部都是 $0$ 就输出一个不是二分图的图就行。

第二次运行时只需要进行二分图染色即可。

```cpp
void solve(string s) {
    if (s == "first") {
        int n;
        fr(n);
        string s;
        fr(s), s = ' ' + s + '0';
        int c0 = 0, c1 = 0;
        for (int i = 1; i <= n; ++i) {
            if (s[i] == '0') c0 = i;
            else c1 = i;
        }
        if (!c1) {
            fwn(n), fwn(1, 3);
            for (int i = 1; i < n; ++i) fwn(i, i + 1);
            return;
        }
        fwn(n - 1), fwn(c0, c1);
        for (int i = 1; i <= n; ++i) {
            if (s[i] == '0' && i != c0) fwn(i, c1);
            else if (s[i] == '1' && i != c1) fwn(i, c0);
        }
    } else {
        int n, m;
        fr(n, m);
        vector<vector<int>> gr(n + 1);
        vector<int> c(n + 1, -1);
        for (int u, v; m--;)
            fr(u, v), gr[u].emplace_back(v), gr[v].emplace_back(u);
        bool f = 0;
        auto dfs = [&](this auto&& self, int u) -> void {
            for (int v : gr[u]) {
                if (c[v] == c[u]) f = 1;
                else if (c[v] != -1) continue;
                else c[v] = c[u] ^ 1, self(v);
            }
        };
        c[n] = 0, dfs(n);
        if (f) {
            for (int i = 1; i < n; ++i) fw(0);
            fw('\n');
        } else {
            for (int i = 1; i < n; ++i) fw(c[i]);
            fw('\n');
        }
    }
}
```