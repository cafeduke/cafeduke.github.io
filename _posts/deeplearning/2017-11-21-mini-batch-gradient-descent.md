# Mini batch gradient descent

## Limitation of batch gradient descent

Batch gradient descent becomes slower as the training set size increases. With data like 5 million training examples, the size of the matrix becomes huge and training slows down. This can be addressed using mini batch gradient descent

## Algorithm

Mini batch gradient descent performs the following for each iteration (*one epoch*) of the entire training set

- Shuffle `X` and `Y`
- Initialize $$v_{dW^{[l]}},  v_{db^{[l]}}$$ vectors which have the same size as $$W^{[l]}, b^{[l]}$$ vectors to zero
- Divide the `X` into mini batches `mini-batch-count`  each of size `mini-batch-size`
- Perform forward propagation of neural network
- Compute cost for the mini batch
- Perform back propagation of neural network
- Calculate the *exponentially weighted average* (running average) of `dW` and `db`
$$
v_{dW^{[l]}} = \beta v_{dW^{[l]}} + (1 - \beta) dW^{[l]} \\
  v_{db^{[l]}} = \beta v_{db^{[l]}} + (1 - \beta) db^{[l]}
$$
- Update the weights
  $$
  W^{[l]} = W^{[l]} - \alpha v_{dW^{[l]}} \\
  b^{[l]} = b^{[l]} - \alpha v_{db^{[l]}}
  $$

  ## Batch Vs mini Vs stochastic descent


| Batch gradient descent                   | Mini batch gradient descent              |
| ---------------------------------------- | ---------------------------------------- |
| Cost **never** goes higher, not even for a single iteration. If the cost goes up then there is something wrong -- Perhaps the learning rate is too large. | Cost may not go up in every iteration. This is because, each time, cost is computed on a different mini batch. |
| The path to the optimum value is smooth and there is no noise | The path to the optimum value is noisy, however there is trend towards cost reduction. |
| Converges to the minimum                 | Wanders around the minimal area without actually converging. |
| Fast for small to medium training set sizes as vectorization is used. | If the size of the mini batch is small all the parallelism gained from vectorization is lost . |
| Slow to process large training set sizes. | For large training set the size of mini batch is substantial and takes advantage of vectorization. |
| One epoch will result in one step in gradient descent. | Each mini batch will take a step in gradient descent. So, one epoch will take `mini-batch-count` steps |
| Several epochs are required to reach optima. | Few epoch (some times just one) are enough. |



## Stochastic Gradient Descent

An extreme case where `mini-batch-size` is set to `1`.  All the parallel execution advantage got from vectorization is lost. However, this provides the fastest training though not accurate as it proceeds and will have maximum noise.

## Choosing mini batch size

| Training Data Size | Mini batch size                          |
| ------------------ | ---------------------------------------- |
| <= 2000            | Use batch gradient descent. So `mini-batch-size = m` |
| > 2000             | Pick a mini batch size that is a power of 2 ranging from $$2^6 - 2^9$$ |

