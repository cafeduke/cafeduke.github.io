---
title: Introduction to recurrent neural networks (RNN)
categories: dl-rnn
layout: post
mathjax: true
typora-root-url: ../../../
---

DRAFT

------



{% include toc.html %}

# Introduction

Sequence models process inputs that are a function of time (like voice) and produce different types of output (like text) as described below. Sequence models like recurrent neural networks (RNN) have transformed speech recognition, natural language processing (NLP). 

## Application of sequence models

| Application                | Detail                                                  |
| -------------------------- | ------------------------------------------------------- |
| Speech recognition         | Voice to text                                           |
| Music generation           | Genre of music to music                                 |
| Sentiment classification   | Analyze the nature of text. Eg: Text to star rating.    |
| DNA sequence analysis      | DNA sequence to type. Eg: DNA strip to type of protein. |
| Machine translation        | Translate one language to another                       |
| Video activity recognition | Video to description, summary or type of the video      |
| Name entity recognition    | Identify names of people in a text                      |

We see that different types of application of sequence models type various lengths of input ($$x$$)  and produce various lengths of output $$y$$. Music generation, for example, takes a single input (genre) and produces the entire music itself.

## Overview of sequence models

### Typical Model

A typical sequence model consists of input broken into individual tokens, where each token forms a **feature** represented by $$x^{\prec i \succ}$$. Each feature shall have corresponding output represented by $$y^{\prec i \succ}$$. Each feature shall also produce an output activation $$a^{\prec i \succ}$$ which is fed to the next layer $$L_{i+1}$$.

### Notation



![SequenceModel](/assets/images/dl/SequenceModel.png)

| Notation              | Detail                                                       |
| --------------------- | ------------------------------------------------------------ |
| $$x^{\prec i \succ}$$ | $$i^{th}$$ feature input. In a sentence, it would be the $$i^{th}$$ word. |
| $$y^{\prec i \succ}$$ | $$i^{th}$$ feature output. In a sentence, it would be the output after processing the $$i^{th}$$ word. |
| $$ a^{\prec i \succ} $$ | $$i^{th}$$ activation produced after taking $$ x^{\prec i \succ} $$ and $$ a^{\prec i-1 \succ} $$ as inputs |
| $$x$$                 | A single input consisting of all feature. An entire sentence. |
| $$y$$                 | A single output consisting of output of all feature.         |
| $$ X^{ (i)\prec t \succ } $$       | From input matrix X, select $$ t^{th} $$ feature in the  $$i^{th}$$ instance. The $$ t^{th} $$ word in the $$i^{th}$$ sentence  |
| $$ Y^{ (i)\prec t \succ } $$       | From output matrix Y, select $$ t^{th} $$ output in the  $$i^{th}$$ instance. |
| $$T^{(i)}_x$$ | Number of input tokens (features) in the $$ i^{th} $$ instance |
| $$T^{(i)}_y$$ | Number of output tokens in the $$ i^{th} $$ instance |

As we see above, in a sequence model, each instance (a sentence for example) can be of different length. In essence, the number of features (size of $$x$$) and number of output (size of $$y$$) varies for each instance. This is different from all the existing model where the input/output size have been the same across instances.

### Representing a word

Any word $$x^{\prec i \succ}$$ is represented using a **one-hot encoding of the index** at which the word is found in the dictionary. For example, if the word "harry" is found at index 4075 in a dictionary of 10,000 words, then the vector will have all zeros with a one at index 4075.

# Recurrent Neural Network

## Name entity recognition example

Consider the following two sentences

1. He said "Teddy bears are on sale"
2. He said "Teddy Roosevelt was a great president"

Consider a "Name entity recognition" problem where words that are part of human names needs to be identified. For example, the first sentence has 7 words, each acting as a feature. The output is a vector of 7 numbers, one for each feature, indicating if the word is a human name or not. The first sentence shall produce an output $$ y = \left[ 0, 0, 0, 0, 0, 0, 0 \right] $$. The second sentence shall produce the output $$ y = \left[ 0, 0, 1, 1, 0, 0, 0, 0 \right] $$

The model can detect that 'Teddy' (a feature) is indeed a part of human name only after encountering 'president' (another feature). This means knowledge of having analyzed a feature needs to be passed on for further analysis.

## Why regular NN does not solve the problem

A typical NN (or CNN) cannot be used to model the above problems because

- **Fixed input and output size:** A typical network will require the feature count (word count in all sentences) to be the same. In a sequence model each instance has different feature count. Fixing a max and padding remaining with null is also not possible. Same is the case with output.
- **Learning from one feature not shared with other:**  In typical NN, a set of features $$x$$ are collectively analyzed and influence the output $$y$$. Here, analysis of each feature influences the other.

## Closer look at RNN

Consider the calculation of $$y^{\prec 3 \succ}$$ corresponding to input feature $$x^{\prec 3 \succ}$$ indexing the word "Teddy"

- $$y^{\prec 3 \succ}$$ is generated after analyzing $$a^{\prec 3 \succ}$$ 
- $$a^{\prec 3 \succ}$$ is generated after analyzing both $$a^{\prec 2 \succ}$$ (input from previous feature analysis) and  $$x^{\prec 3 \succ}$$  (current feature input)
- Similarly, $$a^{\prec 2 \succ}$$ is generated after analyzing $$a^{\prec 1 \succ}$$ and $$x^{\prec 2 \succ}$$
- In essence, a feature can be analyzed and corresponding output is produced only after **all previous features** are analyzed. So, the analysis of all the features that came earlier influences the current analysis.
- In terms of time series, if the first feature was analyzed at time interval $$t_1$$ the second feature is analyzed only at time interval $$t_2$$. 

## Limitation of RNN

An RNN has analysis from earlier feature to base the current analysis. However, it does not have analysis from features that appear later. Considering the 'Name entity recognition' problem described above, unless the word 'president' (that comes much later) is analyzed the word 'Teddy' (that comes much earlier) cannot be marked as a person.

## Computations

In a typical NN calculations, input activation is multiplied by weight (parameter), a bias is added to get $$z$$. The $$z$$ is then fed to an  activation function (like ReLU, tanh or sigmoid) to obtain the output activation. 

### Forward propagation equations

$$
\begin{aligned}
a^{\prec t \succ} &= g(W_{aa} \ a^{\prec t-1 \succ} + W_{ax} \ x^{\prec t \succ} + b_a ) \\
y^{\prec t \succ} &= g(W_{ya} \ a^{\prec t \succ}   + b_y ) \\
\end{aligned}
$$

Consider all blocks to be identical. Lets say $$a$$ is a 100 dimensional vector. Let $$x$$ be a 10,000 dimensional vector (one-hot index for a word's index).

Consider $$ W_{aa} \ a^{\prec t-1 \succ} $$
- All the 100 elements in $$a^{\prec t-1 \succ} $$ are multiplied by different weights to produce one resultant element (similar to single neuron of next layer)
- $$ W_{aa} \ a^{\prec t-1 \succ} $$ should be a vector of 100 elements. This is because LHS is a^{\prec t \succ} which is a 100 element vector.
- This means $$W_{aa}$$ is a matrix of dimension $$ (100 \times 100) $$

Consider $$ W_{ax} \ x^{\prec t \succ} ​$$
- All the 10,000 elements in $$x^{\prec t \succ} $$ are multiplied by different weights to produce one resultant element.
- $$ W_{ax} \ x^{\prec t \succ} $$ should be a vector of 100 elements. This is because LHS is a^{\prec t \succ} which is a 100 element vector.
- This means $$W_{ax}$$ is a matrix of dimension $$ (100 \times 10000) $$

### Choice of activation function

- For calculating $$a$$ typically $$tanh$$ is a common choice.
- For calculating $$y$$, 
  - Binary classification problem $$-$$ `sigmoid` is the activation function. 
  - K way classification problem $$-$$ `softmax` is the activation function. 

### Simplified Notation

Conventions
- $$ W_{a} $$ be a matrix got by horizontally concatenating $$ W_{aa} $$ and $$ W_{ax} $$
- $$ \left[ a^{\prec t-1 \succ}, x^{\prec t \succ} \right] $$ be a matrix got by vertically concatenating $$ a^{\prec t-1  \succ} $$ and  $$ x^{\prec t \succ} $$