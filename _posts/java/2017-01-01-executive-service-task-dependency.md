---
layout: post
title: Executor Service - Task dependency  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Executor service - Task dependency  

  
  
In this article, we shall explore executing tasks that directly and/or indirectly depend on other tasks in parallel. The dependency can be expressed as a directed graph as given below.  
  

## Understanding dependency task execution  

### Sample Graph

![Task Dependency Graph](images/TaskDependency.jpg)  
  

### Terminology

Term  

Details  

Directed Graph  

A graph having nodes connected using lines with arrow head.  
Graph can be traversed only in the direction of the arrow  

Indegree of a node  

The number of arrows arriving to the node.  

Outdegree of a node  

The number of arrows leaving from the node.  

Cyclic graph  

A graph that may have one or more paths that result in a cycle.  

  

### Task execution flow  

Consider the above graph  

*   Tasks are represented as nodes
*   Dependency between tasks are represented using edges. Consider the examples below.  
    

*   B1 depends on A1. So, an arrow heads from B1 pointing towards A1.
*   B2 depends on both A1 and A2. So we have two arrows from B2, one pointing to A1 and other pointing to A2.  
    

*   A1 and A2 have zero indegree. So, A1 and A2 do not depend on any task and can be executed in parallel.
*   Lets say task A1 is complete but A2 is still running

*   B1 depends on only A1. Since A1 is complete B1 can execute.
*   B2 depends on A1 and A2. Since A2 is still running, B2 will have to wait.
*   B3 depends on only A2. Since A2 is still running, B2 will have to wait.  
    

## Task Dependency data structure  

We need a mechanism to create a directed graph of tasks.  

### Task

Lets start by examining what a task entails.  

Property  

Details  

Name  

Name of the task  

Indegree tasks  

Tasks that depend on the current task.  
Who depends on this task?  

Outdegree tasks  

Tasks that the current task depends on.  
Who does this task depend on?  

Sleep Time  

Time to sleep as part of task execution.  
Used to simulate different execution time for various tasks.  

  
Below is the code for the Task class.  
```java
/**  
* Task to be executed.  
 */  
static class Task implements Callable<Void>  
{  
   /**  
* Name of the task  
    */  
   private String name;  
     
   /**  
* Tasks that depend on the current task.   
    */  
   private Set<Task> setInTask = new HashSet<> ();  
     
   /**  
* Tasks that the current task depends on.   
    */  
   private Set<Task> setOutTask = new HashSet<> ();  
     
   /**  
* Time to sleep as part of task execution.   
    */  
   private int sleepInMilli;  
     
   public Task (String name)  
   {  
      this (name, new Task[0]);  
   }  
     
   public Task (String name, int sleepInMilli)  
   {  
      this (name, new Task[0], sleepInMilli);  
   }  
     
   public Task (String name, Task outTask[])  
   {  
      this (name, outTask, DEFAULT_TASK_EXEC_TIME);  
   }  
     
   /**  
* Create a task that depends on tasks specified by <b>outTask</b>.  
*    
* Essentially  
*  - The current task will have <b>outTask</b> as outdegree.  
*  - Each task in outTask will have current task as indegree.  
*    
*  @param name Name of the task  
*  @param outTask List of tasks the current task depends  
*  @param sleepInMilli Time in milli to sleep as part of task execution   
    */  
   public Task (String name, Task outTask[], int sleepInMilli)  
   {  
      this.name = name;  
      setOutTask.addAll(Arrays.asList(outTask));  
      for (Task task : outTask)  
         task.addInTask (this);  
      this.sleepInMilli = sleepInMilli;  
   }  
     
   /**  
* Add <b>task</b> as indegree to current task.  
    */  
   public void addInTask (Task task)  
   {  
      setInTask.add(task);  
   }  
     
   public Void call() throws Exception  
   {  
      Util.threadLog("Started task", name);  
      Util.sleepInMilli(sleepInMilli);  
      Util.threadLog("Finished task", name);  
      return null;  
   }  
     
   @Override  
   public String toString ()  
   {  
      StringBuilder builder = new StringBuilder ();  
      builder.append(name);  
      return builder.toString();  
   }  
}
```

### Constructing a task data structure  

```java
public class ExecutorService_TaskDependency  
{  
   private static final int DEFAULT_TASK_EXEC_TIME = 5;  
  
   public static void main (String arg[]) throws Exception  
   {  
      Task taskA1 = new Task ("A1");  
      Task taskA2 = new Task ("A2", 30);  
        
      Task taskB1 = new Task ("B1", new Task[]{taskA1});  
      Task taskB2 = new Task ("B2", new Task[]{taskA1, taskA2}, 30);  
      Task taskB3 = new Task ("B3", new Task[]{taskA2});  
        
      Task taskC1 = new Task ("C1", new Task[]{taskB1});  
      Task taskC2 = new Task ("C2", new Task[]{taskB1,taskB2});  
      Task taskC3 = new Task ("C3", new Task[]{taskB3});  
        
      Task taskD1 = new Task ("D1", new Task[]{taskC1, taskC2, taskC3});  
        
   }    
  
   static class Task implements Callable<Void>  
   {  
      ...  
      ...  
   }  
}
```
A task object is created by providing the name, and array of dependent tasks (if any). We could optionally provide a sleep time to simulate task execution time thus test its impact on other tasks.  
  

## Parallel task execution modules  

Let us consider several modules that will finally help us add parallelism to dependent task execution.  

### Finding leaves

#### Valid tasks  

A valid task is one that is reachable from that task(s) that have to be executed.  
  
Lets consider the above graph  

*   Lets say we want to execute task C2
*   Now tasks that are reachable from C2 are {C2, B1, B2, A1, A2}. These are valid tasks.

#### Recursive navigation - Depth First Search (DFS)

```java
static class TaskManager   
{  
   /**  
 * Task comparator - Tasks are sorted by ascending order of task names.   
    */  
   private static Comparator<Task> comparatorTask = (tA, tB) -> tA.name.compareTo(tB.name);     
  
   /**  
* A set of all valid reachable tasks.   
* Essentially all tasks that can be reached from the task(s) that needs to be executed.  
    */  
   private Set<Task> setAllValidTask = new TreeSet<> (comparatorTask);  
     
   /**  
* A set of all leaf tasks - Tasks that have zero outdegree.  
* A task with zero outdegree is a task that does not depend on any other task.  
    */  
   private Set<Task> setLeaf = new TreeSet<> (comparatorTask);  
  
   public void fillLeafLevelTask (Task... task)  
   {  
      for (Task currTask : task)  
      {  
         List<Task> listPath = new ArrayList<> ();  
         fillLeafLevelTask (listPath, currTask);  
      }  
   }  
     
   /**  
* Find all leaves - Tasks with zero indegree.  
*    
*  @param listPath Path to the current task.  
*  @param task Current task.   
    */  
   private void fillLeafLevelTask (List<Task> listPath, Task task)  
   {  
      // Add task to path  
      listPath.add(task);  
        
      // If we are here there is a valid path to this task, so add task to 'setAllValidTask'  
      setAllValidTask.add(task);  
        
      // Task with zero outdegree - That's a leaf  
      if (task.setOutTask.isEmpty())  
         setLeaf.add(task);  
      else  
      {  
         // Iterate over tasks that current task depends on  
         for (Task outTask : task.setOutTask)  
         {  
            // Next task to consider is already in path - Thats a cyclic dependency!   
            if (listPath.contains(outTask))  
               throw new IllegalStateException ("Graph has cycle at Task=" \+ task);  
              
            // Next task to consider is not yet explored - Perform recursive call  
            if (!setAllValidTask.contains(outTask))  
               fillLeafLevelTask(listPath, outTask);  
         }  
      }  
        
      System.out.println("State: Task=" \+ task + " Path=" \+ listPath + " ValidTask=" \+ setAllValidTask + " Leaf=" \+ setLeaf);  
      listPath.remove(task);  
   }  
}
```
Recursively navigate through each task that needs to be executed (DFS - depth first search is used) to figure out all the leaf tasks. During navigation, we also catch and flag any cyclic dependencies.  

### Get indegree of completed tasks  

Let us assume the the currently executing task and its result ([Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html)) object are stored in a map `mapExecutingTaskToResult`. The below function identifies tasks that have completed. The indegree of the completed tasks are fetched, but only valid tasks among these are considered.  

#### Set of valid indegree  

Lets consider the above graph  

*   Lets say we want to execute task C2
*   Now tasks that are reachable from C2 are {C2, B1, B2, A1, A2}. These are valid tasks.
*   Let us suppose A2 has completed  
    

*   we find indegree of A2 which is {B2, B3}
*   However, B3 is not a valid task since B3 is not reachable from C2. So, we discard it.
*   Valid Indegree  =  In degree of A2 -  All valid tasks
*   Hence, {B2} = {B2, B3} - {C2, B1, B2, A1, A2}

*   We deduce that B2 is the only valid indegree when A2 completes.  
    

```java
  
static class TaskManager   
{  
   ...  
   ...  
  
   /**  
 * Task comparator - Tasks are sorted by ascending order of task names.   
    */  
   private static Comparator<Task> comparatorTask = (tA, tB) -> tA.name.compareTo(tB.name);     
  
 /**  
* A map of task to its future result object.  
    */  
   private Map<Task, Future<Void>\> mapExecutingTaskToResult = new TreeMap<> (comparatorTask);  
     
   /**  
* A set of tasks that have completed execution.  
    */  
   private Set<Task> setCompletedTask = new TreeSet<> (comparatorTask);  
     
  
   /**  
* Find tasks that depend on completed tasks   
*    
* Perform the following  
*  <ul>  
*  <li> Go through all currently executing tasks and find tasks that have completed.  
*  <li> If a task is completed, find tasks that depend on the completed task.   
* That is find indegree of completed task.  
*  <li> Add current task indegree to a "set" to eliminate duplicates.  
*  </ul>    
    */  
   private Set<Task> getInDegreeOfCompletedTask ()  
   {  
      // The indegree of completed tasks that are also valid (reachable).  
      Set<Task> setTaskToCheck = new TreeSet<> (comparatorTask);  
        
      // A set used to store tasks that have completed execution - while examining running tasks   
      Set<Task> setCompletionSubset = new TreeSet<> (comparatorTask);  
        
      // Iterate over map of currently executing tasks (mapped to execution result object)  
      for (Iterator<Task> iter = mapExecutingTaskToResult.keySet().iterator(); iter.hasNext();)  
      {  
         Task currTask = iter.next();             
         Future<Void\> currResult = mapExecutingTaskToResult.get(currTask);  
  
         // Check if the task is done!  
         if (currResult.isDone())  
         {  
            // Add indegree of currTask if it is chosen for execution   
            // setTaskToCheck = currTask.setIntask intersection setAllValidTask  
            setTaskToCheck.addAll(currTask.setInTask);  
            setTaskToCheck.retainAll(setAllValidTask);  
  
            // Add current task to completion sub set   
            setCompletionSubset.add (currTask);  
              
            // Remove the current entry  
            iter.remove();  
         }  
      }           
      setCompletedTask.addAll(setCompletionSubset);  
      Util.threadLog("Status report - ExecutingTask=" \+ mapExecutingTaskToResult.keySet() + " CompletedTask=" \+ setCompletionSubset + " InTaskToCheck=" \+ setTaskToCheck);  
        
      return setTaskToCheck;  
   }        
}
```
Note  

*   When a task has completed, it is removed from `mapExecutingTaskToResult`. Since it is no more an executing task.  
    
*   All completed tasks are added to `setCompletedTask  
    `
*   The returned set is called `setTaskToCheck`  \- We need to check if these tasks can be executed next or not!  
    

When this function completes we have a set of valid tasks that were dependent on completed tasks.  

The function only gives us tasks that were dependent on completed tasks (indegree) - That does not mean it is now the turn of these tasks to execute!  
Some of these tasks may depend on other tasks that are yet to execute.  

### Execute tasks with completed outdegree

An outdegree of a task gives its dependencies. If all the dependencies of a task are part of the "completed task set" then the task is executed.  
  
```java
static class TaskManager   
{  
   ...  
   ...  
  
   /**  
* Examine each task in the <b>setTaskToCheck</b> to see if all its dependencies (outdegree)  
* have completed. If so, execute the task.  
*    
*  @param setTaskToCheck  
    */  
   private void execTaskWithCompletedOutDegree (Set<Task> setTaskToCheck)  
   {  
      for (Task currTask : setTaskToCheck)  
      {  
         if (setCompletedTask.containsAll(currTask.setOutTask))  
         {  
            Util.threadLog("Task has zero out-degree. Executing Task=" \+ currTask);  
            mapExecutingTaskToResult.put (currTask, executor.submit(currTask));  
         }  
      }   
   }  
}
```

Note:  
Execution using `executor.submit(Callable)` is non-blocking. That is, the main thread does not wait for the job to complete.  
Submission provides a handle to the [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) object using which we can track the completion of the Callable.  

## Putting the modules together

Here, we execute the leaf nodes and poll until task(s) are complete. When few task(s) are complete, figure out the tasks, that now, has no dependencies and can execute. The exercise is continued until there are no more tasks running.  
  
```java
static class TaskManager   
{  
  
   ...  
   ...  
  
   /**  
* Execute all the tasks in <b>task</b> array.  
*    
*  @param task Tasks to be executed  
    */  
   public void execute (Task... task) throws Exception  
   {  
      // Initialize maps and sets for new iteration  
      Util.threadLog("Execution started");  
      init ();       
        
      // Find all leaves that we get recursively navigating all tasks in task array  
      Util.printHeading("Find leaves for " \+ Arrays.asList(task));  
      fillLeafLevelTask (task);  
        
      // Execute all leaf tasks  
      Util.printHeading("Begin execution from leaves " \+ setLeaf);  
      for (Task currTask : setLeaf)  
         mapExecutingTaskToResult.put (currTask, executor.submit(currTask));  
        
      while (!mapExecutingTaskToResult.isEmpty())  
      {  
         // Get the dependents (indegree) of completed tasks  
         Set<Task> setTaskToCheck = getInDegreeOfCompletedTask ();  
           
         // Execute tasks with no dependencies (outdegree)  
         execTaskWithCompletedOutDegree(setTaskToCheck);  
  
         // If tasks are executing but there is no task tasks that need to be examined, sleep for a while.  
         if (setTaskToCheck.isEmpty() && !mapExecutingTaskToResult.isEmpty())  
         {  
            Util.threadLog("No task completed execution, sleeping");  
            Util.sleepInMilli(DEFAULT_TASK_EXEC_TIME + 2);  
         }  
      }           
        
      // Shutdown executor  
      Util.threadLog("Execution complete");  
      executor.shutdown();  
   }  
  
   public void init ()  
   {  
      executor = Executors.newFixedThreadPool(threadCount);  
      mapExecutingTaskToResult.clear();  
      setCompletedTask.clear();  
      setAllValidTask.clear();  
      setLeaf.clear();  
   }  
}
```
```java
Output:  
[Wed, 07-Dec-2016 13:48:57.673 IST] [Thread=main] Execution started  
  
------------------------------------------------------------  
                    Find leaves for [C2]  
------------------------------------------------------------  
State: Task=A1 Path=[C2, B1, A1] ValidTask=[A1, B1, C2] Leaf=[A1]  
State: Task=B1 Path=[C2, B1] ValidTask=[A1, B1, C2] Leaf=[A1]  
State: Task=A2 Path=[C2, B2, A2] ValidTask=[A1, A2, B1, B2, C2] Leaf=[A1, A2]  
State: Task=B2 Path=[C2, B2] ValidTask=[A1, A2, B1, B2, C2] Leaf=[A1, A2]  
State: Task=C2 Path=[C2] ValidTask=[A1, A2, B1, B2, C2] Leaf=[A1, A2]  
  
------------------------------------------------------------  
            Begin execution from leaves [A1, A2]  
------------------------------------------------------------  
[Wed, 07-Dec-2016 13:48:57.689 IST] [Thread=main] Status report - ExecutingTask=[A1, A2] CompletedTask=[] InTaskToCheck=[]  
[Wed, 07-Dec-2016 13:48:57.689 IST] [Thread=main] No task completed execution, sleeping  
[Wed, 07-Dec-2016 13:48:57.689 IST] [Thread=pool-1-thread-1] [A1] Started task  
[Wed, 07-Dec-2016 13:48:57.689 IST] [Thread=pool-1-thread-2] [A2] Started task  
[Wed, 07-Dec-2016 13:48:57.690 IST] [Thread=main] Status report - ExecutingTask=[A1, A2] CompletedTask=[] InTaskToCheck=[]  
[Wed, 07-Dec-2016 13:48:57.690 IST] [Thread=main] No task completed execution, sleeping  
[Wed, 07-Dec-2016 13:48:57.690 IST] [Thread=pool-1-thread-1] [A1] Finished task  
[Wed, 07-Dec-2016 13:48:57.691 IST] [Thread=main] Status report - ExecutingTask=[A2] CompletedTask=[A1] InTaskToCheck=[B1, B2]  
[Wed, 07-Dec-2016 13:48:57.706 IST] [Thread=main] Task has zero out-degree. Executing Task=B1  
[Wed, 07-Dec-2016 13:48:57.691 IST] [Thread=pool-1-thread-2] [A2] Finished task  
[Wed, 07-Dec-2016 13:48:57.706 IST] [Thread=main] Status report - ExecutingTask=[B1] CompletedTask=[A2] InTaskToCheck=[B2]  
[Wed, 07-Dec-2016 13:48:57.706 IST] [Thread=main] Task has zero out-degree. Executing Task=B2  
[Wed, 07-Dec-2016 13:48:57.722 IST] [Thread=pool-1-thread-1] [B2] Started task  
[Wed, 07-Dec-2016 13:48:57.722 IST] [Thread=main] Status report - ExecutingTask=[B1, B2] CompletedTask=[] InTaskToCheck=[]  
[Wed, 07-Dec-2016 13:48:57.722 IST] [Thread=main] No task completed execution, sleeping  
[Wed, 07-Dec-2016 13:48:57.722 IST] [Thread=pool-1-thread-3] [B1] Started task  
[Wed, 07-Dec-2016 13:48:57.723 IST] [Thread=main] Status report - ExecutingTask=[B1, B2] CompletedTask=[] InTaskToCheck=[]  
[Wed, 07-Dec-2016 13:48:57.723 IST] [Thread=main] No task completed execution, sleeping  
[Wed, 07-Dec-2016 13:48:57.723 IST] [Thread=pool-1-thread-3] [B1] Finished task  
[Wed, 07-Dec-2016 13:48:57.724 IST] [Thread=pool-1-thread-1] [B2] Finished task  
[Wed, 07-Dec-2016 13:48:57.725 IST] [Thread=main] Status report - ExecutingTask=[] CompletedTask=[B1, B2] InTaskToCheck=[C2]  
[Wed, 07-Dec-2016 13:48:57.725 IST] [Thread=main] Task has zero out-degree. Executing Task=C2  
[Wed, 07-Dec-2016 13:48:57.725 IST] [Thread=main] Status report - ExecutingTask=[C2] CompletedTask=[] InTaskToCheck=[]  
[Wed, 07-Dec-2016 13:48:57.725 IST] [Thread=main] No task completed execution, sleeping  
[Wed, 07-Dec-2016 13:48:57.726 IST] [Thread=pool-1-thread-2] [C2] Started task  
[Wed, 07-Dec-2016 13:48:57.731 IST] [Thread=pool-1-thread-2] [C2] Finished task  
[Wed, 07-Dec-2016 13:48:57.732 IST] [Thread=main] Status report - ExecutingTask=[] CompletedTask=[C2] InTaskToCheck=[]  
[Wed, 07-Dec-2016 13:48:57.732 IST] [Thread=main] Execution complete  
  

```