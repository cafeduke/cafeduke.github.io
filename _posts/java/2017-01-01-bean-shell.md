---
layout: post
title: Bean Shell  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# BeanShell: Platfrom independent scripts using Java

## Why BeanShell?

One of the most intriguing feature of Linux is shell scripting. The power of shell scripting along with pipes to feed output of one command to the other, make it a delight to add a bunch of custom helper commands. These helper commands can range from simple aliases that help navigate to nested directories, to commands that start servers and setup test environment.  
  
However, we feel crippled when working in a Windows environment. Creating and maintaining a batch equivalent of every shell script is a time consuming excercise. Using toolkits like [MKS](https://en.wikipedia.org/wiki/MKS_Toolkit) or [Cygwin](https://www.cygwin.com/) assist to a good extent by providing many Linux command equivalents on Windows. However, not all Linux command equivalents exist in the toolkit and several options do not work the same way, as they do on Linux. This would require us to maintain a batch/Perl script for Windows. Nevertheless, [MKS](https://en.wikipedia.org/wiki/MKS_Toolkit) does provide an indispensable addition of simulating a Linux environment on Windows.  
  
Scripting using Perl does sound like a good alternative. However, dependency on a external library (or Perl module) might require installation! A subset of Perl modules that do not require installation are called "Pure Perl Modules". However, identifying these pure Perl modules is obscure.  
  
External and [open source libraries available for Java](http://www.java-opensource.com/) is overwhelming! Adding a new module just requires adding the JAR to classpath. BeanShell clubs the comfort of familiar Java syntax, scripting conveniences that requires no compilation with rich library support.  

## Resources

There are good amount of documentation available to get started with writing BeanShell scripts.  
  
[BeanShell Quick Start](http://www.beanshell.org/manual/quickstart.html#Quick_Start)  
[BeanShell Home](http://www.beanshell.org/home.html)  
  
Surprisingly, The latest BeanShell library not in the BeanShell [website](http://www.beanshell.org/home.html). Rather, latest [BeanShell 2](http://code.google.com/p/beanshell2/) (2.1.8 as of now) is found in [code.google.com](http://code.google.com/p/beanshell2/)  

## Custom commands using BeanShell for Linux

### Typical approach  

Linux uses the [SheBang](https://en.wikipedia.org/wiki/Shebang_%28Unix)(Magic Line/HashBang  is the first line of a script file that begins with#! ) to identify the path to the executable, that shall be used to execute the current script. In case of BeanShell, we can use the [HashBang](https://en.wikipedia.org/wiki/Shebang_%28Unix) line `"#!/usr/bin/java bsh.Interpreter"` (as suggested in the BeanShell Manual). Details follow.  

```java
$ export CLASSPATH=${CLASSPATH}:${DIR_LIB}/beanshell/*:${DIR_LIB}/jansi/*  
$ export PATH=${PATH}:${HOME}/scripts  
  
$ cat > ${HOME}/scripts/sayHello  
#!/usr/bin/java bsh.Interpreter  
print ("Hello World");  
  
$ chmod 755 ${HOME}/scripts/sayHello  
  
$ sayHello  
Hello World
```
Here, path to all necessary libraries are added to CLASSPATH. The directory having all our scripts is added to PATH environment variable. All scripts are given executable permission.  
  
The above approach has the following caveats:  
  
1) Path to Java is hard coded in the magic  line.

*   Many times, path to Java is expected to be constructed using the environment variable JAVA_HOME.
*   Most Unix flavors do not support environment variables in [HashBang](https://en.wikipedia.org/wiki/Shebang_%28Unix).

2) CLASSPATH environment variable is used to set all necessary libraries.

*   Windows restricts the maximum length for environment variables.
*   Setting environment variable CLASSPATH is not the recommended way. See below excerpt from [The Java Tutotrial - PATH and CLASSPATH](https://docs.oracle.com/javase/tutorial/essential/environment/paths.html#classpath)

The CLASSPATH variable is one way to tell applications, including the JDK tools, where to look for user classes. (Classes that are part of the JRE, JDK platform, and extensions should be defined through other means, such as the bootstrap class path or the extensions directory.)  
  
The preferred way to specify the class path is by using the -cp command line switch. This allows the CLASSPATH to be set individually for each application without affecting other applications. Setting the CLASSPATH can be tricky and should be performed with care.  

### Using custom executable in HashBang (Magic Line/Hashbang)

#### Create a Wrapper Shell script for BeanShell - bsh  

We create a command (an executable Shell script), namely bsh, as follows:  
```java
$ export PATH=${PATH}:${HOME}/scripts  
  
$ cat > ${HOME}/scripts/bsh  
#!/bin/bash  
if [ -z "${JAVA_HOME}" ]  
then  
   echo "JAVA_HOME not set"  
   exit 1  
fi  
DIR_LIB="${HOME}/lib";  
${JAVA_HOME}/bin/java -cp ${DIR_LIB}/beanshell/*:${DIR_LIB}/jansi/* bsh.Interpreter "$@"  
  
$ chmod 755 ${HOME}/scripts/bsh
```

#### Include bsh in the HashBang of beanshell scripts

We use bsh as the [HashBang](https://en.wikipedia.org/wiki/Shebang_%28Unix) of the beanshell scripts we create as follows:  
```java
$ cat > ${HOME}/scripts/sayHi  
#!/usr/bin/env bsh  
print ("Hi");  
  
$ chmod 755 ${HOME}/scripts/sayHi  
  
$ sayHi  
Hi
```

#### Working

1) Typing "sayHi" searches for an executable named "sayHi" in PATH  
```java
Result: Finds ${HOME}/scripts/sayHi  

```
2) Using "/usr/bin/env bsh" searches for an executable named "bsh" in PATH.  

*   We can use the absolute path to bsh in HashBang as well.  (Like `#!/home/raghu/scripts/bsh` )  
    
*   However, absolute path cannot be used when we are checking in the scripts in a version control system. This is because each user can pull the sources into a different directory.

```java
Result:  Finds ${HOME}/scripts/bsh
```
  
3) bsh script is used to execute sayHi.  
```java
This is same as executing:  
$HOME/scripts/bsh $HOME/scripts/sayHi
```
  
4) bsh executes Java class bsh.Interpreter with all libraries in classpath.  File name "sayHi"  shall be a command line argument. (Had we provided command line arguments to sayHi, they would follow)  
```java
This is same as executing:  
${JAVA_HOME}/bin/java   
   -cp ${DIR_LIB}/beanshell/*:${DIR_LIB}/jansi/* bsh.Interpreter sayHi
```

## Custom commands using BeanShell for Windows  

#### Create a Wrapper executable for BeanShell - bsh.cmd  

First, we create a command (an executable .cmd file), namely bsh.cmd, as follows.  
```java
@echo off  
IF NOT DEFINED JAVA_HOME (  
  echo JAVA_HOME is not set  
  exit /B  
)  
  
set DIR_LIB=%HOMEPATH%\\lib  
${JAVA_HOME}\\bin\\java -cp ${DIR_LIB}\\beanshell\*:${DIR_LIB}\\jansi\* bsh.Interpreter "$@"
```
Add the directory having all our scripts (`%HOMEPATH%\\scripts`) to PATH environment variable. Please find instructions [here](http://www.computerhope.com/issues/ch000549.htm).  

#### Use bsh.cmd to execute BeanShell script with the same name  

On Linux, we can create an executable file named "sayHello". The file shall execute when we type "sayHello", as long as it is found in PATH. The [HashBang](https://en.wikipedia.org/wiki/Shebang_%28Unix) shall provide details on the execution mechanism. Creating custom commands on Linux, requires creating files without extension.  
  
However, on Windows, a file's execution mechanism is identified from its extension. So, to create a command named "sayHello" we shall create a file named "sayHello.cmd". The Windows executable "sayHello.cmd" shall have Windows commands to simply execute the bean shell script "sayHello".  

```java
C:\\> type C:\\Users\\Raghu\\scripts\\sayHello.cmd  
@echo off  
set CurrCMDPath=%~dp0  
set CurrCMDName=%~n0  
bsh %CurrCMDPath%%CurrCMDName% %*  
  
C:> sayHello  
Hello World
```
Here,  

*   Variable `CurrCMDPath` will have the path to current CMD file. In above example, `CurrrCMDPath=C:\\Users\\Raghu\\scripts`
*   Variable `CurrCMDName` will have the name of the current CMD file without extension. In above example, `CurrCMDName=sayHello`
*   bsh.cmd is used to execute BeanShell script "sayHello" as follows: `bsh C:\\Users\\Raghu\\scripts\\sayHello`
*   Any command line arguments received by sayHello.cmd shall follow `"bsh C:\\Users\\Raghu\\scripts\\sayHello"`

Thus, adding more BeanShell commands shall simply mean creating the corresponding CMD file for Windows. The content of all the CMD file shall be the same (as sayHello.cmd, given above)!  
  
We can use BeanShell to create [WORA (Write Once Run Anywhere)](https://en.wikipedia.org/wiki/Write_once,_run_anywhere) scripts.