---
title: Hadoop Ecosystem
categories: bigdata
layout: post
mathjax: true
typora-root-url: ../../
---

# Apache Hadoop Ecosystem

Apache **Hadoop** is an open source  software platform for ***distributed storage*** and ***distributed processing*** of  ***very large*** data sets on computer ***clusters*** built from ***commodity hardware***. 


![HadoopEcosystem](/assets/images/bigdata/HadoopEcosystem.png)


| Layer | Term                | Detail                                                       |
| :---: | ------------------- | ------------------------------------------------------------ |
|  H1   | HDFS                | Hadoop Distrubuted File System (HDFS) is a fault tolerant, distributed file system. |
|  H1   | HDFS Providers      | HDFS is a file system that is implemented by several providers like Apache, HortonWorks, CloudEra |
|  H2   | YARN                | YARN is a resource negotiator $$-$$ Yet Another Resource Negotiator (YARN), manages resources (nodes) on the computing cluster. Resource Negotiation $$-$$ What nodes are available? What nodes are not available? What gets to run where? |
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

- BigData is stored in a distributed and reliable manner. Apps can access the BigData quickly and reliably
- BigData (large files like logs) can be broken into chunks called  **blocks**  (128MB per block by default) and distributed.
- **High Availability:** Multiple copies of each block are stored in different commodity (regular) computers.
- Blocks can be processed in parallel.  Efficiency is improved by trying to keep the computer processing a block, physically closer to the block.

## Architecture

HDFS consists of a single **NameNode** and multiple **DataNode**s



![HDFS](/assets/images/bigdata/HDFS.png)

### NameNode

- Keeps track of where each block and its relica recides.
- Keeps track of what is on all DataNodes.
- At any given point of time all clients should be talking to the same **NameNode**

### DataNode

- The client app queries the NameNode to figure out which DataNode(s) to contact for data.

### Working: Reading a file

- Client queries NameNode about the file it wishes to read
- NameNode tells about the (DataNode, blocks) to contact.
- The above data is provided by considering which blocks shall be most efficient based on the client. Note that the very same block could be replicated in different physical locations.

### Working: Writing a file

- Client tells its intention to write with the NameNode
- The NameNode provies a handle using which the client writes data on a single DataNode.
- The DataNodes talk to each other $$-$$ Divides into blocks. Distributes the data in a replicated manner.
- Acknowlegement that all data/replication is successfully stored reaches the NameNode
- The NameNode now creates a new entry.

## What happens if the NameNode fails?

- **Secondary NameNode:** There is only one NameNode - The data of the NameNode could be consistently backed up.
- **HDFS NameNode Federation:** Different namenodes for different volumes which are backedup at regular intervals. Reduce the extent of restoration damage upon failure.
- **HDFS High Availability:** Hot standby NameNode with shared edit log. ZooKeeper knows which NameNode is primary.

## How to interface with HDFS

HDFS is like a giant hard drive.

- Ambari
- CLI
- HTTP / HDFS Proxies
- Java Interface
- NFS (Network File System  $$-$$ Mounting a remote file system on a server) Gateway. After mouting HDFS will just look like another directory structure on the current computer.

# Apache Spark

Apache Spark gives flexibility to write Java/Scala/Python code to perform complex transformation and analysis of data.

## What sets Spark apart

- Scalable
- Fast - A memory based solution (as opposed to disk based). Tries to maintain as much as possible in RAM.
- Spark/Tez use **directed acyclic graphs** and outperform MapReduce.
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

![alt](/assets/images/bigdata/Hive.png)

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



# NoSQL

NoSQL stands for **Not only SQL**, Non relational dabases.

> Large number of accesses to planet size data $$-$$ Answer simple queries at high transactional rate on massive data sets.

Large amount of data (like google searches) keep growing and need to be fit **horizontally scalable** (Fit by adding more hardware)



## Where RDBMS fits?

- RDBMS gives the power of **rich analytical query language** like SQL (Structured Query Language)
- RDBMS is best suited for **analytical work**.
- Scale of the data is not huge and does not keep growing horizontally. Eg: Company employee database $$-$$ even when there are lakhs of employees.

## Where NoSQL fits?

- Scale is huge and shall grow horizontally
  - Huge data can be scaled only by partitioning the data and storing on multiple nodes.
- Typically the same query is raised over and over again (at a large scale)
  - What movies should be recommended for this customer?
  - What pages has this customer visited?
  - What has this customer ordered in the past?
- **KeyValue Datastore**  is enough: A simple get/put API of key-value pairs address the needs (Key = employee Id, value = JSON object with details)

## Best of both worlds?

It is possible!

- Hive on top of HDFS cluster is exposed to answer the more analytical queries.
- A NoSQL database on top of HDFS shall answer the more high tractional, repetitive, simple queries.

![BestOfBoth](/assets/images/bigdata/BestOfBoth.png)



Consider a case of providing product recomendation to customer

- A high transactional website (like google) can act as **datasource** feeding customer searches
- A streaming tech like (Spark Fume) that sits on HDFS can listen to high transactional real time data
- **Spark** can then transform the data into a format (denormalized $$-$$ join of several tables into a JSON object) that fits the requirement of the view
- Thus transformed data is pushed by Spark into a **NoSQL database** like MongoDB
- Front end **webserver**s will now display the recommendations to the Browser.



# CAP Theorem

> You can only have *two* out of CAP (Consistency, Availability and Partition tolerance)

- **Consistency:**  Not everyone sees the change immediately $$-$$ there is a lag. Example: Facebook post may not be visible to few people while few others might be able to see it.
- **Availability:** Always up and running.
- **Parition Tolerance:** Easily split and distributed across cluster.

![alt](/assets/images/bigdata/CAP.png)


## The difference is in the choices made

### Traditional Database

- Traditional databases need the at most consistency and availability
- They compromize on the partition tolerance

### HBase & MongoDB

- HBase and MongoDB rely on master and zookeeper which are central to availability. A failure of these shall affect availability.
- HBase do avoid *single point of failure* by running mulitple master nodes. However, a failure of all the masters (though less probable) shall bring down the entire DB.
- Essentially, HBase compromises on availability for consistency and partition tolerance.

### Cassandra

- Parition Tolerance is non negotiable in a Hadoop cluster.
- Cassandra choses Availability over Consistency!
  - It takes some time (few seconds) for the change to be propagated throught the cluster and all nodes have the same content.
  - Cassandra provides **enventual consistency** (as opposed to immediate consistency)
- **Tunable Consistency:** Consistency requirements are tunable by compromising on availability.


# Apache HBase

A non-relational, scalable, columnar, noSQL database built on top of HDFS.

- HBase can be used to vend a massive scale dataset stored on HDFS .
- Does not have query language, but has API to perform CRUD operations.
- HBase is based on Bigtable $$-$$ A paper published by google.

## Architecture

![alt](/assets/images/bigdata/HBase.png)

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

- Keeps track of who is the current master.
- If master goes down, it knows who the next master is and tell everyone about it.

## Data Model

- A record (row in RDBMS) is identified by an unique **key** $$-$$ *primary key*
- A record typically has a small number of feature families (column faimily)
  - A feature family can have subset of features
  - A record can have many features or just a few (Thus not storing empy columns/features)
- A cell is an intersection of record and feature. A cell can have many timestamp versions.

### Data Model Example: WebLinkDetail

#### Key

Each record here has a key $$-$$ 'website domain'. That is for www.google.com domain the key shall be `com.google.www` (Stored as per hierarchy).

#### Contents Column Family

- A column family storing multiple versions of the content

#### Anchor Column Family

- Format : `<Column family name>: <Column name>`
- `Anchor:cnsi.com > CNN`
  - Column family = `Anchor`
  - Column = `cnsi.com`
  - Cell = `CNN`
  - This means the website `com.cnsi` has links to `www.google.com` via anchor text `CNN`
- `Anchor:my.look.ca > click_here`
  - This means the website `ca.look.my` has links to `www.google.com` via anchor text `click_here`

In this example we find that a column family `Anchor` can have various columns (web site name) with cell being the anchor text.

## Access HBase

- Java APIs and wrappers for Python, Scala
- Connectors to Spark, Hive, Pig
- REST service that runs on top of HBase
- Protocol buffers like Thrift/Avro (More performat than REST)

# Cassandra

Cassandra is a distributed non-relational database. Highlight $$-$$ High availability. No master node. No single point of failure.

- Different Architecture than HBase $$-$$ No master node
- Similar Model as HBase
- Unlike Hbase, Cassandra has a query language $$-$$ CQL (Cassandra Query Language)
- Gets its name from a greek mythology which means *"Tells the future"

## CAP

Cassandra compromises on Consistency for Availability and Paritiion Tolerance.

## Cassandra achives high availability

### Ring Architecture

- No master nodes that keep track of which nodes serve what data.
- **Gossip Protocol: ** Every node of the cluster communicates with each other every second to keep track of who is maintaining what data.
- Every node of the cluster
  - Runs the same software
  - Performs the same operations
- Client can talk to any node to get the data

### Working

- Consider a ring of 6 nodes.
- Each nodes maintains ranges of keys.  The first node takes `1-1million` the second `1million - 2million`  and so on. Essentailly keys are distributed in the round robin fashion.
- A new data, based on key goes to a primary node  and few backup nodes as well.
- Nodes talk to each other to figure out
  - which nodes are up and which are down
  - which nodes has what range

### Tuning Consistency

- The value for a given key can be accepted only if the results from `n` nodes match. If not, the operation waits until `n` nodes are consistent.

## Connecting Cassanda Rings

Cassandra can manage replication between racks of Cassandra rings and/or Hadoop cluster.

For example

- We could connect a Cassandra `RingA` to Cassandra `RingB` which inturn distrubutes data on to Hadoop cluster
- Data from `RingA` is replicated on to `RingB` and from there to Hadoop cluster
- Clients like WebServer with heavy transactional requests connect to `RingA`
- Clients like Hive which perform more *batch oriented big analytics* requests connect to `RingB`

## CQL

- CQL is just a fancy API $$-$$ Looks like SQL. Ment for get/put of key/value pairs.
- Has no JOIN (big limitation)
- All queries must have a primary key

## Spark + Cassandra

DataStax offers a Spark-Cassandra connector.

- Allows the read/write of Cassandra tables as Spark Dataframes.
- Quries on DataFrame get translated into CQL queries in Cassandra

# Mongo DB

Mongo DB gets its name as it can handle hu**mongo**us  data.

- Uses a document based data model
- Whats different? Any unstructured JSON document can be stored in MongoDB
- No real schema is enfored. No primary key.
- Can create index on any field.

## CAP

MongoDB compromises on Availability for Consistency and Paritiion Tolerance.

## Terminology

- A MongoDB database contains **Collections** which inturn contains **Documents**
- Documents cannot be moved between Collections belonging to *different* Databases

## Architecture

- Single Master
- Secondary maintain copies of primary.
  - As writes happen to the primary they get replicated to the secondary.
  - We could have multiple secondary datanodes in different data centers.
- Secondary elects primary if the primary goes down (in seconds).


# Query NoSQL Data

Drill vs Phoenix Vs Presto


# YARN - Resource Negotiation

Yet Another Resource Negotiator $$-$$ Manage resources of the cluster.

- A component exclusively for managing resources on the cluster (Earlier, in Hadoop1.0 this was integrated into MapReduce)
- YARN enabled development of MapReduce alternatives  $$-$$ Spark/Tez  $$-$$ Built on top of YARN. 
- Spark/Tez use **DAG $$-$$ Directed Acyclic Graphs** and outperform MapReduce significantly

> Modular functionality Isolation $$-$$ The big performance advantange came as a result of separating resource negotiation from YARN.

## Architecture

While HDFS manages the storage resource, YARN manages the compute resource.

![YARN](/assets/images/bigdata/YARN.png)

### Cluster Storage Layer

HDFS is the cluster storage layer $$-$$ Spread out storage of big data, across nodes in cluster, by breaking up into blocks and replicating it.

### Cluster Compute Layer

YARN is the cluster compute layer $$-$$ Split and execute computation (jobs/tasks) across cluster.

YARN maintains **data locality** $$-$$ YARN tries to align data blocks on same physical nodes as much as possible to improve performance

### YARN Applications

Applications such as MapReduce, Tez and Spark run on top of YARN

## Working

### Running a job

- Client starts an application
- A NodeManager daemon running on each physical node manages the node.
- YARN will will contact the Master's NodeManager to get the requisite Worker nodes ready to split and assign the tasks
- YARN choses nodes, so that it minimizes data being pulled around in the network.
- YARN optimizes both $$-$$ **CPU cycles and data locality** 

### Scheduling Options

- FIFO $$-$$ Runs in first in first out. The job in the queue will have to wait from the previous to complete.
- Capacity $$-$$ Run jobs from queue n parallel if there is capacity
- Fair Schedulers $$-$$ Smaller jobs might run out of queue when big jobs are hogging. 



# Mesos - Resource Negotiation

A resource manager like YARN, more general $$-$$ A general container management system.

## How does Mesos differ from YARN?

YARN is restricted to distributing Hadoop tasks (MapReduce/Spark) with underlying HDFS file system.

- YARN is **monolithic**  $$-$$ YARN makes the call. Decides where to run what task.
- YARN is optimized for long analytical jobs.

Mesos is general and manages resources across data center (not just for big stuff)

- Mesos can allocate resources for webservers
- Mesos can handle long and short lived processes $$-$$ Even run just small scripts
- Mesos is not part of Hadoop ecosystem per se.
- Mesos offers info on available resources back to the framework $$-$$ The framework makes the call.

## Mesos and YARN together

YARN can talk to Mesos for mananging non-Hadoop computing resources.

- **Siloed** A cluster of resources managed by Mesos and another managed by YARN.
- **Resource Sharing** YARN and Mesos can be tied together using Myriad. This way, the resources managed by YARN can be used by Mesos if free.

# Apache Tez

Accelerate jobs that run on Hadoop cluster $$-$$ A charging elephant.

- Alternative to MapReduce. 
- Hive/Pig job can use Tez instead of MapReduce $$-$$ Hive uses Tez by default. 
- Ambari can be used configure what Tez/MapReduce uses underneath.
- Constucts DAG (Directed Acyclic Graphs), similar to Spark for efficient processing of distributed Jobs/Tasks.
- DAGs optimization $$-$$ Eleminates unnecessary steps/dependencies, run possible steps in parallel.

# ZooKeeper

Keeps track of info that must be synchronized in a cluster. 

- When consistency is a primary concern (from CAP), synchronized info must be kept track of $$-$$ Enter Zookeper
- Zookeeper solves the problem of reliable distributed coordination
- Many deamons (including YARN) use Zookeper to store/access synchronized information

Zookeeper as a service can use used to answer

- Which node is the master?

- What tasks are assigned to which workers?  When a worker fals, where to pick up from to redistribute.  
- Which workers are currently available?



# Oozie

Oozie (Burmese name for 'elephant keeper' ) can schedule and execute workflows. 

## Oozie Workflow $$-$$ Tasks with dependencies

A Oozie Workflow is an XML `workflow.xml` made up of heterogenous actions (Hive tasks, Pig tasks, MapReduce tasks etc)  that have inter-dependencies.

- The `workflow.xml` is a DAG (Directed Acyclic Graph) where a graph's XML node/tag is an action
- Actions that have no dependencies can run in parallel.

### Setup Workflow

- Make sure each action (XML tag) works on its own.
- Create directory in HDFS to place `workflow.xml ` . The XML shall have actions and its dependencies configured.
- Create a local file `job.properties` which shall have properties (key=value) referenced by `workflow.xml`

### Run Workflow In MasterNode

#### Run Oozie to start the Web Console

```bash
oozie job --oozie <URL to have Oozie console. Eg: http://localhost:11000> -config <Path to job.properties> -run
```

#### Access Oozie Readonly Web Console

```
http://localhost:11000/oozie
```

## Oozie Co-ordinators $$-$$ Schedule Workflow

A Oozie co-ordinator is an XML used to schedule workflow execution.

- Schedule Workflow to begin at a *startime* and execute periodically at a given *frequency*
- Schedule Workflow to run after a data becomes available.

## Oozie Bundle $$-$$ A bundle of co-ordinators

- Oozie bundle is a bundle of co-ordinators that can be managed together
- **Example:** Many oozie coordinators that perform log processing can be grouped as an Oozie Bundle.
- **Bundle Operations are handy** $$-$$ An entire bundle could be suspended if required.



# Apache Zeppelin

Zepplin is a broader tool with plugins for various components of Hadoop ecosystem but is primarily a **tool for data science** $$-$$ Used to experiment with Apache Spark scripts and visualize big data. 

> Zepplin is like an IPython notebook for BigData 

## Zeppelin Spark Integration $$-$$ Making Spark feel like data science tool

- Zeppelin can run Spark code interractively.
- Zeppelin can SQL queries against SparkQL **+** visualization

## Zeppelin Interpreters $$-$$ Plugin to integrate with Zeppelin

- Interpreter is a way to integrate with Zeppelin $$-$$ Another term for plugin
- Zeppelin Spark integration was possible using Spark Interpreter
- Zeppelin ships by default with a whole bunch of interpreters for varous BigData technologies. A custom interpreter can be written as well.



# Hue (Hadoop User Experience)

Hue (Hadoop User Experience) is for Cloudera like Ambari is for HortonWorks.

## Top Hadoop Distributions

- HortonWorks
  - Ambari is used for primary management, execute query, files UI
  - Zeppelin is used for notebook style analysis.
  - 100% open source
- CloudEra
  - Cloudera Manager is used for primary management
  - Hue (open sourced by couldera) is used to execute query, files UI
  - Few proprietery 

## Hue Provides

- Oozie Editor (Not there in HortonWorks)
- Interfaces to Pig, Hive, HBase, HDFS and Sqoop (Like Ambari)
- Built in notebook (Like Zeppelin)



# Kafka - Streaming data into cluster

Kafka is a general prupose *publish/subscribe message system* to *steam data* into the cluster in *real time*. 

Examples of realtime BigData that can be streamed into cluster using Kafka

- Log entries from Web servers
- Sensor data from IoT devices
- Stock trading data

> Streaming helps publishing and optionally processing the data into cluster in realtime!  

## The Publish/Subscribe system

Kafka temporarily stores messages generated from various *producers* (such as IoT, webservers etc), for some period of time and makes them available under various streams (*topic*)  to **consumers** . A consumer subscribes to several interested topics.

- Kafka stores data and the position of each customer $$-$$ Consumer can catch from where their left off.
- Kafka can efficiently manage many consumers for each topic

>  Consider a overhead tank with several input pipes and serverl taps at the bottom. 
>
> - Kafka is the tank
> - Pipes are the publishers
> - Taps are the topic



## Architecture

- **Producer** apps produce messages to topics 
- **Consumer** apps subscribe to topic and receive data
- **Connector**s are modules that publish data as messages to Kafka OR receive messages from Kafka
- **Stream Processor** $$-$$ Transform data as it comes 
  - A producer might publish unstructured data against a topic. 
  - A stream processor is subscribed to this topic.
  - The stream processor formats the data and publishes back to Kafka under a different topic
  - A database might listen this new topic more persistantly















# Resources

https://stackoverflow.com/questions/10732834/why-do-we-need-zookeeper-in-the-hadoop-stack