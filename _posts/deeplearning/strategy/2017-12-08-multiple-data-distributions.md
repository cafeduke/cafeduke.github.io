---
title: Multiple Data Distributions
categories: dl strategy
layout: post
mathjax: true
---

{% include toc.html %}

# Data distributions

With increased data, algorithms have shown to perform extremely well.

**Limitation:** There could be limitation to the data that can be collected from actual source (*actual distribution*). Like the camera acting as robot eye. 

**Requirement:** Algorithm should have **optimal** performance with data from **actual distribution**. 

**Availability:** New data keeps flowing in from various other distributions (by various teams working on fetching data) lets call it **synthesized distribution**.

- Data can be obtained by crawlers of the internet.
- Data can also be created by tweaking the existing data referred to as ***data augmentation***. 

Essentially, we need to make use of both actual and synthesized data to meet the requirement. *This requires dealing with different distributions*.

## Why not mix data from all the distributions?

Actual data could be in the order of 80K while the synthesized data could be around 1000K. Mixing the two will result in a single distribution -- no overhead of dealing with different distributions. We can then divide this data into training, dev and test datasets. However, this way, actual data will get dispersed. 

Final optimized algorithm cannot be guaranteed to work well in real world.

## Dividing data from different distributions

Typically, data is divided into training:dev:test in the ratio 60:20:20. When data is in the order of millions having 10K dev set and 10K test set is enough.

>
> **Entire** dev and test set **must** contain data from the **actual distribution**.
>

Creating dev set from actual distribution $$\rightarrow$$ Helps choose a model with hyper parameters that work with the real world data.

Creating test set from actual distribution $$\rightarrow$$ Gives the final performance of the chosen model.

  