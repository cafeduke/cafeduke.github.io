---
title: Neural Style Transfer
categories: dl-cnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Introduction

Neural style transfer involves merging a content (C) image (Eg: image of building) with a style (S) image (Eg: painting pattern) to generate (G) a resultant image (Eg: building with painting pattern). In order to achieve a perfect mix of C and S, we need to understand what deep CNN is really learning.

# Cost Function

The problem requirement is to generate an image (G) that is the fusion of content (C) and style (S). To do this we define a cost function and reduce the cost function using gradient descent. 
$$
Cost \ function = J(G) = \alpha \ J(G,C) \ + \beta \ J(G,S)
$$

Generate fusion image G

- Initialize G randomly
- Use gradient descent to minimize cost function $$ G = G - \frac{\partial}{\partial G} J(G)  $$

## Content Cost function

Content cost function is computed by J(G, C). Minimizing this cost will make the result more like the content. 

- Use a pre-trained CNN like like VGG net.
- Let a(l,C) be the activations $$a$$ at layer $$l$$ after passing image $$C$$ 
- Let a(l,G) be the activations $$a$$ at layer $$l$$ after passing image $$G$$


$$
J(G,C) = (\parallel a(l,C) - a(l,G) \parallel)^2
$$

> An activation at a given layer will convert the cube (height, width, channels) into an array.

