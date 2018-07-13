---
title: Clash Of Slashes  
category: java
typora-root-url: ../../
---


# Clash Of Slashes


Certain code, even though written in Java, may not work as expected on Windows. Since Linux (or other Unix based platform) mostly forms the base platform. We often find ourselves with tons of code where '/' is used quite liberally. This might lead rather unexpected results.  


## Java properties file - Use [store](https://docs.oracle.com/javase/8/docs/api/java/util/Properties.html#store-java.io.Writer-java.lang.String-) API  

Assertion in below code succeeds on Linux and fails on Windows.  

A Java properties file is created. The property key is 'PathToConfig' and the property value is the absolute path to the configuration file. Later, the properties file is loaded into a properties object. The property value for key 'PathToConfig' is retrieved. The property value is asserted to be the same as the path to configuration file.  


```java
import java.io.*;
import java.util.Properties;
import org.testng.Assert;

/**
 * Code that does not use store API to save properties to file.
 */
public class ClashOfSlashes01
{
   public static final File fileConfig = new File (System.getProperty("user.home"), "server/config/config.xml");

   public static void main (String arg[]) throws IOException
   {
      // Write file path as a property in a properties file.
      PrintWriter out = new PrintWriter (new FileWriter ("my.properties"));
      out.println("PathToConfig=" + fileConfig.getAbsolutePath());
      out.close();

      // Read properties file and assert the value
      Properties prop = new Properties ();
      prop.load(new FileReader ("my.properties"));
      String pathToConfig = prop.getProperty("PathToConfig");     
      Assert.assertTrue(pathToConfig.equals(fileConfig.getAbsolutePath()), "PropertyValue=" + pathToConfig + " ConfigFile=" + fileConfig.getAbsolutePath());
   }
}

```

On Windows, the property in my.properties file shall looks like "PathToConfig=C:\\Users\\Raghu\\server\\config\\config.xml". However, as per the [Java Properties documentation](https://docs.oracle.com/javase/8/docs/api/java/util/Properties.html#load-java.io.Reader-) (excerpt below) the load API either ignores the backslash or treats it as a special character.  

On Windows, the property value obtained from Properties object shall look like "C:UsersRaghuserverconfigconfig.xml".  



The method does not treat a backslash character, `\`, before a non-valid escape character as an error; the backslash is silently dropped. For example, in a Java string the sequence `"\z"` would cause a compile time error. In contrast, this method silently drops the backslash. Therefore, this method treats the two character sequence `"\b"` as equivalent to the single character `'b'`.  


The above issue can be resolved by using the [store](https://docs.oracle.com/javase/8/docs/api/java/util/Properties.html#store-java.io.Writer-java.lang.String-) API to generate properties file.  


## Mix of slashes - Use [Paths](http://rbseshad-pc.in.oracle.com/Docs/JavaDoc/JDK8/api/java/nio/file/Paths.html)  

Consider the following code segment.  

```java
path = System.getProperty("user.home") + "/server/config/config.xml";
System.out.println(path);

```
```java
Output On Linux:
/home/raghu/server/config/config.xml

Output On Windows:
C:\\Users\\Raghu/server/config/config.xml

```

On Windows, the above code results in path having mix of forward and back slashes. Such a path may wrongly configure a server. A test that searches for a path entry in a log file fails only on Windows. We could overcome this issue by creating a variable like 'FileSep' that stores the platform specific file separator and uses it to create the path string.  


```java
String FileSep = System.getProperty ("file.separator");
String path = System.getProperty("user.home") + FileSep + "server" + FileSep + "config" + FileSep + "config.xml";
System.out.println(path);


```
```java
Output on Linux:
/home/raghu/server/config/config.xml

Output On Windows:
C:\\Users\\Raghu\\server\\config\\config.xml

```

Although the above code addresses the issue, the code becomes pretty clumsy and unreadable. Also, considering tons of code already written to use forward slash, changing all of them shall soon be tedious. We could also write code based on the type of operating system, but that would require us to maintain two code paths.  

[Paths](http://rbseshad-pc.in.oracle.com/Docs/JavaDoc/JDK8/api/java/nio/file/Paths.html) to the rescue.  


```java
String path = Paths.get (System.getProperty("user.home"), "/server/config/config.xml").toString();
System.out.println(path);

```
```java
Output on Linux:
/home/raghu/server/config/config.xml

Output On Windows:
C:\\Users\\Raghu\\server\\config\\config.xml

```

The [java.nio.file.Paths](http://rbseshad-pc.in.oracle.com/Docs/JavaDoc/JDK8/api/java/nio/file/Paths.html)class provides APIs to create normalized platform specific paths by accepting arguments that might have mix of slashes in case of Windows. By using Paths we can make the code work for both Windows and Linux with minimal effort, while preserving code readability.  


## Normalized Path

A path constructed using backslash '\\' might not be an acceptable format for configuring servers, even though the server is running on Windows. For example, Apache HTTP server mandates the forward slashes (excerpt of httpd.conf below).  


\# NOTE: Where filenames are specified, you must use forward slashes  
\# instead of backslashes (e.g., "c:/apache" instead of "c:\\apache").  


Instead of writing code based on the type of operating system, we can use [Paths](http://rbseshad-pc.in.oracle.com/Docs/JavaDoc/JDK8/api/java/nio/file/Paths.html) to get normalized path.  

A normalized representation provides a standard way to represent two seemingly different entities which actually represent the same entity. For example, "/home/raghu/server/config/config.xml" and "/home/raghu/server/bin/../config/config.xml" are both paths to the same config.xml file. However, the second representation has unnecessary inclusions which are removed as part of normalization.  
```java
import java.nio.file.*;

public class ClashOfSlashes02
{
   public static void main (String arg[])
   {
      String path = null;

      path = normalizePath(System.getProperty("user.home"), "/server/" + "./config/config.xml");
      System.out.println(path);

      path = normalizePath(System.getProperty("user.home"), "/server/bin/", "../config/config.xml");
      System.out.println(path);    
   }

   public static String normalizePath (String first, String... more)
   {
      return Paths.get(first, more).normalize().toFile().getPath().replace("\\\", "/");
   }
}

```
```java
Output on Linux:
/home/raghu/server/config/config.xml
/home/raghu/server/config/config.xml

Output On Windows:
C:/Users/Raghu/server/config/config.xml
C:/Users/Raghu/server/config/config.xml

```

In the above code, the normalizePath function creates a normalized path. Furthermore, all back slashes are converted to forward slashes. Path thus obtained can be used to configure servers.  

APIs like println take care of adding platform specific line separators. Tools like Ant take care of adding platform specific path separators. We can now use the APIs provided by [Path](http://rbseshad-pc.in.oracle.com/Docs/JavaDoc/JDK8/api/java/nio/file/Path.html) to resolve the clash of slashes.
