---
title: Classic Convolutional Neural Networks
categories: dl-cnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Introduction

This article details several types of classic convolutional  neural networks that have been successfully used. 

- LeNet-5 
- AlexNet
- VGG

# CNN calculation cases

In this section we see some tips to get the dimension of the next layer in typical cases

## Terminologies

| Term | Detail       | Default                         |
| ---- | ------------ | ------------------------------- |
| $$ n^{l-1}_c $$ | Number of channels in input layer | N/A |
| $$ n^l_c $$ | Number of channels in output layer. This also gives the number of filters. | N/A |
| f    | Filter size  | $$ f \times f \times n^{l-1}_c $$ |
| s    | Stride size  | 1                               |
| p    | Padding size | 0                               |

> Each filter volume of dimension $$ f \times f \times n^{l-1}_c $$  convolves on entire input layer volume to produce one output channel.
> The number of filters required is the same as the number of output layer channels.

## Case: Default

$$
\begin{alignat}{2}
Dimension &=  \left\lfloor  \frac{n+2p-f}{s} + 1  \right\rfloor \\
&= \left\lfloor \frac{n+0-f}{1} + 1 \right\rfloor \\
&= \left\lfloor n-f+1 \right\rfloor \\
&= \left\lfloor n-(f-1) \right\rfloor \\
\end{alignat}
$$

## Case: By2 CNN (f=2x2, s=2)

$$
\begin{alignat}{2}
Dimension &=  \left\lfloor  \frac{n+2p-f}{s} + 1  \right\rfloor \\
&= \left\lfloor \frac{n+0-2}{2} + 1 \right\rfloor \\
&= \left\lfloor \frac{n-2}{2} + 1 \right\rfloor \\
&= \left\lfloor \frac{n}{2} -1 + 1 \right\rfloor \\
&= \left\lfloor \frac{n}{2} \right\rfloor \\
\end{alignat}
$$



## Case: Same Convolution/Pooling

In case of same convolution/pooling, the output layer will have the same height and width as input layer after convolution. This is achieved by appropriately padding the input layer. In same pooling (s = 1)

$$
\begin{alignat}{2}
n_{l-1} &= n_{l} \\
\frac{n+2p-f}{s} + 1  &= n \\
n + 2p - f + 1 &= n \ \ \ (Substituting \ s &= 1)\\
2p -f + 1 &= 0 \\
p &= \frac{f-1}{2}
\end{alignat}
$$

By using a stride of 1 and padding of $$\frac{f-1}{2}$$, the output layer will have the same height and width as input layer. 

- The depth or number of channels in the output layer depends on the number of filters used.
- $$f$$ is typically odd, so $$\frac{f-1}{2}$$ will not be a whole number.

# Classic CNN

## LeNet - 5

The goal of LeNet-5 is to recognize hand written digits. 

- It is trained on gray scale images.
- Has around 60K weights (parameters)
- Uses sigmoid/tanh activation function

![LeNet5](/assets/images/dl/LeNet5.png)



## AlexNet

 Named after Alex Krizhevsky. 

- It has around 60 million parameters
- Uses ReLU activation function

![AlexNet](/assets/images/dl/AlexNet.png)

## VGG-16

- Simplified architecture
- All convolutions are same convolutions $$f = 3 \times 3$$ and $$ s = 1 $$ . Therefore $$p = 1$$
- The pooling used is max-pooling with $$ f = 2 \times 2 $$ and $$ s = 2$$. This is By2 CNN $$-$$ The new width and height will be $$\frac{n}{2}$$

| Sl.  | Input Layer     | Convolution Type | Filter Count | Output Layer    |
| ---- | --------------- | ---------------- | ------------ | --------------- |
| L1   | 224 x 224 x 3   | Same             | 64           | 224 x 224 x 64  |
|      | 224 x 224 x 64  | Max Pool         | 64           | 112 x 112 x 64  |
| L2   | 112 x 112 x 64  | Same             | 128          | 112 x 112 x 128 |
|      | 112 x 112 x 128 | Max Pool         | 128          | 56 x 56 x 128   |
| L3   | 56 x 56 x 128   | Same             | 256          | 56 x 56 x 256   |
|      | 56 x 56 x 256   | Max Pool         | 256          | 28 x 28 x 256   |
| L4   | 28 x 28 x 256   | Same             | 512          | 28 x 28 x 512   |
|      | 28 x 28 x 512   | Max Pool         | 512          | 14 x 14 x 512   |
| L5   | 14 x 14 x 512   | Same             | 512          | 14 x 14 x 512   |
|      |                 | Max Pool         | 512          | 7 x 7 x 512     |
| L6   | 7 x 7 x 512     | Full (NN)        | N/A          | 4096            |
| L7   | 4096            | Full(NN)         | N/A          | 4096            |
| L8   | 4096            | Softmax          | N/A          | 1000            |

