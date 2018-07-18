---
layout: post
title: Object HashCode and Equals  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Why override Object's hashCode if equals is overridden  

  
Before we get into the details of answering the above question lets look at Object's equals and hashCode methods.  

## Object's equals  

A class that overrides an `Object`'s `equals` method shall be comparing the current instance with an object of any type. Essentially, a class should be able to compare its instance with another instance that is either of the same type or subtype.  
```java
boolean equals(Object obj)
```
For example, consider `class Cow extends Animal` and `class Gyr extends Cow`. The `equals` method in class Cow should allow comparison between a Cow object and a Gyr object. This is because Gyr is a Cow. So, when we are comparing two different types of Cows we are just comparing the properties that make it a Cow and not worry about the properties specific to breed. In fact, we type cast the Gyr object as Cow.  
  
Two objects of the same type are considered equal if the properties that determine one object equates the other. Below is class Cow that overrides equals method.  
```java
class Cow extends Animal  
{  
   ...  
  
   @Override  
   public boolean equals (Object obj)  
   {  
      if (this == obj)  
         return true;  
        
      if (obj == null || !(obj instanceof Cow))  
         return false;  
        
      Cow cow = (Cow)obj;  
  
      // Return true if all properties of this and cow match  
   }  
}
```
Please note the following  
  
`this == obj  
`

*   The above comparison returns `true` if both variables are referencing the same object
*   Since there is only one object under question, `true` is returned

  
`obj == null || !(obj instanceof Cow)`  

*   A class can be compared with an instance of same type or sub type
*   `(new Animal() instanceof Cow)` returns false. `(new Gyr() instanceof Cow)`  returns true.
*   The above comparison rejects instances that neither of type Cow nor its sub type.

`Cow cow = (Cow)obj`  

*   Since the given object is an instance of Cow, we can safely typecast it to Cow.

## Object's hashCode

The hashcode is an integer associated with an object and is derived from the properties that determine the object. A class that overrides Object's `hashCode` method calculates an integer hashcode (derived from instance properties) and returns it.  
  
Rule: If two objects are equal (as per equals method) then their hashcode (integer value) MUST be the equal  
  
Note the following corollaries:  
  
1) If two objects have same hashcode then the objects may or may not be equal  

*   Lets take another look at the rule, the rule does not specify that objects that are not equal should have different hashcodes. However, it is desirable.  
    
*   Overriding the `hashCode` function and returning 1 is also a valid implementation (though not recommended)  
    

2) If two objects have different hashcodes then the objects are are not equal  

*   If hashcodes are different but objects are equal then it violates the rule.
*   This is because equal objects must have same hashcode. So, we can conclude that objects are not equal.  
    

The second corollary is useful. Comparing heavy objects using equals method can be less efficient.  

*   We first compare hashcodes of two objects - This is simple integer comparison.  
    
*   If the hashcodes are same - We cannot draw any conclusion, so we will have to get into comparing using equals method.  
    
*   If the hashcodes are different  - We know the objects are different. (Thus, avoiding comparison using equals method).  
    

### Calculating HashCode  

Typically hashcode is calculated as follows  
```java
final int PRIME = 31;  
int hash = 1;  
foreach (instance variable 'm' in the object)  
    hash = PRIME * hash + m.hashCode ();
```

## Override hashCode if equals is overridden  

Java relies on adherence to the above rule, failing which,  [Collections API](https://docs.oracle.com/javase/8/docs/api/java/util/Collection.html) may not work as expected (on offending objects). Lets establish this with an example.  

### Override equals, but do not override hashCode

```java
class BadName  
{  
   String name;  
     
   public BadName (String name)  
   {  
      this.name = name;  
   }  
     
   @Override  
   public boolean equals (Object obj)  
   {  
      if (this == obj)  
         return true;  
        
      if (obj == null || !(obj instanceof BadName))  
         return false;  
        
      BadName badName = (BadName)obj;  
      return this.name.equals(badName.name);  
   }  
}
```

### Override both equals and hashCode  

```java
class GoodName  
{  
   private static final int HASH_PRIME = 31;  
     
   String name;     
     
   public GoodName (String name)  
   {  
      this.name = name;  
   }  
     
   @Override  
   public boolean equals (Object obj)  
   {  
      if (this == obj)  
         return true;  
        
      if (obj == null || !(obj instanceof GoodName))  
         return false;  
        
      GoodName goodName = (GoodName)obj;  
      return this.name.equals(goodName.name);  
   }  
     
   @Override  
   public int hashCode ()  
   {  
      return HASH_PRIME + name.hashCode();  
   }  
}
```
Now, let us create two objects of type GoodName. Both objects have the same name and are considered equal by Object's `equals` method. We have also overridden `hashCode` method. Since objects are equal the hashcodes are same. One of the object is added to a `Set` and can be found using the other object as search key.  
```java
GoodName goodNameA = new GoodName("Peace");  
GoodName goodNameB = new GoodName("Peace");     
System.out.println("Object goodNameA HashCode :" \+ goodNameA.hashCode());  
System.out.println("Object goodNameB HashCode :" \+ goodNameB.hashCode());  
  
Set<GoodName> setGoodName = new HashSet<GoodName>();  
setGoodName.add(goodNameA);  
System.out.println("Object Equality  : " \+ goodNameA.equals(goodNameB));  
System.out.println("HastSet Contains : " \+ setGoodName.contains(goodNameB));
```
```java
Output:  
Object goodNameA HashCode :76986989  
Object goodNameB HashCode :76986989  
Object Equality  : true  
HastSet Contains : true
```
  
Similarly, let us create two objects of type BadName. Both objects have the same name and are considered equal by Object's `equals` method. However, the `hashCode` method is not overridden. Though objects are equal their hashcodes differ. One of the object is added to a `Set`, but cannot be found using the other object as search key.
```java
BadName badNameA = new BadName("Terror");  
BadName badNameB = new BadName("Terror");  
System.out.println("Object badNameA HashCode :" \+ badNameA.hashCode());  
System.out.println("Object badNameB HashCode :" \+ badNameB.hashCode());  
  
HashSet<BadName> setBadName = new HashSet<BadName>();  
setBadName.add(badNameA);  
System.out.println("Object Equality  : " \+ badNameA.equals(badNameB));  
System.out.println("HastSet Contains : " \+ setBadName.contains(badNameB));
```
```java
Output:  
Object badNameA HashCode :366712642  
Object badNameB HashCode :1829164700  
Object Equality  : true  
HastSet Contains : false
```
While iterating through the objects in Set, the hashcode of the objects are compared first (to increase efficiency). Different hashcodes imply different objects. Since the hashcodes are different the objects are considered to be different.  
  
Thus, it is necessary to override `hashCode` method for a class that overrides the `equals` method.