---
layout: post
title: Error Analysis
categories: dl-strategy
mathjax: true
---

{% include toc.html %}

# Introduction

If the algorithm is learning a task that humans can do and if it is not as good as *humans then humans can manually looking at the failed/misclassified scenarios* can give some insights into the next steps to taken. The process is referred to as error analysis.

# Perform Error Analysis

## Evaluate impact of error criteria

If a cat classifier is misclassifying some images of dogs and blurry cat images -- We could spend more time on adding dog images to the dataset. Is it worth?

To know the worth we can perform error analysis as follows

- Take 100 random misclassified (mislabeled) examples from **dev set**.
- How many have a suspected pattern (Like are dog images)
- By what percentage will fixing the issue decrease error?
  - If 50 out of 100 mis-classifications are images of dog then then it will reduce error by 50%
  - If 5 out of 100 mis-classifications are images of dog then it will reduce error only by 5%

>
> Error analysis evaluates the impact of a criteria by considering the time taken to complete  the task Vs the error reduction provided by the task upon completion.
>

## Evaluate multiple criteria in parallel

To evaluate various ideas that have result in misclassification

- Create a table for all the misclassified image and check all the criteria they match
- Add comments to later identify any special cases
- Calculate what percentage of total images match a given criteria (Number of checks in column / total number of images)*100.
- Comments may help identify new criteria

| Misclassified image     |      Dog       |    Big Cat     |     Blurry     | Comments                  |
| ----------------------- | :------------: | :------------: | :------------: | ------------------------- |
| Image01                 | :white_check_mark:  |                |                | pitbull                   |
| Image02                 |                | :white_check_mark:  | :white_check_mark:  | blurry lion image in rain |
| ...                     |                |                |                |                           |
| **Criteria Percentage** |       9%       |      48%       |      65%       |                           |

The above table provides a *ceiling on performance* that guides us on the criteria worth perusing.

>
> **Ceiling on performance** is the maximum performance gain that be obtained.
>

# Cleaning incorrectly labeled data

## Incorrectly labeled data in training set

Random errors

 - Errors formed due to typos or human negligence.
 - DL algorithms are robust and can stand moderate amount of random errors

Systematic errors

- Errors that fall into a pattern like marking all white dogs as cats.
- DL algorithms are not robust to these 

## Incorrectly labeled data in dev/test set

Add incorrect label column - This a mistake in labeling (Y).


| Misclassified image     |      Dog       |    Big Cat     |     Blurry     | Incorrect Label | Comments                  |
| ----------------------- | :------------: | :------------: | :------------: | :-------------: | ------------------------- |
| Image01                 | :white_check_mark:  |                |                |                 | pitbull                   |
| Image02                 |                | :white_check_mark:  | :white_check_mark:  |                 | blurry lion image in rain |
| Image03                 |                |                |                | :white_check_mark:   | Missed cat in background  |
| ...                     |                |                |                |                 |                           |
| **Criteria Percentage** |       9%       |      48%       |      65%       |       6%        |                           |

Image03 -- The algorithm marked 1 while the label is marked 0. The labeler missed a cat in background and the algorithm is right.

### Worth of fixing Incorrect labels in dev/test set

| Item                                     |            Case A |              Case B |
| ---------------------------------------- | ----------------: | ------------------: |
| Overall error (dev/test set)             |             10.0% |                2.0% |
| What percent of overall error is incorrect label |   6% of 10 = 0.6% |     30% of 2 = 0.6% |
| What percent of overall error is other criteria |   10 - 0.6 = 9.4% |      2 - 0.6 = 1.4% |
| **Verdict**                              | Investigate other | Fix incorrect label |

### Fixing Incorrect labels in dev/test set

- Ensure dev/test set come from the same distribution. Apply same process to both dev and test.
- Train set distribution may be slightly different from test/dev distribution. We may not fix the train the way we fixed dev/test.
- Check the examples where algorithm is wrong as well as the ones where it is right.