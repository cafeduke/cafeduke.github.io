---
layout: post
title: Lambda Standard Functional Interface - Supplier   
category: java
typora-root-url: ../../
---


# Lambda - Standard Functional Interface - Supplier  

  


## Standard Functional Interface

Standard functional interfaces are functional interfaces provided by Java available in java.util.function package.  

## @FunctionalInterface - Supplier

Interface [Supplier](https://docs.oracle.com/javase/8/docs/api/java/util/function/Supplier.html) is a standard functional interface that has abstract method `get` with the following signature.  
```java
@FunctionalInterface  
public interface Supplier<T>  
{  
   T get ()  
   ...  
}
```
We find that the functional interface `Supplier`, of generic type `T`, has the abstract method that does not accept any argument and returns `T`

### Print consumer

We shall create a print consumer to print a string and use it in upcoming lambda expressions. Note that the `doPrint` consumer is declared final as it shall be used by other lambda expressions. The consumer shall be effectively final anyways.  
```java
final Consumer<String\> doPrint = (s) -> System.out.println(s);  
doPrint.accept("Hello World");
```

### Date Format Supplier

The lambda expression in the example below does not accept any argument but returns an object of type [SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html).  
```java
Supplier<SimpleDateFormat\> friendlyDate = () -> new SimpleDateFormat("EEE, dd-MMM-yyyy HH:mm:ss z");  
Supplier<SimpleDateFormat\> logDate      = () -> new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");  
  
doPrint.accept("Friendly date = " \+ friendlyDate.get().format(new Date()));  
doPrint.accept("Log date = " \+ logDate.get().format(new Date()));
```
```java
Output:  
Friendly date = Wed, 24-Feb-2016 10:15:26 IST  
Log date = 2016-02-24T10:15:26.735+05:30  

```

## Method reference using consumer

We shall use a simple classes [Person.java](https://blogs.oracle.com/brewing-tests/resource/lambda/Person.java) and [Util.java](https://blogs.oracle.com/brewing-tests/resource/lambda/Util.java) class for the examples that follow. We shall create Consumer objects using [Method Reference](https://blogs.oracle.com/brewing-tests/entry/lambda_method_reference).  

### Reference to a Static Method  

Similar to consumer, we have suppliers for primitive data types - [BooleanSupplier](https://docs.oracle.com/javase/8/docs/api/java/util/function/BooleanSupplier.html),  [IntSupplier](https://docs.oracle.com/javase/8/docs/api/java/util/function/IntSupplier.html), [LongSupplier](https://docs.oracle.com/javase/8/docs/api/java/util/function/LongSupplier.html) and [DoubleSupplier](https://docs.oracle.com/javase/8/docs/api/java/util/function/DoubleSupplier.html). These suppliers have an abstract method that returns the primitive data type. As shown in code below, static method `currentTimeMillis`  of `System` class can be used for static method reference.  
```java
LongSupplier supplyTimeInMilli = System::currentTimeMillis;  
  
long beginTime = supplyTimeInMilli.getAsLong();  
Util.sleepInMilli (100);                       // Perform a task that needs to be timed.  
long endTime = supplyTimeInMilli.getAsLong();  
  
doPrint.accept("Time taken = " \+ (endTime - beginTime) + " milli second");
```
```java
Output:  
Time taken = 100 milli second
```
Here, `LongSupplier` object `supplyTimeInMilli` is used to calculate the time taken to complete a task.  

### Reference to an Instance Method of a Particular Object  

A [Person](https://blogs.oracle.com/brewing-tests/resource/lambda/Person.java) class has getters that return age (integer) as well as gender (enum of type Gender). These form good candidates for creating Suppliers as shown below.  
```java
Person p = new Person (50, Gender.MALE);  
  
Supplier<Gender> supplyGender = p::getGender;  
doPrint.accept("Gender=" \+ supplyGender.get());  
  
IntSupplier supplyAge = p::getAge;  
doPrint.accept("Age=" \+ supplyAge.getAsInt());
```
Getters are good candidates for creating Supplier objects using method reference.  

```java
Output:  
Gender=MALE  
Age=50
```
