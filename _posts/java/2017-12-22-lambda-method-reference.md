---
layout: post
title: Lambda - Method Reference  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Lambda - Method Reference  

  
  
We have seen that a reference to a functional interface can be assigned a lambda expression as follows.  
```java
Stylist stylist = (s) -> "#" \+ s + "#";
```
A functional interface can also be assigned different types of method references as given below  

*   Reference to a Static Method
*   Reference to an Instance Method of a Particular Object
*   Reference to an Instance Method of an Arbitrary Object of a Particular Type  
    

We shall examine each one in detail. The above is best explained with an example. So, lets take a look at classes that make up the example.  

## Lemon, Sugar and Lemonade

In this example, we shall consider three simple classes - Lemon, Sugar and Lemonade.  
```java
public class MethodReferenceExample  
{  
   public static class Lemonade   
   {   
      private Lemon lemon;  
        
      private Sugar sugar;  
        
      private Lemonade (Lemon lemon, Sugar sugar)  
      {  
         this.lemon = lemon;  
         this.sugar = sugar;  
      }  
        
      public static Lemonade getInstance (Lemon lemon, Sugar sugar)  
      {  
         return new Lemonade (lemon, sugar);  
      }         
   }   
     
   public static class Lemon  
   {  
      public Lemonade getLemonade (Sugar sugar)  
      {  
         return Lemonade.getInstance(this, sugar);  
      }  
   }  
     
   public static class Sugar      
   {  
      public Lemonade getLemonade (Lemon lemon)  
      {  
         return Lemonade.getInstance(lemon, this);  
      }  
   }  
  
   public static class JuiceJunction  
   {  
      public Lemonade makeMasalaLemonade (Lemon lemon, Sugar sugar)  
      {  
         return Lemonade.getInstance(lemon, sugar);  
      }  
   }  
}
```
As shown above  

*   Lemonade - A static method `getInstance` returns a lemonade by accepting `Lemon` and `Sugar` objects.  
    
*   Lemon - The `getLemondate` method in this class accepts `Sugar` and returns the `Lemonade`
*   Sugar  - The `getLemondate` method in this class accepts `Lemon` and returns the `Lemonade`
*   JuiceJunction - A static class that accepts `Lemon` and `Sugar` and makes masala  lemonade.  
    

Lets define a functional interface `CoolRefresher` that accepts `Lemon` and `Sugar` and returns a `Lemonade` object.  
```java
@FunctionalInterface  
public static interface CoolRefresher  
{  
   publci abstract Lemonade make (Lemon lemon, Sugar sugar);  
}
```
Now that we have considered the prerequisite classes and interfaces we are good to go. Lets start by creating a `CoolRefresher` instance using the lambda expression we are familiar with.  
```java
CoolRefresher refresher = (l,s) -> new JuiceJunction ().makeMasalaLemonade(l, s);
```
Lets instantiate Lemon and Sugar objects.  
```java
Lemon lemon = new Lemon ();  
Sugar sugar = new Sugar ();
```

### Reference to a Static Method

The functional interface references a static method that has the same signature as the abstract method  in the functional interface.  

*   In case of functional interface `CoolRefresher`, the abstract method `make` accepts `Lemon`, `Sugar` and returns `Lemonade`.  
    
*   So, `CoolRefresher` can refer to a static method having the same signature.

```java
CoolRefresher refresher = Lemonade::getInstance;  
refresher.make(lemon, sugar);  

```
Method References use the :: operator  
  
In the above example,  

*   Lemonade's getInstance method accepts `Lemon` and `Sugar` and returns a `Lemonade`
*   Lemonade's getInstance method is STATIC.  
    

Hence, Lemonade's `getInstance` method can be used as method reference.  

### Reference to an Instance Method of a Particular Object

The functional interface references an instance method of an existing object. Since both the object and instance method name are given, the object's instance method can be invoked.  
  
```java
JuiceJunction jjJayanagar = new JuiceJunction ();  
CoolRefresher refresher = jjJayanagar::makeMasalaLemonade;  
refresher.make(lemon, sugar);
```
In the above example,  

*   Instance Method  - JuiceJunction's `makeMasalaLemonade`
*   Particular Object - `jjJayanagar`
*   JuiceJunction's `makeMasalaLemonade` method accepts `Lemon`, `Sugar` and returns `Lemonade`.
*   JuiceJunction's `makeMasalaLemonade` is an INSTANCE method.
*   `CoolRefresher` is assigned the PARTICULAR JuiceJunction's object `jjJayanagar` to be used to call the INSTANCE method. 
*   `refresher.make(lemon, sugar)` is equivalent of invoking `jJayanagar.makeMasalaLemonade (lemon,sugar).`

Hence, we are asking Java to use the particular object "`jjJayanagar`" to invoke a function "`makeMasalaLemonade`" which has the same arguments and return type as "`make`".  
  

### Reference to an Instance Method of an Arbitrary Object of a Particular Type

The functional interface references an instance method of a particular type of Class. The type of the the Class should be the same as the type of the first argument in the functional interface's abstract method. Also, the instance method should accept the remaining arguments and return a type that matches the abstract method.  

*   In case of functional interface `CoolRefresher,` the abstract method `make`'s first argument is of type `Lemon`
*   `So,` `CoolRefresher` can refer to an instance method from class `Lemon`. This method should accept remaining arguments (`Sugar`) and return a type that matches `make` (`Lemonade`)  
    

```java
CoolRefresher refresher = Lemon::getLemonade;  
refresher.make(lemon, sugar);  

```
In the above example,  

*   Instance Method - Lemon's `getLemonade`
*   Arbitrary Object - Arbitrary Lemon Object ( not known during assignment )
*   `CoolRefresher` requires a method body to accept`s Lemon`, `Sugar` and returns `Lemonade`.
*   Lemon's `getLemonade` method (INSTANCE METHOD) accepts `Sugar` and returns `Lemonade`.
*   `refresher.make(lemon, sugar)` is equivalent of invoking `lemon.getLemodate (sugar).`