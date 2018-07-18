---
layout: post
title: Lambda Standard Functional Interface - Consumer  
category: java
typora-root-url: ../../
---


# Lambda - Standard Functional Interface - Supplier  

  
  

## Standard Functional Interface

Standard functional interfaces are functional interfaces provided by Java available in java.util.function package.  

## @FunctionalInterface - Consumer

Interface [Consumer](https://docs.oracle.com/javase/8/docs/api/java/util/function/Consumer.html) is a standard functional interface and possibly the simplest. A consumer has an abstract method `accept` with the following signature.  
```java
@FunctionalInterface  
public interface Consumer<T>  
{  
   void accept (T t)  
   ...  
}
```
We find that the functional interface `Consumer`, of generic type `T`, has the abstract method that accepts `T` and returns void.

### Consumer greeting  

An object of type `Consumer<String>` is created using a lambda expression that accepts a `String` and returns void. Here, we accept an argument `'s'` and print a greeting.
```java
Consumer<String\> consumerGreeting = (s) -> System.out.println ("Hello, " \+ s);  
consumerGreeting.accept ("Lambda");
```
```java
Output:  
Hello, Lambda
```

### Print consumer

We shall create a print consumer to print a string and use it in upcoming lambda expressions. Note that the `doPrint` consumer is declared final as it shall be used by other lambda expressions. The consumer shall be effectively final anyways.  
```java
final Consumer<String\> doPrint = (s) -> System.out.println(s);  
doPrint.accept("Hello World");
```
```java
Output:  
Hello World
```

### Consumer log

In this example, we create a `Consumer<String>` that appends metadata information (like timestamp) to a log message.  
```java
Consumer<String\> logMesg = (s) -> doPrint.accept("[" \+ new Date () \+ "] " \+ s);  
logMesg.accept("Finished");
```
```java
utput:  
[Mon Feb 15 19:05:45 IST 2016] Finished
```

### Noop consumer

A consumer need not return anything and need not perform anything with the argument it received. This might not be useful but valid.  
```java
Consumer<String\> consumerNoop = (s) -> {};
```
Note that there is empty open and close braces since `(s) -> ;` is syntactically incorrect and would result in a compilation error.  

### Primitive consumer

We have consumers for primitive datatypes - [IntConsumer](https://docs.oracle.com/javase/8/docs/api/java/util/function/IntConsumer.html), [LongConsumer](https://docs.oracle.com/javase/8/docs/api/java/util/function/LongConsumer.html) and [DoubleConsumer](https://docs.oracle.com/javase/8/docs/api/java/util/function/DoubleConsumer.html). These consumers have an abstract method that accepts the corresponding primitive data type and returns void. For example, an [IntConsumer](https://docs.oracle.com/javase/8/docs/api/java/util/function/IntConsumer.html) accepts an int and returns void.
```java
IntConsumer consumerCount = (num) -> doPrint.accept ("We have " \+ num + " votes.");  
consumerCount.accept(3245);
```
```java
Output:  
We have 3245 votes.
```

## Method reference using consumer

We shall use a simple classes [Person.java](https://blogs.oracle.com/brewing-tests/resource/lambda/Person.java) and [Util.java](https://blogs.oracle.com/brewing-tests/resource/lambda/Util.java) class for the examples that follow. We shall create Consumer objects using [Method Reference](https://blogs.oracle.com/brewing-tests/entry/lambda_method_reference).  

### Reference to a Static Method

We just need a static method that accepts something and returns void. [Util.java](https://blogs.oracle.com/brewing-tests/resource/lambda/Util.java) has several such static methods.  
```java
Consumer<String\> doLog = Util::threadTimeStampLog;  
doLog.accept("Log Message");    // Equivalent of Util.threadTimeStampLog("Log Message")
```
```java
Output:  
[Tue, 16-Feb-2016 10:28:23.855 IST] [Thread=main] Log Message  

```

### Reference to an Instance Method of a Particular Object  

The Person class has a setter that accepts an `int`. Since it is a setter, the return type is void. In the example below, we shall use [Method Reference - Reference to an Instance Method of a Particular Type](https://blogs.oracle.com/brewing-tests/entry/lambda_method_reference). (Take a look at [Lambda - Method Reference](https://blogs.oracle.com/brewing-tests/entry/lambda_method_reference) for details).  
```java
Person p = new Person (50, Gender.MALE);  
IntConsumer personAgeSetter = p::setAge;  
personAgeSetter.accept(18);     // Equivalent of p.setAage(18);  
doPrint.accept(p.toString());
```
Setters are good candidates for creating Consumer objects using method reference.  
  
```java
Output:  
Age=18 Gender=MALE  

```

### Reference to an Instance Method of an Arbitrary Object of a Particular Type

Lets generalize this type of method reference using the below example.  
  
Consider a functional interface that has an abstract method `todo` that accepts 4 arguments of type `A`, `B,` `C` and `D` and returns an object of type `X`. Now, an object of type `MyFuncInterface`  can be assigned `A::someMethod`, if this instance method "`someMethod`" accepts remaining arguments - `B,` `C` and `D` and returns `X`.
```java
@FunctionalInterface  
interface MyFuncInterface  
{  
   public X todo (A a, B b, C c, D d)  
}  
  
MyFuncInterface myFuncInterface = A::someMethod;
```
Now, lets consider Consumer<String>. The abstract method `accept` has only one argument that takes `String` and returns void. So, we need look for an instance method in `String` class that accepts no arguments and returns void.  
```java
Consumer<String\> consumerNotify = String::notify;
```
Invoking `consumerNotify.accept("Hello")` shall result in `"Hello".notify ()`
