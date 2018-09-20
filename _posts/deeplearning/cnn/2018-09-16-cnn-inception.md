---
title: Inception Networks
categories: dl-cnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Introduction

Convolution networks involves layers obtained by convolving filters with dimensions like 5x5, 3x3 and 1x1. It also involves pooling layers like max-pool, avg-pool etc. An inception network does them all in a single layer. This makes the architecture complicated, but it works well. Before we get into that we need to understand some building blocks.

# Network in network (Convolution 1x1)

## Concept

 A convolution with a filter of size 1x1 is just like convolving with a filter of any other size. However, it does provide an interesting viewpoint due to which it is also called **network in network**.

- An SOP (sum of products) is performed on the overlapping elements. 
- ReLU operation is performed over the resultant number + bias which then  fills a cell in the output channel. 
- The filter then moves left and down to fill all cells of the output channel.

![Convolution1x1](/assets/images/dl/Convolution1x1.png)

## Viewpoint

A network in network viewpoint of 1x1 convolution

- Consider a single overlapping cube of the input layer as shown in the diagram above.
- Consider each overlapping channel in input layer (marked yellow) to be a neuron. So, there are 32 input neurons.
- If the next layer has 1 neuron there would be 32 connections. Each connection required a weight.
- The filter cube can be visualized to be holding the weights for each of these 32 connections.
- Now, multiple filters relate to multiple neurons of the next layer.

> One overlapping cube of the input layer (1x1x32 = 32 neurons) is fully connected with another layer having **one neuron per filter cube**. The weights of each connection are given by the channels of the filter.

## Use

Pooling Convolution $$-$$ Shrink the height and width. 1x1 Convolution $$-$$ Shrink depth (number of channels) while retaining the height and width.

![Convolution1x1DepthReduction](/assets/images/dl/Convolution1x1DepthReduction.png)



In the above example

- 32 filters each of dimension (1x1x192) is used. (Note: The number of channels in filter must match in input layer.)
- A ReLU activation is applied after each convolution.
- The output layer retains the height and width of the input layer while the number of channels shrinks.

# Inception

An inception layer concatenates several types of convolutions into one layer as illustrated below. To facilitate concatenation, all convolutions should produce **outputs of same height and width** but can differ in the number of output channels.

## Illustration

![InceptionConcept](/assets/images/dl/InceptionConcept.png)



In the above diagram

- 28 x 28 x 64 above 1x1 means $$-$$ 64 filters each of dimension 1 x 1 x 192 was convolved with input to produce 28 x 28 x 64 output volume.  
- Similarly 28 x 28 x 128 above 3x3 means $$-$$ 128 filters each of dimension 3 x 3 x 192 was convolved with input to produce 28 x 28 x 128 output volume.
- Same indicates that appropriate padding was used to ensure output height and width match the input.

## Computation Cost

Consider the following convolution

| Input Layer   | Filter      | Filter Count | Convolution Type | Output Layer |
| ------------- | ----------- | ------------ | ---------------- | ------------ |
| 28 x 28 x 192 | 5 x 5 x 192 | 32           | Same             | 28 x 28 x 32 |

Lets calculate the total number of multiplications required

- To produce one cell in one channel of output layer $$-$$ A filter volume was imposed on input volume and the overlapping elements were multiplied 
- There are 5 x 5 x 192 elements in a filter. Therefore,  5 x 5 x 192 multiplications were required to produce one cell of output volume.
- There are 28 x 28 x 32 cells in output volume. Therefore, total number of multiplications = (5 x 5 x 192) x  (28 x 28 x 32) = 120 million
- Addition cost is almost same as multiplication cost.

> Just a single inception layer is computationally very expensive. 

## Reducing inception cost using bottleneck layer

As seen in the previous section, inception incurs a huge computation cost. This can be reduced by introducing a another layer in between. This layer introduced in between is called a **bottleneck layer** and is obtained after performing 1x1 convolution on input layer.

| Input Layer   | Filter      | Filter Count | Convolution Type | Output Layer |
| ------------- | ----------- | ------------ | ---------------- | ------------ |
| 28 x 28 x 192 | 1 x 1 x 192 | 16           | Regular          | 28 x 28 x 16 |
| 28 x 28 x 16  | 5 x 5 x 16  | 32           | Same             | 28 x 28 x 32 |

Computational cost

- Layer 1: (1 x 1 x 192) x (28 x 28 x 16) = 2.4 million
- Layer 2: (5 x 5 x 16) x (28 x 28 x 32) = 10.0 million

Total computational cost is **12.4 million**

> By using suitable bottleneck layer the computational cost reduced by almost 90%

## Data loss using bottleneck layer

As long as a reasonable size is chosen for the bottleneck layer, the representation size can be shrinked down without hurting the network while improving performance.

# Inception Network

An inception network is a wiring of several **inception blocks**. Each inception block consists of several convolution layers (1x1, 3x3, 5x5) preceded by a bottleneck layer (to reduce computation cost).

![InceptionNetwork](/assets/images/dl/InceptionNetwork.png)

This inception network was developed by Google, also called GoogleNet.



## Inception Block

A single inception block (marked red in the above diagram) consists of the following convolutions.

![InceptionBlock](/assets/images/dl/InceptionBlock.png)



- The Previous Activation block (28 x 28 x 192) is the output block obtained from the previous inception.
- The Previous Activation block is convolved using 1x1 (64 filters), 3x3 (128 filters), 5x5 (32 filters) and max-pool (192 filters)
  - A bottleneck block is added before convolving using 3x3 and 5x5 filters to reduce computation cost.
    - A bottleneck block that shrinks from 192 to 96 channels is added before the 3x3 convolution
    - A bottleneck block that shrinks from 192 to 16 channels is added before the 5x5 convolution
  - A 1x1 convolution is added after max-pool to shrink the number of channels
- Same convolutions are used to ensure the final output volumes have the same height and width
- The output volumes are concatenated to produce the **channel concat** block



## Side branches of Inception Network

In a deep inception network, the output from hidden layers at certain intervals are branched out and are fed to softmax to get a prediction. Thus created branches are referred to as **side branches**. The prediction of side branches are used to understand the features realized by the hidden layers.

