---
title: Residual Neural Networks
categories: dl-cnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Introduction

Very deep neural network (NN) (100s of layers) are tough to train due to vanishing and exploding gradients problem. This is addressed using **skip connection** or **shortcut connection** $$-$$ Feed activation from one layer to a deeper layer. These skip connections are used to build **ResNets (Residual Neural Networks)**

![RestNetTraining](/assets/images/dl/RestNetTraining.png)

Training regular NN vs ResNets with increase in number of layers

- Regular NN: Training error in theory should decrease however it increases after a point due to vanishing/exploding gradients problem
- ResNets: ResNets do no suffer from the issue and can work with as many as 100s or even 1000s of layers.

# Residual Block

Consider three generic layers $$l, \ l+1 \ and \ l+2$$. Lets begin with the output produced by layer $$l$$ and take it through layers $$l+1$$ and $$l+2$$.

## Plain Block

| Layer   | Input Activation | Z                                           | Output Activation        |
| ------- | ---------------- | ------------------------------------------- | ------------------------ |
| $$l$$   | -                | -                                           | $$a_l$$                  |
| $$l+1$$ | $$a_{l}$$        | $$ z_{l+1} = W_{l+1} \ a_{l} + b_{l+1} $$   | $$a_{l+1} = g(z_{l+1})$$ |
| $$l+2$$ | $$a_{l+2}$$      | $$ z_{l+2} = W_{l+2} \ a_{l+1} + b_{l+2} $$ | $$a_{l+2} = g(z_{l+2})$$ |

## Residual Block

### Skip Connection

In a residual block, the output produced by layer $$l$$ is fed to $$l+2$$ which shall look as follows.

![ResNet](/assets/images/dl/ResNet.png)

| Layer   | Input Activation | Z                                         | Output Activation              |
| ------- | ---------------- | ----------------------------------------- | ------------------------------ |
| $$l+2$$ | $$a_{l+2}$$      | $$z_{l+2} = W_{l+2} \ a_{l+1} + b_{l+2}$$ | $$a_{l+2} = g(z_{l+2} + a_l)$$ |

### Dimension requirement for shortcut connection

In case of ResNets, the output from $$l^{th}$$ layer (that is, $$a_l$$) with $$n_l$$ neurons is fed to $$(l+2)^{th}$$  layer with $$n_{l+2}$$ neurons. In essence, $$l^{th}$$ and the $$(l+2)^{th}$$ layer must have the same number of neurons. This is not a restricting requirement as typically, the neural networks (NN) are designed with **same sized hidden layers**. 

In case the layers are of different dimensions then $$a_l$$ can be multiplied with a suitable weight $$W$$ (which either learns parameters or is just zero padded) to ensure the resultant dimension matches with $$z_{l+2}$$.

# How do ResNets work well on deeper NN?

Lets look at the math of a ResNet

$$
\begin{aligned}
a_{l+2} &= g(z_{l+2} + a_l) \\
a_{l+2} &= g(W_{l+2} \ a_{l+1} + b_{l+2} + a_l) \\
\end{aligned}
$$

Due to vanishing gradient it is possible that  $$W$$  is close to 0. Assuming, negligible bias, 

- In regular NN $$a_{l+2} = g(0) $$ 
- In ResNet $$a_{l+2} = g(a_l) = a_l$$ (Note:  $$a_l$$ is obtained after applying ReLU on $$z_l$$  which is now void of any negative number. g(g(x)) = x, in case of ReLU )

Therefore, it is possible for the $$l+2$$ layer to produce an output same as the $$l$$ layer. Thus, learning identity operation.

> ResNets provides a possibility where a deeper layer can act as an **identity** layer, thus in the worst case scenario they cause no harm. In other scenarios, deeper layers do learn something insightful and benefit NN.  