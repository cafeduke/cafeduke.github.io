---
title: Bias, Variance & data mismatch during multiple distributions
categories: dl
layout: post
mathjax: true
---

{% include toc.html %}

# Data mismatch

Consider the following scenario

| Dataset  | Percentage error |
| -------- | ---------------- |
| Human    | 0%               |
| Training | 1%               |
| Dev      | 10%              |
| Test     | 11%              |

Single distribution across training, dev and test

- Variance - overfitting the training set.

Different distribution for training compared to dev/test

- Could be variance
- Could be because model is seeing new type of data never seen during training $$\rightarrow$$ **Data mismatch**


Essentially, when training data is from different distribution and test/dev is from another, we cannot point out the issue with the model. Without knowing the issue we cannot fix.

# The training-dev dataset

Two things have changed in our dev set

- The usual change $$\rightarrow$$ Dev data is new (unseen by model during training) 
- The new change $$\rightarrow$$ Dev data distribution is new from the training data distribution.

Since two things have changed we cannot narrow down to which change has increased dev error.

>
> A **training-dev** dataset has following properties
>
> - Has the same size as dev and test datasets
> - Has the same distribution as training dataset (Scooped from training set)
> - Like dev, training-dev is **not** part of model training
>



# Diagnose model

## Identifying data mismatch

The below diagram depicts what the difference between various errors indicate

```
Human           +---+
                    |-----> Avoidable Bias    
Training        +---+
                    |-----> Variance
Training-dev    +---+
                    |-----> Data mismatch
Dev             +---+
                    |-----> Dev overfiting
Test            +---+
```



## Case analysis

| Dataset      |    Case A    |      Case B       |  Case C  |             Case D             |                  Case E                  |      Case F      |
| ------------ | :----------: | :---------------: | :------: | :----------------------------: | :--------------------------------------: | :--------------: |
| Human        |      0%      |        0%         |    0%    |               0%               |                    4%                    |        4%        |
| Training     |      1%      |        1%         |   10%    |              10%               |                    7%                    |        7%        |
| Training-dev |      9%      |       1.5%        |   11%    |              11%               |                   10%                    |       10%        |
| Dev          |     10%      |        10%        |   12%    |              20%               |                   12%                    |        6%        |
| Test         |     11%      |        11%        |   13%    |              21%               |                   13%                    |       6.1%       |
| **Verdict**  | $$Variance$$ | $$Data-mismatch$$ | $$Bias$$ | $$Bias \\ + \\ Data-mismatch$$ | $$Bias=3 \\ Variance=3\\Data-mismatch=2$$ | $$Dev \ easier$$ |

**Case E**

- We have bias and variance as well as some amount of data mismatch

**Case F**

- The model seems to have bias and variance 
- The model however performed better on the dev and test datasets $$\rightarrow$$ This is what we really care about
- This happens if training data is harder while the actual data (test/dev) is easier for the model resulting in lesser error.
- Since the error in the test is closer to human error, it can used in production.


# Fix data mismatch

There are no well laid out mechanisms to fix data mismatch. One obvious way is manually looking into the failed dev set examples, perhaps certain cases were never considered during training. For example, baby cheetah images in dev set misclassified as cat. We can now add a lot of baby lion, tiger and cheetah images to the training set.

Another useful method is work on the following table for intuition.

|                                 | Distribution A | Distribution B |
| ------------------------------- | :------------: | :------------: |
| Human Level                     |       A        |       X        |
| Error on data seen by model     |       B        |       Y        |
| Error on data not seen by model |       C        |       Z        |

```
B - A = Avoidable bias
C - B = Variance
Z - C = Data mismatch
X     = Human error on real world data
Y     = Training error using only real world data
```

## Data-mismatch case analysis

|                                 | Distribution A | Distribution B |
| ------------------------------- | :------------: | :------------: |
| Human Level                     |     A = 6%     |    X = 12%     |
| Error on data seen by model     |     B = 7%     |    Y = 13%     |
| Error on data not seen by model |     C = 8%     |    Z = 13%     |

Considering A, B, C and Z we see that

- Model has only 1% avoidable bias and only 1% variance.
- The data-mismatch is  5% (relatively high)
- Filling X, tells us that even humans are not great at dealing with Distribution-B
- Filling Y, tells us that that model when trained using only Distribution-B performs comparable to humans

Essentially, the model is doing the best and it is the distribution that needs betterment. For example, perhaps the camera quality went bad or is covered by fog and the robot took bad pictures.  Filling X and Y may give better intuition.