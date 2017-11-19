[TOC]

# Hyper parameters
| Parameter           | Detail                                   |
| ------------------- | ---------------------------------------- |
| alpha               | The learning rate. The derivative `dW` and `db` are multiplied by alpha to adjust weights. |
| beta                | Momentum. Used to calculate the exponentially weighted average of the gradient (`dW` and `db`). |
| mini match size     | Size of the mini batch                   |
| L                   | Number of layers                         |
| learning rate decay | Rate at which learning rate parameter should reduce after each epoch (iteration of one full batch) |
| beta1               | Used in Adam optimization for momentum of  $dW$ and $db$  (Typically : 0.9   ) |
| beta2               | Used in Adam optimization for momentum of $dW^2$  and  $db^2$  (Typically : 0.999 ) |
| epsilon             | Used in Adam optimization to avoid divide by zero         (Typically : 10^-8 |

# Hyper parameter scale

## Random Sampling Of Hyper parameters

Sampling at random does not necessarily mean uniformly sampling at random. 
   - Uniformly random search for parameter 'number of layers' over range (2, 4, 6, 8, 10) etc might make sense
   - Uniformly random search for parameter 'alpha' over range (0.1, 0.4, 0.6, 0.8, 1) does not make sense

## Why linear scale won't work for some hyper parameters

Some hyper parameter do not linearly affect the system.  Small changes may cause small or extremely large impact depending on the current value of the hyper parameter.  

   - Current values of beta
      - If beta = 0.91, it will average over 11.11 days. 
      - If beta = 0.99, it will average over 99.99 days.
   - Add 0.005 to each of the above case
      - If beta = 0.91 + 0.005 = 0.915, it will average over  11.76 days. (Diff : 0.65)
      - If beta = 0.99 + 0.005 = 0.915, it will average over 199.99 days. (Diff : 100 )

### Choosing log scale

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
