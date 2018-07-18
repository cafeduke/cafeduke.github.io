---
layout: post
title: Brewing Lambda - Basics  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Brewing Lambda - Basics

  
Java 8 introduced lambda expressions. In this article, we look into the basics of lambda expression.  

## Introducing anonymous inner class

### Conventional Way  

Consider the following interface Stylist  that has only one method namely doStyle to be implemented. The doStyle method accepts a String styles it and returns the new stylish string.  
```java
public interface Stylist  
{  
   public abstract String doSytle (String mesg);  
}
```
In conventional implementation given below, class MyStylist implements the interface Stylist, styles by enclosing the given string within hash char. The given String is styled using the Stylist and the resultant String is printed on the console.  
```java
public class LambdaBasic  
{     
   public static void main (String arg[])  
   {  
       /* Conventional Way  */  
      MyStylist myStylist = new MyStylist();  
      myStylist.doStyle("Hello World");  
   }  
  
   static class MyStylist implements Stylist  
   {  
      @Override  
      public String doStyle (String mesg)  
      {  
         return "#" \+ mesg + "#";  
      }        
   }  
}

```
```java
Output:  
#HelloWorld#  

```

### Anonymous Inner Class

The above result can be achieved using anonymous inner classes as follows.  
```java
public class LambdaBasic  
{     
   public static void main (String arg[])  
   {  
      /* Anonymous Inner Class  */  
      Stylist stylist = new Stylist()   
      {  
         @Override  
         public String doStyle(String mesg)  
         {  
               return "#" \+ mesg + "#";  
         }  
      };  
      stylist.doStyle("Hello World");  
   }  
}
```
In this case, we do not create an explicit class (like MyStylist) that implements the interface. Instead an object of type Stylist is created using "new Stylist ()". Since, Stylist is an interface, the methods declared in the interface are implemented. Here, we instantiate an anonymous class (implicit that is not named in the code) that implements our interface Sytlist.  

## Introducing Lambda

Lambda expressions comes into picture when an interface has a single abstract method. Such interfaces are called functional interfaces. Annotation [@FuntionalInterface](https://docs.oracle.com/javase/8/docs/api/java/lang/FunctionalInterface.html) is used to prevent accidental addition of methods into a functional interface.  A compilation error is thrown in case additional methods are added to a functional interface. We shall see more on functional interface later. In the above example, Sylist is a valid candidate to be a functional interface.  
```java
Stylist stylist = (String s) ->   
{   
   return "#" \+ s + "#";  
};  
stylist.doStyle("Hello World");
```
A lambda expression is a concise way of creating an anonymous inner class object. The above example uses the Lambda expression (String s) -> { return "#" + s + "#"; }. Here, we are creating an object of type Sylist. We are eliminating some of the boilerplate code and are providing just the implementation for the only abstract method doStyle.  
  
A lambda expression has the following parts  
  
1) Argument List  

*   The signature of the argument list must match the signature of the abstract method in the Functional Interface.  
    
*   In case of Stylist, the argument list consists of a String argument. So, the first part would be (String s). Here 's' is just an arbitrary variable name just like 'mesg' is an arbitrary variable in the anonymous inner class example.
*   The signature list can be further concise to just include the argument names and not include the data type. The data type can be inferred from the signature of the Functional Interface.  
    
*   In case of Stylist, the argument list can be reduced to (s). Since we are writing lambda expression for doStyle method. Java can infer that 's' is of type String
*   So, the above expression can be reduced to (s) -> { return "#" + s + "#"; }  
    

2) Arrow Operator  

*   The arrow operator '->' is used to separate the argument list from the implementation body.

3) Implementation Body  

*   Lambda expressions are only for functional interfaces and functional interfaces have only one abstract method. So, there is no need to mention the name of the abstract method as part of the lambda expression.
*   The argument names are arbitrary names and are required since they are used in the implementation body.
*   In case of Stylist, we want to enclose the given string with '#'.  
    
*   When an implementation body has a single line, we need not include the braces and the 'return' keyword.  
    
*   So, the above expression can be reduced to (s) -> "#" + s + "#";  
    

Finally, the displayStyle function call can be reduced to the following:  
```java
Stylist stylist = (s) -> "#" \+ s + "#";  
stylist.doStyle("Hello World");  

```
Note:  

*   A lambda expression is a concise way of creating an object of functional interface type.
*   An interface need not be annotated with @FunctionalInterface to use lambda expressions, however it is advisable.  
    

  
Now, lets see some more examples of lambda expressions.  
```java
Stylist stylistA = (mesg) -> "[" \+ mesg + "]";  
Stylist stylistB = (s)    -> s.toUpperCase();  
  
System.out.println(stylistA.doSytle("Bracket"));  
System.out.println(stylistB.doSytle("Capital"));
```
```java
Output:  
[Bracket]  
CAPITAL  

```

### Lambda for few standard interfaces

#### Comparator

With Java 8, a Comparator is now annotated with [@FuntionalInterface](https://docs.oracle.com/javase/8/docs/api/java/lang/FunctionalInterface.html). A [Comparator<T>](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html)  has an abstract function [compare](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#compare-T-T-) that accepts two objects of type T and returns an integer, based on how they compare against each other. The following examples sorts a string array using custom comparators created using lambda expression.  
  
```java
String names[] = new String[] {"apple", "zebra", "cat", "elephant", "dog", "ball"};  
  
/* Sort in ascending length */  
Comparator <String\> comparatorLen = (s1, s2) -> s1.length () - s2.length ();  
Arrays.sort(names, comparatorLen);  
System.out.println(Arrays.asList(names));  
  
/* Sort in ascending order */  
Comparator <String\> comparatorAsc = (s1, s2)  -> s1.compareTo(s2);  
Arrays.sort(names, comparatorAsc);  
System.out.println(Arrays.asList(names));  
  
/* Sort in descending order */  
Comparator <String\> comparatorDesc = (s1, s2) -> -1 * s1.compareTo(s2);  
Arrays.sort(names, comparatorDesc);  
System.out.println(Arrays.asList(names));

```
```java
utput:  
[cat, dog, ball, apple, zebra, elephant]  
[apple, ball, cat, dog, elephant, zebra]  
[zebra, elephant, dog, cat, ball, apple]

```

#### Runnable

[Runnable](https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html) is a simple functional interface with an abstract function [run](https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html#run--) that does not accept any argument and has a void return type.  
```java
/* Simple print worker */  
Runnable worker = () -> System.out.println("Hello World");   
new Thread (worker).start();  
  
/* Simple and concise print worker */  
new Thread (() -\> System.out.println("Hello World")).start();  
  
/* Noop worker */  
new Thread (() -\> {}).start();

```
```java
Output:  
Hello World  
Hello World  
  

```