---
title: Hadoop Ecosystem
categories: bigdata
layout: post
mathjax: true
---

# Terminologies

| Layer | Term                | Detail                                                       |
| :---: | ------------------- | ------------------------------------------------------------ |
|  H1   | HDFS                | Hadoop Distrubuted File System (HDFS) is a fault tolerant, distributed file system. |
|  H1   | HDFS Providers      | HDFS is a file system that is implemented by several providers like Apache, HortonWorks, CloudEra |
|  H2   | YARN                | YARN is a resource negotiator - Yet Another Resource Negotiator (YARN) manages resources (nodes) on computing cluster. Resource Negotiation: What nodes are available? What nodes are not available? What gets to run where? |
|  H2   | Mesos               | Mesos is also a resource negotiator. Alternative to YARN. Solves save problems in different ways. It can work with YARN as well. |
|  H3   | MapReduce           | A versative programming model to process data across HDFS cluster. A mapper transforms data. A reducer aggregates data. |
|  H3   | TEZ                 | More optimal than MapReduce.                                 |
|  H3   | Spark               | Works on top of YARN/Mesos. Spark scripts are written using Scala/Python/Java. Efficient and reliable to process data across Hadoop cluster. Handles streaming data in realtime. Supports machine learning libraries. |
|  H4   | Pig                 | Works on top of MapRedue. A high level scripting language with some similarities with SQL. |
|  H4   | Hive                | Works on top of MapRedue. A high level scripting language very similar to SQL. |
|  H5   | Apache Ambari       | Gives the total overview of cluster. Views provide resource utilization, execute queries, import databases etc. |
|  V1   | Apache HBase        | A NoSQL database provding *columnar* datastore that is very fast. Performant on a very large transaction base. Can be used to expose data (transfomed by Spark/MapReduce) to be consumed by other systems (like RDBMS) |
|  V2   | Apache Storm        | Process streaming data in real time. A streaming machine learning model can work with Apache Storm. |
|  V3   | Oozie               | Way of scheduling jobs on Hadoop cluster.                    |
|  V4   | Zookeper            | Keep track of shared states that many applications can use.  (Eg: Is the node up? Who is the master?) |
|  V5   | Data Ingestion      | Getting data from other sources into HDFS system.            |
| V5.1  | Sqoop               | **Sq**l-Had**oop** is a data ingestion tool for RDBMS. Acts as a connector between HDFS and legacy databases. |
| V5.2  | Flume               | A data ingestion that transport weblogs at a large scale to cluster in realtime for Spark/Storm. |
| V5.2  | Kafka               | A generic data ingestion version of Flume. Collect data of any type from PCs, webservers. |
|  V6   | External Data       | Data stored in other places, other than Hadoop cluster.      |
| V6.1  | MySQL               | Any SQL database. Import/Export data from SQL database to Hadoop using Sqoop. |
| V6.2  | Cassandra / MongoDB | Alternative to HBase. Columnar database for exposing data for realtime usage. A database layer like this is required to reside between the realtime application and Hadoop cluster. |
|  V7   | Query Engines       | Alternative to Hive. Interactively enter (SQL) queries.      |
| V7.1  | Apache Drill        | Query Engine that can make SQL queries work across a wide range of NoSQL databases. |
| V7.2  | Hue                 | For CloudEra (Another Hadoop stack provider) this takes the role of Ambari. |
| V7.3  | Apache Phoenix      | Similar but more advaced than Apache Drill.                  |

# HDFS

Hadoop Distrubuted File System (HDFS) is a fault tolerant, distributed file system. There are competing providers of Hadoop statcks like HortonWorks, CloudEra, MapR.

# Apache Spark 

Apache Spark gives flexibility to write Java/Scala/Python code to perform complex transformation and analysis of data. 

## What sets Spark apart

- Scalable
- Fast - A memory based solution (as opposed to disk based). Tries to maintain as much as possible in RAM.
- Libraries that are built on top of Spark that enables the following
  - Machine learning
  - Data mining
  - Visualization
  - Streaming data
- Does not require thinking in terms of mappers and reducers.

## Components of Spark

| Componenet      | Detail                                                       |
| --------------- | ------------------------------------------------------------ |
| Spark Streaming | Work on streamed data, realtime instead of batch processing. |
| Spark SQL       | SQL interface to Spark. Optimizations namely datasets is focused in this direction in Spark 2.0 |
| MLLib           | Spark for Machine Learning problems.                         |
| GraphX          | Analyze the properties of a graph - Like social networking connection graph. |

# Hive

Hive makes Hadoop cluster look like a traditional database by executing SQL.  (Hadoop cluster can also be integrated with an existing MySQL database.)

- ![Hive](/home/rbseshad/Learn/BigData/Hive.png)

## Advantanges of Hive

- Hive uses HiveQL which is very similar to SQL.
- Hive converts HiveQL to MapReduce or Tez and executes them across the cluster abstracting the complexity. 
- Easy OLAP (Online Analytics Programming) - Lot easier than MapReduce
- Hive can be talked to from a service.
- Hive exposes JDBC/ODBC drivers and looks like any other database.
- Hive over Tez is fast. (Faster than Hive over MapReduce.)

## Disadvantanges

- Hight Latency: Hive converts HiveQL to MapReduce/Tez which is not suitable for realtime. OLTP (Online Transaction Processing)
- Stores data in a de-normalized way?
- No transactions - Record level updates/inserts/deletes.

## HiveQL

- Very similar to SQL
- Create table from unstructured text file

```sql
CREATE TABLE User_Movie (
    UserId  INT,
    MovieId INT,
    Rating  INT,
    Time    INT,
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS TEXTFILE;
```

- **Views:** Stores result of SQL that can be used as a table.

```sql
CREATE VIEW IF NOT EXISTS TopMovies AS
SELECT MovieId, count(MovieId) as RatingCount
FROM User_Movie
GROUP BY MovieId
ORDER BY RatingCount DESC

SELECT Title, RatingCount
FROM Movie, TopMovies
WHERE Movie.MovieId = TopMovies.MovieId
```

## Schema On Read

### Traditional Database: Schema on Write

- The schema is defined before loading the data. 

### Hive: Schema on Read

- Unstructured data is stored in a text file (Delimited by tab/comma)
- Hive takes unstructured data and applies schema to it as it is being **read**.
- Hive has a metadata store that has info to interpret the raw data. 
- HCatalogRead can expose this metadata (SchemaOnRead) to other services as well.

## Managed Vs External Table

By default, the table created above is a *Managed Table* -- A table managed by Hive. This will move (as opposed to copy) the table from a distributed cluster to where Hive expects. If a table is dropped, it is permanently removed.

External tables created as follows do not alter the actual data. Only the metadata attached to the data is removed when table is dropped.

```sql
CREATE EXTERNAL TABLE IF NOT EXITS User_Movie (
    UserId  INT,
    MovieId INT,
    Rating  INT,
    Time    INT,
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
LOCATION '/home/rbseshad/big-data/ml-100k/u.data'
```

## Partitioning 

A huge data set can be stored in partitioned sub-directories. Hive is more performant if the dataset resides only on certain partitions.

```sql
CREATE TABLE Customer (
    Name STRING,
    Address STRUCT <street:STRING, city:STRING, state:STRING, pincode:INT>
    ...
)
PARTITIONED BY (Country STRING);
```

Each country in the above example could be in its own subdirectory

- /customer/country=IN/
- /customer/country=JP/
- /customer/country=US/

## Ways to use Hive

1. Command

```bash
hive -f <A .hql file>
```

2. Ambari > Hue
3. JDBC/ODBC server
4. Via a *Thrift service*. Used to talk to Web clients, for example.
5. Via Oozie.

# Integrating Hadoop and MySQL

**Sqoop:** Import data to or from Hadoop cluster to relational database like MySQL.

## MySQL

- Popular and free relational database
- Molithic: Resides on a single (typically huge) hard drive.

## Sqoop to SQL



## SQL to Sqoop



# Apache HBase

A non-relational, scalable, columnar, noSQL database built on top of HDFS. 

- HBase can be used to vend a massive scale dataset stored on HDFS .
- Does not have query language, but has API to perform CRUD operations.
- HBase is based on Bigtable $$-$$ A paper published by google.



## Architecture

![HBase]({{"/assets/images/bigdata/HBase.png" | absolute_url}})



### Region Server

Region here does not refer to geographical regions $$-$$ It is about the ranges of keys (Pretty much like sharding). 

- HBase distributes data across a fleat of Region servers. A region server inturn talks to distributed HDFS.
- A RegionServer can automatically adapt with growing data by repartitioning
- It can adpat to addition/removal of RegionServers

### HMaster

Mastermind, knows where everything is

- A web app does not talk to HMaster directly. It talks to RegionServer.

- A master keeps track of the following

  - Schema of the data (metadata)

  - Where data is stored
  - How data is partitioned.

### Zookeeper

A watcher of the watcher (Zookeeper $$-$$ An answer to who watches the watcher!)

- Keeps track of who the current master is
- If master goes down, it knows who the next master is and tell everyone about it.



### 

```java
import java.io.*
class A {

}
```

