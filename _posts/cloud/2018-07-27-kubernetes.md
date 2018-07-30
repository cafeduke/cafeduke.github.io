---
title: Kubernetes
categories: cloud
layout: post
mathjax: true
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

