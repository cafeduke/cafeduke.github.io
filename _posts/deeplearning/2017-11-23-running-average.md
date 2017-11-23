---
title: Exponentially Weighted Average
categories: dl
layout: post
mathjax: true
---

{% include toc.html %}

# Introduction

Running average or **exponentially weighted average** is an algorithm for calculating the average of latest 'n' items as we proceed. This is used when new items are being encountered continuously and we need a low cost (performant) way of calculating average (in an incremental fashion) after adding the new item.

# Algorithm

The running average (exponentially weighted average) is calculated as follows

$$
V_{t} \ =\ \beta \ V_{t-1} \ +\ ( 1-\beta ) \ \theta _{t} \ \ where \ \ V_{0}=0
$$

Here,

- $$\ \theta _{t}$$ is the new item added at iteration $$t$$
- $$V_{t}$$ is the running average calculated after $$t$$ iterations
- $$V_{t-1}$$ was the previous running average (i.e the average calculated after $$t-1$$ iterations) 
- $$\beta$$ is the weight we would like to associate to the average calculated thus ( $$V_{t-1}$$ ).
- $$1-\beta$$ is the weight we would like to associate to the new item added  ( $$\theta_{t}$$ ).

# Understanding running average

For better understanding lets write the formula as $$V_{t} \ =\ ( 1-\beta ) \ \theta _{t} + \beta \ V_{t-1} \ $$. Let us expand the algorithm for various values like $$V_{1}, \ V_{2} \ V_{3}$$ and so on to reveal the working.

## Running average expansion


$$
\begin{gathered}
V_{t} \ =( 1-\beta ) \ \theta _{t} \ +\beta V_{t-1} \ \\
\\
V_{1} \ =( 1-\beta ) \ \theta _{1} \ +\beta 0\\
V_{1} \ =\ ( 1-\beta ) \ \theta _{1}\\
\\
V_{2} \ =( 1-\beta ) \ \theta _{2} \ +\beta V_{1}\\
V_{2} \ =\ ( 1-\beta ) \ \theta _{2} \ +\beta \ ( 1-\beta ) \ \theta _{1}\\
\\
V_{3} \ =( 1-\beta ) \ \theta _{3} \ +\beta V_{2}\\
V_{3} \ =\ ( 1-\beta ) \ \theta _{3} \ +\ \beta \ ( 1-\beta ) \ \theta _{2} \ +\ \beta ^{2}( 1-\beta ) \ \theta _{1} \ \ \ \ \ \ \ \\
\\
V_{4} \ =( 1-\beta ) \ \theta _{4} \ +\ \beta V_{3}\\
V_{4} \ =\ ( 1-\beta ) \ \theta _{4} \ +\ \beta \ ( 1-\beta ) \ \theta _{3} \ +\ \beta ^{2}( 1-\beta ) \ \theta _{2} \ +\ \beta ^{3}( 1-\beta ) \ \theta _{1} \ \ \\
\\
V_{5} \ =( 1-\beta ) \ \theta _{5} \ +\ \beta V_{4}\\
V_{5} \ =\ ( 1-\beta ) \ \theta _{5} \ +\ \beta \ ( 1-\beta ) \ \theta _{4} \ +\ \beta ^{2}( 1-\beta ) \ \theta _{3} \ +\ \beta ^{3}( 1-\beta ) \ \theta _{2} +\ \beta ^{4}( 1-\beta ) \ \theta _{1} \ \ \\
\ ...\\
\ ...\\
\ ...\\
\ V_{t} \ =( 1-\beta ) \ \theta _{t} \ +\ \ \beta V_{t-1} \ \ \ \\
\ V_{t} \ =\ ( 1-\beta ) \ \theta _{t} \ \ +\ \beta \ ( 1-\beta ) \ \theta _{t-1} \ +\ \beta ^{2}( 1-\beta ) \ \theta _{t-2} \ \ +\ \ \beta ^{3}( 1-\beta ) \ \theta _{t-3} \ +\ ...+\ \beta ^{t-1}( 1-\beta ) \ \theta _{1} \\
\end{gathered}
$$



## Understanding running average expansion

A typical value for $$\beta$$ would be `0.9`, this makes $$1 - \beta$$ to be `0.1`. With these values substituted in the expansion we get

$$
\begin{gathered}
V_{t} \ =\ 0.1\theta _{t} \ \ +\ 0.9\ ( 0.1) \ \theta _{t-1} \ +\ 0.9^{2}( 0.1) \ \theta _{t-2} \ \ +\ 0.9^{3}( 0.1) \ \theta _{t-3} \ +\ ...+\ 0.9^{t-1}( 0.1) \ \theta _{1} \\

V_{t} \ =\ 0.1\theta _{t} \ \ +\ 0.09 \ \theta _{t-1} \ +\ 0.081 \ \theta _{t-2} \ \ +\ 0.072 \ \theta _{t-3} \ +\ ...+\ 0.9^{t-1}( 0.1) \ \theta _{1} \
\end{gathered}
$$

From the expansion we find that a weight attached to the current temperature is `0.1` and the weight decreases **exponentially** as we go along older (earlier) values of $$\theta$$. This is termed is ***exponential weight decay***

The weight attached to $$\theta_{t-10}$$, that is value of $$\theta$$, `10` items before is $$0.9^{10}(0.1) = 0.034 ~= e^{-1}0.1  $$. This weight is pretty insignificant and adds very little to the sum. Hence, when $$\beta = 0.9$$, a 10 day old value gets a weight close to $$e^{-1}$$, so it is almost like calculating the average for the last 10 items.

In general, for given value of $$\beta$$, the average calculated by the algorithm is given as follows

$$
Number \ of \ items \ averaged = \frac{1}{(1-\beta)}
$$

# Programming Running average 

In a program running average can be calculated as follows

```python
v = 0
beta = 0.9
for theta in thetas:
    v = beta*v + (1-beta)*theta
```

