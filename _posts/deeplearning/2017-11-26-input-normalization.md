---
title: Input normalization
categories: dl
layout: post
mathjax: true
---

{% include toc.html %}

# Introduction

Input normalization will seed up learning. When there is huge range among features -- For example, some features ranging from 0 to 1 while others ranging from 0 to 1000 -- learning becomes slow.



## Algorithm

Each input feature vector $$x$$ with $$m$$ dataset size is normalized as follows

$$
\mu = \frac{\sum^{m}_{j=1}x^{(j)}}{m} \\
\sigma^{2} = \frac{ \sum^{m}_{j=1}({x^{(j)} - \mu})^{2} }{m} \\
\forall^{m}_{j=1} \ x^{(j)} := \frac{x^{(j)} }{ \sigma^{2}}
$$

