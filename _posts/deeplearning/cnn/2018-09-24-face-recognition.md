---
title: Face Recognition
categories: dl-cnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Introduction

An application of face recognition is authenticating a person using his face rather than ID card. Another application is recommending to tag friends in an image posted on social media (like facebook) $$-$$ This requires comparing two images and outputting if it belongs to the same person or not.

Consider the problem of identifying the person from an image. 

- Lets say we are 5 friends. 
- We could train a network model which outputs a softmax function (with 5 neurons) identifying the person. We could use thousands of images of each friend to train this network. 
- What happens when a another friend joins the group? We may have to first get 1000s of images of the new member and retrain the entire model for 6 friends. 

The above method is very tedious requiring frequent retraining and also impractical to get 1000s of images every-time there is a new member.  What we need is a **one-shot learning**.  By just having one image of each friend in the database, we should be able to identify if a given image is one of our friend or not.

The solution is to train a model to output a **similarity function** $$-$$ How similar are two images.

- A function d(img1, img2) will output a number that indicates the degree of difference between the images.
- A value less than a threshold indicates the images are similar. 
- A value greater than threshold indicates the images are different.

# Siamese Network

A Siamese network has a single convolution that can be trained to input two images and output the distance between them.  The distance is used to determine if the images belong to the same person or not.

Consider a CNN that outputs a vector of values (128) per input image. 

- Use the same network to get the output vectors for two images (say x1, x2).
- The output generated by the CNN are basically the **face feature encodings** for each image.
- Compute the distance between the two vectors.
- The network is trained to minimize the distance between the vectors, if x1 == x2 (Same person)
- The network is trained to maximize the distance between the vectors, if x1 != x2 (Different people)

![FaceSiamese](/assets/images/dl/FaceSiamese.png)

$$
\begin{aligned}
f(x1) &= Output \ vector \ with \ encoding \ of \ image \ x1 \\
f(x2) &= Output \ vector \ with \ encoding \ of \ image \ x2 \\
Distance \ between \ vectors \ &= \ \ d(x1, x2) \ = \ ( f(x1) - f(x2) )^2
\end{aligned}
$$

> Distance between two vectors could be the square root of the sum of squares of elements (SOP) of the vector.

# Triplet Loss Function

The Siamese network defined in the previous section will work well if the the network is well trained to output good  **face feature encodings**. One way to well train such a network is by using **triplet loss function**.

- The triplet loss function uses three pairs of images Anchor (A), Positive (P) and Negative
  - Anchor is the image under question
  - Positive is image of the same person as Anchor
  - Negative is image of a different person
- Calculate distance between anchor and positive image vectors. $$ d(A,P) = ( f(A) - f(P) )^2 $$
  -	$$d(A,P)$$ should ideally be a value close to 0 
- Calculate distance between anchor and negative image vectors. $$ d(A,N) = ( f(A) - f(N) )^2 $$ 
  -	$$d(A,N)$$ should ideally be a value close to 1 
- Let $$\alpha​$$ be the margin (distance separating two entities) between $$ d(A,P) ​$$ and $$ d(A,N) ​$$. Greater the  $$\alpha​$$ , greater distance is enforced between same and different images.

Now, a loss function (cost or error function) is a function that needs to be minimized ( $$ideally, 0$$) in order to improve the working of the algorithm.

$$
\begin{aligned}
\Delta &= d(A,P) - d(A,N) \\
Triplet \ Loss \ Function &= J(A,P,N) = max(0,\ d(A,P) - d(A,N) + \alpha)
\end{aligned}
$$

## Understanding triplet loss function

-	$$ \Delta$$ is a  negative number (ideally, $$ 0 - 1 = -1 $$)
-	We would want  $$\Delta$$ to be negative enough to reduce  $$\alpha$$ below zero. Essentially, we would like $$ \alpha + \Delta <= 0 $$
-	If $$\alpha = 0.9$$  and $$\Delta$$ is $$-0.8$$, the triplet loss function will evaluate $$max(0, -0.8+0.9) = max (0, 0.1) = 0.1$$ 
-	If the positive and negative distances are not far enough from each other, then the triplet loss function will be greater than zero.

> Triplet loss function penalizes if  $$d(A,P)$$ and $$d(A,N)$$ are closer than $$\alpha$$. 
> Training using triplet loss function will require choosing images from training dataset for A, P and N to minimize $$J(A,P,N)$$

## Choosing images for A, P and N

Let say we randomly choose triplets combinations for A, P and N. That is, we pick pick two random images of the same person for A and P and image of a flower for N. This is easy for the network to differentiate between a person and a flower. Hence, it is not trained to work well with tough data and may fail on test/real-world use cases.

In order to make the algorithm robust, we need to images of the same person with different styles (hair color, hair style, facial expression etc) for A and P.  The image of the person we choose for N should be pretty similar (similar nose, eyes, skin color etc) to the person chosen for A. 

> Commercial face recognition companies train on millions of images (Ranging from 10 million to even 100 million). These companies have **trained** networks and **posted weights online**. This can be used as base.

# CNN with binary classification

A model that uses CNN with binary classification can used as an alternative to triplet loss for image recognition. 

![Face_BinaryClass](/assets/images/dl/Face_BinaryClass.png)

The CNN network takes two images as input and outputs a binary (1/0) output to indicate same or different images

- The overall network has two convolutions $$-$$ one per image. 
- Let $$f(x_i)$$ and $$f(x_j)$$ be the corresponding output encoding vectors.
- $$ f(x_i)$$ and $$f(x_j) $$ are concatenated to form $$x$$ which acts as input to a logistic regression. (Just like a logistic regression problem taking a bunch of features $$x$$ and outputting (1/0) indicating if the tumor is cancerous or not.)

# Face recognition during test time

Once a CNN for face recognition is well trained (using image pairs that are quite challenging to solve, even for human) it can be used to compare any two faces (Faces that were never seen earlier by the network). 

In a company setting

- A single image of all employees is inputted and only the *output feature encodings* are saved in database.
- When an employee approaches for authentication, his image from the camera passes though the CNN to obtain feature encoding. 
- We now have feature encoding of the input image to be compared with feature encodings of all employees. This is done in one of the following ways
  - Calculate distance between encodings.
  - Feed each pair of encodings to a Logistic Regression that gives a binary output (same or not)

