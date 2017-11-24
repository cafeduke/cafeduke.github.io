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
- To reach the optimal point in green, less distance has to covered vertically and more distance has to be covered horizontally. That is, W2 should reduce by small factor while W1 should increase by a large factor.
- Consider W1
  - Lets keep W2 constant resulting in the sliceW1.
  - The curve that we have due to sliceW1 (front view) is gradual (not steep). 
  - Multiplying with a sizable $$\alpha$$, will move W1 towards the green optima (bottom of the bowl)
- Consider W2
  - Lets keep W1 constant resulting in the sliceW2.
  - The curve that we have due to sliceW2 (left view) is at the beginning of the bowl and is steep.
  - Multiplying with same sizable $$\alpha$$, will move W2 past the green optima (side of the bowl)
- Essentially, W1 must increase considerably while W2 should reduce by small amount in each iteration.

# Momentum

Gradient with momentum takes a running average of the derivatives thus reducing the oscillations. For a given mini batch, running average for each layer is calculated as follows:
$$
\begin{gathered}
V_{dW} = \beta V_{dW} + (1 - \beta) dW \\
V_{db} = \beta V_{db} + (1 - \beta) db
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

## Algorithm

$$
\begin{gathered}
S_{dW} = \beta S_{dW} + (1 - \beta) dW^{2} \\
S_{db} = \beta S_{db} + (1 - \beta) db^{2} \\
\\
W = W - \alpha \frac{dW}{\sqrt{S_{dW}+\epsilon}} \\
b = b - \alpha \frac{db}{\sqrt{S_{db}+\epsilon}}
\end{gathered}
$$

RMS prop calculates

- The running average of the square of the derivatives
- Updates the weights by dividing derivative by square root of running average
- $$\epsilon$$ is a very small value like $$10^{-8}$$ to prevent divide by zero.

## Working

When curve is steep, the derivative is large $$dW \ and/or \ db$$, so is $$S_{dW} \ and/or \ $_{db}$$. 

- The division of two relatively large numbers results in a moderate number. 
- This ensures minimal oscillation despite $$\alpha$$ taking higher values.

When curve is gradual, the derivative is small  $$dW \ and/or \ db$$, so is  $$S_{dW} \ and/or \ $_{db}$$. 

- The division of two relatively small numbers results in a moderate number
- This ensures that better acceleration with $$\alpha$$ taking higher values.

Essentially, increasing $$\alpha$$ to increase acceleration among small derivatives won't worsen the larger ones.

# Momentum with Adam

Adam is one of the algorithm that optimizes really well in many cases in NN. Combines momentum and RMSProp.

## Algorithm

$$
\begin{gathered}
V_{dW} = \beta_{1} V_{dW} + (1 - \beta_{1}) dW \\
V_{db} = \beta_{1} V_{db} + (1 - \beta_{1}) db \\
\\
S_{dW} = \beta_{2} S_{dW} + (1 - \beta_{2}) dW^{2} \\
S_{db} = \beta_{2} S_{db} + (1 - \beta_{2}) db^{2} \\
\\
W = W - \alpha \frac{V_{dW}}{\sqrt{S_{dW}+\epsilon}} \\
b = b - \alpha \frac{V_{db}}{\sqrt{S_{db}+\epsilon}}
\end{gathered}
$$

Note 

- $$V_{dW}$$ calculates the running average of the derivative (Like Momentum)
- $$S_{dW}$$ calculates the running average of the square of the derivative (Like RMSProp)
- The weights are updated using a ratio of $$V_{dW}$$ and $$S_{dW}$$
- $$\epsilon$$ is a very small value like $$10^{-8}$$ to prevent divide by zero.



# Bias Correction

Bias correction is not necessary for algorithms that run for many iterations of  `t`. Note that t begins with a value of 1 and keeps incrementing for each mini batch across epochs. 

That is, if there are 2 epochs with 25 mini batches each making a total of 50 mini batches then `t` takes values from 1 to 50. 

However, bias correction can be implemented as follows

$$
\begin{gathered}
V_{dW} := \frac{V_{dW}}{(1 - \beta_{1}^{t})} \\
V_{db} := \frac{V_{db}}{(1 - \beta_{1}^{t})} \\
\\
S_{dW} := \frac{S_{dW}}{(1 - \beta_{2}^{t})} \\
S_{db} := \frac{S_{db}}{(1 - \beta_{2}^{t})} \\
\end{gathered}
$$
