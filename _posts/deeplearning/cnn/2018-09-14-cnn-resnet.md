---
title: Residual Neural Networks
categories: dl-cnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Introduction

Very deep neural network (100s of layers) are tough to train due to vanishing and exploding gradients problem. This is addressed using **skip connections** $$-$$ Feed activation from one layer to a deeper layer. These skip connections are used to build ResNets (Residual Neural Networks)

# Residual Block

Consider three generic layers $$l, \ l+1 \ and \ l+2$$. Lets begin with the output produced by layer $$l$$ and take it through layers $$l+1$$ and $$l+2$$.

| Layer   | Input Activation | Z                                           | Output Activation        |
| ------- | ---------------- | ------------------------------------------- | ------------------------ |
| $$l$$   | -                | -                                           | $$a_{l}$$                |
| $$l+1$$ | $$a_{l}$$        | $$ z_{l+1} = W_{l+1} \ a_{l} + b_{l+1} $$   | $$a_{l+1} = g(z_{l+1})$$ |
| $$l+2$$ | $$a_{l+2}$$      | $$ z_{l+2} = W_{l+2} \ a_{l+1} + b_{l+2} $$ | $$a_{l+2} = g(z_{l+2})$$ |

In a residual block, the output produced by layer $$l​$$ is fed to $$l+2​$$ which shall look as follows.

| Layer   | Input Activation | Z                                         | Output Activation              |
| ------- | ---------------- | ----------------------------------------- | ------------------------------ |
| $$l+2$$ | $$a_{l+2}$$      | $$z_{l+2} = W_{l+2} \ a_{l+1} + b_{l+2}$$ | $$a_{l+2} = g(z_{l+2} + a_l)$$ |

