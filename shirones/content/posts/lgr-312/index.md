---
title: LGR-312(Div. 3) 做题记录
published: 2026-10-24
description: 模拟、计数、手写链表
tags: [模拟赛, 洛谷, Div. 3]
category: 题解
lang: zh_CN
draft: false
---

首次 AK Div. 3，不过榜爷们太神了，勉强 rk48。T4 太神秘了，不知道为什么要考一道手写链表的题，写的非常难受。

## [A 生存大师](https://www.luogu.com.cn/problem/P17760)

签到题略。

```cpp
void solve() {
    int n, a, b;
    fr(n, a, b);
    vector<int> s(n + 1);
    frn(s, n);
    for (int i = 1; i <= n; ++i) {
        if (s[i] == 1) {
            if (a) --a;
            else if (b) --b;
            else return fwn(i - 1);
        } else {
            if (b) --b;
            else return fwn(i - 1);
        }
    }
    fwn(n);
}
```


## [B 红石大佬](https://www.luogu.com.cn/problem/P17761)

**题意：** 给一个 $2\times n$ 网格，在其中选择 $k$ 个格子。考虑其他空格，如果相邻 $4$ 格有被标记的，那么获得 $1$ 分。求最大分值。

有一定细节的模拟题。首先注意到一定要选 **恰好** $k$ 格，而不是不超过 $k$ 格。考虑根据 $n$ 奇偶分类，注意到最优摆法都是走“马”步，也就是摆一半的格子数。多余的格子就直接从答案里扣就行。记得特判，以及判断偶数情况是否顶到边上决定要不要减去一。

```cpp
void solve() {
    ll n, k;
    fr(n, k);
    if (!k) return fwn(0);
    if (k == (n << 1)) return fwn(0);
    if (n == 1 && k == 1) return fwn(1);
    if (n == 2 && k <= 2) return fwn(2);
    if (n & 1) {
        ll lf1 = max(0ll, k - (n >> 1) - 2), lf2 = max(0ll, k - ((n + 1) >> 1));
        fwn(max(min(k, n >> 1) * 3 - lf1, min(k, (n + 1) >> 1) * 3 - 2 - lf2));
    } else {
        ll lf = max(0ll, k - (n >> 1) - 1);
        fwn(3 * min(k, n >> 1) - (k >= (n >> 1)) - lf);
    }
}
```




## [C 跑酷大神](https://www.luogu.com.cn/problem/P17762)


**题意：** 给定长度为 $2n$ 的正整数数列，考虑其所有排列（注意相同的数交换位置算不同的排列）$b_i$ 中 $[b_{2k-1},b_{2k}]$ 的交集长度之和。

计数+贪心构造题。不难，但思路挺有意思。

首先排个序，不难发现最终交集为空或为 $[a_n,a_{n+1}]$，直接将 $n$ 前的元素和 $n$ 后的元素进行匹配，然后前后关系也无法确定。最终答案为 $|a_{n+1}-a_n|(n!)^22^n$。

```cpp
void solve() {
    int n;
    fr(n);
    vector<int> a(n << 1 | 1);
    frn(a, n << 1), ranges::sort(a);
    ll ans = abs(a[n + 1] - a[n]);
    for (int i = 1; i <= n; ++i) ans = ans * 2ll * i % mod * i % mod;
    fwn(ans);
}
```



## [D 建筑大佬](https://www.luogu.com.cn/problem/P17763)

**题意：** 给定长度为 $n$ 的三个正整数组 $a_i,b_i,c_i$，三种操作 $op,x,y,z$，操作一将所有 $a_i=x$ 对应位置的 $b_i$ 改为 $y$，$c_i$ 改为 $z$，其他操作同理。每次操作后分别求出当前三个数列的和。

这道题让我对这场比赛的印象差了不少，前面都是（尤其 C）是比较有意思的小清新题，这个题除了手写链表好像没有别的更好写的做法，写得我非常难受。

首先我们发现如果两个位置的三个数组对应相等，则之后的操作没办法将其分开，也就是说我们可以将三个数组压在一个 `ull` 里，每个记录包含的大小。此后的操作只能将多个 `ull` 段落合并而不能分裂。然后考虑如何快速寻找某一数列值为指定 $x$ 的位置。我们可以建立一个链表将这些相同元素的下标装进去，之后修改时只需要修改链表的表头连接到新的位置就行。答案更新只需要利用前面维护的大小就行。最终复杂度 $O(n\log n)$，因为处理前要排序方便寻找相同位置。

```cpp
const int N = 1e6 + 5;
const ull mask = (1 << 20) - 1;
int head[3][N], tot;
struct node {
    int a, b, c, cnt, nxt[3];
} nd[N << 1];
inline void insert(int x, int d, int v) {
    nd[x].nxt[d] = head[d][v], head[d][v] = x;
}
void init() { }
void solve() {
    int n, m;
    fr(n, m), memset(head, -1, sizeof head);
    vector<ull> key(n);
    {
        vector<ull> a(n), b(n);
        fr(a), fr(b);
        for (ull i = 0, c; i < n; ++i)
            fr(c), key[i] = a[i] << 40 | b[i] << 20 | c;
        ranges::sort(a);
    }
    ll sa = 0, sb = 0, sc = 0;
    for (int i = 0, cnt = 1; i < n; i += cnt) {
        for (cnt = 1; i + cnt < n && key[i + cnt] == key[i]; ++cnt);
        ll a = key[i] >> 40, b = (key[i] >> 20) & mask, c = key[i] & mask;
        nd[++tot] = { a, b, c, cnt }, insert(tot, 0, a), insert(tot, 1, b);
        insert(tot, 2, c), sa += a * cnt, sb += b * cnt, sc += c * cnt;
    }
    for (int op, x, y, z; m--;) {
        fr(op, x, y, z);
        ll sum = 0;
        int cur = head[--op][x];
        head[op][x] = -1;
        for (ll nxt, cnt; cur != -1; cur = nxt) {
            nxt = nd[cur].nxt[op], sum += (cnt = nd[cur].cnt);
            if (!cnt) continue;
            if (op == 0) sb -= cnt * nd[cur].b, sc -= cnt * nd[cur].c;
            else {
                sa -= cnt * nd[cur].a;
                op == 1 ? (sc -= cnt * nd[cur].c) : (sb -= cnt * nd[cur].b);
            }
            nd[cur].cnt = 0;
        }
        if (sum) {
            if (op == 0)
                nd[++tot] = { x, y, z, sum }, sb += sum * y, sc += sum * z;
            else if (op == 1)
                nd[++tot] = { y, x, z, sum }, sa += sum * y, sc += sum * z;
            else nd[++tot] = { y, z, x, sum }, sa += sum * y, sb += sum * z;
            insert(tot, 0, nd[tot].a), insert(tot, 1, nd[tot].b);
            insert(tot, 2, nd[tot].c);
        }
        fwn(sa, sb, sc);
    }
}
```

