---
title: "P3952 [NOIP 2017 提高组] 时间复杂度"
published: 2026-11-25
description: 小模拟计算给定伪代码时间复杂度
tags: [洛谷, 模拟]
category: 题解
lang: zh_CN
draft: false
---
> 来源：[洛谷 P3952](https://www.luogu.com.cn/problem/P3952)

**题意：** 多测。给一段伪代码，先给行数和预测复杂度。随后 $n$ 行，包含两种代码，`F a x y` 表示一个 `for(int a=x;a<=y;++a)`（`n` 是初始给出的数据范围量），`E` 表示循环结束。判断是否有循环开始结束未匹配或者中间变量重复定义（有就输出 `ERR`），否则判断时间复杂度判断是否正确。

## 思路

小模拟？考虑维护错误标记、跳过标记、一个变量名称桶、一个栈，栈内维护该层新中间变量，是否跳过和是否贡献复杂度。

然后如果是新循环，按照如下顺序：输入，如果错误跳过，判断变量是否重复定义，将给的 `xy` 转换为数字，判断是否造成跳过（`x>y`），判断是否贡献复杂度，将状态入栈。

如果是循环结束，判断是否错误，错误跳过，拿出新状态，更新跳过状态，删除中间变量，如果跳过状态就跳过，然后如果贡献复杂度就还原复杂度。

最后记得特判栈是否为空。

我恨你，模拟题。

## 代码

```cpp
inline void solve() {
    int n, c = 0, r = 0, ans = 0;
    string w;
    cin >> n >> w;
    if (!isdigit(w[2]))
        for (int p = 4; isdigit(w[p]); ++p) c = c * 10 + (w[p] - '0');
    unordered_set<string> us;
    bool e = 0, s = 0;
    us.emplace("n");
    vector<tuple<string, bool, bool>> st;
    while (n--) {
        string op, a, x, y;
        cin >> op;
        if (op == "F") {
            cin >> a >> x >> y;
            if (e) continue;
            if (us.count(a)) e = 1;
            us.emplace(a);
            int dx = 1e9, dy = 1e9;
            bool ay = 0;
            if (isdigit(x[0])) dx = stoi(x);
            if (isdigit(y[0])) dy = stoi(y);
            if (us.count(y) && x != y && !s) ans = max(ans, ++r), ay = 1;
            if (dx > dy && !s) st.emplace_back(a, ay, s = 1);
            else st.emplace_back(a, ay, 0);
        } else {
            if (st.empty()) e = 1;
            if (e) continue;
            auto [a, y, sc] = st.back();
            st.pop_back();
            if (sc) s = 0;
            us.erase(a);
            if (s) continue;
            if (y) --r;
        }
    }
    if (e || st.size()) cout << "ERR\n";
    else cout << (c == ans ? "Yes" : "No") << '\n';
}
```
