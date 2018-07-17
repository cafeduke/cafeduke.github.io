---
layout: post
title: Brewing with inner classes  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Brewing with Inner classes

  
  
In this article, we look at basics of inner classes, relationship between Inner and Outer classs and the advantage the relationship brings, an example to add clarity, visibility in Inner classes and finally we shall explore the effect of static modifier in Inner classes.  

## What is an Inner class?

A class can include a nested class. The nested class is called an Inner class. An Inner class has its existence only within the context of the outer class.  
```java
// Outer class  
class Outer  
{  
   private String name = "TheOuter";  
    
   private InnerPublic myInnerPublic = new InnerPublic ("MyInnerPublic");     
     
   public Outer (String name)  
   {  
      this.name = name;  
   }  
  
 // Inner class      
   public class InnerPublic  
   {  
      private String name;  
        
      public InnerPublic (String name)  
      {  
         this.name = name;  
      }  
   }  
}  

```

## Outer - Inner relationship  

### No secrets: Inner/Outer classes have access to each other's private members  

```java
class Outer  
{  
   private String name;  
     
   private int size = 2;     
    
   private InnerPublic myInnerPublic = new InnerPublic ("MyInnerPublic");     
     
   public Outer (String name)  
   {  
      this.name = name;  
   }  
     
   public void funOuter ()  
   {  
      Util.printHeading("Outer Class - Instance Method");  
      System.out.println("Access private instance variable of Outer class.        this.name="    \+ this.name);  
      System.out.println("Access private instance variable of InnerPublic class.  myInnerPublic.name=" \+ myInnerPublic.name);        
   }  
     
     
   public class InnerPublic  
   {  
      private String name;  
        
      public InnerPublic (String name)  
      {  
         this.name = name;  
      }  
        
      public void display ()  
      {  
         Util.printHeading("Inner Class - Instance Method");  
         System.out.println("Access private instance variable of InnerPublic class. this.name=" \+ this.name);  
         System.out.println("Access private instance variable of Outer class.       size=" \+ size);  
      }  
   }        
}
```
The class `Outer` has  

*   A private instance variable `size`  
    
*   An instance variable of type inner class `InnerPublic` namely `myInnerPublic`.  
    

The class `InnerPublic` has  

*   A private instance variable `name`

#### Accessing private members of Inner from Outer class  

From method `funOuter` of class `Outer`, we are able to access the private variable of class `InnerPublic` as `myInnerPublic.name`

#### Accessing private members of Outer from Inner class  

From method `display` of class `InnerPublic`, we are able to access the private variable `size` of class `Outer`.  

### One-to-many: An outer class can be associated with multiple inner classes  

An instance of outer class can be associated with multiple instances for various inner classes.  
  
```java
public class InnerClassPrinciple  
{  
    public static void main (String arg[])  
    {        
       Outer outer = new Outer ("Outer");  
       InnerA a1 = outer.new InnerA ();   
       InnerA a2 = outer.new InnerA ();  
       InnerB b1 = outer.new InnerB ();  
       InnerC c1 = outer.new InnerC ();  
       InnerC c2 = outer.new InnerC ();  
       InnerC c3 = outer.new InnerC ();  
    }  
}  
  
class Outer  
{  
   class InnerA  
   {  
        
   }  
     
   class InnerB  
   {  
        
   }  
     
   class InnerC  
   {  
        
   }  
}
```

An Inner class has its existence only within the context of an Outer class. Hence, an instance of Outer class is necessary to create an instance of Inner class.  
Note the syntax: InnerA a1 = outer.new InnerA ();  

In previous examples instance of Inner class was created within the Outer class. So, the implicit `this` object was used.  
  
```java
class Outer  
{  
   // The below code uses implicit this object of outer class
 private InnerPublic myInnerPublicA = new InnerPublic ("MyInnerPublicA");  
  
   // The below code explicitly specifies 'this.new'  
 private InnerPublic myInnerPublicB = this.new InnerPublic ("MyInnerPublicB");  
}  

```

### Example: Items and paid-by users

In this example, we use an outer class `Item` and inner class `PaidBy`. An item can be paid by multiple users. So, `Item`  can be associated with multiple `PaidBy` objects.  
```java
package core.classes;  
  
public class InnerClassExample  
{  
   public static void main (String arg[])  
   {  
      Item item = new Item ("Lunch", new String[] {"Raghu", "Pavi", "Madhu", "Sanjeev"}, new int[] {110, 250, 80, 25});  
      System.out.println(item);  
   }  
}  
  
class Item  
{  
   private String itemname;  
     
   private PaidBy paidBy[];  
     
   public static final String HR = "--------------------------------------------------";  
     
   public static final String NewLine = System.getProperty("line.separator");  
     
   public Item (String itemname, String username[], int amount[])  
   {  
      this.itemname = itemname;  
      this.paidBy = new PaidBy [username.length];  
        
      if (username.length != amount.length)  
         throw new IllegalArgumentException("Username and amount size must match");  
        
      for (int i = 0; i < username.length; ++i)  
         this.paidBy[i] = this.new PaidBy (username[i], amount[i]);        
   }  
     
   public String toString ()  
   {  
      StringBuilder builder = new StringBuilder();  
        
      int total = 0;  
      for (PaidBy currPaidBy : paidBy)  
      {  
         builder.append(currPaidBy);  
         total += currPaidBy.amount;  
      }        
      builder.append(HR).append(NewLine);  
      builder.append("Total amount = ").append(total).append(NewLine);  
      return builder.toString();  
   }  
     
   private class PaidBy  
   {  
      private String username;  
        
      private int amount;  
        
      public PaidBy (String username, int amount)  
      {  
         this.username = username;  
         this.amount = amount;  
      }  
        
      public String toString ()  
      {  
         return String.format("%-10s paid %3d for %s" \+ NewLine , username, amount, itemname);  
      }  
   }  
}  

```
```java
Output:  
Raghu      paid 110 for Lunch  
Pavi       paid 250 for Lunch  
Madhu      paid  80 for Lunch  
Sanjeev    paid  25 for Lunch  
--------------------------------------------------  
Total amount = 465  

```
  
Note 1) Following is a code snippet from the above code. Here the implicit `this` object of Item is used to create `PaidBy` objects.  
```java
class Item  
{  
   ...  
   ...  
     
 public Item (String itemname, String username[], int amount[])  
   {  
      ...  
      this.paidBy[i] = this.new PaidBy (username[i], amount[i]);  
   }  
}  

```
Note 2) `Item` class can easily access private variable `amount` of the `PaidBy` class to calculate the total `amount`.  
  
Note 3) `PaidBy` class can easily access private variable `itemname` of the `Item` class in its `toString()` method.  

## Visibility modifier and Inner class  

We understand private, default, protected and public visibility for variables and methods. Similarly, an inner class also have various visibility. Similar to visibility of methods and variables, a private inner class is not visible to another class while an public inner class is visible.  
```java
public class InnerClassPrinciple  
{  
    public static void main (String arg[])  
    {  
       /* Outer Class */         
       Outer outerA = new Outer ("OuterA");  
       outerA.funOuter();  
  
       /* Public Inner Class */         
       InnerPublic innerA1 = outerA.new InnerPublic ("InnerA1");  
       innerA1.display();  
  
       /* Private Inner Classes */  
       // Class InnerPrivate is not visible here  
    }  
}  
  
class Outer  
{  
   private String name;  
     
   private int size = 2;     
     
   private InnerPublic myInnerPublic = new InnerPublic ("MyInnerPublic");     
     
   private InnerPrivate myInnerPrivate = new InnerPrivate ("MyInnerPrivate");  
  
   public Outer (String name)  
   {  
      this.name = name;  
   }  
  
   public class InnerPublic  
   {  
      private String name;  
        
      public InnerPublic (String name)  
      {  
         this.name = name;  
      }  
   }  
  
   private class InnerPrivate  
   {  
      private String name;  
        
      public InnerPrivate (String name)  
      {  
         this.name = name;  
      }        
   }  
}
```

## Static modifier and Inner class  

### Static inner class

  
Like any static variable or method, a static Inner class is a property of the class (Outer class) and not any instance. So, a static Inner class can be accessed using the Outer classname - no instance necessary.  
```java
public class InnerClassPrinciple  
{  
    public static void main (String arg[])  
    {  
       /* Public Static Inner Classes */  
       Outer.StaticInner staticInnerA1 = new Outer.StaticInner("StaticInnerA1");  
       staticInnerA1.display();  
    }  
}  
  
class Outer  
{  
   private String name;  
  
   private int size = 2;  
     
   private static int MAX_SIZE = 5;  
  
   public Outer (String name)  
   {  
      this.name = name;  
   }  
  
   public static class StaticInner  
   {  
      private String name = "StaticInner";  
        
      public StaticInner (String name)  
      {  
         this.name = name;  
      }  
        
      public void display ()  
      {  
         Util.printHeading ("StaticInner Class - Instance Method");  
           
         System.out.println("Access private instance variable of InnerPublic class.                      this.name= " \+ this.name);  
         System.out.println("Cannot Access private instance variable of Outer class with name conflict.  Outer.this.name");  
         System.out.println("Cannot Access private instance variable of Outer class.                     size");  
         System.out.println("Access private static   variable of Outer class.                            Outer.MAX_SIZE= " \+ Outer.MAX_SIZE);  
      }        
   }  
}
```
Note  

*   An instance of static Inner class is created using `Outer` classname. `Outer.StaticInner staticInnerA1 = new Outer.StaticInner("StaticInnerA1");`
*   A static inner class can access only static variables of the outer class.

### Static methods in Inner Class  

A static inner class can have its own static variables and methods. However, a non-static inner class cannot have its own static variables/methods. All static content has  to be moved to the Outer class.  
  
```java
class Outer  
{  
   ...  
  
   public class InnerPublic  
   {  
      // private static int FUN_STATIC = 1;  
  
      /*  
Error:   
         - Static methods can only be declared in a static or top level type  
         - We have to either move the static method to outer class OR declare the class static.  
   
      public static void funStatic ()  
      {  
  
      }  
  
      */  
  
      ...  
   }  
  
   public static class StaticInner  
   {  
      private static int FUN_STATIC = 1;  
  
      ...  
   }  
}
```