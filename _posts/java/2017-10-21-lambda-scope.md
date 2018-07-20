---
layout: post
title: Brewing Lambda - Scope  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Brewing Lambda - Scope  

## Static and instance variables

Static variables and instance variables can be accessed and modified in a lambda expression (Similar to an anonymous inner class).
```java
public class L02Scope  
{  
   private int varInstance = 1;  
     
   private static int varStatic = 1;  
     
   public static void main (String arg[])  
   {        
      new L02Scope ().testlambdaScope();  
   }  
  
   /**  
    * Instance and static variables can be accessed/modified within lambda  
    */  
   public void testlambdaScope ()  
   {  
      Stylist stylist = (mesg) -> mesg + " InstanceVariable=" \+ ++varInstance   
                                       \+ " StaticVariable="   \+ ++varStatic;  
      System.out.println(stylist.doStyle("lambda:"));  
   }  
}
```
```java
Output:  
lambda: InstanceVariable=2 StaticVariable=2  

```

## Local Variable

*   Lambda expression can access a local variable if it is final.    
*   A non final local variable shall be rendered final (effectively final) after being accessed by lambda.

### Final local Variable  

The first point above is easier to understand. Lets take a look at an example for the first point.  
```java
final String finalLocalVar = "-)";  
Stylist stylist = (s) ->  s + finalLocalVar;  
System.out.println(stylist.doStyle(":"));
```
```java
Output:  
:-)
```
Here, Stylist is a functional interface that accepts a String and returns a String. The lambda expression uses the final variable finalLocalVar.  

### Regular (non final) local variable  

We can use a regular (non final) local variable in the lambda expression (similar to final variables) as given below.  
```java
String localVar = "-)";  
Stylist stylist = (s) ->  s + localVar;  
System.out.println(stylist.doStyle(":"));
```
However, attempting to change the variable after using it in lambda shall throw a compilation error.  
![Lambda Scope Final](https://blogs.oracle.com/brewing-tests/resource/images/LambdaScopeFinal.jpg)