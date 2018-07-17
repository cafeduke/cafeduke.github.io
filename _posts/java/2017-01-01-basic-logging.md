---
layout: post
title: Brewing Java Logging  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# Brewing with Java Logging

  
  
In this article, we shall take advantage of [Java Logging API](https://docs.oracle.com/javase/8/docs/technotes/guides/logging/overview.html) to quickly setting basic console and text file logging.  
  
We begin by analyzing the existing Logger, understanding why messages more verbose than INFO are not logged (against what one would expect) and provide a quick fix for this. However, you can choose to skip these and go to the final section "Finer Log Utility" to get hold of the log utility that addresses typical concerns.  

## Set log related system properties

First, lets take a look at the desired log format. The meta data is enclosed within square brackets followed by log message. The meta data includes timestamp, log level, log message source.  
```java
[Wed 18-Jan-2017 10:10:05.596 IST] [INFO   ] [com.maga.util.MLogger main] HelloWorld  

```
By setting a System property `java.util.logging.SimpleFormatter.format` to an appropriate value having format specifiers, we can ensure the above log format. [SimpleFormatter.format](https://docs.oracle.com/javase/8/docs/api/java/util/logging/SimpleFormatter.html#format-java.util.logging.LogRecord-) documents the various format options. Also, see [format string](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#syntax) syntax. Now that we have decided on the format string, we set the system property  `java.util.logging.SimpleFormatter.format` in the static block.  
  
`public class MLogger  
{  
/**  
* Property name (key) to format log messages  
    */  
public static final String LOG_FORMAT_KEY = "java.util.logging.SimpleFormatter.format";  
  
/**  
* Value for key 'java.util.logging.SimpleFormatter.format'.  
    */  
public static final String LOG_FORMAT_VALUE = "[%1$ta %1$td-%1$tb-%1$tY %1$tT.%1$tL %1$tZ] [%4$-7s] [%2$s] %5$s%6$s%n";  
  
static  
{  
System.setProperty(LOG_FORMAT_KEY, LOG_FORMAT_VALUE);  
}  
}`

## Basic Logging  

### Creating Logger object  

We use the [java.util.logging.Logger](https://docs.oracle.com/javase/8/docs/api/java/util/logging/Logger.html) to create a logger object. The `getLogger` method accepts a `name`. The name is generally a fully qualified (dot separated) class name. The class that intends to log. Essentially, every class can have its own private logger object as given below.  
  
```java
package com.myorg.ace;  
  
class A  
{  
   private Logger logger = Logger.getLogger(currClass.getName());  
}  

```
Class `A` shall have a logger by name `com.myorg.ace.A`  
  
```java
package com.myorg.bee;  
  
class B  
{  
   private Logger logger = Logger.getLogger(currClass.getName());  
}
```
Class `B` shall have a logger by name `com.myorg.bee.B`  

### Putting a simple logger to test  

```java
import java.util.logging.*;  
  
public class MLogger  
{  
   /**  
* Property name (key) to format log messages  
    */  
   public static final String LOG_FORMAT_KEY = "java.util.logging.SimpleFormatter.format";  
     
   /**  
* Value for key 'java.util.logging.SimpleFormatter.format'.  
    */  
   public static final String LOG_FORMAT_VALUE = "[%1$ta %1$td-%1$tb-%1$tY %1$tT.%1$tL %1$tZ] [%4$-7s] [%2$s] %5$s%6$s%n";     
    
   static  
   {  
      System.setProperty(LOG_FORMAT_KEY, LOG_FORMAT_VALUE);  
   }  
     
   public static void main (String arg[])  
   {  
      Logger logger = Logger.getLogger(LoggerTest.class.getName());  
      logAllLevels(logger);   
   }  
  
   public static void logAllLevels (Logger logger)  
   {  
      logger.severe ("Severe");  
      logger.warning("Warning");  
      logger.info  ("Info");       
      logger.fine  ("Fine");  
      logger.finer ("Finer");  
      logger.finest("Finest");  
      logger.info  ("Begin stacktrace");  
      logger.log(Level.SEVERE, "Ooops! Error occured.", new IllegalStateException("Ooops"));  
      logger.info  ("End stacktrace");  
      logger.info  ("");  
   }  
}
```
```java
Output  
[Mon 23-Jan-2017 14:30:40.601 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Severe  
[Mon 23-Jan-2017 14:30:40.640 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger logAllLevels] Warning  
[Mon 23-Jan-2017 14:30:40.641 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] Info  
[Mon 23-Jan-2017 14:30:40.641 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] Begin stacktrace  
[Mon 23-Jan-2017 14:30:40.642 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Ooops! Error occured.  
java.lang.IllegalStateException: Ooops  
	at com.maga.util.MLogger.logAllLevels(MLogger.java:94)  
	at com.maga.util.MLogger.main(MLogger.java:39)  
  
[Mon 23-Jan-2017 14:30:40.643 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] End stacktrace  
[Mon 23-Jan-2017 14:30:40.644 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] 
```
  
We find that log level fine and more verbose logs are not displayed!  

### Analyzing Logger

From [Java Logging API](https://docs.oracle.com/javase/8/docs/technotes/guides/logging/overview.html) documentation, we find that a Logger can have multiple [Handlers](https://docs.oracle.com/javase/8/docs/technotes/guides/logging/overview.html#a1.5). Each Handler can additionally have a formatter to format logs. Now, lets see what is cooking with your logger object.  
  
```java
import java.util.logging.*;  
  
public class MLogger  
{  
   ...  
  
   public static void main (String arg[])  
   {  
      Logger logger = Logger.getLogger(LoggerTest.class.getName());        
      printLoggersAndHandlers(logger);  
   }  
  
   public static void printLoggersAndHandlers (Logger logger)  
   {  
      if (logger == null)  
         return;  
        
      while (logger != null)  
      {  
         System.out.println("Logger Name=" \+ logger.getName() + " Level=" \+ logger.getLevel());  
         System.out.println("--------------------------------");  
         printHandlers(logger);  
         System.out.println();  
         logger = logger.getParent();  
      }  
   }  
     
   public static void printHandlers (Logger logger)  
   {  
      if (logger == null)  
         return;  
        
      Handler handler[] = logger.getHandlers();  
      if (handler == null || handler.length == 0)  
      {  
         System.out.println("No handers");  
         return;  
      }  
        
      int count = 0;  
      for (Handler h : handler)  
         System.out.println(String.format("Handler[%d] Name=%s Level=%s Formatter=%s", count++, h.getClass().getSimpleName(), h.getLevel(), h.getFormatter().getClass().getSimpleName()));  
   }  
  
}  

```
```java
Output  
Logger Name=com.maga.util.MLogger Level=null  
--------------------------------  
No handers  
  
Logger Name= Level=INFO  
--------------------------------  
Handler[0] Name=ConsoleHandler Level=INFO Formatter=SimpleFormatter
```
  
We find that, by default, a logger has 'null' level and has no handlers. From [Java Logging API - Loggers](https://docs.oracle.com/javase/8/docs/technotes/guides/logging/overview.html#a1.3), we find the following  
  
If a Logger's level is set to be null then the Logger will use an effective Level that will be obtained by walking up the parent tree and using the first non-null Level.  
  
The parent of this logger has a name `""`. An logger with empty name is the Root Logger. The root logger has a console hander with INFO verbosity. Hence, all messages that are verbose than INFO are not printed.  

### Quick Fix

As a quick fix we can update the root logger itself to allow `ALL` log levels.  
  
```java
public class MLogger  
{  
   ...  
  
   static  
   {  
      System.setProperty(LOG_FORMAT_KEY, LOG_FORMAT_VALUE);  
      setLevelAcrossHandlers (Logger.getLogger(""), Level.ALL);      
   }  
  
   public static void main (String arg[])  
   {  
      Logger logger = Logger.getLogger(LoggerTest.class.getName());  
      printLoggersAndHandlers(logger);  
      logAllLevels(logger);   
   }  
  
   public static void setLevelAcrossHandlers (Logger logger, Level level)  
   {  
      if (logger.getHandlers() == null || logger.getHandlers().length == 0)  
         return;  
        
      logger.setLevel(level);  
      for (Handler handler : logger.getHandlers())  
         handler.setLevel(level);        
   }   
  
 }  

```
```java
Output  
Logger Name=com.maga.util.MLogger Level=null  
--------------------------------  
No handers  
  
Logger Name= Level=ALL  
--------------------------------  
Handler[0] Name=ConsoleHandler Level=ALL Formatter=SimpleFormatter  
  
[Mon 23-Jan-2017 16:01:28.588 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Severe  
[Mon 23-Jan-2017 16:01:28.593 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger logAllLevels] Warning  
[Mon 23-Jan-2017 16:01:28.594 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] Info  
[Mon 23-Jan-2017 16:01:28.595 IST] [com.maga.util.MLogger] [FINE   ] [com.maga.util.MLogger logAllLevels] Fine  
[Mon 23-Jan-2017 16:01:28.595 IST] [com.maga.util.MLogger] [FINER  ] [com.maga.util.MLogger logAllLevels] Finer  
[Mon 23-Jan-2017 16:01:28.596 IST] [com.maga.util.MLogger] [FINEST ] [com.maga.util.MLogger logAllLevels] Finest  
[Mon 23-Jan-2017 16:01:28.596 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] Begin stacktrace  
[Mon 23-Jan-2017 16:01:28.597 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Ooops! Error occured.  
java.lang.IllegalStateException: Ooops  
	at com.maga.util.MLogger.logAllLevels(MLogger.java:96)  
	at com.maga.util.MLogger.main(MLogger.java:41)  
  
[Mon 23-Jan-2017 16:01:28.598 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] End stacktrace  
[Mon 23-Jan-2017 16:01:28.599 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels]   

```

## MLogger - Refining log utility  

Earlier, we provided a quick fix that updates the root logger. However, we would like to provide individual logger for each class name (or dot separated string). This can be done as follows.  

### Reset LogManager

First, we don't want the root logger (Logger with empty name) with console handler to be attached to every logger we create. So, lets reset the `LogManager LogManager.getLogManager().reset()` in a static block.  
```java
public class MLogger  
{  
   ...  
  
   static  
   {  
      System.setProperty(LOG_FORMAT_KEY, LOG_FORMAT_VALUE);  
      LogManager.getLogManager().reset();     
   }  
  
  
   public static void main (String arg[])  
   {  
      Logger logger = Logger.getLogger(LoggerTest.class.getName());  
      printLoggersAndHandlers(logger);  
      logAllLevels(logger);   
   }  
  
   ...   
}  

```
Below is the output before and after `LogManager` reset. We find that root logger has no handlers. So, the root logger does not log messages. Eventually, no messages are logged.  

After LogManager reset  

Defaut - Before LogManager reset  

```java
Logger Name=com.maga.util.MLogger Level=null  
--------------------------------  
No handers        
  
Logger Name= Level=INFO  
--------------------------------  
No handers      
```

```java
Logger Name=com.maga.util.MLogger Level=null  
--------------------------------  
No handers        
  
Logger Name= Level=INFO  
--------------------------------  
Handler[0] Name=ConsoleHandler Level=INFO Formatter=SimpleFormatter      
```

### Customized Logger Object

The MLogger has a `getLogger()` function the uses the given `String` to create a logger. Thus created logger  

*   Allows use of parent handlers - Allowed by default.  
    
*   Adds a `FileHandler` if a file is provided otherwise adds a ConsoleHandler
*   The hander sets `SimpleFormatter`
*   The hander and logger levels are set as per `LOG_LEVEL` variable.  
    
*   The `LOG_LEVEL` defaults to `INFO` if system property `maga.mlogger.loglevel` is not set.  
    

  
```java
public class MLogger  
{  
   /**  
* Property name (key) to format log messages  
    */  
   public static final String LOG_FORMAT_KEY = "java.util.logging.SimpleFormatter.format";  
     
   /**  
* Value for key 'java.util.logging.SimpleFormatter.format'.  
    */  
   public static final String LOG_FORMAT_VALUE = "[%1$ta %1$td-%1$tb-%1$tY %1$tT.%1$tL %1$tZ] [%3$s] [%4$-7s] [%2$s] %5$s%6$s%n";  
     
   /**  
* The system property to be used to set the default log level for MLogger.  
    */  
   public static final String PROP_LOG_LEVEL = "maga.mlogger.loglevel";  
  
   /**http://aseng-wiki.us.oracle.com/asengwiki/display/ASQA/Test+Environment+Setup#TestEnvironmentSetup-CreateTestView  
* Default log level  
    */  
   public static final Level LOG_LEVEL = (System.getProperty(PROP_LOG_LEVEL) == null) ? Level.INFO : Level.parse(System.getProperty(PROP_LOG_LEVEL));     
  
   static  
   {  
      System.setProperty(LOG_FORMAT_KEY, LOG_FORMAT_VALUE);  
      LogManager.getLogManager().reset();     
   }  
  
   public static void main (String arg[])  
   {  
      Logger logger = MLogger.getLogger(LoggerTest.class.getName());  
      printLoggersAndHandlers(logger);  
      logAllLevels(logger);   
   }  
  
   public static Logger getLogger(Class<?\> currClass)  
   {  
      return getLogger(currClass.getName());  
   }  
  
   public static Logger getLogger(Class<?\> currClass, File file)  
   {  
      return getLogger(currClass.getName(), file);  
   }  
  
   public static Logger getLogger(String name)  
   {  
      return getLogger(name, null);  
   }  
  
   public static Logger getLogger (String name, File file)  
   {  
      Logger logger = Logger.getLogger(name);  
        
      try  
      {  
         // Return logger if it is already initialized.  
         if (logger.getHandlers() != null && logger.getHandlers().length > 0)  
            return logger;  
     
         // Allow use of parent handlers  
         logger.setUseParentHandlers(true);  
     
         // Use custom console handler  
         Handler handler = (file == null) ? new ConsoleHandler() : new FileHandler(file.getAbsolutePath());  
         handler.setFormatter(new SimpleFormatter());  
     
         // Set log level for handler and logger  
         logger.setLevel(LOG_LEVEL);  
         handler.setLevel(LOG_LEVEL);  
     
         // Add handler to logger  
         logger.addHandler(handler);  
      }  
      catch (Exception e)  
      {  
         throw new IllegalStateException ("Error initializing logger.", e);  
      }  
      return logger;  
   }  
}  

```
```java
Output  
Logger Name=com.maga.util.MLogger Level=INFO  
--------------------------------  
Handler[0] Name=ConsoleHandler Level=INFO Formatter=SimpleFormatter  
  
Logger Name= Level=INFO  
--------------------------------  
No handers
```

### Set LogLevel for Logger and all Handlers  

Here, we are setting the LogLevel of `Logger` and all its `Handler`s. By default (though explicitly set) a logger sets use of parent handlers `logger.setUseParentHandlers(true)`. This enables hierarchical logging - The parent of a Logger with name a.b.c would be a.b (if it exits). Its parent would be a (if it exits).  Root logger with name "" is the base of all loggers.  
  
```java
public class MLogger  
{  
   public static void setLevelAcrossHandlers (Logger logger, Level level)  
   {  
      if (logger == null || logger.getHandlers() == null || logger.getHandlers().length == 0)  
         return;  
        
      logger.setLevel(level);  
      for (Handler handler : logger.getHandlers())  
         handler.setLevel(level);        
   }    
}  

```

### Putting it all together  

```java
package com.maga.util;  
  
import java.util.logging.ConsoleHandler;  
import java.util.logging.FileHandler;  
import java.util.logging.Handler;  
import java.util.logging.Level;  
import java.util.logging.LogManager;  
import java.util.logging.Logger;  
import java.util.logging.SimpleFormatter;  
import java.io.*;  
  
public class MLogger  
{  
   /**  
* Property name (key) to format log messages  
    */  
   public static final String LOG_FORMAT_KEY = "java.util.logging.SimpleFormatter.format";  
     
   /**  
* Value for key 'java.util.logging.SimpleFormatter.format'.  
    */  
   public static final String LOG_FORMAT_VALUE = "[%1$ta %1$td-%1$tb-%1$tY %1$tT.%1$tL %1$tZ] [%3$s] [%4$-7s] [%2$s] %5$s%6$s%n";  
     
   /**  
* The system property to be used to set the default log level for MLogger.  
    */  
   public static final String PROP_LOG_LEVEL = "maga.mlogger.loglevel";  
  
   /**  
* Default log level  
    */  
   public static final Level LOG_LEVEL = (System.getProperty(PROP_LOG_LEVEL) == null) ? Level.INFO : Level.parse(System.getProperty(PROP_LOG_LEVEL));     
     
   static  
   {  
      System.setProperty(LOG_FORMAT_KEY, LOG_FORMAT_VALUE);  
      LogManager.getLogManager().reset();  
   }     
     
   /*  
    * ------------------------------------------------------------------  
    * Logging  
* -----------------------------------------------------------------   
    */  
     
   public static Logger getLogger(Class<?\> currClass)  
   {  
      return getLogger(currClass.getName());  
   }  
  
   public static Logger getLogger(Class<?\> currClass, File file)  
   {  
      return getLogger(currClass.getName(), file);  
   }  
  
   public static Logger getLogger(String name)  
   {  
      return getLogger(name, null);  
   }  
  
   public static Logger getLogger (String name, File file)  
   {  
      Logger logger = Logger.getLogger(name);  
        
      try  
      {  
         // Return logger if it is already initialized.  
         if (logger.getHandlers() != null && logger.getHandlers().length > 0)  
            return logger;  
     
         // Allow use of parent handlers  
         logger.setUseParentHandlers(true);  
     
         // Use custom console handler  
         Handler handler = (file == null) ? new ConsoleHandler() : new FileHandler(file.getAbsolutePath());  
         handler.setFormatter(new SimpleFormatter());  
     
         // Set log level for handler and logger  
         logger.setLevel(LOG_LEVEL);  
         handler.setLevel(LOG_LEVEL);  
     
         // Add handler to logger  
         logger.addHandler(handler);  
      }  
      catch (Exception e)  
      {  
         throw new IllegalStateException ("Error initializing logger.", e);  
      }  
      return logger;  
   }     
  
   public static void logAllLevels (Logger logger)  
   {  
      logger.severe ("Severe");  
      logger.warning("Warning");  
      logger.info  ("Info");       
      logger.fine  ("Fine");  
      logger.finer ("Finer");  
      logger.finest("Finest");  
      logger.info  ("Begin stacktrace");  
      logger.log(Level.SEVERE, "Ooops! Error occured.", new IllegalStateException("Ooops"));  
      logger.info  ("End stacktrace");  
      logger.info  ("");  
   }  
     
   public static void setLevelAcrossHandlers (Logger logger, Level level)  
   {  
      if (logger == null || logger.getHandlers() == null || logger.getHandlers().length == 0)  
         return;  
        
      logger.setLevel(level);  
      for (Handler handler : logger.getHandlers())  
         handler.setLevel(level);        
   }     
     
   public static void printLoggersAndHandlers (Logger logger)  
   {  
      if (logger == null)  
         return;  
        
      while (logger != null)  
      {  
         System.out.println(String.format("Logger Name=%s Level=%s", logger.getName(), logger.getLevel()));  
         System.out.println("--------------------------------");  
         printHandlers(logger);  
         System.out.println();  
         logger = logger.getParent();  
      }  
   }  
     
   public static void printHandlers (Logger logger)  
   {  
      if (logger == null)  
         return;  
        
      Handler handler[] = logger.getHandlers();  
      if (handler == null || handler.length == 0)  
      {  
         System.out.println("No handers");  
         return;  
      }  
        
      int count = 0;  
      for (Handler h : handler)  
         System.out.println(String.format("Handler[%d] Name=%s Level=%s Formatter=%s", count++, h.getClass().getSimpleName(), h.getLevel(), h.getFormatter().getClass().getSimpleName()));  
   }  
     
}
```

## Taking MLogger for a spin  

### Test Hierarchical Log  

```java
public class MLogger  
{  
   ...  
  
   public static void main (String arg[]) throws SecurityException, IOException  
   {  
  
       Logger loggerMaga = MLogger.getLogger("com.maga", new File("Maga.log"));  
  
       loggerMaga.warning("---------------------------------------------");  
       loggerMaga.warning("Warning");  
       loggerMaga.warning("---------------------------------------------");         
       MLogger.setLevelAcrossHandlers(loggerMaga, Level.WARNING);  
       logAllLevels(loggerMaga);
  
       Logger logger = MLogger.getLogger(MLogger.class.getName());  
  
       logger.warning("---------------------------------------------");  
       logger.warning("Info");  
       logger.warning("---------------------------------------------");  
       logAllLevels(logger);  
         
       MLogger.setLevelAcrossHandlers(logger, Level.FINER);  
       logger.warning("---------------------------------------------");  
       logger.warning("Finer");  
       logger.warning("---------------------------------------------");  
       logAllLevels(logger);  
         
  
   }  
}  

```
Any class can use the `MLogger` utility as shown above

*   A Logger object is obtained using `MLogger.getLogger(String)`
*   We set the level of the logger and all its handers using `MLogger.setLevelAcrossHandlers(Logger,Level)`

In the above test  

*   We have two logger objects `logger` and `loggerMaga`
*   Logger  `logger` has name `com.maga.util.MLogger` while the `loggerMaga` has name `com.maga`  
    
*   Since hierarchical logging is enabled `loggerMaga` is the parent of `logger`
*   All logs by logger reaches loggerMaga. However, loggerMaga and its handers are set the log only WARNING verbosity. So, all logs (its own and what reaches from the children) below WARNING are ignored.  
    
*   `logger` level is INFO by default. All levels are logged - Only INFO and above are logged.  
    
*   `logger` level is set to FINER using  `MLogger.setLevelAcrossHandlers` \- Only FINER and above are logged.
*   In Maga.log file we find that the logs from the child is captured but verbosity below WARNING are ignored.  
    

```java
Contents of Maga.log  
[Tue 24-Jan-2017 15:11:26.579 IST] [com.maga] [WARNING] [com.maga.util.MLogger main] ---------------------------------------------  
[Tue 24-Jan-2017 15:11:26.584 IST] [com.maga] [WARNING] [com.maga.util.MLogger main] Warning  
[Tue 24-Jan-2017 15:11:26.585 IST] [com.maga] [WARNING] [com.maga.util.MLogger main] ---------------------------------------------  
[Tue 24-Jan-2017 15:11:26.585 IST] [com.maga] [SEVERE ] [com.maga.util.MLogger logAllLevels] Severe  
[Tue 24-Jan-2017 15:11:26.586 IST] [com.maga] [WARNING] [com.maga.util.MLogger logAllLevels] Warning  
[Tue 24-Jan-2017 15:11:26.587 IST] [com.maga] [SEVERE ] [com.maga.util.MLogger logAllLevels] Ooops! Error occured.  
java.lang.IllegalStateException: Ooops  
        at com.maga.util.MLogger.logAllLevels(MLogger.java:114)  
        at com.maga.util.MLogger.main(MLogger.java:44)  
  
[Tue 24-Jan-2017 15:11:26.588 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger main] ---------------------------------------------  
[Tue 24-Jan-2017 15:11:26.590 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger main] Info  
[Tue 24-Jan-2017 15:11:26.591 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger main] ---------------------------------------------  
[Tue 24-Jan-2017 15:11:26.593 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Severe  
[Tue 24-Jan-2017 15:11:26.593 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger logAllLevels] Warning  
[Tue 24-Jan-2017 15:11:26.596 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Ooops! Error occured.  
java.lang.IllegalStateException: Ooops  
        at com.maga.util.MLogger.logAllLevels(MLogger.java:114)  
        at com.maga.util.MLogger.main(MLogger.java:50)  
  
[Tue 24-Jan-2017 15:11:26.597 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger main] ---------------------------------------------  
[Tue 24-Jan-2017 15:11:26.598 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger main] Finer  
[Tue 24-Jan-2017 15:11:26.599 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger main] ---------------------------------------------  
[Tue 24-Jan-2017 15:11:26.600 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Severe  
[Tue 24-Jan-2017 15:11:26.600 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger logAllLevels] Warning  
[Tue 24-Jan-2017 15:11:26.606 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Ooops! Error occured.  
java.lang.IllegalStateException: Ooops  
        at com.maga.util.MLogger.logAllLevels(MLogger.java:114)  
        at com.maga.util.MLogger.main(MLogger.java:56)
```

### Test LogLevel as system property

As we demonstrate below, by setting the system property `maga.mlogger.loglevel` we run the entire code with new log level. This way we can rerun the code with more granular verbosity for debugging.  
  
```java
public class MLogger  
{  
   ...  
  
   public static void main (String arg[]) throws SecurityException, IOException  
   {  
       Logger logger = MLogger.getLogger(MLogger.class.getName());  
       logAllLevels(logger);  
   }  
}  

```
```java
Output  
>java -cp classes -Dmaga.mlogger.loglevel=FINER com.maga.util.MLogger  
[Tue 24-Jan-2017 15:32:34.925 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Severe  
[Tue 24-Jan-2017 15:32:34.966 IST] [com.maga.util.MLogger] [WARNING] [com.maga.util.MLogger logAllLevels] Warning  
[Tue 24-Jan-2017 15:32:34.968 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] Info  
[Tue 24-Jan-2017 15:32:34.970 IST] [com.maga.util.MLogger] [FINE   ] [com.maga.util.MLogger logAllLevels] Fine  
[Tue 24-Jan-2017 15:32:34.971 IST] [com.maga.util.MLogger] [FINER  ] [com.maga.util.MLogger logAllLevels] Finer  
[Tue 24-Jan-2017 15:32:34.972 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] Begin stacktrace  
[Tue 24-Jan-2017 15:32:34.974 IST] [com.maga.util.MLogger] [SEVERE ] [com.maga.util.MLogger logAllLevels] Ooops! Error occured.  
java.lang.IllegalStateException: Ooops  
        at com.maga.util.MLogger.logAllLevels(MLogger.java:110)  
        at com.maga.util.MLogger.main(MLogger.java:51)  
  
[Tue 24-Jan-2017 15:32:34.976 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels] End stacktrace  
[Tue 24-Jan-2017 15:32:34.978 IST] [com.maga.util.MLogger] [INFO   ] [com.maga.util.MLogger logAllLevels]  

```