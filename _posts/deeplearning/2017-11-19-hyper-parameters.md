---
layout: post
title: Hyper parameters
categories: dl
mathjax: true
---

{% include toc.html %}

# Table of hyper parameters

| Parameter           | Detail                                   |
| ------------------- | ---------------------------------------- |
| $$\alpha$$          | The learning rate. The derivative $$dW$$ and $$db$$ are multiplied by alpha to adjust weights. |
| $$\beta$$           | Momentum. Used to calculate the exponentially weighted average of the gradient ($$dW$$ and $$db$$). |
| mini match size     | Size of the mini batch                   |
| L                   | Number of layers                         |
| learning rate decay | Rate at which learning rate parameter should reduce after each epoch (iteration of one full batch) |
| $$\beta_{1}$$       | Used in Adam optimization for momentum of  $$dW$$ and $$db$$  (Typically : 0.9   ) |
| $$\beta_{2}$$       | Used in Adam optimization for momentum of $$dW^2$$  and  $$db^2$$  (Typically : 0.999 ) |
| $$\epsilon$$        | Used in Adam optimization to avoid divide by zero         (Typically : $$10^{-8}$$) |

# Hyper parameter scale

## Random sampling of hyper parameters

Sampling at random does not necessarily mean uniformly sampling at random. 
   - Uniform random search for parameter 'number of layers' over range (2, 4, 6, 8, 10) etc might make sense. 
   - Uniform random search for parameter 'alpha' over range (0, 0.2, 0.4, 0.6, 0.8, 1) does not make sense

## Why linear scale won't work for some hyper parameters?

Some hyper parameter do not linearly affect the system.  Small changes may cause small or extremely large impact depending on the current value of the hyper parameter.  

   - Current values of beta
      - If beta = 0.91, it will average over 11.11 days. 
      - If beta = 0.99, it will average over 99.99 days.
   - Add 0.005 to each of the above case
      - If beta = 0.91 + 0.005 = 0.915, it will average over  11.76 days. (Diff : 0.65)
      - If beta = 0.99 + 0.005 = 0.915, it will average over 199.99 days. (Diff : 100 )

## Choosing log scale

To select a uniformly random value over a scale 0.1 to 0.0001 ( $10^-1 to 10^-4$)

```python
exp = np.random.rand(1,5)    # Randomly select a value between 1 and 4
np.random.rand() * 10**-exp  # random number raised to the power
```

# Hyper parameter tuning practice

Periodically, retest hyper parameters to ensure it is not stale.


| Panda                                    | Caviar                                   |
| ---------------------------------------- | ---------------------------------------- |
| Babysit a model.                         | Train many models in parallel.           |
| Every day, watch the cost function, tweak parameters like learning rate until reasonable accuracy is achieved. | Execute multiple models with different hyper parameters to run in parallel. Select a model with best accuracy. |
| Need more human time and less GPUs.      | Needs less human time and more GPUs.     |
| Like a panda that takes care of one baby at a time. | Like fish that lays many eggs (caviar) and the fittest shall survive. |

# Orthogonalization

Consider a 90s television with several tuning knobs for width, height, move-vertical, move-horizontal and so on. We tune each parameter to desired value and then move to the next. Having one knob to adjust several parameters will cause more confusion and lead to chaos. 

| Model Status                             | Issue    | Resolution                               |
| ---------------------------------------- | -------- | ---------------------------------------- |
| Training set does not fit.               | Bias     | Use Bigger network. Use better optimization algorithm like Adam. |
| Training set fits. Dev does not fit.     | Variance | Regularization. Get more training data.  |
| Training and dev set fits. Test does not fit. |          | Formulation of dev/test set is not correct. Possible bug in cost function. |

# Single Number Evaluation

A numeric evaluation metric that incorporates all the function and provides a single number to optimize is required. Sometimes accuracy itself is not a good enough measure.

## Unacceptable errors

### Issue 

Consider a binary cat classifier model.

| Model | Accuracy | Nature of error                          |
| ----- | -------- | ---------------------------------------- |
| A     | 98.5%    | Few blurry cat images are not identified. |
| B     | 99.3%    | Few porn images are classified as cat.   |

Though the accuracy of model-B is much better than model-A. The nature of errors of model-B is unacceptable. Here, traditional accuracy is not a good measure. 

### Resolution

Training data can be associated with corresponding weight. Cost function shall include weight. Essentially, misclassification of certain training data will incur higher cost compared to others. Thus model-B will result in lesser accuracy.

## Skewed Classes

### Issue

Consider the binary classification problem of cancer detection from tumor. Most tumors, (say 99% of them) are benign. 

- A model that does a very good job at detecting benign tumors but a very poor job at detecting cancer tumors can have high accuracy (say 99.2%). 
- A model that just marks all tumors as benign will still have 99% accuracy

### Resolution

|                              | Actual Positive | Actual Negative (-) |
| :--------------------------: | :-------------: | :-----------------: |
| **Predicted Positive (+ve)** |    $$T_{p}$$    |      $$F_{p}$$      |
| **Predicted Negative (-ve)** |    $$F_{n}$$    |      $$T_{n}$$      |

- The cells will have +ve or -ve based on the prediction.
- If the prediction matches the actual its True else False

#### Prediction

A prediction is defined as follows

$$
Prediction \ = \ \frac{T_{p}}{T_{p} \ + \ F_{p}}
$$

- A higher prediction means $$\uparrow \ T_{p} \downarrow F_{p}$$ . This means very few false positives.
- When a tumor is predicted to be cancer - It is most likely cancer. (You can bet on +ve prediction)
- When a tumor is predicted to be benign - Could still be cancer. (You cannot be sure about -ve prediction)



#### Recall

A recall is defined as follows

$$
Recall \ = \ \frac{T_{p}}{T_{p} \ + \ F_{n}}
$$


- A higher recall means  $$\uparrow \ T_{p} \downarrow F_{n}$$ . This means very few false negatives.
- When a tumor is predicted to be benign - It is more likely benign. (You can bet on -ve prediction)
- When a tumor is predicted to be cancer - It could be benign. (You cannot be sure about +ve prediction)

#### F1 score

Both precision and recall have to be used to determine the accuracy of the model. We need a model with high precision and recall - These are two metrics. However, we need a single evaluation metric.

$$
F1 \ score \ = \ \frac{2}{\frac{1}{P} + \frac{1}{R}} \ = \ \frac{2PR}{P+R}
$$

>
> F1 score is obtained by taking the harmonic mean between precision(P) and recall (R)
>

