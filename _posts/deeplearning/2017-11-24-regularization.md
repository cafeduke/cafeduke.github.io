---
layout: post
title: Regularization
categories: dl
mathjax: true
---

{% include toc.html %}

# L1 and L2 regularization

Regularization is technique to prevent overfitting. 

Cost function for logistic regression is given by
$$
J(w,b) \ = \ -\frac{1}{m} \sum^{m}_{i=1} \left[ y \ log(a) + (1-y) \ log(1-a) \right]
$$
Here,

- $$m$$ is the number of training examples
- $$a$$ is the activation function
- $$y$$ is the expected outcome

## L2 Regularization

L2 regularization is obtained by taking the sum of the squares of all the weights (from all the layers). Using the bias in regularization is not necessary since weights make up majority and adding biases (just a vector per layer) does not change much.

$$
L2 \ Regularization \ = \ \frac{\lambda}{2m}\sum{w^{2}}
$$

Here

- $$\lambda$$ is a regularization factor. Increasing lambda reduces overfitting.

## L1 Regularization

L1 regularization is obtained by adding the weights. Positive and negative weights may sum up to zero resulting in reducing the effect of regularization.

$$
L1 \ Regularization \ = \ \frac{\lambda}{2m}\sum{w}
$$

## L2 Regularization for neural network (NN)

For each layer the derivatives of weights are calculated as follows
$$
Cost \ with \ regularization \ J(w,b) \ = \ -\frac{1}{m} \sum^{m}_{i=1} \left[ y \ log(a) + (1-y) \ log(1-a) \right] + \left[ \frac{\lambda}{2m}\sum{w^{2}} \right] \\
dW := dW + \frac{\lambda}{m} W \\
db := db \\
\ \\
Note: dW \ computes \ \frac{\partial}{\partial W} (L2 \ Regularization) =  \frac{\partial}{\partial W} \left[ \frac{\lambda}{2m}\sum{w^{2}} \right] \ = \ \frac{\lambda}{m}W
$$

## Why increasing $\lambda$ reduces overfitting?

With increase in lambda the weights are penalized. Reducing the weights is analogous to having only a few weights (parameters) which brings it closer to a linear model (more bias and less variance)

$$
\uparrow \lambda \uparrow dW \downarrow W \\
\ \\
Note: W := W - \alpha \ dW
$$


































































































































































