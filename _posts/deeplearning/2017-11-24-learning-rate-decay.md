---
title: Learning rate decay
categories: dl
layout: post
mathjax: true
---

{% include toc.html %}

# Introduction

Learning rate decay may help speed up the algorithm. In a mini batch gradient descent, each mini batch adds some noise, this is minimized by taking a [running average](/_posts/deeplearning/2017-11-23-running-average.md) of the mini batches. With [momentum, RMSprop and Adam](/_posts/deeplearning/2017-11-23-gradient-momentum-with-adam.md) we can increase the learning rate ($$\alpha$$) without adding much noise. 

A larger alpha helps speed up the algorithm by increasing momentum, but it never lets the algorithm converge and may just *wander around the optima without converging*. 

Slowly reducing learning rate ($$\alpha$$) every epoch has the following advantages

- The learning rate is large enough during the initial stages to ensure faster learning
- The learning rate gradually reduces (decays) every epoch thus converging to optima.

# Algorithm

$$
learning \ rate \ (\alpha) \ = \ \frac{1}{1 + decay\_rate*epoch\_num} \alpha_{0}
$$

Here,

- $$\alpha$$ The learning rate that is a function of epoch number.
- decay-rate is another parameter (like `1`) to be tuned, that controls the rate at which $$\alpha$$ reduces (decays).
- epoch-num gives the current count of the epoch (`epoch-num = epoch-index + 1`).



# Other learning rate decay algorithms

## Exponential decay

$$
\alpha \ = \ k^{epoch\_num} \alpha_{0} \ \ \ where \ k < 1
$$

## Decay as function of mini batch counter (t)

$$
\alpha \ = \frac{k}{\sqrt{t}} \ \alpha_{0} \ \ \ where \ k < 1
$$

## Discrete staircase

Reduce alpha by a fixed rate after every `n` steps of `t`.