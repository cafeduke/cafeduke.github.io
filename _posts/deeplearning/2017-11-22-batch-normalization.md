---
layout: post
title: Batch normalization
categories: dl
mathjax: true
---

{% include toc.html %}

#  Advantages of batch normalization

   - Makes hyper parameter search problem much easier.
   - Makes neural network much more robust. 
   - The choice of hyperparameters that work well is a much bigger range
   - Enable easily train even very deep networks. 

# Problem with deep NN

   - Normalizing the input features (X) can speed up learning
   - In case of deep neural networks (NN), eventually A's that are fed to the next layer become unevenly distributed, slowing learning.
   - Batch normalization deals with normalizing the the Zs so that As are normalized as well.

# Algorithm

Formula, per mini batch

   - For a given mini batch, following is calculated per layer

$$
\begin{gathered}
\mu \ =\beta \mu \ +( 1-\beta ) \ \left[\dfrac{1}{m} \ \sum Z\right] \ \\
\ \\
\sigma ^{2} \ =\beta \sigma ^{2} \ +\ ( 1-\beta )\left[\frac{1}{m} \ \sum ( Z\ -\mu )^{2}\right]\\
\\
Znorm\ =\ \frac{( Z\ -\ \mu ) \ }{\sqrt{\sigma ^{2} \ +\ \epsilon }}\\
\\
\tilde{Z} =\gamma \ Znorm\ +\ \zeta \\
\end{gathered}
$$


   - **Note:**  $$\mu$$ and $$\sigma ^{2} $$ provide the running average per layer across mini batches. This needs to be saved for later. 
   - Here $$\gamma$$ and $$\zeta$$ are learnable parameters, different for each layer

$$
\begin{gathered}
\gamma \ =\gamma \ -\ \alpha \frac{\partial }{\partial \gamma } \ ( J)\\
\zeta \ =\ \zeta \ -\ \alpha \frac{\partial }{\partial \beta } \ ( J)
\end{gathered}
$$

   - Thus obtained $$\tilde{Z}$$ is fed to the activation function.

# Why bias 'b' is not required in BN?
Earlier $$Z = WX + b$$ was used in the calculation of $$Z$$. However in BN $$Z = WX$$ is used.

- Now, the calculation of $$Znorm$$ removes the effect of b (*Yes! entire b vector*)

- Therefore the value of $$Znorm$$ is the same for both  $$Z = WX + b$$ and $$Z = WX$$ making $$b$$ irrelevant.

Why BN works?
Covariance shift : 
      - With deep neural network the statistical distribution (range of inputs) received by internal hidden layers of NN shifts
      - Keeps shifting after every few layers
      - Adjusting to the new distribution range slows learning
   - BN normalizes the input into hidden units
   - Each hidden layer is now like a layer receiving normalized input from X (just like first hidden layer)

# Why regularization effect is seen in BN?

The mean and variance is computed for each mini-batch of Z (not batch), so there is some noise
The Z~ calculated will have some noise as well acting as regularization parameter (similar to dropout)
Therefore larger the batch size, lesser the noise and lesser the regularization effect

# How to use BN at test time?

BN is an algorithm for mini-batches. 
The $$Z$$s are normalized per mini batch. This requires calculating $$\mu$$ and $$\sigma ^{2} $$ **per mini batch**.
In case of test, the entire test set acts as one mini-batch, so, BN cannot be applied as is.

Actually for BN traning
   - Keep a running average of  $$\mu$$ and $$\sigma ^{2} $$  per layer.
   - Use the running average of $$\mu$$ and $$\sigma ^{2} $$ during the training as well.

For BN testing
   - Use the  $$\mu$$ and $$\sigma ^{2} $$  (per layer) obtained from training, for $$\tilde{Z}$$ calculation of the test.
   - The entire test set will act as one mini-batch but will use the   $$\mu$$ and $$\sigma ^{2} $$ got from training.