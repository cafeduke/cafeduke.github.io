---
title: Tensorflow
categories: dl
layout: post
mathjax: true
typora-root-url: ../../
---

{% include toc.html %}

# Introduction

Tensor flow is an open source, flexible, scalable, production-ready, python library that supports **distributed computing** for numerical computation $$-$$ particularly suited for **large scale machine learning**

- Tensor API `tensorflow.contrib.learn` is compatible with SciKit Learn
- **Tensor Board** $$-$$ A great visualization tool
- **Cloud service** to run Tensor flow graphs

## Parallel Execution

- A computation graph is created
- The graph can be broken down to chunks that can be executed in parallel on CPU/GPU

![TensorEquation](/assets/images/TensorEquation.png)

How **big** are we talking about $$-$$ Millions of features `n` with billions of instances `m`