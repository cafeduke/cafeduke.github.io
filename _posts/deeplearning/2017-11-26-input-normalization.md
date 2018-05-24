---
layout: post
title: Input normalization
categories: dl
mathjax: true
---

{% include toc.html %}

# Introduction

Input normalization will seed up learning. When there is huge range among features -- For example, some features ranging from 0 to 1 while others ranging from 0 to 1000 -- learning becomes slow.



# Algorithm

Each input feature vector $$x$$ with $$m$$ dataset size is normalized as follows

$$
\mu = \frac{1}{m}\sum^{m}_{j=1}x^{(j)} \\
\sigma^{2} = \frac{1}{m} \sum^{m}_{j=1}({x^{(j)} - \mu})^{2} \\
\forall^{m}_{j=1} \ x^{(j)} := \frac{x^{(j)} }{ \sigma^{2}}
$$

# How input normalization speeds learning?

Say, two input features say x1 and x2 have ranges like 0-1 and 0-1000. 

- This shall result in contours that are very elliptical (elongated bowl) rather than circular (round bowl).   
- Gradient descent will require a lot of steps before it can reach the optima.