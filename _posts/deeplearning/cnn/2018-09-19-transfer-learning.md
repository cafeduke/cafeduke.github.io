---
title: Transfer Learning
categories: dl-cnn
layout: post
mathjax: true
typora-root-url: ../../../
---

{% include toc.html %}

# Transfer learning for small dataset

Consider a pet classification problem where we need to identify if the given image is one of our pets or not. How do you develop a network when we have only few images of our pets (small dataset) $$-$$ Enter **transfer learning**.

>  Train a network using an existing trained network as base

## Algorithm

![TransferLearning](/assets/images/dl/TransferLearning.png)

- Use an existing trained network like **ImageNet** . This has softmax to output 1000 different classes classes
- Download not only the code but also the weights
- Replace the softmax layer with custom softmax to identify custom pets (Eg: PetA, PetB or None)
- Freeze learning on all layers except softmax layer. We are freezing the weights between layers. The only weight not frozen is the weight between the last layer of existing network and newly added softmax layer.
- Now train the network on the small dataset

## Speeding transfer learning

### Training Typical Network 

- Set the number of epochs to train
- For each epoch
  - Shuffle the training set and divide into batches
  - For each batch
    - Forward propagation $$-$$ calculate Zs and As (activations)
    - Back propagation $$-$$ Use the differentiation of the cost function to evaluate the gradients. 
    - Update the weights from the gradients.

Note that the weights of all the layers are adjusted after each batch. Now, since we are freezing the learning of the first n layers as in the above case, the weights of first n layers do not change. *This means for every $$x$$ in every epoch as input the resultant $$a$$ at the end of the nth layer shall be the same.*

### Speed Learning Frozen Network

- Compute activation $$A$$  obtained at the end of nth frozen layer for the training set $$X$$ 
- Save $$ Z, A $$ to disk and load during training.
- For each batch of $$x$$ get the the corresponding $$z,a$$  of the nth layer.
- Proceed with training and update weights of only the layers that are not frozen.

# Transfer learning for large dataset

If we have a larger dataset then we can accordingly reduce the number of frozen layers. 

For the layers that were not frozen we could 

- Use the original weights as initial weights 
- Clear the original weights and perform random initialization.

As an extreme case where the the dataset is pretty huge, we could not freeze any layer and use all original weights as initial weights and train them all.
