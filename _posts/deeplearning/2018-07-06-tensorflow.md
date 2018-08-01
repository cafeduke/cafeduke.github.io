---
title: Tensorflow
categories: dl
layout: post
mathjax: true
typora-root-url: ../../
---

{% include toc.html %}

# Introduction

Tensor flow is an open source, flexible, scalable, production-ready, python library that supports **distributed computing** for numerical computation $$-$$ particularly suited for **large scale machine learning**

- Tensor API `tensorflow.contrib.learn` is compatible with SciKit Learn
- **Tensor Board** $$-$$ A great visualization tool
- **Cloud service** to run Tensor flow graphs

## Tensorflow Parallel Execution

Tensorflow operations (shortened as **ops**) can take any number of inputs and produce one ouput. Inputs and ouput are multidimensional array called **tensors**.

- Addition, multiplication ops take two input and produce one output
- Constants and variables take no input (*source ops*)

> In Python Tensors are input/output NumPy arrays that have a type (typically float) and shape.

- A computation graph is created
- The graph can be broken down to chunks that can be executed in parallel on CPU/GPU

![TensorEquation](/assets/images/TensorEquation.png)

How **big** are we talking about $$-$$ Millions of features `n` with billions of instances `m`

## Computation Graph

### Construction Phase $-$ Create Computation Graph

The following code *only* creates a **default computation graph** , but does NOT execute.

```python
import tensorflow as tf

x = tf.Variable(3, name='x')
y = tf.Variable(4, name='y')
f = x*x*y + y + 2
```

### Execution Phase - Run Computation Graph

To evaluate the graph it must be placed in **tensor flow session**.  The tensor flow session holds the variable values.

#### Session without **with** block

```python
session = tf.Session()
session.run(x.initializer)
session.run(y.initializer)
result = session.run(f)
print (result)
session.close()
```

#### Session using **with** block

```python
with tf.Session as session:
    x.initializer.run()
    y.initializer.run()
    result = f.eval()
```

- The session object is initialized as the default session.
- The session created is automatically closed a the end of the block

> `f.eval()` is equivalent to calling `tf.get_default_session().run(f)`

#### Default Session and Global variables initializer

```python
# Prepare an init node
init = tf.global_vairables_initializer()

# Note that a with block is required. No need to close session
with tf.Session as session:
    init.run()
    result = f.eval()
```

#### Interractive Session and Global variables initializer

```python
# Prepare an init node
init = tf.global_vairables_initializer()

# Interractive session automatically set itself as default session -- No with block
session = tf.InterractiveSession()
init.run()
result = f.eval()

# Session need to be closed
session.close()
```

### Custom Computation Graph Object

By default any node created is added to default graph. 

```python
x = tf.Variable(1)
x.graph is tf.get_default_graph() # True
```

A custom graph can be created and used as follows

```python
graph = tf.Graph()
with graph.as_default():
    x = tf.Variable(1)
    x.graph is tf.get_default_graph() # False
```

# Linear Regression With Tensorflow

The benifit of the below code vs using the LinearRegression library is that  Tensorflow will automatically run on GPU if present.

```python
import numpy as np
from sklearn.datasets import fetch_california_housing

housing = fetch_california_housing()
m, n = housing.data.shape
housing_data_plus_bias = np.c_[np.ones((m, 1)), housing.data]

# X.shape == (m,n)
X = tf.constant(housing_data_plus_bias, dtype=tf.float32, name="X")

# y.shape == (n,1)
y = tf.constant(housing.target.reshape(-1, 1), dtype=tf.float32, name="y")

# XT.shape == (n,m)
XT = tf.transpose(X)

# theta = (X.T . X)^-1 . X.T . y
theta = tf.matmul(tf.matmul(tf.matrix_inverse(tf.matmul(XT, X)), XT), y)

with tf.Session() as sess:
    theta_value = theta.eval()
```

# Gradient Descent with Tensorflow

## Concept

- We are using $w$ instead of $\theta$ as this shall be the norm in deep learning.
- $X$ is the input column matrix of shape `n x m` where `n` is the number of features and `m` is the dataset size.
- $W$ are the weights (parameters) that need to be adjusted after each iteration to increase the accuracy of the prediction.
- $J$ is the cost function.

Repeat the following for each `j` from `1 to n`. 


$$
\begin{aligned}
w =  (w _{0} ,\ w _{1} ,\ w _{2} ,\ ...,\ w _{n}) \\
w _{j} \ =\ w _{j} \ -\ \alpha \frac{\partial }{\partial w _{j}} J(w) \\
\end{aligned}
$$

In case of Linear Regression

$$
\begin{aligned}
J = \frac{1}{m}\left[ w^{T}.X -\ y\right]^{2}
\end{aligned}
$$

Solving the partial derivative we get

$$
\begin{aligned}
w \ =\ w \ -\ \alpha \frac{2}{m} \left[ w^{T}.X \ - \ y \ \right].X
\end{aligned}
$$

## Manually computing gradient descent

The issue with manually computing gradient descent is *manual calculation of the derivaties*. 

```python
n_epochs = 1000
learning_rate = 0.01

# X.shape == (n, m) y.shape == (1, m) w.shape == (n, 1)
X = tf.constant(scaled_housing_data_plus_bias.T, dtype=tf.float32, name="X")
y = tf.constant(housing.target.reshape(1, -1), dtype=tf.float32, name="y")
w = tf.Variable(tf.random_uniform([n + 1, 1], -1.0, 1.0), name="w")
y_pred = tf.matmul(w.T, X, name="predictions")

# error.shape == (1,m)
error = y_pred - y
cost_function = tf.reduce_mean(tf.square(error), name="cost_function")

# gradients.shape == (n, 1)
gradients = 2/m * tf.matmul(X, tf.transform(error))

# Adjusted weights
training_op = tf.assign(w, w - learning_rate * gradients)

init = tf.global_variables_initializer()
with tf.Session() as sess:
    sess.run(init)
    for epoch in range(n_epochs):
        # Print the cost after every 100 iterations
        if epoch % 100 == 0:
            print("Epoch", epoch, "Cost =", cost_function.eval())
        training_op.eval()

    best_w = w.eval()
```

## Autodiff

Automatically compute the gradients given the **ops** `cost_function` and `weights`

```python
gradients = tf.gradients(cost_function, [w])[0]
```

## Optimizer

Tensorflow provides several optimizers like Gradient/Momentum optimizers that can used to calculate the partial derivatives as follows.

### Standard Optimizer

```python
# Adjusted weights
optimizer = tf.train.GradientDescentOptimizer(learning_rate=learning_rate)
training_op = optimizer.minimize(cost_function)
```

### Momentum Optimizer

```python
# Adjusted weights
optimizer = tf.train.MomentumOptimizer(learning_rate=learning_rate, momentum=0.9)
training_op = optimizer.minimize(cost_function)
```

# Placeholder Node

Placeholder nodes do not actually perform any computation. 

- The value for a placeholder node is supplied at runtime
- An exception is thrown if no value is provided for a placeholder node.



## Creating Placeholder Node

- Use the `tf.placeholder` and provide the output data type and optionally, shape.
- `None` in the dimension indicates **any size**.

The following code creates a placeholder `A` to store `floats` with any number of rows but 3 columns.

```python
A = tf.placeholder(tf.float32, shape=(None, 3))
```

## Dynamic values to Placeholder Node

While evaluating a node that depends on a placeholder node, the placeholder values are fed using **feed_dict**

```python
A = tf.placeholder(tf.float32, shape=(None, 3))
B = A + 5
with tf.Session() as sess:
    B_val_1 = B.eval(feed_dict={A: [[1, 2, 3]]})
    B_val_2 = B.eval(feed_dict={A: [[4, 5, 6], [7, 8, 9]]})

print(B_val_1)
[[ 6.  7.  8.]]

print(B_val_2)
[[  9.  10.  11.]
 [ 12.  13.  14.]]
```



```python
n_epochs = 1000
learning_rate = 0.01

# X is column matrix
# X.shape == (n, m) y.shape == (1, m) w.shape == (n, 1)
X = tf.placeholder(tf.float32, shape(n+1, None), name="X")
y = tf.placeholder(tf.float32, shape(  1, None), name="y")
w = tf.Variable(tf.random_uniform([n + 1, 1], -1.0, 1.0), name="w")
y_pred = tf.matmul(w.T, X, name="predictions")

# error.shape == (1,m)
error = y_pred - y
cost_function = tf.reduce_mean(tf.square(error), name="cost_function")

# Tensorflow optimizer computes the gradients
optimizer = tf.train.MomentumOptimizer(learning_rate=learning_rate, momentum=0.9)
training_op = optimizer.minimize(cost_fuction)

# Fix the size of each batch
batch_size = 100
batch_count = int(np.ceil(m / batch_size))

init = tf.global_variables_initializer()
with tf.Session() as sess:
    sess.run(init)
    for epoch in range(n_epochs):
        for batch_index in range(batch_count):
            X_batch, y_batch = fetch_batch(epoch, batch_index, batch_size)
            w = w - training_op.eval(feed_dict={X:X_batch, y:y_batch})
            
        # Print the cost after every 100 iterations
        if epoch % 100 == 0:
            print("Epoch", epoch, "Cost =", cost_function.eval())
        sess.run(training_op)

    best_w = w.eval()    
    
def fetch_batch(epoch, batch_index, batch_size):
    '''
	Fetch batch of size `batch_size` starting with `batch_index`
    '''
    # load the data from disk
    return X_batch, y_batch    
```



