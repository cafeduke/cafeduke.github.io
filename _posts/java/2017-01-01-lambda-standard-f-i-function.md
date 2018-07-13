---
title: Lambda Standard Functional Interface - Consumer  
category: java
typora-root-url: ../../
---


# Lambda - Standard Functional Interface - Function  




## Standard Functional Interface

Standard functional interfaces are functional interfaces provided by Java available in java.util.function package.  

## @FunctionalInterface - Function

Interface [Function](https://docs.oracle.com/javase/8/docs/api/java/util/function/Function.html) is a standard functional interface that has abstract method apply with the following signature.  
```java
@FunctionalInterface  
public interface Function<T,R>  
{  
   R apply (T t)  
   ...  
}  

```
We find that the functional interface Fuction, has the abstract method that accepts  a type T and returns a type R

### Integer to String

An object of type Function<String,Integer> is created using a lambda expression that accepts a String and returns an Integer. Here, the string is parsed to return the integer value.  
```java
Function<String,Integer\> convertStrToInt = (s) -> Integer.valueOf (s);  
System.out.println(convertStrToInt.apply("100"));
```
```java
Output:  
100  

```

### Hasher Bracer and Boxer

In the code below, we create three Function<String,String> objects namely fHasher, fBracer and fBoxer that pad a character to the given string. For example, the fHasher pads the given string with a '#' character and returns the result.  
```java
Function<String,String\> fHasher = (s) -> "#" \+ s + "#";  
Function<String,String\> fBracer = (s) -> "{" \+ s + "}";  
Function<String,String\> fBoxer  = (s) -> "[" \+ s + "]";   

Function<String,String\> fDecorate = fHasher.andThen(fBracer).andThen(fBoxer);  
System.out.println(fDecorate.apply ("HelloWorld"));  

```
The andThen extension method is used to wire the functions. Note that  andThen accepts a Function and returns a Function.  
```java
Output:  
[{#HelloWorld#}]
```

## Method reference using Function

We shall create Function objects using [Method Reference](https://blogs.oracle.com/brewing-tests/entry/lambda_method_reference).  

### Reference to a Static Method  

To create a static method reference for object Function<String,Integer>, we need a static function that accepts String and returns Integer. The Integer.valueOf method matches the requirement.
```java
Function<String,Integer\> convertStringToInt = Integer::valueOf;  
System.out.println(convertStringToInt.apply("200"));  

```
```java
Output:  
200  

```

### Reference to an Instance Method of a Particular Object

Object of type Function<Date,String> using this type of method reference, can be created using an object (of any class) that has instance method that accepts Date and returns String. The format instance method of class java.text.SimpleDateFormat converts the given Date object into a formatted String.  
```java
SimpleDateFormat dateFormat = new SimpleDateFormat ("EEE, dd-MMM-yyyy HH:mm:ss.SSS z");  
Function<Date,String\> formatter = dateFormat::format;  
System.out.println(formatter.apply(new Date()));
```
```java
Output:  
Wed, 16-Mar-2016 09:36:05.495 IST  

```

The below example creates an object of type IntFunction<String>. An IntFunction<R> has an abstract method that accepts an int and returns a type R. So, an IntFunction<String> object can be created using lambda expression that accepts int and returns a String. However, we are creating a method reference - Instance method of a particular object.  For this, we can reference any object that has an instance method that accepts int and returns a String. In the below example, we use a String object "HelloWorld". The String object has method substring that accepts an int (index) and returns the resultant substring.  
```java
IntFunction <String\> helloSubstr = "HelloWorld"::substring;  
System.out.println(helloSubstr.apply(5));
```
Essentially, calling helloSubstr.apply(5) is equivalent of "HelloWorld".substring(5)  
```java
Output:  
World  

```

### Reference to an instance method of an arbitrary object of a particular type

Object of type Function<String,Integer> using this type of method reference, requires an instance method in the String class that has no parameters and returns an Integer. A String's length method matches this requirement.  
```java
Function<String,Integer\> sizer = String::length;  
System.out.println(sizer.apply("HelloWorld"));
```
Essentially, calling sizer.apply("HelloWorld") is equivalent of "HelloWorld".length()
```java
Output:  
10
```
