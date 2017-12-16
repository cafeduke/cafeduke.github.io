---
title: Neural network math
categories: dl
layout: post
mathjax: true
---

{% include toc.html %}

# Introduction

In order to compute the equations for forward and back propagation, consider the a 4 layer neural network  as given below.

![4LayerNN]({{"/assets/images/4LayerFullNN.png" | absolute_url}}) 

## Convention

| Item        |          Dimension           | Detail                                   |
| ----------- | :--------------------------: | ---------------------------------------- |
| $$l$$       |              -               | Layer index                              |
| $$L$$       |              -               | Total number of layers = Number of hidden layers + output layer |
| $$n_{l}$$   |              -               | Number of neurons in $$l^{th}$$ layer    |
| $$n_{L}$$   |                              | Number of neurons in the last layer. That is, $$l = L$$ |
| $$m$$       |              -               | Number of training examples.             |
| $$X$$       |        $$n \times m$$        | Input dataset. Each column is an example with n features. |
| $$Y$$       |      $$n_{L} \times m$$      | Expected output dataset.                 |
| $$W_{l}$$   | $$n_{l}  \ \times\ n_{l-1}$$ | The weight matrix                        |
| $$Z_{l}$$   |      $$n_{l} \times m$$      | $$l^{th}$$ layer receiving inputs from previous layer |
| $$A_{l}$$   |      $$n_{l} \times m$$      | $$l^{th}$$ activation layer. Input layer for the next layer. |
| $$A_{L}$$   |      $$n_{L} \times m$$      | Last activation layer                    |
| $$P * Q$$   |                              | Matrix multiplication between matrix $$P$$ and matrix $$Q$$ |
| $$(P)^{T}$$ |                              | Transpose of $$P$$                       |

# Forward Propagation

## Generic Equation

The generic equation for forward propagation is as follows. Here, g(z) is an activation function such as sigmoid, tanh,  relu or softmax function
$$
\begin{aligned}
Z_{l} &= W_{l}*A_{l-1} + b_{l} \\
A_{l} &= g(Z_{l})
\end{aligned}
$$

## Equations for the layers

The equation can be extended to various layers as follows:

| Layer 1                     | Layer 2                         | Layer 3                           | Layer4                          |
| --------------------------- | ------------------------------- | --------------------------------- | ------------------------------- |
| $$Z_{1} = W_{1}*X + b_{1}$$ | $$Z_{2} = W_{2}*A_{1} + b_{2}$$ | $$Z_{3} = W_{3} * A_{2} + b_{3}$$ | $$Z_{4} = W_{4}*A_{3} + b_{4}$$ |
| $$A_{1}=g(Z_{1})$$          | $$A_{2}=g(Z_{2})$$              | $$A_{3}=g(Z_{3})$$                | $$A_{4}=g(Z_{4})$$              |



# Cost Function

The cost function comparing the output of the last layer $$ A_{L}$$ and expected output layer $$Y$$ is given  as follows.

$$
J = J(w,b) =  -\frac{1}{m} \sum^{m}_{i=1} \left[ \ \sum^{n_{L}}_{j=1} \left[ \ Y \ log(A_{L}) + (1-Y) \ log(1-A_{L}) \ \right] \ \right]
$$

# Gradient descent

Gradient descent involves minimizing the cost function (*or error function*) $$J$$

- Finding the gradient $$dW = \frac{\partial J}{\partial W}$$ of the weights $$w$$ and $$db = \frac{\partial J}{\partial b}$$ of bias b w.r.t the cost function $$J(w,b)$$ so as to minimize the cost function. 
- Update the weights with the gradient

$$
\begin{aligned}
& foreach \ (W,b) \ across \ layers \ 1 \ to \ L \ \{ \\
& \ \ \ \ \ \ W := W - \alpha \ dW \\
& \ \ \ \ \ \ b := b - \alpha \ db \\
& \}
\end{aligned}
$$

>
> In order to proceed with gradient descent we need $$dW$$ and $$db$$ for each layer
>

# Back Propagation

Considering the 4 layer NN, we need to compute $$dW_{1}, \ dW_{2},  \ dW_{3}  \ and  \ dW_{4}$$ along with $$db_{1}, \ db_{2},  \ db_{3}  \ and  \ db_{4}$$

Now, $$dW_{1} = \frac{\partial J}{\partial W_{1}}$$ is basically how small changes to $$W_{1}$$ affects the cost function. Changes to $$W_{1}$$ result in corresponding changes to  $$Z_{1}$$ which in-turn affects A_{1} and so on as shown below

$$
\begin{aligned}
&
W_{4} \xrightarrow{affects} 
Z_{4} \xrightarrow{affects} 
A_{4} \xrightarrow{affects}
J \\

&
b_{4} \xrightarrow{affects} 
Z_{4} \xrightarrow{affects} 
A_{4} \xrightarrow{affects}
J \\ \\
&
W_{3} \xrightarrow{affects} 
Z_{3} \xrightarrow{affects} A_{3} \xrightarrow{affects}
Z_{4} \xrightarrow{affects} A_{4} \xrightarrow{affects}
J
\\
&
b_{3} \xrightarrow{affects} 
Z_{3} \xrightarrow{affects} A_{3} \xrightarrow{affects}
Z_{4} \xrightarrow{affects} A_{4} \xrightarrow{affects}
J \\
.\\
.\\
.\\
&
W_{1} \xrightarrow{affects} 
Z_{1} \xrightarrow{affects} A_{1} \xrightarrow{affects}
Z_{2} \xrightarrow{affects} A_{2} \xrightarrow{affects}
Z_{3} \xrightarrow{affects} A_{3} \xrightarrow{affects}
Z_{4} \xrightarrow{affects} A_{4} \xrightarrow{affects}
J
\\
&
b_{1} \xrightarrow{affects} 
Z_{1} \xrightarrow{affects} A_{1} \xrightarrow{affects}
Z_{2} \xrightarrow{affects} A_{2} \xrightarrow{affects}
Z_{3} \xrightarrow{affects} A_{3} \xrightarrow{affects}
Z_{4} \xrightarrow{affects} A_{4} \xrightarrow{affects}
J
\end{aligned}
$$

So in order to compute $$dW_{1}$$ we need to start with $$dA_{4}$$ and then move on to $$dZ_{4}$$ and work our way backwards.

## Compute $$ dA_{L} $$

Here, $$ dA_{L} = dA_{4} $$

$$
\begin{aligned}
dA_{4} &= \frac{\partial J}{\partial A_{4}} \\
&=  -\frac{1}{m} \sum^{m}_{i=1}  \sum^{n_{L}}_{j=1} \left[  \frac{\partial}{\partial A_{4}} \left[ Y \ log(A_{4}) + Y (1-Y) \ log(1-A_{4}) \ \right ] \right ]\\

&= -\frac{1}{m} \sum^{m}_{i=1}  \sum^{n_{L}}_{j=1} \left[ Y \frac{\partial}{\partial A_{4}} log(A_{4}) + (1-Y)\frac{\partial}{\partial A_{4}}log(1-A_{4}) \right] \\

&=  -\frac{1}{m} \sum^{m}_{i=1}  \sum^{n_{L}}_{j=1} \left[ \frac{Y}{A_{4}} + \frac{1-Y}{1-A_{4}} \right] \\
\end{aligned}
$$

> In general, 
> $$ dA_{L} \ =  -\frac{1}{m} \sum^{m}_{i=1}  \sum^{n_{L}}_{j=1} \left[ \frac{Y}{A_{L}} + \frac{1-Y}{1-A_{L}} \right]  $$
>
> In short,
> $$  dA_{L} \ =  -\frac{1}{m} \sum \left[ \frac{Y}{A_{L}} + \frac{1-Y}{1-A_{L}} \right]  $$

## Compute $$ dZ_{L} $$

$$
\begin{aligned}
dZ_{4} &=\frac{\partial J}{\partial Z_{4}} \\
&= \frac{\partial J}{\partial A_{4}} \ \frac{\partial A_{4}}{\partial Z_{4}}\\
&= dA_{4} \ \ \frac{\partial }{\partial Z_{4}}[ g( Z_{4})] \ \\
&= dA_{4} \ \  g'( Z_{4}) \\
&= -\frac{1}{m} \sum \left[ \frac{Y}{A_{4}} + \frac{1-Y}{1-A_{4}} \right] \ \  g'( Z_{4})
\end{aligned}
$$

> In general,
> $$ dZ_{L} = dA_{L} \ \ g'(Z_{L})  $$
>
> Substituting the value of $$dA_{L}$$ we get,
> $$  dZ_{L} =  -\frac{1}{m} \sum \left[ \frac{Y}{A_{L}} + \frac{1-Y}{1-A_{L}} \right] \ \  g'( Z_{L}) $$

## Compute $$ dA_{l} $$

$$dA_{l}$$ is computing $$dA$$ of any other layer other than the last layer $$L$$. 

$$
\begin{aligned}
dA_{3} &= \frac{\partial J}{\partial A_{3}} \\
&= \frac{\partial J}{\partial Z_{4}} \ \ \frac{\partial  Z_{4}}{\partial A_{3}} \\
&= dZ_{4} \ \ \frac{\partial }{\partial A_{3}} \left[ Z_{4} \right ] \\
&= dZ_{4} \ \ \frac{\partial }{\partial A_{3}} \left[ W_{4} * A_{3} + b_{4}\right ] \\
&= dZ_{4} \ \  \left[ W_{4} + 0 \right] \\
&= dZ_{4} \ \ W_{4} \\
\end{aligned}
$$

> In general,
> $$ dA_{l} = W_{l+1} \ \ dZ_{l+1}  $$
>
> Vectorization formula,
> $$  dA_{l} = (W_{l+1})^T \ * \ dZ_{l+1} $$
>

## Compute $$ dZ_{l} $$

$$dZ_{l}$$ is computing $$dZ$$ of any other layer other than the last layer $$L$$. 

$$
\begin{aligned}
dZ_{3} &= \frac{\partial J}{\partial Z_{3}} \\
&= \frac{\partial J}{\partial A_{3}} \ \ \frac{\partial  A_{3}}{\partial Z_{3}} \\
&= dA_{3} \ \ \frac{\partial }{\partial Z_{3}} \left[ g(Z_{3})  \right] \\
&= dA_{3} \ \  \left[ g'(Z_{3}) \right] \\
&= dA_{3} \ \ g'(Z_{3}) \\
\end{aligned}
$$

Substituting the value from the general equation for $$dA_{l}$$
$$
\begin{aligned}
dZ_{3} &=  W_{4} \ \ dZ_{4} \ \ g'(Z_{3})   \\
\end{aligned}
$$

> In general,
> $$ dZ_{l} = \ \ W_{l+1} \ \ dZ_{l+1} \ \ g'(Z_{l}) $$
>
> Vectorization formula,
> $$  dZ_{l} = (W_{l+1})^{T} \ * \ dZ_{l+1} \ \ g'(Z_{l}) $$

## Compute $$ dW_{l} $$

$$
\begin{aligned}
dW_{4} &= \frac{\partial J}{\partial W_{4}} \\
&= \frac{\partial J}{\partial Z_{4}} \ \ \frac{\partial  Z_{4}}{\partial W_{4}} \\
&= dZ_{4} \ \ \frac{\partial }{\partial W_{4}} \left[  Z_{4}  \right] \\
&= dZ_{4} \ \ \frac{\partial }{\partial W_{4}} \left[  W_{4} * A_{3} + b_{4}  \right] \\
&= dZ_{4} \ \  \left[ A_{3} \right] \\
&= dZ_{4} \ \ A_{3} \\
\end{aligned}
$$

> In general,
> $$ dW_{l} = dZ_{l} \ \ A_{l-1} $$
>
> Vectorization formula,
> $$  dW_{l} = dZ_{l} \ * \ ( A_{l-1} )^{T} $$

## Compute $$ db_{l} $$
$$
\begin{aligned}
db_{4} &= \frac{\partial J}{\partial b_{4}} \\
&= \frac{\partial J}{\partial Z_{4}} \ \ \frac{\partial  Z_{4}}{\partial b_{4}} \\
&= dZ_{4} \ \ \frac{\partial }{\partial b_{4}} \left[  Z_{4}  \right] \\
&= dZ_{4} \ \ \frac{\partial }{\partial b_{4}} \left[  W_{4} * A_{3} + b_{4}  \right] \\
&= dZ_{4} \ \  \left[ 0 + 1 \right] \\
&= dZ_{4} \\
\end{aligned}
$$

> In general,
> $$ db_{l} = dZ_{l} $$
>

# Formula list

## Forward propagation 

$$
\begin{aligned}
Z_{l} &= W_{l}*A_{l-1} + b_{l} \\
A_{l} &= g(Z_{l})
\end{aligned}
$$

## Back propagation for last layer 

$$
\begin{aligned}
dZ_{L} &=  -\frac{1}{m} \sum \left[ \frac{Y}{A_{L}} + \frac{1-Y}{1-A_{L}} \right] \ \  g'( Z_{L}) \\
\end{aligned}
$$

## Back propagation for other layers

$$
\begin{aligned}
dZ_{l} &= (W_{l+1})^{T} \ * \ dZ_{l+1} \ \ g'(Z_{l}) \\
dW_{l} &= dZ_{l} \ * \ ( A_{l-1} )^{T} \\
db_{l} &= dZ_{l} 
\end{aligned}
$$


