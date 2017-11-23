---
title: Gradient momentum with Adam optimization
categories: dl
layout: post
mathjax: true
typora-copy-images-to: ..\..\assets
---

{% include toc.html %}

# Introduction

Gradient descent with momentum works faster than the regular gradient descent. The idea is to calculate the exponentially weighted average (running average) of the derivatives (from back propagation) and use these to update the weights.

## Why learning rate cannot be increased in gradient descent?

The learning rate controls the momentum with which we are approaching the optima. However increasing the learning rate may cause the descent to oscillate more rather than move towards the optima. 

Think of gradient descent to be a ball moving towards the center of a bowl.

- Weights are altered by ($$\alpha * dW$$). This makes the ball to move to a new position in the next descent.
- If the new position of the ball is more towards the side of the bowl and less towards the center, it results in oscillation.

Essentially, most momentum added by $$\alpha$$ goes sidewards and less downwards which is not useful. 

## Why do we have oscillations with increased alpha?

![Oscillation]({{"/assets/images/Oscillation.jpg" | absolute_url}}) 

In the diagram above, W1 and W2 are two weights based on which the cost contour graph is drawn. 

- Initially, lets say the weights are at point A. 
- To reach the optimal point in green, less distance has to covered vertically and more distance has to be covered horizontally. That is, W2 should reduce by small factor while W1 should reduce by a large factor.
- Consider W1
  - Lets keep W2 constant resulting in the sliceW1 
  - The curve that we have due to sliceW1 (front view) is gradual (not steep). 
  - Multiplying with a sizable $$\alpha$$, will move W1 towards the green optima (bottom of the bowl)
- Consider W2
  - Lets keep W1 constant resulting in the sliceW2 (top view)
  - The curve that we have due to sliceW2 (left view) is at the beginning of the bowl and is steep.
  - Multiplying with same sizable $$\alpha$$, will move W2 past the green optima (side of the bowl)
- Essentially, W1 must increase considerably while W2 should reduce by small amount in each iteration.

# Momentum

Gradient with momentum takes a running average of the derivatives thus reducing the oscillations. For a given mini batch, running average for each layer is calculated as follows:
$$
\begin{gathered}
v_{dW} = \beta v_{dW} + (1 - \beta) dW \\
v_{db} = \beta v_{db} + (1 - \beta) db
\end{gathered}
$$
Thus, calculated running averages  are used to update the weights.

$$
\begin{gathered}
W = W - \alpha v_{dW} \\
b = b - \alpha v_{db}
\end{gathered}
$$

# Momentum with RMSprop

$$
\begin{gathered}
s_{dW} = \beta s_{dW} + (1 - \beta) dW^{2} \\
s_{db} = \beta s_{db} + (1 - \beta) db^{2} \\
W = W - \alpha \frac{dW}{\sqrt{s_{dW}}} \\
b = b - \alpha \frac{db}{\sqrt{s_{db}}}
\end{gathered}
$$

Note: RMS prop calculates

- The running average of the square of the derivatives
- Updates the weights by 
