---
layout: post
title: HTTP 2.0 with Jetty server and client  
category: java
typora-root-url: ../../
---

{% include toc.html %}

# HTTP/2 with Jetty server and client

  
HTTP/2 brings in a spectrum of enhancements that include  

*   Enabling full request and response multiplexing - Reduces latency.  
    
*   Efficient compression of HTTP header fields - Reduces protocol overhead.
*   Support for request prioritization and server push

See [OReilly's High Performance Browser Networking](http://chimera.labs.oreilly.com/books/1230000000545/ch12.html) for details.  
  
This article details setting up Jetty server to listen to HTTP/2 non-ssl (h2c) as well as SSL (h2) clients.  

## Versions  

Server  

Version  

Download  

Jetty Server  

9.3.6.v20151106  

[Jetty Server](http://download.eclipse.org/jetty/)  

Jetty Http Client  

9.3.7.v20150115

[Maven Central](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22org.eclipse.jetty%22%20AND%20a%3A%22jetty-client%22)  

Jetty ALPN Boot  

8.1.7.v20160121  

[Maven Central](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22org.mortbay.jetty.alpn%22%20AND%20a%3A%22alpn-boot%22)

JDK  

1.8.0_72  

[Oracle JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)  

Firefox  

44.0  

  

## Browser add-on to indicate HTTP/2 connection

The [HTTP/2 indicator add-on](https://addons.mozilla.org/en-us/firefox/addon/spdy-indicator/) can be installed for firefox. A lightning icon is shown in the address bar if browser used HTTP/2 protocol to connect to the server. Mouse over the lighting icon displays the message as shown below.  
  
![Http2 Indicator](https://blogs.oracle.com/brewing-tests/resource/images/Http2Indicator.jpg)  

## Configure Jetty Server for HTTP/2

You may not require some of the sections detailed below. These sections cover the typical setup issues/requirements.  

### Download Jetty Server

Download and unzip [Jetty Server Archive](http://download.eclipse.org/jetty/) to a folder (say "C:\\Jetty"). Lets refer this as JETTY_HOME.  

### Setup WebApp

1.  Create a folder "MyApp" under JETTY_HOME/webapps
2.  Create a file named Snoop.jsp in folder JETTY_HOME/webapps/MyApp with the following content.  
    

```java
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>  
<%@ page import="java.util.*" contentType="text/plain"  %>  
  
\# -----------------------------------------------  
\# Method  
\# -----------------------------------------------  
Protocol=${pageContext.request.protocol}  
Method=${pageContext.request.method}  
ClientIP=${pageContext.request.remoteAddr}  
RequestURL=${pageContext.request.requestURL}  
  
\# -----------------------------------------------  
\# Request Headers  
\# -----------------------------------------------  
<c:forEach var="currHeader" items="${pageContext.request.headerNames}">  
${currHeader}=${header[currHeader]}</c:forEach>  
  
\# -----------------------------------------------  
\# Parameters  
\# -----------------------------------------------  
<c:forEach var="currParam" items="${pageContext.request.parameterNames}">  
${currParam}=${param[currParam]}</c:forEach>  

```

### Ensure presence of appropriate ALPN module  

ALPN is an extension of TLS protocol used in HTTP/2. See [link](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation) for details. Now, for a given JDK a corresponding ALPN jar is required as per the [mapping](http://www.eclipse.org/jetty/documentation/9.2.8.v20150217/alpn-chapter.html#alpn-versions).  

#### Check your java version  

```java
C:\\Jetty> java -version  
java version "1.8.0_72"  
Java(TM) SE Runtime Environment (build 1.8.0_72-b15)  
Java HotSpot(TM) 64-Bit Server VM (build 25.72-b15, mixed mode)
```

#### Check ALPN module file for the java version

If your java version is "1.8.0\_72" you must find a corresponding file "JETTY\_HOME/modules/alpn-impl/alpn-1.8.0_72.mod" with the same version string. If you find the file, you are good to go and skip the next step.  

#### Create ALPN module file for the java version

1.  Download the latest [Oracle JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and the latest [ALPN boot file](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22org.mortbay.jetty.alpn%22%20AND%20a%3A%22alpn-boot%22).
2.  Copy the downloaded ALPN boot JAR file in JETTY_HOME/lib/alpn  
    
3.  Copy existing file with latest version under "JETTY_HOME/modules/alpn-impl/" as  alpn-<version string matching the JDK version>.mod.
4.  Edit alpn-<version string matching the JDK version>.mod and replace existing alpn-boot version with the one downloaded.  
    

### Enable HTTP and HTTPS connectors  

```java
C:\\Jetty> java  -jar  JETTY_HOME/start.jar  --add-to-startd=http,https,deploy  
C:\\Jetty> java -jar JETTY_HOME/start.jar  

```
Note: By default, SSL port is 8443 and non-ssl port is 8080. Press Ctrl-C to stop the server  

### Add HTTP/2 SSL and non-SSL support

```java
C:\\Jetty> java  -jar  JETTY_HOME/start.jar  --add-to-startd=http2,http2c  
C:\\Jetty> java  -jar  JETTY_HOME/start.jar  

```

### Configure custom listen port

It is possible that you have other servers running in ports such as 8080 which Jetty server uses by default. The default listen ports can be modified as given below.  
  

1.  HTTP port : Uncomment and update property 'jetty.http.port' in JETTY_HOME/start.ini
2.  HTTPS port : Uncomment and update property 'jetty.ssl.port' in JETTY_HOME/start.d/ssl.ini  
    

### Configure custom keystore

Configure Jetty use a custom keystore (or generate [custom keystore](https://docs.oracle.com/cd/E19509-01/820-3503/6nf1il6er/index.html) ). Lets say the custom keystore is called "mystore.jks" with password "mykey".  
  

1.  Copy mystore.jks to JETTY_HOME/etc
2.  Add the following entries in file JETTY_HOME/start.ini  
    

```java
jetty.sslContext.keyStorePath=etc/mystore.jks  
jetty.sslContext.trustStorePath=etc/mystore.jks  
jetty.sslContext.keyStorePassword=mykey  
jetty.sslContext.keyManagerPassword=mykey  
jetty.sslContext.trustStorePassword=mykey  

```

## Request Using Browser

Request "https://localhost:8443/MyApp/Snoop.jsp"

*   From the response we find that protocol HTTP/2.0
*   The same can be verified using the 'lightning' icon in the address bar.

Request "https://localhost:8080/MyApp/Snoop.jsp"  

*   We find that the communication is still HTTP/1.1
*   This is because in case of non-SSL the server protocol order choses HTTP/1.1 before HTTP/2  
    

  

## Configure Jetty Client for HTTP/2

Download Jetty [HTTP Client libraries](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22org.eclipse.jetty%22%20AND%20a%3A%22jetty-client%22) and add them to create a Java project. Below is the code that sends a HTTP request as well as a HTTPS request to Jetty server. The protocol version is printed from the resultant response.  

Add "-Xbootclasspath/p:<path to alpn-boot JAR>" as JVM argument  
Eg: -Xbootclasspath/p:C:/Java/Http2Client/lib/alpn-boot-8.1.7.v20160121.jar  

  
```java
import java.io.*;  
import org.eclipse.jetty.client.HttpClient;  
import org.eclipse.jetty.client.HttpClientTransport;  
import org.eclipse.jetty.client.api.ContentResponse;  
import org.eclipse.jetty.http2.client.HTTP2Client;  
import org.eclipse.jetty.http2.client.http.HttpClientTransportOverHTTP2;  
import org.eclipse.jetty.util.ssl.SslContextFactory;  
  
public class Client  
{  
   public static final String KEYSTORE = new File ("JGet.jks").getAbsolutePath();  
     
   public static final String STOREPASS = "welcome1";  
     
   public static void main(String arg[]) throws Exception  
   {  
      // enableSSLDebug ();  
      SslContextFactory sslContextFactory = getSSLContextFactory ();  
        
      HttpClient httpClient = null;  
      ContentResponse response = null;  
  
      try  
      {  
         HttpClientTransport trasport = new HttpClientTransportOverHTTP2(  
                                        new HTTP2Client());  
         httpClient = new HttpClient(trasport, sslContextFactory);  
           
         httpClient.start();  
         response = httpClient.GET("https://localhost:8383/MyApp/Snoop.jsp");  
         System.out.println(response.getRequest().getURI() + " : " \+    
                            response.getVersion());  
           
         response = httpClient.GET("http://localhost:8282/MyApp/Snoop.jsp");  
         System.out.println(response.getRequest().getURI() + " : " \+    
                            response.getVersion());  
      }  
      catch (Exception e)  
      {  
         e.printStackTrace();  
      }  
      finally  
      {  
         httpClient.stop();  
      }  
   }  
     
   /**  
* Enable SSL Debug  
    */  
   private static void enableSSLDebug ()  
   {  
      System.setProperty("javax.net.debug", "ssl");  
   }  
     
   /**  
* Configure custom keystore and return the context factory object.  
    */  
   private static SslContextFactory getSSLContextFactory () throws Exception  
   {  
      SslContextFactory sslContextFactory = new SslContextFactory();  
      try  
      {  
         sslContextFactory.setNeedClientAuth(false);  
           
         sslContextFactory.setKeyStorePath(new File (KEYSTORE).getAbsolutePath());  
         sslContextFactory.setKeyStorePassword (STOREPASS);  
         sslContextFactory.setKeyStoreType("JKS");  
           
         sslContextFactory.setTrustStorePath(new File (KEYSTORE).getAbsolutePath());  
         sslContextFactory.setTrustStorePassword(STOREPASS);  
         sslContextFactory.setTrustStoreType("JKS");  
           
         sslContextFactory.setKeyManagerPassword(STOREPASS);  
  
      }  
      catch (Exception e)  
      {  
         e.printStackTrace();  
      }        
      return sslContextFactory;  
   }   
}
```
```java
Output:  
https://localhost:8383/MyApp/Snoop.jsp : HTTP/2.0  
http://localhost:8282/MyApp/Snoop.jsp : HTTP/2.0  

```