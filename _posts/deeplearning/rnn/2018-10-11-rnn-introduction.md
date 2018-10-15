---
title: Recurrent neural networks (RNN)
categories: dl-rnn
layout: post
mathjax: true
typora-root-url: ../../../
---

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
| $$y\_cap^{\prec i \succ}$$ | $$i^{th}$$ output prediction. In a sentence, it would be the output after processing the $$i^{th}$$ word. |
| $$y^{\prec i \succ}$$ | $$i^{th}$$ output label. In a sentence, it would be the actual output after processing the $$i^{th}$$ word. |
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

> Each feature analysis happens at a different time step.

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
- $$ W_{aa} \ a^{\prec t-1 \succ} $$ should be a vector of 100 elements. This is because LHS is $$a^{\prec t \succ}$$ which is a 100 element vector.
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
- $$ \left[ a^{\prec t-1 \succ}, x^{\prec t \succ} \right] $$ be a matrix got by vertically concatenating $$ a^{\prec t-1  \succ} $$ and  $$ x^{\prec t \succ} ​$$

$$
\begin{aligned}
a^{\prec t \succ} &= g(W_{a} \left[ a^{\prec t-1 \succ}, \ x^{\prec t \succ}\right] + b_a ) \\
y^{\prec t \succ} &= g(W_{y} \ a^{\prec t \succ}   + b_y ) \\
\end{aligned}
$$

> The same weight matrix $$W_{a}, \ W_{y}$$ and bias $$ b_a, b_y $$ are used/adjusted for the entire time series.

### Back propagation though time

Most of the library will automatically calculate the back propagation. However, below is the intuition. Back propagation is by differentiating the cost function. The cost function for an RNN is the summation of the cost functions of individual time series.
$$
\begin{aligned}
J(y\_cap^{\prec t \succ}, y^{\prec t \succ}) &= - \left[ y^{\prec t \succ} \ log(y\_cap^{\prec t \succ})   + (1- y^{\prec t \succ} ) \ log(1 - y\_cap^{\prec t \succ})  \right] \\
J &= \Sigma^{T_y}_{t=1} \left[ J(y\_cap^{\prec t \succ}, y^{\prec t \succ}) \right] \\
\end{aligned}
$$

Using gradient descent the weights $$W_{a}, \ W_{y}$$  are adjusted.

## Types of RNN

So far we have seen that that number of input tokens $$T_x$$ are same as the number of output tokens $$T_y$$. However, the input/output lengths could be different $$-$$ A machine translation that translates French to English.

![RNNTypes](/assets/images/dl/RNNTypes.png)

| Type               | Application              | Detail                                                       |
| ------------------ | ------------------------ | ------------------------------------------------------------ |
| One to One         | Any typical NN           | Present for the sake of completeness, it takes one input and produces one output. |
| One to Many        | Music Generation         | Using a single input like the genre of the music, the entire music is generated. <br />The output prediction $$y\_cap$$ is fed as input in the next time step. |
| Many to One        | Sentiment Classification | Classify input text, for example predict rating based on comment made about a movie.<br />Many words acting as input result in a single rating as output. |
| Many to Many (N-N) | Name Entity Recognition  | Identify and locate names in a text. <br />Words of a sentence act as input, for each word, prediction indicates if the word is a person's name or not. <br />Note that number of inputs matches the number of outputs. |
| Many to Many (M-N) | Machine translation      | Convert a sentence from language to another.<br />Words in one language result in fewer or more words in another language. |

# Language model using RNN

A language model takes an input sentence and outputs a probability for the sentence (sequence of words to be together). A higher probability may indicate a sentence that is more likely to be accurate. Consider a speech recognition system that needs to output text taking the voice as input.

Consider the following two interpretations of the voice

1. The apple and pair salad
2. The apple and pear salad

A good speech recognition system should be able to determine that probability of 1st sentence is lesser than second and hence choose the second interpretation.

## Training a language model

Building a language model requires a large corpus of English text.  

### Tokenize sentences in the training set

  - Divide the sentence into words
  - Add a `<EOS>` token at the end to indicate "End of sentence". This is to enable models to even predict when sentences end. You may ignore punctuations or add 'period' as a token.
  - Add a `<UNK>` to indicate 'unknown word' for a token not present in the dictionary.
  - This means `<EOS>` and `<UNK>` are part of the dictionary.
  - Finally, each word in the input sentence is mapped to an index (one-hot representation) in the dictionary.

### Training the model

Let *'Cats average 15 hours of sleep a day'* be the first training sentence. The sentence has 8 words. After adding `<EOS>` at the end, we have 9 tokens.

Time step $$t_1$$

- The dummy $$ a^{\prec 0 \succ} $$ is zero vector as usual. Here the input $$ x^{\prec 1 \succ} $$ shall also be a zero vector
- The output $$ y\_cap^{\prec 1 \succ} $$ is a vector having softmax output with 10,002 classes (Assuming 10K words in dictionary + EOS + UNK). A softmax outputs a probability for each class that adds up to 1. The class with the highest probability will be the predicted word.
- Predicted word probability = `np.max(y_cap[1])`. Predicted word index = `np.argmax (y_cap[1])` 
- The probability got  from $$ y\_cap^{\prec 1 \succ} $$  is `P(<word>|'')`. This gives the `<word>` that has the highest probability for beginning a sentence. 
- The time step also produces output activation $$ a^{\prec 1 \succ} $$

Time step $$t_2$$

- The input $$ a^{\prec 1 \succ} $$ is the output produced by the previous time step.
- The input $$ x^{\prec 2 \succ} $$ given here is the expected first word. In the example it is 'Cats'. At time step $$t_1$$ we are telling the model that we expected 'Cats' to be the first word. We now ask the model to predict the next word. Essentially, during training, the input word given to the **next time step** is the expected word for the previous time step.
- Predicted word probability = `np.max(y_cap[2])`. Predicted word index = `np.argmax (y_cap[2])` 
- The probability got  from $$ y\_cap^{\prec 2 \succ} $$  is `P(<word>|'Cats')`. This gives the next `<word>` that has the highest probability given that the first word was 'Cats'
- The time step also produces output activation $$ a^{\prec 2 \succ} $$

Time step $$t_3$$ 
-  The probability got  from $$ y\_cap^{\prec 3 \succ} $$  is `P(<word>|'Cats average')`. This gives the next `<word>` that has the highest probability given that the first part of the sentence was 'Cats average'
-  The time step also produces output activation $$ a^{\prec 3 \succ} $$

> The model trains by giving the input $$ x^{\prec t \succ} $$ which is the expected output in the previous step $$ y^{\prec t-1 \succ} $$. So, $$ x^{\prec t \succ} $$ = $$ y^{\prec t-1 \succ} $$

## Cost Function

The cost function for a time step is similar to the cost function for any softmax.

$$
\begin{aligned}
J(y\_cap^{\prec t \succ}, y^{\prec t \succ}) &= - \ \Sigma \left[ y^{\prec t \succ} \ log(y\_cap^{\prec t \succ}) \right] \\
J &= \Sigma^{T_y}_{t=1} \left[ J(y\_cap^{\prec t \succ}, y^{\prec t \succ}) \right] \\
\end{aligned}
$$

## Probability of the sentence

The probability of the sentence is obtained by multiplying all the predicted class's probability.

$$
P(sentence) = np.max(y\_cap^{\prec 1 \succ}) \ * \ np.max(\ y\_cap^{\prec 2 \succ}) * \ ... * \ np.max(\ y\_cap^{\prec T_y \succ})
$$

## Sampling a language model

After having trained a language model, we could now use it to make some generate several sentences formed by random sampling.

### What is sampling

Consider a typical survey. We could randomly choose 100 people to provide a movie review. That would not give the best idea about the peoples opinion of the movie. If most of the people we survey are kids or most senior citizens that would be even worse. We need a mix of people, but not a random mix either (completely random is like guessing).

We will have to consider a typical probability distribution, of different ages of people going to the movie and accordingly decide how many people, of each age group, should be included to make the 100, we plan to survey. 

```python
np.random.choice(['The', 'In', 'A', 'Once'], p=[0.4, 0.1, 0.3, 0.2])
'In'

np.random.choice(['The', 'In', 'A', 'Once'], p=[0.4, 0.1, 0.3, 0.2])
'The'

np.random.choice(['The', 'In', 'A', 'Once'], p=[0.4, 0.1, 0.3, 0.2])
'The'

np.random.choice(['The', 'In', 'A', 'Once'], p=[0.4, 0.1, 0.3, 0.2])
'A'

np.random.choice(['The', 'In', 'A', 'Once'], p=[0.4, 0.1, 0.3, 0.2])
'In'

np.random.choice(['The', 'In', 'A', 'Once'], size=10, p=[0.4, 0.1, 0.3, 0.2])
array(['In', 'The', 'The', 'A', 'In', 'The', 'A', 'A', 'The', 'The'], dtype='<U4')
```

In the above example, we have a list of 4 words and corresponding probability of a sentence beginning with the word.  Running the `random.choice` shall every time pick a world from the list but based on the probability distribution. What this means is that there is a 40% chance the word picked is 'The' while there is only '10%' chance it is 'In'. 

## Working of language model sampling

Time step $$t_1$$

- Similar to the training, we begin by providing empty vectors for  $$ x^{\prec 1 \succ} $$  and  $$ a^{\prec 0 \succ} $$ as input.
- The resultant  $$ y\_cap^{\prec 1 \succ} $$ , is a vector having probability for every word in the dictionary (to be the first word of a sentence). It is very likely that 'The' has the highest probability. 
- Instead of simply picking the word with highest probability, we pick a random word based on probability distribution in $$ y\_cap^{\prec 1 \succ} $$ . (A word with higher probability has a higher chance to be picked)

Time step $$t_2$$

- Unlike training we don't have an expected sentence. So,  $$ x^{\prec 2 \succ} $$ will be the word picked from random distribution in the previous step.
- The next word is picked randomly based on the probability distribution in $$ y\_cap^{\prec 2 \succ} $$ 

This way a random sentence gets generated, The nature of the sentence shall depend on the nature of the sentences used during training.  Below is the result of sampling after having trained on two different types of sentences.

![RNN_LangSample](/assets/images/dl/RNN_LangSample.png)



**When does the time series end?** The time series can end when a `<EOS>` token is encountered or max-length is reached. 

## Training a character language model

Instead of building a model based on words, we could also build them using characters. A model trained on characters would predict the next character based on the characters encountered thus far. 

The disadvantages with character model are

- **Vanishing gradient problem:**  The **length of the network**, a typical sentence will have several words but a whole lot of characters. It is harder for a model to train how a character chosen much earlier in the model would affect what comes much later.
- **Computational Expense:** A char model would be harder to train and computationally expensive.

# Vanishing gradients with RNN

Consider a language modeling problem that is dealing with the following two sentences

- The **boy** had pie on Monday, pizza on Tuesday, ..., burger on Saturday and **was** sick on Sunday.
- The **boys** had pie on Monday, pizza on Tuesday, ..., burger on Saturday and **were** sick on Sunday.

The singular/plural word used earlier in a sentence, affecting much later in a sentence is an information that needs to be retained for long. Larger the distance, reducing gradient shall be too small to affect what was learnt much earlier.

The vanishing gradient problem of RNN is solved using 

- Gated Recurrent Unit (GRN)
- Long Short Term Memory (LSTM)

## Gated Recurrent Unit (GRU)

GRU is used to prevent the vanishing gradient problem. Lets first look at the equations of GRU and then understand how it prevents/reduces vanishing gradient problem.

### Simplified GRU

A simplified GRU is governed by the following equations:


$$
\begin{aligned}
c^{\prec 0 \succ} &= a^{\prec 0 \succ} = 0 \\
\tilde{c}^{\prec t \succ} &= tanh ( W_c [c^{\prec t-1 \succ}, x^{\prec t \succ}] + b_c ) \\
\Gamma_u &= \sigma (W_u [c^{\prec t-1 \succ}, x^{\prec t \succ}] + b_u ) \\
c^{\prec t \succ} &= \Gamma_u * \tilde{c}^{\prec t \succ} + (1 - \Gamma_u) * c^{\prec t-1 \succ} \\
a^{\prec t \succ} &= c^{\prec t \succ} \\
y^{\prec t \succ} &= softmax(W_y \ a^{\prec t \succ} + b_y ) \\
\end{aligned}
$$

### Understanding simplified GRU

- GRU algorithm provides a memory cell $$ c^{\prec t \succ} $$. Every time step has its own memory cell. 

- Every time step calculates a new value $$ \tilde{c}^{\prec t \succ}$$ *(tilde c)* which is the **candidate value**. A candidate value is one that attempts to get stored in the memory cell.

- The memory cell is gated by $$\Gamma^{\prec t \succ}$$ (Capital, Gamma, **the gate**). Value of the gate is 0\|1 indicating gate is close\|open.

- If $$\Gamma^{\prec t \succ} == 1$$

  - Gate is open
  - The memory cell  $$ c^{\prec t \succ} $$ gets the candidate value. 
  - This means the old value is overwritten/forgotten.

- Else If $$\Gamma^{\prec t \succ} == 0$$

  - Gate is closed
  - The memory cell  $$ c^{\prec t \succ} $$ (almost) gets the value  $$ c^{\prec t-1 \succ} $$ (previous memory cell value). 
  - This means the old value is retained. The candidate value is discarded.
  - Note that $$ c^{\prec t \succ} $$ will approximately (not exactly) be equal to $$ c^{\prec t-1 \succ} $$. The difference is negligible though.

> As long as the gate is closed the **candidate value** (that is calculated for every time step), gets discarded and the current memory cell gets a value almost same as previous. In essence, the value once memorized can be retained for long even if the time series is very long. 

### More memory cells, more gates

The above describes storing a single memory in $$c^{\prec t \succ}$$. However  $$c^{\prec t-1 \succ}$$ could be a vector of memory cells. Similarly, $$\Gamma^{\prec t \succ}$$ will also be a vector of gates, for corresponding memory cell.

### Full GRU

A full GRU uses another gate called the relevance gate $$\Gamma_r$$ which shall indicate how relevant the previous memory cell value is for calculating the candidate value.

$$
\begin{aligned}
c^{\prec 0 \succ} &= a^{\prec 0 \succ} = 0 \\
\tilde{c}^{\prec t \succ} &= tanh ( W_c [ \Gamma_r * c^{\prec t-1 \succ}, x^{\prec t \succ}] + b_c ) \\
\Gamma_r &= \sigma (W_r [c^{\prec t-1 \succ}, x^{\prec t \succ}] + b_r ) \\
\Gamma_u &= \sigma (W_u [c^{\prec t-1 \succ}, x^{\prec t \succ}] + b_u ) \\
c^{\prec t \succ} &= \Gamma_u * \tilde{c}^{\prec t \succ} + (1 - \Gamma_u) * c^{\prec t-1 \succ} \\
a^{\prec t \succ} &= c^{\prec t \succ} \\
y^{\prec t \succ} &= softmax(W_y \ a^{\prec t \succ} + b_y ) \\
\end{aligned}
$$

GRU is the standard version used by researches. The other commonly used one is LSTM.

## Long Short Term Memory (LSTM)

LSTM is more powerful than GRU, but is more complicated and has more gates. Few equations of LSTM are similar to GRU, however there are lot many changes as given below.

### LSTM Cell
The diagram below provides a circuit representation of a single LSTM cell.

![RNN_LSTM_cell](/assets/images/dl/RNN_LSTM_cell.png) 

### Equations

$$
\begin{aligned}
a^{\prec 0 \succ} &= random () \\
c^{\prec 0 \succ} &= 0 \\
\tilde{c}^{\prec t \succ} &= tanh ( W_c [  a^{\prec t-1 \succ}, x^{\prec t \succ}] + b_c ) \\
\Gamma_u &= \sigma (W_u [a^{\prec t-1 \succ}, x^{\prec t \succ}] + b_u ) \\
\Gamma_f &= \sigma (W_f [a^{\prec t-1 \succ}, x^{\prec t \succ}] + b_f ) \\
\Gamma_o &= \sigma (W_o [a^{\prec t-1 \succ}, x^{\prec t \succ}] + b_o ) \\
c^{\prec t \succ} &= \Gamma_u * \tilde{c}^{\prec t \succ} + \Gamma_f * c^{\prec t-1 \succ} \\
a^{\prec t \succ} &= \Gamma_o * tanh(c^{\prec t \succ}) \\
y^{\prec t \succ} &= softmax(W_y \ a^{\prec t \succ} + b_y ) \\
\end{aligned}
$$

### Understanding LSTM

- Instead of $$c^{\prec t-1 \succ}$$ , we directly use $$a^{\prec t-1 \succ}$$ 
- The relevance gate $$\Gamma_r$$ is not used 
- Three gates update gate, forget gate and output gate are used as opposed to just one, update gate, in GRU
  -	The update gate shall gate the candidate value while the forget gate shall gate the previous memory cell value.
  -	The update and forget gates together determine the value of the current memory cell. 
  -	This way the network **could** create a current memory cell which is the sum of candidate value and previous memory cell (No idea why?)
  -	The output gate shall gate the current memory cell (update above) to determine the value sent to next time step a^{\prec t \succ}



## Chaining
LSTM (or GRU) cells can be chained to analyze the sequence of inputs from  $$x^{\prec 1 \succ}$$ to $$x^{\prec T_x \succ}$$ as shown in the diagram below.

![RNN_LSTM_chain](/assets/images/dl/RNN_LSTM_chain.png)



## GRU vs LSTM

GRU came up later in the history compared to LSTM. 	GRU is more simpler than LSTM. LSTM is a proven model. However, GRU which is the latest is catching up.

# Bidirectional Recurrent Neural Networks (BRNN)

As mentioned as one of the limitations of RNN earlier, RNN cannot make a decision based on the analysis of future inputs and analysis, it can only make a decision based on previous inputs and analysis. BRNN address this limitation. 

**Note:** This is **not back propagation**, it is forward propagation that takes a U turn and comes back. The prediction at any given time step is based on current input ( $$x^{\prec t \succ}$$ ), analysis from previous time step ( $$\overrightarrow{a}^{\prec t-1 \succ}$$ ) and analysis from next time step  ($$\overleftarrow{a}^{\prec t-1 \succ}$$) . The last part is missing in RNN

## Equations

$$
\begin{aligned}
\overrightarrow{a}^{\prec t \succ} &= g(W_{a} \left[ \overrightarrow{a}^{\prec t-1 \succ}, \ x^{\prec t \succ}\right] + b_a ) \\
\overleftarrow{a}^{\prec t \succ} &= g(W_{a} \left[ \overleftarrow{a}^{\prec t-1 \succ}, \ x^{\prec t \succ}\right] + b_a ) \\
y^{\prec t \succ}  &= g(W_{y} \left[ \overleftarrow{a}^{\prec t \succ}, \overrightarrow{a}^{\prec t \succ} \right]   + b_y ) \\
\end{aligned}
$$

Just like the forward activation $$\overrightarrow{a}^{\prec t \succ}$$ is the analysis from all previous time steps, back activation $$\overleftarrow{a}^{\prec t \succ}$$ has information from all future time step.

## Disadvantange of BRNN

The disadvantange of BRNN apart from the obvious computational overhead is that it requires the entire input inorder to may prediction and cannot make predictions as the input is being received. For example, in a voice to text speech recognition system, BRNN would wait for the user to stop to make the prediction of the entire sentence. 

# Deep RNN

Multiple version of RNNs like (Regular RNN, GRU, LSTM, BRNN) can be stacked vertically where $$y^{\prec t \succ}$$ from one layer below, is fed as $$x^{\prec t \succ}$$ to a layer on the top. Like any typical RNN, an entire horizontal layer shall use the same weights. In other words there shall be a $$W_a$$ per layer. 

![DeepRNN](/assets/images/dl/DeepRNN.png)

We won't have many layers of RNN stacked vertically (3 itself is pretty complex and computationally expensive). However after stacking RNN on top of each other for say 3 layers, we could have a regular deep network not connected horizontally.