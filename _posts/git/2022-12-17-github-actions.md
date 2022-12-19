---
title: GitHub Actions
categories: git
layout: post
mathjax: true
typora-root-url: ../../
---

{% include toc.html %}

# Introduction

GitHub Actions provide a platform to automate software development **workflows**. One such popular workflow is CI/CD (Continuous Integration & Continuous Deployment). However, there are several other workflows that can be automated using GitHub Actions as well.

Let's say a new employee joins the company (**event** occurred). There are checklist of **actions** to be carried out (**workflow**) like, a cubical has to allotted, computer has to be procured from IT, computer has to setup with necessary software, a meal coupon has to be provided for the employee, a welcome kit has to be provided for the employee etc. It is ideal to automate execution of such a workflow when a corresponding event gets triggered.

> An **event** automatically triggers corresponding **workflow** that execute a list of **actions**

**Sample GitHub events and workflows**

| Event                    | Workflow                  | Actions                                                      |
| ------------------------ | ------------------------- | ------------------------------------------------------------ |
| New contributor joins    | new-contributor-workflow  | Send welcome email<br />Create credentials for the contributor |
| Pull request is created  | new-pull-request-workflow | Notify lead developer<br />Run automated tests against the developer branch |
| New issue/bug is created | new-bug-workflow          | Assign bug to developer based on area of expertise<br />Assign appropriate labels to the bug<br />Notify the developer owning the bug<br />Notify the lead developer |

