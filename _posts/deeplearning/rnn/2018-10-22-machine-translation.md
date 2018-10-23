---
title: Machine Translation
categories: dl-rnn
layout: post
mathjax: true
typora-root-url: ../../../
---

DRAFT

____

{% include toc.html %}

# Introduction

A machine translation is expected to output the most likely

- Translation of sentence from one language (say French) to another (say English).
- Transcript for an audio clip. 
- Caption for an input image.

A RNN model of type N:M many-to-many is used for the purpose. The network used is also known as an encoder-decoder network or sequence-to-sequence network. 

## Language Model Vs Machine Translation

**Language Model**: A trained language model can generate novel sentences. The model is fed a zero vectors for $$a^{\prec 0 \succ}$$  and $$x^{\prec 1 \succ}$$.    The output $$y^{\prec t \succ}$$  is sampled and fed as input in the next step. Thus $$x^{\prec t \succ} = y^{\prec t-1 \succ}$$ 

![RNN_LanguageModel](/assets/images/dl/RNN_LanguageModel.png)



**Machine Translation:** A machine translation is a concatenation of two networks $$-$$ encoder and decoder. The decoder is very similar to the language model where it operates based on a input encoding. The input encoding comes from an encoder which is a module in itself.

![RNN_MachineTranslation](/assets/images/dl/RNN_MachineTranslation.png)

Consider image captioning, where a caption needs to be generated for an input image. Here, the encoder module could be a CNN model such as AlexNet which generates an encoding for an input image. The encoding is fed to the decoder (purple) to generate the caption.

While this mechanism does address the problem, it may not provide the best translation possible for a given input sentence or the best caption possible for a given input image. Below section mention why the above solution is not the best and how to improvise.

## Why greedy search algorithm is not the best?

Consider a greedy search for machine translation, of a sentence in French to English. The encodings of the French sentence is fed to a decoder. The decoder in the first time step  predicts $$y^{\prec 1 \succ}$$.  A softmax classifier shall be used to pick the word that has the highest probability. Thus, we picked the best first word. We now input this into the next time step and pick the best second word and so on. A sentence thus generated is said be generated using **"greedy search"**. Why is this not the best translation?

Consider the following two translations

1. Jane is visiting Africa in September.
2. Jane is going to be visiting Africa in September.

The first translation is better than the second. Let $$x$$ be the encodings of the French sentence.  Probability $$ P( "visiting" | "Jane \ is", x)  < P( "going" | "Jane \ is", x)$$, hence the greedy search picked "going" over "visiting". 

However, when we consider the entire sentence or a much larger sentence the probability shall reverse. Probability $$ P( "Jane \ is \ visiting \ Africa" |  x)  > P( "Jane \ is \ going \ to \ be \ visiting \ Africa" | x)$$.

In essence the best solution is the one that maximizes the following probability
$$
Maximize: \ P(y^{\prec 1 \succ},\ y^{\prec 2 \succ},\ y^{\prec 3 \succ} ...\ y^{\prec n \succ} | x)
$$


# Beam search algorithm

A greedy search does the job but is not good enough. Beam search provides a much better translation. The beam algorithm defines a parameter called **beam width** $$-$$ The number of top probabilities the algorithm will consider at each time step. Note that  *with a beam-width=1, beam search algorithm is same as greedy*.

## Working

Time step $$t_1$$

- Similar to greedy search, beam search takes the input encoding $$x$$ to predict the first word (among 10K words in dictionary).
- The greedy search would pick the highest probability word as first word and move to the next step. The beam search defines a parameter called  **beam width**.  If beam width is 3, the top 3 words and their probabilities ( `p1 = <vector of 3 probabilities>`) are stored before moving to the next time step.

Time step $$ t_2 $$

- The objective of the greedy algorithm for the time step would be to just find $$ P(y^{\prec 2 \succ} | \ y^{\prec 1 \succ}, x)$$. Pick the word with the top probability.
- The objective of the beam algorithm for the time step is to maximize $$P(y^{\prec 1 \succ}, y^{\prec 2 \succ} |\ x) $$ 
- From the probability theorem we know that $$P(A,B | x) = P(A\ |x) * P(B\ |A,x)$$. Applying the theorem, we get $$ P(y^{\prec 1 \succ}, y^{\prec 2 \succ} |\ x) = P(y^{\prec 1 \succ} | x) * P(y^{\prec 2 \succ} | x,y^{\prec 1 \succ}) $$ 
- The $$ t_2 $$ of the decoder outputs $$P(y^{\prec 2 \succ} | x,y^{\prec 1 \succ}) $$. That is probability for all the words in the dictionary (`p2 = <vector of 10K probabilities>`).
- The $$ t_1 $$ has given us $$P(y^{\prec 1 \succ} | x)$$. We just need to multiply the two. However $$ t_1 $$, in case of beam (with beam-width = 3) has given us top 3 probabilities (`p1`).
- To get all combinations, we create a vector of (3 * 10K = 30K) probabilities. `p1.dot(p2.T).reshape(-1, 1)`. In this huge vector the first 10K correspond to the top word in $$ t_1 $$, the next 10K correspond to the second topper from $$ t_1 $$ and so on.
- We now sort entire 30K and pick only top 3 words and their probabilities for the next time step.

> At $$t_2$$, we are picking top 3 (beam-width=3) words with highest probability of $$P(y^{\prec 1 \succ}, y^{\prec 2 \succ} |\ x) $$.  In essence, at any given point of time there are only beam width copies of the network.

## Refinements	

### Length Normalization

We define beam algorithm to maximize the collective probability of choosing all the words.

$$
\begin{aligned}
Maximize &= \ P(y^{\prec 1 \succ},\ y^{\prec 2 \succ},\ y^{\prec 3 \succ} ...\ y^{\prec n \succ} | x) \\
Maximize &= 
 P(y^{\prec 1 \succ}|x) * 
 P(y^{\prec 2 \succ}|x,y^{\prec 1 \succ}) * 
 P(y^{\prec 3 \succ}|x,y^{\prec 2 \succ},y^{\prec 1 \succ}) \ ...
 P(y^{\prec n \succ}|x,y^{\prec n-1 \succ}, ... y^{\prec 2 \succ},y^{\prec 1 \succ}) \\

\end{aligned}
$$

 Multiplying a lot of probabilities (a number between 0 and 1) will result in a very small number resulting in **numerical underflow** $$-$$ The floating point representation of the computer cannot store a very small number accurately. 


$$
\begin{aligned}
Maximize &= \ log \left[ P(y^{\prec 1 \succ},\ y^{\prec 2 \succ},\ y^{\prec 3 \succ} ...\ y^{\prec n \succ} | x) \right] \\
Maximize &= log \left[
 P(y^{\prec 1 \succ}|x) * 
 P(y^{\prec 2 \succ}|x,y^{\prec 1 \succ}) * 
 P(y^{\prec 3 \succ}|x,y^{\prec 2 \succ},y^{\prec 1 \succ}) *\ ... *\
 P(y^{\prec n \succ}|x,y^{\prec n-1 \succ}, ... y^{\prec 2 \succ},y^{\prec 1 \succ})
\right] \\

Maximize &= log (P(y^{\prec 1 \succ}|x))  + log(P(y^{\prec 2 \succ}|x,y^{\prec 1 \succ})) + log(P(y^{\prec 3 \succ}|x,y^{\prec 2 \succ},y^{\prec 1 \succ})) + ... + log(P(y^{\prec n \succ}|x,y^{\prec n-1 \succ}, ... y^{\prec 2 \succ},y^{\prec 1 \succ}))
\end{aligned}
$$




