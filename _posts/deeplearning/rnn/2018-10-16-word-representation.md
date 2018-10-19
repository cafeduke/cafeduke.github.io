---
title: Word Representation
categories: dl-rnn
layout: post
mathjax: true
typora-root-url: ../../../
---

DRAFT

____

{% include toc.html %}

# Introduction 

Algorithms such as RNN, GRU and LSTM can be applied to Natural Language Processing (NLP).  

One of the key ideas is **word embedding**  which helps learn relationship between words, such as *Man:Women :: King:Queen. However, it is also important to *debias* these learnings, to reduce bias (like say, ethnicity) which the algorithm can pickup.

## Notation Reference

| Notation  | Detail                                                       |
| --------- | ------------------------------------------------------------ |
| $$E$$     | Embedding matrix of (web embeddings x dictionary words)      |
| $$O_{i}$$ | $$i^{th}$$  one-hot vector representation of the word.       |
| $$e_i$$   | $$i^{th}$$ feature vector representation of the word (word encoding). |



## Representation Type

In RNN, LSTM and GRU algorithms, we used a one-hot representation for dictionary words. This section details the limitation of one-hot and an alternative representation.

### One-Hot representation

A one-hot vector for representing the index of a word in a dictionary (any one-hot for that matter, including one-hot for representing category), gives an advantage of not judging by the numeric value of the index. However, it also equates all words. Hence, the distance between one-hot representation of any two words is the same.

1. I want a glass of orange ___
2. I want a glass of apple ___

Even if the algorithm has learnt that 'juice' is likely to go with word 'orange', it cannot apply this learning to 'apple'. This is because, as long as the algorithm is concerned, 'apple' is as good as any other word (say 'sky').

### Feature representation (Word embedding)

Consider a table with different features (like gender, age, royalty, food, noun, verb, action, edible, etc) as rows and all words in a dictionary as columns. Each cell will have a value ranging from say -1 to 1 to indicate how appropriate a feature applies to the word.

![RNN_WordEmbedding](/assets/images/dl/RNN_WordEmbedding.png)

A vector for a word like "orange", will have value closer to 1 for features like "is fruit" and a value closer to "-1" for features like "royalty". So, "orange" and "apple" are likely to have similar features compared to "orange" and "king". Hence, using feature representation (also called **word embedding**) can help apply learnings for "orange" to say "apple".

> Embedding signifies trying to place a given word in n-dimensional space of features

**Visual representation:** Lets say we have around 300 features for a word. Mapping it to a 3D/2D space (with algorithm like t-SNE) will help visualize the grouping of similar words. 

## Word embedding Vs One-Hot

- One-hot for all words in a dictionary shall be huge. With word embedding, we could have a much small feature set.
- One-hot is extremely sparse compared to word embedding.
- One-hot cannot to used to understand similarities between words while a word embedding can.

## Transfer learning

The performance of the algorithm that uses feature representation (word embedding) depends on the **extensive training**. For example, an algorithm that understands the feature similarities between 'orange' and 'apple', may not recognize 'durian'  (and hence apply any learning) as it is unlikely, to have come across 'durian', during training.

One of the ways of dealing with a small training dataset is **transfer learning**. 

- An existing model, pre-trained on billions of words, from various sentences/books can be used.
- Train the model on the small dataset and continue to adjust the word embeddings (Adjustment not recommended unless the dataset is significantly large)

## Word embedding Vs CNN Face encoding

A CNN Face encoding model was trained to take **any image** as input and generate a vector of encodings. This could be compared with the encodings of **any** other image, to judge the similarity between these images. The images that are likely to be encountered in the real word is an ever expanding infinite set while words are more or less finite. We could work on word embeddings for all words in the dictionary, store and reuse in applications.

>  As a terminology, encodings generated for a word are called embeddings

## Application - Solve analogy

One of the properties of word embedding is solving analogies such as *"Man : Woman :: King : ? "*. Solving an analogy determines learning relation between words.

### How to solve an analogy problem?

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
Cosine \ similarity \ (u, v) \ = \ \frac{ \parallel \ u^T \ v \ \parallel }{ \parallel u \parallel \ \parallel v \parallel }
$$

# Learning Word Embedding

In the section below, by training a context-target (predict target from context) model we achieve two things

1. Language modeling $$-$$ Predict the target given the context
2. Learning word embedding $$-$$ Generate the embedding matrix $$E$$.

## Context-Target NN Model

The problem is similar to *fill in the blanks*. The words given are collectively called **context** and the blank to be filled is called **target**.

### Previous-4 model

This section solves the language modeling problem using classic NN.  Consider the following NN that takes previous 4 words to predict the next word.

- Lets say the each word embedding is a vector of size $$(300,1)$$
- Since we are using last 4 words as input, the input layer $$x$$ will be a vector $$(4\times300, 1) = (1200,1)$$
- Lets say the hidden layer $$L1$$ has 100 neurons, the weight matrix $$W1 = (100 \times 1200) $$
- Lets say the output layer $$L2$$ is a softmax to identify 10K classes (words of dictionary).
- The matrix $$E$$ having the word embeddings for all words is also a parameter (weight)

Working

- Back propagation used to perform gradient descent, adjust weights to learn word embeddings
- A algorithm should land up having similar word embeddings(feature vectors ) for 'apple' and 'orange' to minimize cost.

> The Previous-4 model is best suited for language modeling (Validating a sentence, Predicting next word accurately) as primary objective. For just learning word embedding the below simpler models can, very well, be used.

### Left-4, right-4 model 

The training set is created by

- Picking a target word.
- Context will be 4 words to the left + 4 words to the right of the target

### Previous-1 model 

The training set is created by

- Picking a target word.
- Context will be the word before the target.

### Nearby-1 word (Skip gram model)

The training set is created by

- Picking a target word.
- Context will be a single word that is nearby, i.e in a range of, say 1-5 words, before/after the target.

## Word2Vec 

Word2Vec is an algorithm to train a model to perform language modeling and learning word embeddings. However, the primary purpose of this algorithm is to learn word embeddings (not concerned about accuracy of the model during language modeling). The supervised learning problem that is being solved here is to predict the target given the context.

### Working

- Choose a random context ($$c = $$  input word).
- Choose a random, but nearby (1-5 words before/after context)  as  target ($$t =$$ word to be predicted).
- Calculate the softmax probability vector (probabilities must add up to 1) as follows.

### Cost function

$$
Softmax \ Probability(t|c) = \frac{ e^{w_t^T \ e_c} }{ \Sigma_{j=1}^{10K} e^{w_j^T \ e_c} }
$$

Here,

- $$e_c$$ encodings of the context word 
- $$w_t$$ weights for the target encoding 
- $$w_j$$ weight of the $$j^{th}$$ word in the dictionary

**Note on the equation**

- Numerator: Multiplies weights associated with the **target** $$w_t$$ with the encodings of the **context** $$e_c$$
- Denominator: sums weights from all the words multiplied with the encodings of **context** $$e_c$$
- The model is slow as it requires computing using all words in the dictionary.

### Hierarchical Softmax Classifier

Consider a hierarchy of binary classifiers. The root classifier takes context as input and directs to left/right classifier to find the target word. This continues down the tree until the leaf classifier points to the target word.

## Negative Sampling

Similar to WordVec, Negative sampling also has the objective of learning word embeddings. Unlike WordVec, the supervised learning problem here is different. A sample training set may look as follows

| Context | Target | Label |
| ------- | ------ | ----- |
| orange  | juice  | 1     |
| orange  | king   | 0     |
| orange  | of     | 0     |
| orange  | book   | 0     |

#### Training set creation	

- Create a (context, target) word pair from the sentence and label this pair as `1`. 
- A label of `1` indicates target matches context. A label of `0` indicates mismatch.
- Create K negative target samples
  - Pick a random word from the dictionary 
  - Create the pair (context, random-word) and label this pair as `0`
  - Since we are picking a random word, it is possible (though less likely) that the random word is actually a match to the context.
- This way we have chosen one positive example and generated K negative examples.

In essence, a single set will have (K+1) word pairs. We shall have several such sets in the training dataset.

### Supervised learning problem

The supervised learning problem here is to take input $$X$$ consisting of word pairs and predict the corresponding label $$y$$ (`1/0`).
$$
P(y=1 | c,t) = sigmoid (w_t^T \ e_c)
$$


### Working

- In general, a binary classifier takes input features $$x$$, has weights $$w$$ to predicts a binary $$y\_cap$$. Based on expected $$y$$, the weights $$w$$ are adjusted. This is how the binary classifier **learns**.
- Consider 10K binary classifiers, one for each word in the dictionary. 
- A single binary classifier for a word say 'king', takes input features (encoding of a word $$e_{i}$$), has weights $$w_{king}$$ and shall predict a binary $$y\_cap$$ . `1` if the encodings match with the 'king'. `0` if input encodings do not match with the 'king'. 
- Lets say we input encodings of 'orange' $$e_{orange}$$ to 'king' and 'juice' classifiers
  - We go to the 'king' classifier and say, *"I have a word, that is high on fruit and low on royalty. Will you be the target?"*. The 'king' classifier says *"Not a chance, No"*.
  - We go to the 'juice' classifier and say, *"I have a word, that is high on fruit and low on royalty. Will you be the target?"*. The 'juice' classifier says *"I am already impressed, Yes"*.

>  In essence, for each set of (K+1) examples, the same context encoding is given to (K+1) classifiers. Only one is expected to say 'yes' and others are expected to say 'no'. Since we have a labeled set, the weights of the classifiers are accordingly adjusted , thus training these (K+1) classifiers per set.

### Selecting negative targets

Using empirical frequency of words (Frequency of occurrence in real world) as-is will have more words like 'the', 'of', 'is', etc. So, below formula is used.

Let,

- f(w) be represent the empirical frequency for word 'w'. 
- $$P(w)$$ be the probability of choosing word 'w' 

$$
P(w_i) = \frac{f(w_i)^{3/4}}{\Sigma_1^{10K} \  f(w_j)^{3/4}}
$$



## GloVe (Global Vectors) Algorithm

GloVe algorithm, short for, Global Vectors for vector representation, is not used as much as Word2Vec, but it is simpler. 

A crucial element of the glove algorithm defines is the matrix $$X_{ij}$$ 

- The number of times the $$i^{th}$$ word (context) appears **in the context of** the $$j^{th}$$ word (target) in the corpus (large number of sentences).
- It depends on the definition of the **context**
  - If context is defined as one word being in proximity (1-10 words range) of the other, then $$X_{ij} = X_{ji}$$ . Checking the number of times 'orange' appears in context of 'juice' would be same as checking the number of times 'juice' appears in the context of 'orange'.
  - If context is defined as $$i^{th}$$ word appearing just before the $$j^{th}$$ word, then $$X_{ij}$$ is not symmetric.

### Cost function

$$
J = \Sigma_{i=1}^{10K} \  \Sigma_{j=1}^{10K} \left[ \ f(X_{ij})  ( w_i \ e_j + b_i - b_j - log(X_{ij}) ) \ \right]
$$

Here,

- $$X_{ij}$$ measures how many times the $$i^{th}$$ word appears in context of $$j^{th}$$ word. If this value is closer to the product $$w_i e_j$$ then cost $$J$$ reduces.
- The equation means how **related** are words $$i$$ and $$j$$ as measured by how **often** they occur with each other.
- $$f(X_{ij})$$ is the weighting term
  - $$X_{ij}$$  could be zero and $$ log(0) = -\infin$$ , in this case, $$f(X_{ij})$$ will be zero.
  - Based on various heuristics the weights of very frequent words like 'it', 'and', 'the' or very rare words like 'durian' are calculated.
- $$w$$ and $$e$$ play symmetric roles. So, finally the encodings are calculated as $$ e_i := \frac{e_i + w_i}{2}$$ 

# Applications of word embedding

## Sentiment Classification

Sentiment classification is about analyzing a text and rating it. For example, the model could be analyzing the review of a restaurant and outputting a start rating from 1 to 5.

### Simple sentiment classification model

**Working**

- Use a pre-trained word embedding matrix $$E$$ (Trained over billions of words from various books/docs/newspapers)
- Get the word embeddings, for each word, in the given input review text
- Average all the word embeddings to create a single vector of word embedding (`np.mean(E_sub, axis=1)`)
- Feed this to a hidden layer and then to softmax to predict $$y\_pred$$ 5 probabilities.

**Limitation**

This algorithm works well on typical reviews. However, a limitation of the algorithm is that it does not take care of order of the words. For example, *"Completely lacking in good service, good taste or good ambiance"*  is probably a 1-star review. However, multiple occurrences of word *"good"* might mislead the algorithm into considering this as a positive, 4-star review. 

### RNN sentiment classification model

An RNN that passes the learning from previous time steps to the next can be used to learn order of words. In particular, the embeddings of each word is passed as input $$x^{\prec t \succ}$$ . The output from the final activation is then fed to softmax to make the prediction as given below.

![WordEmbedding_Sentiment](/assets/images/dl/RNN_Sentiment.png)



This is an example of **"Many to One"** RNN model. A model like this takes care of order. Like the previous model, E is taken from a standard pre-trained model (Trained over billions of words from various books/docs/newspapers).  So, a test review that uses another word like "void" instead of "lacking" shall also be classified correctly, even if the word "void" was not a part of training dataset. This works because E is taken from the standard model and has already learnt encodings, than what the current training has to offer. 
