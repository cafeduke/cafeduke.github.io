---
title: Executor Service - On the fly sumbmission  
category: java
typora-root-url: ../../
---


# Executor service - Basics  



In this article, we shall see a simple example of using [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html). Here, we use a [FixedThreadPool](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executors.html#newFixedThreadPool-int-) executor service. An [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) provides a mechanism that creates and manages multiple threads within a thread pool. Here, the intricacies of thread management are abstracted, simplifying executing tasks in parallel, thus increasing efficiency.  

We take a look at an example where we need to find the factorial of random numbers stored in an array.  

*   This requires creation of a [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html) task - In this case, a factorial task finds factorial of a given number.
*   We create a list of [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html) tasks, each to find factorial of a different number.
*   We shall invoke the entire list of [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html) tasks.
*   A [FixedThreadPool](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executors.html#newFixedThreadPool-int-) executor service shall dedicate the specified fixed number of threads to work on the [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html) task in parallel
*   Each thread from the executor service shall pick a task from the list and work on it (invoke call method). Once done, the thread shall pick the next pending task until all the task in the list are complete.  

*   Since multiple threads are working in parallel the list of tasks will be complete in lesser time.  


## FactorialTask - A Callable<Integer>

The call method of the FactorialTask shall calculate the factorial of the given number and return it.  

Factorial of a number n can be recursively defined as f(n) = n * f(n-1). At any given stage, it is possible that some other thread has already calculated f(n-1). In this case, we just fetch the value and multiply by n. We then add (n, f(n)) to a map mapNumFactorial so that other threads can take advantage of this calculation.  

```java
static class FactorialTask implements Callable<Integer>  
{  
   private int n = -1;  

   private static Map<Integer,Integer\> mapNumFactorial = new ConcurrentHashMap<> ();  

   public FactorialTask (int n)  
   {  
      this.n = n;  
   }  

   @Override  
   public Integer call () throws Exception  
   {  
      if (n == 0 || n == 1)  
         return 1;  

      int prod = 1;  
      for (int i = n; i >= 2; --i)  
      {  
         if (mapNumFactorial.containsKey(i))  
         {  
            Util.threadLog(String.format("[n=%3d] Found %d! ", n, i));  
            prod = prod * mapNumFactorial.get(i);  
            break;  
         }  
         prod = prod * i;  
         Util.sleepInMilli(100);  
      }  

      Util.threadLog(String.format("[n=%3d] Adding %d! ", n, n));  
      mapNumFactorial.putIfAbsent(n, prod);        
      return prod;  
   }        
}  

```

## Invoke all Callable   

We create a list of [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html) and invoke them all using the [invokeAll](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html#invokeAll-java.util.Collection-) call. The [invokeAll](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html#invokeAll-java.util.Collection-) invokes all the [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html), but waits for them to complete (either succeed for fail with an exception, either way complete). It returns a list of [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) objects which are used to [get](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html#get--) the result.  

```java
public void demoFixedPoolExec () throws InterruptedException, ExecutionException  
{  
   Util.threadLog("Started Fixed Thread Pool Demo");  
   ExecutorService execService = Executors.newFixedThreadPool(poolSize);  

 /* Iteration 1 */  

   // Need to find factorial of the following numbers   
   int num[] = new int [] { 10, 3, 8, 5, 12};  

   // A list of Callable tasks  
   List<Callable<Integer>\> listTask = new ArrayList<Callable<Integer>\> ();  

   Util.printHeading("Iteration 1 - " \+ Arrays.toString(num));  

   // Each Callable task shall find factorial of a random number from 'num' array.  
   for (int i = 0; i < num.length; ++i)  
      listTask.add(new FactorialTask(num[i]));  

   // Invoke all the tasks and wait for it to complete  
   // Note: Unlike submit the invokeAll call is blocking - Waits for all parallel tasks to complete.   
   List<Future<Integer>\> listResult = execService.invokeAll(listTask);  

   Util.printSubHeading("Result");  
   for (int i = 0; i < num.length; ++i)  
      System.out.println(String.format("%d! = %d", num[i], listResult.get(i).get()));  
}  

```

[ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html)'s [invokeAll](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html#invokeAll-java.util.Collection-) call is blocking where as [submit](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html#submit-java.util.concurrent.Callable-) is non-blocking.  

Had we used the [submit](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html#submit-java.util.concurrent.Callable-) call of [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) (rather than [invokeAll](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html#invokeAll-java.util.Collection-)), the call would immediately return a [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html)object without waiting for the operation to complete. This is useful if we would rather do something else until the results are available. We can even check if the result is available using the [isDone](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html#isDone--) method. Hence, a reference to a [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) object can be used to obtain the result sometime later (in the future). At present, the object may not even hold the result.  

## Reuse Executor Service

An executor service can be reused to invoke another list of [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html)s as follows.  
```java
public void demoFixedPoolExec () throws InterruptedException, ExecutionException  
{  
   Util.threadLog("Started Fixed Thread Pool Demo");  

   ...  
   ...  

   /* Iteration 2 */   

   listTask.clear();  
   num = new int [] { 2, 11, 7};        

   Util.printHeading("Iteration 2 - " \+ Arrays.toString(num));  

   // Each Callable task shall find factorial of a random number from 'num' array.  
   for (int i = 0; i < num.length; ++i)  
      listTask.add(new FactorialTask(num[i]));  

   listResult = execService.invokeAll(listTask);  

   Util.printSubHeading("Result");  
   for (int i = 0; i < num.length; ++i)  
      System.out.println(String.format("%d! = %d", num[i], listResult.get(i).get()));  
}
```

## Shutdown Executor Service

Shutdown an executor service to prevent accepting new submissions.  Call [awaitTermination](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html#awaitTermination-long-java.util.concurrent.TimeUnit-) to wait for the currently executing tasks to complete.  
```java
public void demoFixedPoolExec () throws InterruptedException, ExecutionException  
{  
   Util.threadLog("Started Fixed Thread Pool Demo");  

   ...  
   ...  

   // Shutdown executor service  
   execService.shutdown();  

}  


```

## Putting it all together

```java
public class ExecutorService_FixedThreadPool_Basic  
{  
   private int poolSize = -1;  

   public ExecutorService_FixedThreadPool_Basic (int poolSize)  
   {  
      this.poolSize = poolSize;  
   }     

   public static void main (String arg[]) throws Exception  
   {  
      new ExecutorService_FixedThreadPool_Basic(10).demoFixedPoolExec();  
   }  

   public void demoFixedPoolExec () throws InterruptedException, ExecutionException  
   {  
      Util.threadLog("Started Fixed Thread Pool Demo");  
      ExecutorService execService = Executors.newFixedThreadPool(poolSize);  

      ...  
      ...  

      /* Iteration 1 */  

      ...  
      ...  

      /* Iteration 2 */  

      ...  
      ...       

      // Shutdown executor service  
      execService.shutdown();  
      Util.threadLog("Finished Fixed Thread Pool Demo");  
   }  

   static class FactorialTask implements Callable<Integer>  
   {  
      ...  
      ...  
   }  
}  

```
```java
Output | grep 'DirTask':  
[Thu, 17-Nov-2016 12:01:34.724 IST] [Thread=main] Started Fixed Thread Pool Demo  

------------------------------------------------------------  
              Iteration 1 - [10, 3, 8, 5, 12]  
------------------------------------------------------------  
[Thu, 17-Nov-2016 12:01:34.989 IST] [Thread=pool-1-thread-2] [n=  3] Adding 3!   
[Thu, 17-Nov-2016 12:01:34.989 IST] [Thread=pool-1-thread-4] [n=  5] Found 3!   
[Thu, 17-Nov-2016 12:01:34.989 IST] [Thread=pool-1-thread-4] [n=  5] Adding 5!   
[Thu, 17-Nov-2016 12:01:35.083 IST] [Thread=pool-1-thread-3] [n=  8] Found 5!   
[Thu, 17-Nov-2016 12:01:35.083 IST] [Thread=pool-1-thread-3] [n=  8] Adding 8!   
[Thu, 17-Nov-2016 12:01:35.192 IST] [Thread=pool-1-thread-5] [n= 12] Found 8!   
[Thu, 17-Nov-2016 12:01:35.192 IST] [Thread=pool-1-thread-5] [n= 12] Adding 12!   
[Thu, 17-Nov-2016 12:01:35.301 IST] [Thread=pool-1-thread-1] [n= 10] Found 5!   
[Thu, 17-Nov-2016 12:01:35.301 IST] [Thread=pool-1-thread-1] [n= 10] Adding 10!   

Result  
------------------------------------------------------------  
10! = 3628800  
3! = 6  
8! = 40320  
5! = 120  
12! = 479001600  

------------------------------------------------------------  
                  Iteration 2 - [2, 11, 7]  
------------------------------------------------------------  
[Thu, 17-Nov-2016 12:01:35.410 IST] [Thread=pool-1-thread-7] [n= 11] Found 10!   
[Thu, 17-Nov-2016 12:01:35.410 IST] [Thread=pool-1-thread-7] [n= 11] Adding 11!   
[Thu, 17-Nov-2016 12:01:35.410 IST] [Thread=pool-1-thread-6] [n=  2] Adding 2!   
[Thu, 17-Nov-2016 12:01:35.519 IST] [Thread=pool-1-thread-8] [n=  7] Found 5!   
[Thu, 17-Nov-2016 12:01:35.519 IST] [Thread=pool-1-thread-8] [n=  7] Adding 7!   

Result  
------------------------------------------------------------  
2! = 2  
11! = 39916800  
7! = 5040  
[Thu, 17-Nov-2016 12:01:35.519 IST] [Thread=main] Finished Fixed Thread Pool Demo  


```
