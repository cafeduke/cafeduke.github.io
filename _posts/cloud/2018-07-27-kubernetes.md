---
title: Kubernetes
categories: cloud
layout: post
mathjax: true
typora-root-url: ../../
---

{% include toc.html %}

# Introduction

Kubernetes is an orchestrator of containerized apps (*typically microservice apps*) in a distributed environment at scale. Kubernetes comes from the greek word that means *"The person who steers the ship"*. Hence the logo. 

> K8s is short for Kubernetes

## Terminoligies

| Term             | Detail                                                       |
| ---------------- | ------------------------------------------------------------ |
| K8s Node         | A Kubernetes Node is any Linux host $-$ VM, bare metal or even private/public cloud instance. |
| K8s Cluster      | Used interchangibly as just Kubernetes, is made up of master and worker nodes. |
| Microservice App | A microservice app is an application made up several independent parts called **services.**. The services work together to create a meaningful application. |
| K8s Master Node  | A collection of services that make up the control panel and are incharge of the K8s cluster. Master schedules apps, monitors worker nodes, implements changes and resonds to events. |
| K8s Worker Node  | The app services run on the K8s worker node or just node.    |
| Deployment       | A YAML manifest file that answers (A) What the app needs? (B) Scale $-$ How many replica apps? |
|                  |                                                              |

# K8s Master Node

A master is a collection of services (that typically runs on several hosts) that make up the control panel of the cluster.

![KubeMaster](/assets/images/cloud/KubeMaster.jpg)

## API Server  $-$ Brain of cluster

- Front end of the K8s control panel
- Exposes REST endpoint (typically 443) that consumes JSON manifest file. 
- The JSON manifest file is validated and work defined in the manifest gets deployed.

## Cluster Store $-$ Memory of cluster

- The configuration and state of the cluster gets persisted in cluster store.
- The cluster store is an etcd service $-$ Popular distributed, consistent key-value pair store.

## Kube Controller Manager

- Manages  several controllers like node controller, endpoint controller and namespace controller.
- The aim of the controller manager is to ensure **current state** matches the **desired state**

## Kube Scheduler

- Watch for new workloads and assign them to nodes.
- Evaluate affinity and anti-affinity constraints and resource management.

# K8s Worker Node / Minions

The K8s worker nodes are also called **Minions**. 

![KubeNode](/assets/images/cloud/KubeNode.jpg)

## Kubelet

- The main K8s agent that runs on all the worker nodes. Install a kubelet on a host and register with the K8s cluster. The host is now node of the K8s cluster.
- Watches for work assignment. Carries out the task. Maintains a reporting channel back to master.
- If the work can't be run the the report is sent to Master to take action.
- Exposes port 10255 for inspecting.

## Container Runtime

- Kubelet needs to work with the container runtime to perform container management
  - Pulling Images
  - Start/Stop containers
- Docker is the typical container runtime. Kubernetes talks to Docker using Docker Remote API.
- Kubernetes released Container Runtime Interface (CRI). This could abstract any Runtime that implements the CRI to be pluggable.

## Kube Proxy

Ensures that every Pod gets its own unique IP address. Lightweight load balancing node.

# Declarative Model & Desired State

- The **desired state** of the app (microservice) is written in a manifest file (YAML).
  - The desired state has information regarding
    - The images to be used
    - Number of replicas
    - Network to operate on
    - How to perform the network update
- The manifest is posted to **API server service** of the K8s Master.
  - The **kubectl** command (Client utility) is used to post manifest to API server on port 443
  - The K8s inspects the manifest and decides the controller to send it to. (Eg: Deployments Controller)
- K8s Master stores the manifest in **ClusterStore** master service 
- K8s deploys the application on to the cluster.
  - A **container runtime** (like Docker) pulls images, starts containers, builds network.
- K8s implements a **reconciliation loop** to make sure cluster does not vary from desired state.
  - Say, desired state has 10 replicas of a web-front-end Pod and 2 go down
  - The reconciliation loop picks this and two new pods shall be started on some node.

# Pod

A container cannot directly run in K8s cluster. One or more tightly coupled containers always run inside Pods.

> Pod is the atomic unit of deployment in K8s world, providing a shared execution environment to run one/more tightly coupled containers within.

| Technology     | Atomic Unit Of Scheduling |
| -------------- | ------------------------- |
| Virtualization | VM                        |
| Docker         | Container                 |
| Kubernetes     | Pod                       |

Containers within the same pod share environment such as

- IPC namespace
- Shared memory and storage
- Network stack $-$ All containers in the Pod will have the same IP $-$ Pod's IP
- Range of ports, IPC sockets

## Pods are atomic unit

- Minimum unit of scaling in K8s.
  - Scaling $-$ Add another pod, not another container to an existing pod 
- Deployment of the  Pod is all (entire Pod) or nothing
  - In a multi-container Pod, either all services are accessible or none is.
- A Pod is up only if every part of it is up and running.
- The entire Pod **must**  exist on a single node.

## Lifecycle

![PodLifecycle](/assets/images/cloud/PodLifecycle.jpg)



A manifest is submitted to the **API server** master service. 

- A Pod is scheduled on a healthy node
- Pending State $-$ Waiting for all resources to be up and running.
- Running State $-$ All resources are up and running
- Succeeded State $-$ Task done
- Failed State $-$ One or more containers/resources could not start.

Pods are mortals $-$ Failed is discarded, new one is created.

- Pod is born, life and they die
- When a pod dies unexpectedly, a new one is created anywhere in the cluster.
- The apps must not be hardwired to the pod.

## Inter and Intra Pod Communication

Every pod has its own IP. 

- Inter Pod communication $-$ Pod IP. 
- Intra Pod communication $-$ localhost.
  - Intra Pod communication is by containers within the same Pod 
  - Containers within the same Pod will have unique port number.

## Container Limits - cgroup - Control group

Containers in a Pod can have its own cgroup limits. Like Linux limits cgroup are the limits on resources like CPU, memory. 



# ReplicaSet

ReplicaSets are higher level K8s objects that 

- Create multiple replicas of a Pod.
- Initiate the reconciliation loop to ensure the right number of Pods are running.
- ReplicaSets are typically deployed using much higher level objects called **Deployment**

# Service

Service is a K8s object (like Pod, ReplicaSet and Deployment). Service perform load-balancing of origin-server Pods. 

![Services](/assets/images/cloud/Services.jpg)

Service provides an LB abstraction

- The client Pods need not know about the origin-server Pod IPs
- The client Pods only interact with the Service Pod.
- If origin-server Pods scale or if few pods fail and the replacements come-up then they are seamlessly added to the Service and load-balancing keeps working.

## Label $-$ Connecting Pod to Service

![Label](/assets/images/cloud/Label.jpg)

