---
title: Vanishing and exploding gradients problem
categories: dl
layout: post
mathjax: true
---

{% include toc.html %}

# Introduction

In NN, especially deep neural networks the derivative can get exponentially small or exponentially large referred to as vanishing or exploding gradient respectively. 

# Basic components of NN

## Gradient descent

Gradient descent involves iterating over

- Finding the gradient $$dW = \frac{\partial J}{\partial W}$$ of the weights $$w$$ and bias $$b$$ w.r.t the cost function $$J(w,b)$$ so as to minimize the cost function. 
- Update the weights with the gradient

$$
\begin{aligned}
& foreach \ W \ across \ layers \ \ \{ \\
& \ \ \ \ \ \ W = W - \alpha \frac{\partial}{\partial W} (J) \\
& \}
\end{aligned}
$$

If the gradient (derivatives matrix $$dW$$) becomes small, gradient descent and hence the learning shall become very slow referred to as **vanishing gradient**.

## Activation Functions

| Function | g(z)                                     | Range of g(z)  | g'(z)           | Values for g'(z)   |
| -------- | ---------------------------------------- | -------------- | --------------- | ------------------ |
| sigmoid  | $$\frac{1}{1+e^{-z}}$$                   | $$0 \ to \ 1$$ | g(z) * (1-g(z)) | $$0 \ to \ 0.25 $$ |
| relu     | $$\begin{cases} 0 & z < 0 \\ z & z >= 0  \end{cases}$$ | $$0 \ to \ z$$ | $$0 \ or \ 1$$  | $$0 \ or \ 1$$     |



**Note:**

- The derivative of sigmoid activation function $$g'(z)$$ **ranges** but has a maximum value of $$0.25$$
- The derivative of relu function is **binary**  $$\Rightarrow$$  either 0 or 1

# Analyzing NN with 4 layers

Lets take an example of neural network that has 4 layers and see how the equations for back prop expand.

![4LayerNN]({{"/assets/images/4LayerNN.jpg" | absolute_url}}) 

## Forward propagation

### Generic Equation

The generic equation for forward propagation is as follows. Here, g(z) is an activation function such as sigmoid, tanh,  relu or softmax function
$$
\begin{aligned}
Z_{l} &= W_{l}*A_{l-1} + b_{l} \\
A_{l} &= g(Z_{l})
\end{aligned}
$$

### Equations for the layers

The equation can be extended to various layers as follows:

| Layer 1            | Layer 2             | Layer 3               | Layer4              |
| ------------------ | ------------------- | --------------------- | ------------------- |
| $$Z1 = W1*X + b1$$ | $$Z2 = W2*A1 + b2$$ | $$Z3 = W3 * A2 + b3$$ | $$Z4 = W4*A3 + b4$$ |
| $$A1=g(Z1)$$       | $$A2=g(Z2)$$        | $$A3=g(Z3)$$          | $$A4=g(Z4)$$        |


## Back propagation
### Generic Equation

The equations of the back propagation can be derived by differentiating (and then generalizing) the equations tabulated above.
$$
\begin{aligned}
dW_{l} &= dZ_{l} * A_{l-1} \\
dZ_{l} &= dA_{l} * g'(Z_{l}) = dZ_{l+1} * W_{l+1} * g'(Z_{l}) \\
db_{l} &= dZ_{l}
\end{aligned}
$$

### Equations for the layers

| Layer 1                                 | Layer 2                                 | Layer 3                                 | Layer4                          |
| --------------------------------------- | --------------------------------------- | --------------------------------------- | ------------------------------- |
| $$dW_{1} = dZ_{1}*X$$                   | $$dW_{2} = dZ_{2}*A_{1}$$               | $$dW_{3} = dZ_{3}*A_{2}$$               | $$dW_{4} = dZ_{4}*A_{3}$$       |
| $$dZ_{1} = dZ_{2} * W_{2} * g'(Z_{1})$$ | $$dZ_{2} = dZ_{3} * W_{3} * g'(Z_{2})$$ | $$dZ_{3} = dZ_{4} * W_{4} * g'(Z_{3})$$ | $$dZ_{4} = dA_{4} * g'(Z_{4})$$ |



### Solving for $dW_{1}$ 

$$
\begin{aligned}
dW_{1} &= dZ_{1} * X \\
       &= dZ_{2} * X * W_{2} * g'(Z_{1}) \\
       &= dZ_{3} * X * W_{2} * W_{3} * g'(Z_{1}) * g'(Z_{2})  \\
       &= dZ_{4} * X * W_{2} * W_{3} *  W_{4} * g'(Z_{1}) * g'(Z_{2}) * g'(Z_{3})  \\
\end{aligned}
$$

# Vanishing gradient

## Why sigmoid activation may cause vanishing gradient?

Expanding forward propagation for 
$$
\begin{aligned}
dW_{1} &= dZ_{1} * X \\
       &= dZ_{2} * X * W_{2} * g'(Z_{1}) \\
       &= dZ_{3} * X * W_{2} * W_{3} * g'(Z_{1}) * g'(Z_{2})  \\
       &= dZ_{4} * X * W_{2} * W_{3} *  W_{4} * g'(Z_{1}) * g'(Z_{2}) * g'(Z_{3})  \\
\end{aligned}
$$
Expanding the equation for the gradient  $$dW1$$ for a 4 layered neural network gives us the following equation.

$$
dW_{1}= dZ_{4} * X * W_{2} * W_{3} *  W_{4} * g'(Z_{1}) * g'(Z_{2}) * g'(Z_{3})
$$

**Note** 

- Weights $$W$$ generally have a value less than 1  
- If sigmoid activation function is used g'(Z) will have a max value of 0.25 Essentially, both W and g'(Z) shall be values less than 1. 

$$
dW \tilde= (x < 1)^{2(l-1)}
$$

- In a deep neural network, the value of $$l$$ may be reach 50 or more which will make the derivative insignificant resulting in vanishing gradient.

## How relu activation prevents vanishing gradient?

The derivative is g'(z) in case of relu is either 0 or 1. When the derivative is 1 (which is mostly the case since z is rarely negative), The equation for 4 layer neural network boils down to the following

$$
dW_{1}= dZ_{4} * X * W_{2} * W_{3} *  W_{4} * 1 * 1 * 1
$$
This reduces the effect of raising a value less than 1 to ha high power. Thus working well even for deeper networks.

# Exploding gradient

## How higher weights results in exploding gradient?

**Forward Propagation**: Expanding the equation for the forward propagation  $$Z_{4}$$ for a 4 layered neural network gives us the following equation.

For simplification, consider the following

- Ignore bias term $$b$$
- g(z)  = z. Hence $$A_{l} = g(Z_{l}) = Z_{l}$$

$$
\begin{aligned}
Z_{4} &= A_{3} * W_{4} \\
      &= Z_{3} * W_{4} \\
      &= A_{2} * W_{4} * W_{3} \\
      &= Z_{2} * W_{4} * W_{3} \\
      &= A_{1} * W_{4} * W_{3} * W_{2} \\
      &= Z_{1} * W_{4} * W_{3} * W_{2} \\
      
\end{aligned}
$$

**Back Propagation**: Expanding the equation for the gradient  $$dW1$$ for a 4 layered neural network gives us the following equation.
$$
dW_{1}= dZ_{4} * X * W_{2} * W_{3} *  W_{4} * g'(Z_{1}) * g'(Z_{2}) * g'(Z_{3})
$$
**Note**:

- Even if W is slightly greater than 1, the value of Z shall increase exponentially with deeper NN.
- With greater Z the value of dZ  shall increase
- From back propagation equation we find the value of dW shall increase resulting in **exploding gradient**.

## Initializing weights to mitigate gradient explosion

The following weight initialization has worked well in a neural network for a given layer $$l$$. Different weight initialization methods have worked well for different activation functions as given below.



| Activation function | Weight initialization                    |
| ------------------- | ---------------------------------------- |
| Relu                | $$W_{l} = random() * \sqrt{\frac{2}{n_{l-1}}}$$ |
| tanh                | $$W_{l} = random() * \sqrt{\frac{1}{n_{l-1}}}$$ |




Here,

- $$W_{l}$$ is the weights for the $$l^{th}$$ layer

- $$n_{l-1}$$ gives the number of neurons in layer  $$l$$

- random() returns a random float between 0 and 1

>
> Initialization for tanh is called Xavier initialization
>