---
layout: post
title: Deadlock - Hold and Wait  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Deadlock - Hold and Wait  

  
  

## Deadlock  

A deadlock can occur only if all the below four conditions meets. We can prevent deadlock by preventing just one of the following from occurring.  

### Mutual Exclusion  

Mutual exclusion is unavoidable. There shall always be sections of code that needs to locked on an object allowing only a single thread (at any given point of time) possessing this lock to enter. See [Threads - Synchronization is on the object](https://blogs.oracle.com/brewing-tests/entry/threads_sychronization_lock_is_on) for details.  

### Non Preemption  

Preemption is the ability to forcibly suspend an execution unit and take away all resources allocated to it. From a Java application developer's point of view, Java threads are non-preemptive. Once a thread grabs a resource like a lock on a object by entering a critical section, it has to voluntarily release the resource by invoking `wait()` on the `Object`.  

### Hold And Wait  

Holding resources and waiting for more resources. We need take care of this while writing code.  
  
When the currently held resources are not sufficient to proceed  

*   An execution unit (thread) should check if additional resources are available
*   If ( additional resources are available )

*   Acquire the additional resources, complete the work and release all resources

*   Else

*   Release all currently held resources!
*   Poll (sleep for a while and try again) until the required resources are available  
    

### Circular Wait  

Hold wait may work as long as the pattern does not become circular. Once hold and wait gets circular deadlock is imminent.  

## Deadlock - Hold and wait for resources  

The below class looks deceptively simple and clean. We have an `Account` class that accepts a `name`. A static function is used for fund transfer from one account to another. A lock is obtained on the `from` account and later on the `to` account before proceeding with the transfer.  
```java
class Account  
{  
   private String name = null;  
  
   public Account(String name)  
   {  
      this.name = name;  
   }  
  
   public static void transfer(Account fromAccount, Account toAccount, int amount)  
   {  
      synchronized (fromAccount)  
      {  
         System.out.println("Got lock on " \+ fromAccount + ". Waiting for " \+ toAccount);  
         Util.sleepInMilli(300);  
         synchronized (toAccount)  
         {  
            System.out.println("Transfered " \+ amount + " from " \+ fromAccount + " to " \+ toAccount);  
         }  
      }  
   }  
  
   @Override  
   public String toString()  
   {  
      return "[Account :" \+ name + "]";  
   }  
}
```
Lets have two threads and initiate parallel transfer.  
```java
public class HoldAndWait  
{  
   private static Account accountRaghu = new Account("Raghu");  
   private static Account accountMadhu = new Account("Madhu");  
  
   public static void main(String arg[])  
   {  
     new Thread (() -\> Account.transfer(accountRaghu, accountMadhu, 10), "tA").start ();  
     new Thread (() -\> Account.transfer(accountMadhu, accountRaghu, 10), "tB").start ();  
   }  
}
```
```java
Output On Linux:  
[13:35:06.509][Thread=tA] Got lock on [Account :Raghu]. Waiting for [Account :Madhu]  
[13:35:06.509][Thread=tB] Got lock on [Account :Madhu]. Waiting for [Account :Raghu]
```

### Why deadlock?

We have two threads spawned - `tA` and `tB`.  

*   Thread `tA` transfers from `accountRaghu` to `accountMadhu`.  `tA` acquires a lock on `accountRaghu` and is busy performing some operation (sleeping, in our case) with this resource.  
    
*   Thread `tB` transfers from `accountMadhu`. to `accountRaghu`. . Hence, `tB` acquires a lock on `accountMadhu` and is busy performing some operation (sleeping, in our case) with this resource.
*   Thread `tA` later tries to acquire lock on `accountMadhu` while holding the lock on `accountRaghu`.  
    
*   Thread `tB` later tries to acquire lock on `accountRaghu` while holding the lock on `accountMadhu`.
*   Since each thread has a resource (which shall never be released) that the other requires and since this resource dependency has resulted in a cycle, it results in a deadlock.