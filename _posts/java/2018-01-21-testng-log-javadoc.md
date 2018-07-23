---
layout: post
title: Structure TestNG logs like Javadocs
category: java
typora-root-url: ../../
---

{% include toc.html %}



![test](https://github.com/favicon.ico)

# Introduction

This [article](https://community.oracle.com/docs/DOC-916315) (*published in Oracle Technology Network*)  describes how to build a test framework that  ensures logs from test classes and TestNG listeners that are executing  in parallel reach the appropriate log file and are organized in a format similar to that of Javadocs.

![TestBG log stuctured as Javadocs](https://raw.githubusercontent.com/cafeduke/jreportng/master/etc/doc/images/Log.jpg)

# Abstract

[TestNG](http://testng.org/doc/index.html)  is a popular open source test automation framework. Logging is a  critical part of test execution, and informative and accessible logs  contribute to effective debugging. This article provides a model for  utilizing TestNG and [Java Logging APIs](http://docs.oracle.com/javase/8/docs/technotes/guides/logging/index.html) capture logs and organize them in a format similar to Javadocs. 

Logging is a [cross-cutting concern](http://en.wikipedia.org/wiki/Cross-cutting_concern) that is well addressed by the TestNG listeners incorporating the [observer design pattern](http://en.wikipedia.org/wiki/Observer_pattern).  Logging is related to various test execution lifecycle states—such as  test start, success, failure, skip, and completion—that can be handled  by the listener. The listener also provides callbacks that can be used  to log the beginning and completion of various stages of test execution,  such as TestNG instance, test suite, test element, and test method.  Furthermore, there are callbacks (for example, [`@BeforeClass`](http://testng.org/javadoc/org/testng/annotations/BeforeClass.html), [`@AfterClass`](http://testng.org/javadoc/org/testng/annotations/AfterClass.html)) to log the success, failure, and skipping of configuration methods as well. In addition, the open source library [ReportNG](http://reportng.uncommons.org/) (which uses TestNG listeners) can be customized to generate a comprehensive and elegant HTML report. 

TestNG  also provides a framework for parallel test execution. Java Logging  APIs can be utilized to ensure thread-safe logging from numerous  threads, logging within test cases, as well as callback functions within  listeners. However, increased test execution in parallel interleaves  logs from various test cases, which makes it difficult to isolate the  logs for a given test case. The higher the number of test cases, the  larger the size of the resulting test log file, which slows the  rendering of the ReportNG HTML report. You can roll over the logs, but  that would still make it difficult to find the log files for a given  test case. 

The  solution proposed here ensures that all logs from a given TestNG test  class reside in one HTML file. The HTML filename can match the fully  qualified class name. The HTML files can be linked into a format similar  to that of Javadocs (see diagram). You can select the package and  select the corresponding class to view the logs related to just that  test class, even when the tests have executed in parallel.

Please refer to  [article](https://community.oracle.com/docs/DOC-916315) for details.

# Open-source Maven library

An Html report (similar to one given below)  integreated with customized  [ReportNG](http://reportng.uncommons.org/) can be created using the JReportNG library available in [Maven Central](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22jreportng%22)

```xml
<dependency>
    <groupId>com.github.cafeduke</groupId>
    <artifactId>jreportng</artifactId>
    <version>1.2</version>
</dependency>
```




[![Report Overview](https://raw.githubusercontent.com/cafeduke/jreportng/master/etc/doc/images/Overview.jpg)](https://github.com/cafeduke/jreportng/wiki)

