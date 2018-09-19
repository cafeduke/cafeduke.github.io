---
title: Data Augmentation
categories: dl-cnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Introduction

Computer vision needs to learn a complicated function. In order to do so large amounts of data is necessary. This is unlike other streams of machine learning where a mid size dataset could achieve good test performance. To meet this demand, more data is created by manipulating the existing data $$-$$ **data augmentation**.

# Augmentation techniques

- Mirroring
- Random Cropping
  - Crop a section of the original image
  - As long as the crop size is significantly large, we don't run the risk of cropping the the required content.
- Rotation
- Shearing
  - Skewing the image
- Color shifting
  - Increase/decrease the saturation of RGB values. 
  - As an example adding 20 to Red and Blue channels and subtracting 20 from green channel will add a purple tint to the image $$-$$ as if watching through a purple glass.
  - Make the algorithm more robust to variations in light.

# Dynamic augmentation during training

We could dynamically load images, augment them based on various techniques (described in previous section), create a dynamic batch ready to be trained next.

- A loader thread loads an image from the hard-disk and hands it over to the augmentation worker threads.
- Each augmentation worker thread performs its own augmentation in parallel. While one thread performs mirroring other might perform color shifting
- A batch of images is dynamically created. The batch is queued
- The training thread picks the next batch from the queue to train the network.