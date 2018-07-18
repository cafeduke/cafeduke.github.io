---
layout: post
title: Threads - Synchronization is on object  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Threads - Sychronization lock is on the object  

  
There shall always be sections of code that needs to locked on by an object allowing only a single thread (at any given point of time) possessing this lock to enter. Such sections of code are called critical sections.  

## Method synchronization

In the code below, method `fun()` is synchronized. Synchronization is always with respect to an object. In the below example, the synchronization is on object `this`. Object `this` refers to the invoking object. Suppose `mangoA` and `mangoB` are two objects of type Mango. When `mangoA``.fun()` is executing, `mangoA` is the invoking object and when `mangoB``.fun()` is executing, `mangoB` is the invoking object.
```java
class Mango  
{  
   public synchronized void fun ()  
   {  
      // Only on thread can access this at a time  
   }  
}
```

## Synchronization - Without mutual exclusion  

Consider two threads - one is executing `mangoA``.fun()` and the other is executing `mangoB``.fun()` as given below.  
```java
public class SyncIsOnObject  
{  
     
   public static void main (String arg[])  
   {  
      Mango mangoA = new Mango ("Mango-A");  
      Mango mangoB = new Mango ("Mango-B");        
      new Thread (mangoA, "threadA").start();  
      new Thread (mangoB, "threadB").start();  
   }  
     
   static class Mango implements Runnable  
   {  
      private String name;  
        
      public Mango (String name)  
      {  
         this.name = name;  
      }  
        
      @Override  
      public void run ()  
      {  
         fun ();  
      }  
        
      public synchronized void fun ()  
      {  
         Util.threadLog("Started.  this = " \+ this);  
         Util.sleepInMilli(500);  
         Util.threadLog("Finished. this = " \+ this);  
      }  
        
      @Override  
      public String toString ()  
      {  
         return name;  
      }  
   }  
}
```
  
```java
Output:  
[Mon, 04-Apr-2016 13:27:47.831 IST] [Thread=threadA] Started.  this = Mango-A  
[Mon, 04-Apr-2016 13:27:47.831 IST] [Thread=threadB] Started.  this = Mango-B  
[Mon, 04-Apr-2016 13:27:48.337 IST] [Thread=threadA] Finished. this = Mango-A  
[Mon, 04-Apr-2016 13:27:48.337 IST] [Thread=threadB] Finished. this = Mango-B  
  

```
From the output, we find that `threadA` and `threadB` have overlapping timestamps. This means they were both inside the method `fun()` at the same time. In the above example, the function fun is synchronized. How is this possible?  
  
"The function fun is synchronized" \- What does this mean ?  

*   Two (or more) threads can never execute `fun()` at the same time - Incorrect.  
    
*   Two (or more) threads can never execute `fun ()` at the same time using the same object \- Correct

In the above code `threadA` is executing `mangoA.fun()` and `threadB` is executing `mangoB.fun()`. Since they are two different objects there are two different locks. Each thread acquires lock on corresponding object and their is no mutual exclusion. Both threads can execute fun at the same time.  
  
Synchronization - A section of code is locked on an object  
  

## Synchronization - With mutual exclusion  

Lets make the following change to the `main` function. Both threads are now using the same object `mango`.  
```java
public class SyncIsOnObject  
{  
     
   public static void main (String arg[])  
   {  
      Mango mango = new Mango ("Mango");  
      new Thread (mango, "threadA").start();  
      new Thread (mango, "threadB").start();        
   }  
  
   static class Mango implements Runnable  
   {  
      ...  
   }  
}
```
```java
Output:  
[Mon, 04-Apr-2016 15:08:15.764 IST] [Thread=threadA] Started.  this = Mango  
[Mon, 04-Apr-2016 15:08:16.268 IST] [Thread=threadA] Finished. this = Mango  
[Mon, 04-Apr-2016 15:08:16.268 IST] [Thread=threadB] Started.  this = Mango  
[Mon, 04-Apr-2016 15:08:16.768 IST] [Thread=threadB] Finished. this = Mango
```
We now find that there is no overlap in timestamp. Thread `threadA` is executing `mango.fun()` and `threadB` is executing `mango.fun()` as well. Both threads need a lock on the same object `mango`. This makes `fun()` mutually exclusive for the two threads.