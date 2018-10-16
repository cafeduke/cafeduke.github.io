---
title: Word Representation
categories: dl-rnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Introduction 

Algorithms such as RNN, GRU and LSTM can be applied to Natural Language Processing (NLP) $$-$$ One of the key areas of AI. One of the key ideas is **word embedding** such as *Man:Women :: King:Queen*, essentially learning the relationship between words. However, it is also important to *debias* these learnings  to reduce bias across (say, ethnicity) which the algorithm can pickup.

# Word Embedding

In RNN, LSTM and GRU algorithms, we used a one-hot representation for dictionary words. This section details the limitation of one-hot and an alternative representation.

## One-Hot representation

A one-hot vector for representing the index of a word in a dictionary, or on-hot in general gives an advantage of not judging by the numeric value of the index. However, it also equates all words and hence distance between any two words (one-hot representation) is the same.

1. I want a glass of orange ___
2. I want a glass of apple ___

Even if the algorithm has learnt that 'juice' is likely to go with word 'orange'. It cannot apply the learning to 'apple'. This is because as long as the algorithm is concerned, 'apple' is as good as any word (say 'sky').

## Feature representation (Word embedding)

Consider a table with different features (like gender, age, royalty, food, noun, verb, action, edible, etc) as rows and all words in a dictionary as columns. Each cell will have a value ranging from say -1 to 1 to indicate how appropriate a feature applies to the word.

![RNN_WordEmbedding](/assets/images/dl/RNN_WordEmbedding.png)

A vector for a word like "orange", will have value closer to 1 for features like "is fruit" and a value closer to "-1" for features like "royalty". So, "orange" and "apple" are likely to have similar features compared to "orange" and "king". Hence, using feature representation (also called **word embedding**) can help apply learnings for "orange" to say "apple".

> Embedding signifies trying to place a given word in n-dimensional space of features

**Visual representation:** Lets say we have around 300 features for a word. Mapping it to a 3D/2D space (with algorithm like t-SNE) will help visualize the grouping of similar words. 

## Word embedding Vs One-Hot

- One-hot for all words in a dictionary shall be huge. With word embedding, we could have a much small feature set (especially, if we are using transfer learning).
- One-hot is extremely sparse compared to word embedding.
- One-hot cannot to used to understand similarities between words while a word embedding can.

## Transfer learning in word embedding

The performance of the algorithm that uses feature representation depends on the **extensive training**. 

For example, an algorithm that understands the feature similarities between 'orange' and 'apple' may not recognize 'durian'  (and hence apply any learning) as it is unlikely that it came across 'durian' during training.

One of the ways of dealing with a small training dataset is **transfer learning**. 

- An existing model pre-trained on billions of words from various sentences/books can be used.
- Train the model on the small dataset and continue to adjust the word embeddings (Not typically required unless the dataset is significantly large)

## Word embedding Vs CNN Face encoding

A CNN Face encoding model was trained to take **any image** as input and generate a vector of encodings. This could then be compared with the encodings for another image, to judge the similarity between these images. As opposed to images that are an ever expanding infinite superset, words are more or less finite. 

>  As a terminology, encodings generated for a word are called embeddings

## Word Embedding solving analogies

One of the properties of word embedding is solving analogies such as *"Man : Woman :: King : ? "*. Solving an analogy determines learning relation between words.

### How to solve analogies?

- Calculate the vector distance between embedding vectors for man and woman  $$ \parallel e_{man}  - e_{woman} \parallel $$ 
- Find out which vector has the closest distance with $$e_{king}$$ 

$$
\begin{aligned}
e_{man} - e_{woman} &\approx e_{king} - e_{x} \\
e_{x} &\approx e_{king} - e_{man} + e_{woman} \\
Solve \ for &: similarity \ (e_{x},\ e_{king} - e_{man} + e_{woman}) \\
\end{aligned}
$$



### Similarity between vectors

The most commonly used similarity function is called **cosine similarity**. Cosine similarity between two vectors `u` and `v` is defined as follows.

$$
Cosine \ similarity \ (u, v) \ = \ \frac{ \parallel \ u.T \ v \ \parallel }{ \parallel u \parallel \ \parallel v \parallel }
$$





