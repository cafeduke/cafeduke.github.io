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

## Parallel Execution

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





