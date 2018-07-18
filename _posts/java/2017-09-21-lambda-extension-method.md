---
layout: post
title: Brewing Lambda - Extension Method
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Brewing Lambda - Functional Interface & Extension Methods  

  
  

## @FunctionalInterface

Lambda expression can be used instantiate an object of an interface type that has only abstract method. Since there is only one abstract method, the name of the method, argument types and return type are inferred from the signature of the abstract method. Hence, the lambda expression need not include these boilerplate code. Such interfaces that have one and only one abstract method are called functional interfaces.  
  
Java compiler flags an error if additional abstract methods are added to an interface annotated with @FunctionalInterface annotation.  
  
![Functional Interface Error](images/FunctionalInterfaceError.jpg)  
Lambda expression can be used on interfaces with one abstract method even if it is not annotated with @FunctionalInterface. However, it is recommended.  

## Extension Method  

An interface in Java 8 can have non-static (instance) methods with method body. These methods are prefixed with a keyword default. Such methods are called extension methods.  

Note: This is not the same as default visibility of instance methods in a class. In a class, not mentioning any visibility (private, protected or public) results in default visibility. Here, we cannot use 'default' as a keyword. The keyword 'default' can be used only in an interface (in Java 8).  

Extension methods are valid only for an interface. It is a new addition and a radical change from the conventional idea of an interface, where interface never had functions with method body. Below is an example of an interface with extension methods. Note that TrendStylist is not a functional interface. Extension methods are hence not limited to functional interfaces.  
```java
public interface TrendStylist  
{  
   public abstract String getLeftStyle  ();  
     
   public abstract String getRightStyle ();  
     
   default String padStyles (String mesg)  
   {  
      return getLeftStyle() + mesg + getRightStyle ();  
   }  
}
```
All methods of an interface including the extension methods are inherited with 'public' visibility. In the below example, `MyTrendStylist` class implements the abstract methods  defined in `TrendStylist`. The extension method `padSytles` is also inherited with public visibility and call be called using an object of type `MyTrendStylist`.  
```java
public class ExtensionMethodDemo  
{  
   public static void main (String arg[])  
   {  
      MyTrendStylist myStylist = new MyTrendStylist ();  
      System.out.println(myStylist.getLeftStyle());  
      System.out.println(myStylist.getRightStyle());  
      System.out.println(myStylist.padStyles ("HelloWorld"));  
      System.out.println(myStylist.padPipe   ("Hello World"));  
   }  
}  
  
class MyTrendStylist implements TrendStylist   
{  
   @Override  
   public String getLeftStyle ()  
   {  
      return "<--";  
   }  
  
   @Override  
   public String getRightStyle()  
   {  
      return "-->";  
   }  
     
   public String padPipe (String mesg)  
   {  
      return "||" \+ mesg + "||";  
   }  
}  

```
```java
Output:  
<--  
-->  
<--HelloWorld-->  
||Hello World||  

```
An extension method can be overridden in the implementing class but the visibility cannot be reduced (like any other method overriding) from public.  
  

## Extension Method and Functional Interface  

Extension methods are an independent Java 8 feature as shown in previous examples. Since extension methods can be added to any interface, they can be added to functional interfaces as well. Lets add some extension methods to our `Stylist` functional interface.  
  
```java
@FunctionalInterface  
public interface Stylist  
{  
   public abstract String doStyle (String mesg);  
     
   default Stylist padSmile ()  
   {  
      return (s) -> ":-) " \+ doStyle(s) + " (-:";  
   }  
     
   default Stylist padWink ()  
   {  
      return (s) -> ";-) " \+ doStyle(s) + " (-;";  
   }  
}
```
The `padSmile` extension method returns a `Stylist`. Since `Stylist` is a functional interface, lambda expression can be used to construct the `Stylist` object. The `padSmile` extension method pads a smile face to the `doSytle` implementation. Since `padSmile` and `padWink` in turn return an object of type `Stylist` they can be used as builder as given below.  
  
```java
Stylist stylist = (s) -> "'" \+ s +  "'";  
System.out.println(stylist.padWink().padSmile().doStyle("HelloWorld"));
```
```java
Output:  
:-) ;-) 'HelloWorld' (-; (-:
```
  
We have created a stylist object that wraps a given string in single quotes. Now, `padWink` pads this with a wink and returns the resultant `Stylist` object. `padSmile` in turn pads this with a smile.
