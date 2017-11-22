---
title: K-Class Classification
categories: dl
layout: post
mathjax: true
---

{% include toc.html %}

# Introduction

To classify two classes `K==2` , such as to classify if an image is cat or not, a binary classifier is used.  If we want to classify 'K' classes, such as to classify if an image is cat, dog, chick or none of the above, where `K > 2`, we use **softmax** classifier.

Note: 

- K-class classifier outputs values from 0 to K-1. 

- K==0 implies for none of the above. 

- K values greater than 0 indicates the corresponding class

  ​

# Binary Vs softmax classification 

| Binary                                   | Softmax                                  |
| ---------------------------------------- | ---------------------------------------- |
| Ycap is calculated as follows, this makes the max value in `AL` output `1` and rest to `0`<br /><br /> `Ycap = (AL == np.max(AL)).astype(int)` | For `AL`, the sum of probabilities of all the neurons in `AL` should be `1`.<br /><br /> `AL = (e^Z) / np.sum (e^Z)`. |
| Uses **hardmax** : Assigning 1 to which ever probability is maximum. Hence the name hard max. | Uses **softmax**:  activation function for the last layer. Softmax gets its name because it produces probabilities that add up to 1 (rather than 1\|0) |
| Relu activation function is used for all hidden layers except the last. Sigmoid activation function is used for the last layer. | Relu activation function is used for all hidden layers except the last. Softmax activation function is used for the last layer. |
| `Cost function = -1/m * ( Y*np.log(AL) + (1-Y)*np.log(1-AL) )` | `Cost function = -Y*np.log(Ycap)`        |
| The cost function ensures high cost when Y and AL are not close, at times when Y=0 as well as when Y=1 | The cost function ensures high cost if the probability of the expected class is far from 1 |
| During back propagation, dZ for the last layer is given by <br />`dZ = -1 * (Y/AL - (1-Y)/(1-AL)) * g'(Z)` | During back propagation, dZ for the last layer is given by <br />`dZ = Ycap - Y` |

