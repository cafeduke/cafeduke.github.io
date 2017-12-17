---
title: Baye's error and human error
categories: dl
layout: post
mathjax: true
---

{% include toc.html %}

# Introduction

Consider the following model

| Error Type | Percentage error |
| ---------- | ---------------- |
| Training   | 8%               |
| Dev        | 10%              |
| Test       | 11%              |

It appears that the model is suffering from **bias = 8%** . This analysis is based on the assumption that training error should ideally be close to zero. However, not all models can be trained to have close to zero error. Sometimes it could be technically impossible to reduce the error below a certain value known as the ***Baye's error (Bayesian error)***

> Bayes error is the minimum possible error for a given model -- It is impossible to reduce the error below Baye's error

# Baye's Vs human error

Human error is the minimum error with which human can perform the task expected out of the model. When we say human, it refers to the best of the best (or a group of expert humans) suited for the task. *Even with an expert group, human error comes close to but can never be lesser than Baye's error.* 

## Why do we need baye's error?

Consider the same model. This time we have additional information -- Baye's error.

| Error type | Percentage error |
| ---------- | ---------------- |
| Bayes      | 7.5%             |
| Training   | 8%               |
| Dev        | 10%              |
| Test       | 11%              |

With the Baye's error in picture we are able to analyze that

- We know that training error cannot go below 7.5% so the bias is only 0.5%. 
- This bias that can be avoided with a better model is called ***Avoidable Bias***. 

$$
Avoidable Bias \ = \ Training \ error \ - \ Dev \ error
$$

- The variance with the model is 10% - 8% = 2%
- The model is suffering from a higher variance.

Essentially, without the Baye's error we would have assumed the minimum possible error to be zero and diagnosed the model to have bias. Now, we know that the model has more variance.

## How human error compares to Baye's error?

Humans are pretty good at certain tasks like computer vision, natural language processing and speech recognition. For these tasks human error can be used as a proxy for Baye's error. 

However, consider a task like identifying a subtle bone fracture from x-ray. After being trained over millions of x-ray images, it is possible for the model to be better than the best of doctors in analyzing the x-ray. In this case human error is no longer a proxy for Baye's error. (There might be no clear way to find the real value of Baye's error)

# Case studies

| Error type    |        Case A         |    Case B     |        Case C         |     Case D      |
| ------------- | :-------------------: | :-----------: | :-------------------: | :-------------: |
| Expert humans |         0.5%          |     0.5%      |         0.5%          |      0.5%       |
| Average human |         0.7%          |     0.7%      |         0.7%          |       1%        |
| Training      |          5%           |      1%       |         0.7%          |      0.3%       |
| Dev           |          6%           |      5%       |         0.75%         |      0.4%       |
| Test          |         6.1%          |     5.1%      |         0.78%         |      0.45%      |
| **Verdict**   | Avoidable bias = 4.5% | Variance = 4% | Avoidable bias = 0.2% | Variance = 0.1% |

## Case A

- Avoidable bias = 5 - 0.5 = 4.5%
- Variance = 6 - 5 = 1%

**Verdict:** The model has an avoidable bias of 4.5%.

## Case B

- Avoidable bias = 5 - 0.5 = 4.5%
- Variance = 5 - 1 = 4%

**Verdict:** The model has a variance of 4%.

## Case C

- Avoidable bias = 0.7 - 0.5 = 0.2%. 
- Variance = 0.75 - 0.7 = 0.05%

**Verdict:**The model has an avoidable bias of 0.2%.

Note 

- Without the analysis from expert humans, considering only average humans, the algorithm has a bias of 0%. We might have thought the model cannot be improved further.
- Knowing that average human error = training error, variance is also as low as 0.05%, we realize that model is already pretty much in par with average human.
- Since test error - average human error is as low as 0.08%, the model can be considered ready to be shipped. 

## Case D

- Avoidable bias = 0.3 - 0.5 = **-0.2%**
- Variance = 0.4 - 0.3 = 0.1%

**Verdict:**The model has a variance of 0.1%

Note 

- A negative avoidable bias indicates that the algorithm has surpassed the expert humans.
- Test error - expert human error = -0.05%. This means model is better than humans.
- Since we don't know the Baye's error, we cannot assert or deny that there is more room for improving the model.

# Model better than expert human

As in the Case D above, it is possible that the test error of a model is lesser than the expert human error. This means the model is now better than the expert humans combined. The Baye's error might be close or there might be room for improvement -- both possibilities exist.

However, we need more training data to improve the model. The training data with input ($$X$$) and expected output ($$Y$$) was based on expert human opinion. Now that the model is better than human, training the model based on human determined input/output may not reduce error further.

Essentially, there is no clear way of proceeding further from here. We could try randomly tweaking certain hyper parameters and see if the model improves.