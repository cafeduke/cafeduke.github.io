---
layout: post
title: Executor Service - On The Fly Submission  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Executor service - On the fly submission  

In this article, we shall recursively navigate through a given directory using an [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html). Multiple threads shall involve in navigating directories and analyzing files simultaneously. There are two executor services `serviceDir` and `serviceFile`. The  [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) `serviceDir` shall spawn threads to dig into directories in parallel. The [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) `serviceFile` shall spawn threads to calculate the size of file in parallel.

## DirTask - A Callable<Void>  

Each thread executing a `DirTask` shall list contents under the current directory  

*   A [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html) task (`DirTask`) is created for each child directory under the current directory.  

*   The callable task is submitted using the executor service.
*   So, another thread in the [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) (`serviceDir`) shall take care of digging through this child directory while the current thread goes ahead analyzing further files in the current directory.  

*   A [Callable](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Callable.html) task (`FileTask`) is created for each file under the current directory.  

*   The callable task is submitted using the executor service.
*   So, another thread from another [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) (`serviceFile`) shall take care of analyzing the file while the current thread goes ahead add adds the [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) result object into a [BlockingQueue](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingQueue.html).
*   Please note that the result object is added into [BlockingQueue](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingQueue.html). The thread does not wait for the file size calculation to complete. We are just adding the [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) object using which we can obtain the result at a later point in time.  
    

```java
/**  
 * Analyze the list of files in the current directory.   
 * <ul>  
 *    <li>If the file is a directory, </li>   
 * </ul>  
 */  
private class DirTask implements Callable<Void>  
{  
   private File dir;  
     
   public DirTask (File dir)  
   {  
      this.dir = dir;  
   }  
     
   @Override  
   public Void call() throws Exception  
   {  
      for (File file : dir.listFiles())  
      {  
         if (file.isDirectory())  
         {  
            Util.threadLog("Submit DirTask. Dir=" \+ pathBaseDir.relativize(file.toPath()));  
            serviceDir.submit(new DirTask(file));  
         }  
         else  
         {  
            Util.threadLog("Submit FileTask. File=" \+ pathBaseDir.relativize(file.toPath()));  
            Future<Long> result = serviceFile.submit(new FileTask(file));  
            queueResult.put(result);  
         }  
      }  
      return null;  
   }        
}
```

## FileTask - A Callable<Long>

Each thread calculates and returns the size of a file.  

```java
private class FileTask implements Callable<Long>  
{  
   private File file;       
     
   public FileTask (File file)  
   {  
      this.file = file;  
   }  
     
   @Override  
   public Long call() throws Exception  
   {  
      Util.threadLog("File=" \+ pathBaseDir.relativize(file.toPath()) + " Size=" \+ formatSize(file.length()));  
      Util.sleepInMilli(10);  
      return file.length();  
   }  
}
```

## Recursive calculation of directory size  

The recursive directory size calculation proceeds as follows  

*   A `DirTask` is created using the base directory and submitted using [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) `serviceDir`.
*   This shall result in various threads from `serviceDir` [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) to dig recursively into directories. As a result further submissions of `DirTask` using `serviceDir` and `FileTask` using `serviceFile` [ExecutorService](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html) shall take place.
*   By specifying the thread pool size of `serviceDir` and `serviceFile` we control on the number of threads that should involve in digging into directories and number of threads that should analyze each file to get the file size.
*   The main thread after triggering the recursive navigation shall poll the [BlockingQueue](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingQueue.html) for [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) result objects
*   Polling a queue utilizes the built in mechanism of waiting for objects to appear and removes the first element in the queue when it appears.
*   The result objects are used to [Future.get](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html#get--) the value returned  by `FileTask`. Thus obtained value is aggregated to calculate the total sum.  


```java
public class ExecutorService_ProducerConsumer  
{     
   private BlockingQueue<Future<Long>\> queueResult = new ArrayBlockingQueue<>(10);  
     
   private ExecutorService serviceDir;  
     
   private ExecutorService serviceFile;  
     
   private Path pathBaseDir;  
     
   public static void main (String arg[]) throws Exception  
   {  
      ExecutorService_ProducerConsumer demo = new ExecutorService_ProducerConsumer ();  
      long size = demo.getSize(new File("D:\\\Media\\\Movies"));  
      System.out.println("------------------------------------------------------------------------");  
      System.out.println("Total Size = " \+ formatSize(size));  
      demo.clean();  
   }  
     
   public ExecutorService_ProducerConsumer ()  
   {  
      serviceDir = Executors.newFixedThreadPool(2);  
      serviceFile = Executors.newFixedThreadPool(3);        
   }  
     
   public long getSize (File file) throws Exception  
   {  
      if (file == null || !file.exists())  
         throw new FileNotFoundException("File does not exist. File=" \+ file);  
        
      if (file.isFile())  
         return file.length();  
        
      pathBaseDir = file.toPath();  
      queueResult.clear();  
        
      serviceDir.submit(new DirTask(file));        
      Future<Long\> result = null;  
      long sum = 0;  
      while ((result = queueResult.poll(3, TimeUnit.SECONDS)) != null)  
         sum += result.get();  
        
      return sum;  
   }  
     
   public void clean()  
   {  
      serviceDir.shutdown();  
      serviceFile.shutdown();       
   }   
  
   ...  
   ...  
}
```

```bash
Output | grep 'DirTask':  
[Mon, 14-Nov-2016 11:49:19.128 IST] [Thread=pool-1-thread-1] Submit DirTask. Dir=Hindi\\D-Day  
[Mon, 14-Nov-2016 11:49:19.128 IST] [Thread=pool-1-thread-1] Submit DirTask. Dir=Hindi\\Golmaal.Returns  
[Mon, 14-Nov-2016 11:49:19.128 IST] [Thread=pool-1-thread-2] Submit DirTask. Dir=English\\2010 - Leap Year  
[Mon, 14-Nov-2016 11:49:19.129 IST] [Thread=pool-1-thread-2] Submit DirTask. Dir=English\\2011 - Jumping The Broom  
  
Output | grep 'FileTask':  
[Mon, 14-Nov-2016 11:49:19.157 IST] [Thread=pool-1-thread-1] Submit FileTask. File=English\\2011 - Jumping The Broom\\UnKnOwN.nfo  
[Mon, 14-Nov-2016 11:49:19.158 IST] [Thread=pool-1-thread-2] Submit FileTask. File=English\\2012 - Delhi Safari\\Delhi-Safari.mkv  
[Mon, 14-Nov-2016 11:49:19.163 IST] [Thread=pool-1-thread-1] Submit FileTask. File=English\\2013 - TheAdventure\TheAdventure.mp4  
[Mon, 14-Nov-2016 11:49:19.169 IST] [Thread=pool-1-thread-2] Submit FileTask. File=English\\2013 - The Machine\\The.Machine.2013.720p.BluRay.x264.YIFY.mp4
  
Final Output:  
...  
...  
------------------------------------------------------------------------  
Result=29.39GB
```