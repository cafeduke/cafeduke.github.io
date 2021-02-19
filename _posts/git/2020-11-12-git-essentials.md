---
title: Git Essentials
categories: bigdata
layout: post
mathjax: true
typora-root-url: ../../
---

{% include toc.html %}

# Introduction

Git is a open-source version control system. 

A version control system (like git, ADE, clear-case) is used for distributed software storage, development and versioning. So, a version control provides the following.
  - Distributed storage -- The files (are shard-ed) and stored in multiple servers (using distributed file system)
  - Parallel development -- Many people can work and add features to the same project
  - Distributed development -- Two or more developers in different parts of the world can develop software. Eg: Any open source software.
  - Conflict management  -- If two developers have modified same set of files, then they can resolve the conflict (diff), typically to include both their changes.
  - Versioning  -- Various versions (stages of development) of the files are stored. So, we have the entire version history stored for each file.

# Setup git and duke-git

## Install git
https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

```bash
> which git
/usr/bin/git

> git --version
git version 2.25.1
```
## Install duke-git

https://github.com/cafeduke/duke-git

```bash
# Ensure duke-git is part of path
> which git-history
https://github.com/raghubs81/LearnGit
```

## Create your own git project

-	Create GIT account on https://github.com/ and login. (Eg: https://github.com/raghubs81)
-	Go to Home > Repositories (tab) > New (button)
- Create a repository say "Work" (Eg: https://github.com/raghubs81/Work)

## Fork and clone duke-git

- Sign into to your repository at `https://github.com/<my_git_login>`
- Go to https://github.com/raghubs81/LearnGit
- Click on "Fork button"
- Now this will clone "LearnGit" into your account

```bash
> git clone https://github.com/<my_git_login>/LearnGit
```

# Different areas of storage

![Workflow01](/assets/images/git/DukeGitStorageLevel.jpg)



| Area   | Alias                                      | Note                                                         |
| ------ | ------------------------------------------ | ------------------------------------------------------------ |
| Work   | Working directory, Working area, Work tree | Has tracked, but modified files plus untracked files.        |
| Stage  | Cache, Index                               | After reaching a milestone with a file, we save a copy (stage the file) before modifying it further. <br />In case we are not happy with the modifications we can always restore the staged version back to work. |
| Local  | Local repo, Local repository               | After finishing a module (a bundle of files), we save the bundle of files into what we call a **commit**. |
| Remote | Remote repo, Remote repository             | Copy commits from local repository to the remove server.     |

# Typical Core Workflow

During development, we modify files. Before we proceed further, we would like to save a copy of these files -- This is called **staging** files. In case, we are not happy with current changes we could restore the staged copy. 
- Files are staged using the `git add <path to file>...` command.
- Files are copied from stage to work  using `git-cp-stage-work <file1> [<file2 ... <filen>]` command
- Files are moved from stage to work  using `git-cp-stage-work <file1> [<file2 ... <filen>]` command. Note that moving staged files, removes them from stage.

>  Staging provides a mechanism to save a copy of the files before we make further edits

Once we reach a milestone (could just be a minor milestone) during the development, we bundle the set of files into what we call a **commit**. We provide a name to the commit, indicating the milestone reached. For example, we could have a commit named "Update usage of all scripts", "Format files to have right indentation" or "Add option --help to provide help".

- A set of files is committed using `git commit <path to file>...`

## Moving across areas of storage 
### Stage files

```bash
# Check the history
> git-history
a9a329f  Version 4   (HEAD -> master, origin/master, origin/HEAD)
5d95c77  Version 3  
02f7753  Version 2  
691f07d  Version 1

# Modify fruit.txt and version.txt to add 'Orange' as version 'v4'
> paste fruit.txt version.txt | column -t
Apple	  v1
Banana	v2
Cherry	v3
Dates	  v4
Grapes	v5

# Check status (We have removed unwanted lines lines from output). 
# Note that we fruit.txt and version.txt are considered modified, but are yet to be staged.
> git status
Changes not staged for commit:
	modified:   fruit.txt
	modified:   version.txt

# Stage the files
git add version.txt fruit.txt 

# Check status. The files are not staged, but are yet to be committed.
> git status
Changes to be committed:
  modified:   fruit.txt
	modified:   version.txt
```
### Restoring staged file to work, when needed
```bash
# Let say, we messed up fruit.txt
> cat > fruit.txt 
This file got messed up!

# What's the status now?
# We have our staged fruit.txt and version.txt. The fruit.txt in work is messed up.
> git status
Changes to be committed:
	modified:   fruit.txt
	modified:   version.txt

Changes not staged for commit:
	modified:   fruit.txt

# Lets see the one we had staged. This looks good!
> git-cat-stage-file fruit.txt
Apple
Banana
Cherry
Orange

# Lets copy this back to work. There we go
> git-cp-stage-work fruit.txt
> cat fruit.txt 
Apple
Banana
Cherry
Orange
```

### Commit files
```bash
# Status again! We are good to commit
> git status
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   fruit.txt
	modified:   version.txt

# Lets commit!
> git commit --all -m "Version 5"
[master e9dce6b] Version 5

# Yes! We have "Version 4", a commit with ID 'e9dce6b'
> git-history
e9dce6b  Version 5   (HEAD -> master)
a9a329f  Version 4   (origin/master, origin/HEAD)
5d95c77  Version 3  
02f7753  Version 2  
691f07d  Version 1  

# Push this to the server
> git push
Username for 'https://github.com': <Enter username>
Password for 'https://<my_git_login>@github.com': <Enter password>
...
To https://github.com/<my_git_login>/LearnGit  

# Lets check the history now!
> git-history
e9dce6b  Version 5        (HEAD -> master, origin/master, origin/HEAD)
a9a329f  Version 4
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1       
   
```

>  Go to` https://github.com/<my_git_login>/LearnGit` and verify you see 'Orange'

### Restore commit file to work when needed

```bash
# Let say, we messed up fruit.txt
> cat > fruit.txt 
This file got messed up!

# What's the status now?
> git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
	modified:   fruit.txt

# Lets check if the commited file is okay
> git-history
e9dce6b  Version 4        (HEAD -> master, origin/master, origin/HEAD)
a9a329f  Version 4  
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1       

# This commit file looks good!
# Just FYI, we could have accessed the same as 'git-cat-commit-file HEAD fruit.txt'
> git-cat-commit-file e9dce6b fruit.txt 
Apple
Banana
Cherry
Dates
Grapes

# Lets restore from commit
> git-cp-commit-work e9dce6b -- fruit.txt 
> cat fruit.txt 
Apple
Banana
Cherry
Dates
Grapes
```

In the above workflow, we cloned an existing project, modified existing files, staged them, committed them and pushed it to the remote server. We also saw restoring files from stage and commit. We covered a core portion of the workflow. If you are maintaining a repo on Git as a single contributor, this is probably what you shall most often need. However, this could be considered the "Hello World!" of git :)

# Undo push

Lets undo push and understand the commands in later sections. In a new section, we shall assume the stage (similar to a newly forked and cloned repository)

```bash
> git reset --hard a9a329f
HEAD is now at a9a329f Version 4

> git-history
a9a329f  Version 4   (HEAD -> master)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1       

# The regular 'git push' fails
> git push        
Username for 'https://github.com': cafeduke
Password for 'https://cafeduke@github.com': 
...
error: failed to push some refs to 'https://github.com/<my_git_login>/LearnGit'

# Lets do a force push
> git push --force
Username for 'https://github.com': 
Password for 'https://<my_git_login>@github.com': 
...
To https://github.com/<my_git_login>/LearnGit
```

# Digging little deeper

## More committed

In this section lets get to know more about commit. A commit contains a set of files (and directories) that were created, updated or deleted. A commit represents a milestone. A text summary describes (summarises) the milestone.

> The commit represents a milestone in the journey of developing a feature.

We see that `git-history` lists few commits. Each commit is a seven digit hexadecimal number, along with its description. Few commits have some additional information as well. Lets learn more on these.

Lets take a look at a more detailed history.

```bash
git-history --long
a9a329f06eb46e355d23dce550b91dce5e5187fc  Version 4  Raghunandan.Seshadri  Sun,15-Nov-2020 16:46:18   (HEAD -> master, origin/master, origin/HEAD)
5d95c770db3c86e85d5c9d03cd45ebf3b9f08727  Version 3  Raghunandan.Seshadri  Sun,15-Nov-2020 16:45:29  
02f7753798193f27bd6bb2c7f75b58d61e58eed8  Version 2  Raghunandan.Seshadri  Sun,15-Nov-2020 16:45:10  
691f07d0eecd58f59815098c38abed675e49e802  Version 1  Raghunandan.Seshadri  Sat,12-May-2018 08:37:39
```

- A commit is a 160bit (20 byte) SHA1 hash code of the files. The same set of files, with the same change will generate the same hash. So, cloning project duke-git `git clone https://github.com/<my_git_login>/LearnGit` will produce the same commit IDs as given above.
- A one line summary of what the commit is all about. Very helpful for someone else to know what the commit is about.
- The author of the commit
- Date of commit
- Optional, meta-data for selected commits.

### Commits are stacked

First off, we see that the latest commit is listed first. In other words, latest commit is at the top, followed by older commits. 

## Terminologies

### Git Repository

A repository is a store house of all our commits. Going forward we shall see that a repository with commits is a `Tree` data structure, with several **branches**,  where each `Node` is a commit. A branch can have one or more `Nodes` (commits).

### Master
By default, there is only one branch -- the `master` branch.

> In git, the default branch is called **master**. Git is now changing the name to **main**

A branch is also a **pointer**, pointing to the latest commit (node) of that branch. We could create several branches (stemming from any node, as we see later) and each branch shall have a name. For example, if we have a branch named `dev_feature1` then `dev_feature1` shall point to the latest commit on branch `dev_feature1`

### HEAD
`HEAD` is a pointer as well. HEAD either points to a branch or directly point to a commit. Typically, `HEAD` points to a branch. As we know, the branch in-turn points to the latest commit.

> HEAD determines where the next commit shall be pushed (added). If we have many branches, we need to make sure HEAD is pointing to the right branch!

### Remote and Local Repository

A repository is a storehouse of commits where the commits are stored as a `Tree` data structure. A local repository stores is our local computer. However, a remote repository stores in remote server where the data is really safe (backed up). 

> Commits are **not really safe** until they are pushed to remote repository.

The entire tree of commits shall be identical in local and remote repository to begin with. However, during the course of development they shall go out of sync. 

## A look a git config

We have a hidden directory in our base project folder called `.git` Lets take a look a section of the configuration stored in `.git/config`

```yaml
[core]
  ...
[remote "origin"]
	url = https://github.com/<my_git_login>/LearnGit
	...
[branch "master"]
	remote = origin
	...

```

- A remote (remote repository) named `origin` is configured with the URL `https://github.com/<my_git_login>/LearnGit` -- This is the remote server storing our project.
- A branch named `master` is configured with remote `origin`.

> We address (point to) the remote repository using **origin**.  The URL provides the remote storage location.

## Local and remote commits

```bash
# git-history takes a branch argument that defaults to current branch which is 'master'
> git-history -h
List commit history of last 'n' commits. By default, n=25, branch=<current checkout branch>

Usage: git-history [--long] [branch] [<number of commits>]

# Git history of master
> git-history master
a9a329f  Version 4   (HEAD -> master, origin/master, origin/HEAD)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1       

# Get history of commits on remote repo's master using 'origin/master'
> git history origin/master
a9a329f  Version 4   (HEAD -> master, origin/master, origin/HEAD)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1       

# Now lets add a version 5, Grapes
> paste fruit.txt version.txt | column -t  
Apple   v1
Banana  v2
Cherry  v3
Dates   v4
Grapes  v5

# Lets add to local repo using commit
> git commit --all -m "Version 5"
[master 991a6bc] Version 5

# NOTE: It reads "Your branch is ahead of 'origin/master' by 1 commit"
> git status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
...

# Get the history of local branch now
> git history master
991a6bc  Version 5   (HEAD -> master)
a9a329f  Version 4   (origin/master, origin/HEAD)
5d95c77  Version 3  
02f7753  Version 2  
691f07d  Version 1 
```

In the output of `git-history master` ,

- The local repository's master branch (or just `master` ) as usual points to the latest commit. Now, the latest commit is `991a6bc`. So, `master` is pointing to this.
- The `HEAD` points to the local branch `master`
- The remote repository's master branch  `origin/master` is pointing to `04c22ee` as before.
- The remote repository's `HEAD` pointer is at the same commit `04c22ee` as well.

# Hard reset
We saw hard reset `reset --hard` in the [Undo push](#undo-push) section . Using a hard reset we can go back to a desired commit.

>  **Warning:** A hard reset deletes all tracked files in stage and work. Untracked files are unaffected.

There are two common `git reset` methods

- Relative 
  - The relative method is relative to a pointer like `HEAD`
  - For example `git rest --hard HEAD~3` shall take HEAD down by 3 commits.
- Absolute
  - Here you provide the Id of the target commit (short or full) 
  - For example `git reset --hard 02f7753` shall take HEAD to this commit "Version 2"

```bash
> git-history
991a6bc  Version 5   (HEAD -> master)
a9a329f  Version 4   (origin/master, origin/HEAD)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1      

# Relative reset. 
# Absolute equivalent of the command would be "git reset --hard 02f7753"
> git reset --hard HEAD~3
HEAD is now at 02f7753 Version 2

> git-history
02f7753  Version 2   (HEAD -> master)
691f07d  Version 1  

# You can reset to a commit not in history! This just undid our previous reset.
> git reset --hard 991a6bc
HEAD is now at 991a6bc Version 5

> git-history
991a6bc  Version 5   (HEAD -> master)
a9a329f  Version 4   (origin/master, origin/HEAD)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1
```

> **Warnings**
>
> 1. Hard reset **deletes** all tracked files in work and stage
> 2.  Hard reset moves both HEAD and master points to the target commit.
> 3. After HARD reset, the commits that are no more part of history are made available for garbage collection. (Similar to Java objects that have no reference)
> 4. In order to reset to a commit not in history, we need to know the commit ID and hope it is not garbage collected.

## Why hard reset?

One of the typical uses of hard reset is when we are sure, we want to discard everything (in work and stage) and go to a commit (and thus all commits leading to it). Typically this commit is in the history -- So, we are sure, we want to discard the top 'n' commits.

The reason we are learning hard reset so early-on it is an easy way to test several git usecases as we shall see in subsequent sections.

# Push, git-refresh and conflict resolution

## push

As we keep committing to the local repository, the local repository is not only out of sync with remote (in case someone else needs to check on the progress). It is also **not safe**. As we have already seen, we need to push commits to remote.

> We should periodically push commits to remote

#### What commits are we pushing?

Git push will NOT push the entire local repository tree to the remote. It will only push the **new commits** of the **current branch**. 

#### Where are we pusing?

From `.git/config` we see that `master` branch uses a remote named `origin`. We see `origin` uses URL `https://github.com/<my_git_login>/LearnGit`. This is the remote destination for the commits.

```bash
[remote "origin"]
	url = https://github.com/cafeduke/LearnGit
	...
[branch "master"]
	remote = origin
```

## git-refresh -- no conflict

The remote repo can go ahead of what we are doing. This can be easily simulated using git-reset.

```bash
# Lets reset to 'Version 2'
> git-history
991a6bc  Version 5   (HEAD -> master)
a9a329f  Version 4   (origin/master, origin/HEAD)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1       

> git reset --hard 02f7753
HEAD is now at 02f7753 Version 2

# We see that our branch is behind by 2 commits
> git status
On branch master
Your branch is behind 'origin/master' by 2 commits, and can be fast-forwarded.

> git-refresh
---------------------------------------------------------------------------------------------------
Pull latest commits from origin/master
---------------------------------------------------------------------------------------------------
From https://github.com/<my_git_login>/LearnGit
 * branch            master     -> FETCH_HEAD
Updating ...
Fast-forward
...
...

---------------------------------------------------------------------------------------------------
[Branch=master] Top 10 commits AFTER pull
---------------------------------------------------------------------------------------------------
991a6bc  Version 5   (HEAD -> master, origin/master, origin/HEAD)
a9a329f  Version 4   
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1       

```

## git-refresh -- conflict

```bash
# Lets reset to 'Version 2'
> git-history
991a6bc  Version 5   (HEAD -> master)
a9a329f  Version 4   (origin/master, origin/HEAD)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1       

> git reset --hard 02f7753
HEAD is now at 02f7753 Version 2

# Commit with "Cactus" fruit for "Version 3"
> paste fruit.txt version.txt 
Apple	  v1
Banana	v2
Cactus	v3

> git commit --all -m "My version 3"
[master 5037c96] My version 3

# We see that the status says branch 'master' has diverged from remote 'origin/master'
> git status
On branch master
Your branch and 'origin/master' have diverged,
and have 1 and 2 different commits each, respectively.
...

# These are the commits on local master
> git-history 
5037c96  My version 3   (HEAD -> master)
02f7753  Version 2     
691f07d  Version 1    

# These are the commits on remote origin/master
> git-history origin/master
a9a329f  Version 4   (origin/master, origin/HEAD)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1
```

Here,

- `git status` mentions that `Your branch and 'origin/master' have diverged`
- The local and remote branches have same commits until "Version 2". After that we have our own commits while the remote has its own.



### A look at the tree before refresh

```bash
# BEFORE refresh
# --------------
Version_1 -- Version_2 -- Version_3 -- Version_4    (origin/master)
Version_1 -- Version_2 -- My_version_3              (master)
```
### Refresh branch

```bash
# Execute git-refresh now
> git-refresh
---------------------------------------------------------------------------------------------------
Pull latest commits from origin/master
---------------------------------------------------------------------------------------------------
From https://github.com/<my_git_login>/LearnGit
 * branch            master     -> FETCH_HEAD
Removing state_resue.txt
Removing set_state.sh
Auto-merging fruit.txt
CONFLICT (content): Merge conflict in fruit.txt
Removing fruit.3.1.mod.txt
Automatic merge failed; fix conflicts and then commit the result.

###################################################################################################
CAUTION: *** Merge conflicts found ***
List of conflicts
###################################################################################################
fruit.txt

Open conflicts using meld tool [y]/n ?
```
Here,

- There are other files that come as part of `origin/master` but we don't have them so there is no conflict
- However,local and remote have updated `fruit.txt` and the changes are different resulting in a conflict.
- Now, you can choose 'y' that opens up a UI to merge or choose 'n' and do the same later. Lets go with 'y'

### 3-way merge with Meld

Meld is a tool that provides a UI for handling merge.

![Refresh Conflict With Meld](/assets/images/git/DukeGitRefreshConflict.jpg)

- 3-way refresh merge
  - A refresh merge is between local and remote branch
  - Column-1: fruit_LOCAL: The file as in latest local commit (The content of fruit.txt as per `master`)
  - Column-3: fruit_REMOTE: The file as in latest remote commit (The content of fruit.txt as per `origin/master`)
  - Column-2: fruit.txt: The file as per the commit that is common to both local and remote (Commit "Version 2")
- In essence, Column-1 tells us how **we** have modified contents in Column-2 and Column-3 tells us how someone else (remote) has modified contents in Column-2.
- Now, we need to update the file **only** in Column-2 by referring the other columns and deciding what we want to keep.

- Lets go with following fruits for fruit.txt (Column-2)
  - Apple
  - Banana
  - Cherry Citric
  - Dates
- Save and close

```bash
Normal merge conflict for 'fruit.txt':
  {local}: modified file
  {remote}: modified file

Normal merge conflict for 'version.txt':
  {local}: modified file
  {remote}: modified file

###################################################################################################
Double check the conflict resolution and execute 'git commit --all -m <commit message>'
###################################################################################################
```

Note that we need to check if the merge is fine and commit the files.

```bash
# Note: 
# - The mesage says conflicts are fixed. Yet, commit is pending.
# - Files are staged
# - There are untracked files fruit.txt.orig and version.txt.orig
> git status
...
...
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)

Changes to be committed:
	modified:   fruit.txt
	modified:   version.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	fruit.txt.orig
	version.txt.orig

# The untracked file is just a backup of the conflict. Lets discard the untracked file
> git-rm-work
--------------------------------  Following files shall be deleted  -------------------------------
Would remove fruit.txt.orig
Would remove version.txt.orig
---------------------------------------------------------------------------------------------------
Continue [y]/n ?
y
Removing fruit.txt.orig
Removing version.txt.orig

---------------------------------------------------------------------------------------------------
Status
---------------------------------------------------------------------------------------------------
...

# Lets check the staged fruit.txt and version.txt
> git-cat-stage-file fruit.txt 
Apple
Banana
Cherry Citric
Dates

> git-cat-stage-file version.txt 
v1
v2
v3
v4

> git commit --all -m "My merge of version 3"
[master 3a9a9e1] My merge of version 3

> git-history
3a9a9e1  My merge of version 3   (HEAD -> master)
5037c96  My version 3           
a9a329f  Version 4               (origin/master, origin/HEAD)
5d95c77  Version 3              
02f7753  Version 2              
691f07d  Version 1

```

### A look at the tree after refresh

```bash
# BEFORE refresh
master         : Version_1 -- Version_2 -- My_Version_3
origin/master  : Version_1 -- Version_2 -- Version_3 -- Version_4

# AFTER refresh
master         : Version_1 -- Version_2 -- Version_3 -- Version_4 -- My_Version_3 -- My_Merge_Of_Version_3

# In General
# ----------

# Before refresh
master        : A -- B -- P
origin/master : A -- B -- C -- D

# After refresh
master        : A -- B -- C -- D -- P -- M1
```

### Merging later

```bash
# Lets go back to that state before refresh
> git reset --hard 5037c96
HEAD is now at 5037c96 My Version 3

# Now choose 'n'
> git-refresh
...
Open conflicts using meld tool [y]/n ?
n

# Note that the status says we have conflicts
> git status
On branch master
Your branch and 'origin/master' have diverged,
...
You have unmerged paths.
  (fix conflicts and run "git commit")
...

# Lets list those conflict files
> git-ls-conflict-files 
fruit.txt
version.txt

# Lets use meld to merge now
> git mergetool
```

# Branches

A simple git project (to begin with) shall have all nodes (commits) in the same branch (master). However, a tree can and most likely will have several branches with its own nodes.

## Know your branch

```bash
# Display local branches 
# Star (*) indicates the current branch.
> git branch
* master

# Display current branch
> git branch --show-current
master

# Display all branches 
> git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev_jackie
  remotes/origin/dev_mango
  remotes/origin/master
```

Here,

- `remotes/` prefix indicates it's a remote branch. Absence of it indicates it is a local branch.

- `remotes/origin` indicates that it is a remote branch associated with a remote (remote repository) named `origin`

  

## Hopping branches

```bash
# Tree (Used _ intead of space in commit message)              
Version_1 -- Version_2 -- Version_3 -- Version_4                    (master)
               |                         |
               |                         +-- Add_Jackie             (dev_jackie)
               |
               +-- Add_Mango -- Add_Raw_Mango                       (dev_mango)

```

### Hopping to a branch

We hop to a new branch using `git checkout` command.

```bash
# Lets go to an existing branch
> git checkout dev_jackie
Branch 'dev_jackie' set up to track remote branch 'dev_jackie' from 'origin'.
Switched to a new branch 'dev_jackie'

# A local dev_jackie branch wasn't there. The remote branch was cloned to local repo and we switched.
> git branch -a
* dev_jackie
  master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev_jackie
  remotes/origin/dev_mango
  remotes/origin/master

# Node 
#  - Local branch 'dev_jackie' and remote branch 'origin/dev_jackie' point to same commit
#  - HEAD points to the local branch 'dev_jackie' now!
> git-history
c2bd70b  Add jackie  (HEAD -> dev_jackie, origin/dev_jackie)
a9a329f  Version 4   (origin/master, origin/HEAD, master)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1             

# Lets check the status
> git status
On branch dev_jackie
Your branch is up to date with 'origin/dev_jackie'.

nothing to commit, working tree clean

# Lets see contents
> paste fruit.txt version.txt | column -t
Apple      v1
Banana     v2
Cherry     v3
Dates      v4
Jackfruit  v5
```

> When you hop a branch HEAD shall point to the target branch.

### Hoping to another and back

```bash
> git checkout dev_mango
Branch 'dev_mango' set up to track remote branch 'dev_mango' from 'origin'.
Switched to a new branch 'dev_mango'

> git branch -a
  dev_jackie
* dev_mango
  master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev_jackie
  remotes/origin/dev_mango
  remotes/origin/master

# Note that this commit has branched after 'Version 2' and has added two more commits
> git-history
3bf806c  Add raw mango   (HEAD -> dev_mango, origin/dev_mango)
1dcae00  Add mango      
02f7753  Version 2       (master)
691f07d  Version 1    

> git checkout master
Switched to branch 'master'
Your branch is up to date with 'origin/master'.

> git-history
a9a329f  Version 4   (HEAD -> master, origin/master, origin/HEAD)
5d95c77  Version 3  
02f7753  Version 2  
691f07d  Version 1
```

## Why branch?

There are two broad purposes for having a branch.

1. Feature branch
   - The purpose of this branch is for the developer to add a feature or fix a bug.
   - This is the branch we have seen all the while in previous sections.
2. Release branch
   - This is a branch meant for a specific release of the product. 
   - This branch shall be maintained (bug fixes are supported) as long as the release is supported.
   - Typically new features will be added to `master` only. The release branch will have only bug fixes that are encountered in this branch.

### Feature branch

Even as a single developer, we might be working on several bugs and features at the same time. We will have to maintain separate code lines to deal with each of them.

- A typical development environment shall have several developers. 
- Each developer shall have several branches for each feature/bug being worked on.
- Typically, a development (dev) branch name will be of the format
  -  `<developer id>_bug<bug number>` in case of a bug fix.
  -  `<developer id>_<feature>` in case of a feature.
- Once the branch is ready with all commits and is working fine. 
  - We will have to test it with new commits (if any) in target branch (`master`) 
  - Merge the dev branch with target branch (`master`)
  - Test again to make sure everything is working 
  - Push to remote

We shall see these in detail in coming sections.

## Creating and persisting branches

A typical feature development or bug fix workflow involves the following steps

### Update the local master

Ensure your local `master` is up to date with remote master `origin/master`. This is to ensure we are branching from the latest commit on master.

```bash
> git checkout master
> git pull
```

### Create a local branch

```bash
# We have created and swtiched to a new branch
> git-mk-branch dev_my_fruit 
> git branch --show-current
dev_my_fruit
```

### Add commits to local branch

```bash
# Add 'Grapes' as our 'Version 5' fruit and commit
> paste fruit.txt version.txt | column -t
Apple	  v1
Banana	v2
Cherry	v3
Dates	  v4
Grapes  v5

# Add 'DryGrapes' as our 'Version 6' fruit and commit
> paste fruit.txt version.txt  | column -t
Apple      v1
Banana     v2
Cherry     v3
Dates      v4
Grapes     v5
DryGrapes  v6

# Graph
Version_1 -- Version_2 -- Version_3 -- Version_4                       (master)
                                         |
                                         +-- Version_5  -- Version_6   (dev_my_fruit)

```

> The commits as well as the branch added above are **not safe** as they are still in the local repository.

### Push local branch and all its commits to remote repository

```bash
> git push origin dev_my_fruit
...
... 
remote: 
...
 * [new branch]      dev_my_fruit -> dev_my_fruit

# We see a local and remote dev_my_fruit 
> git branch -a
  dev_jackie
  dev_mango
* dev_my_fruit
  master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev_jackie
  remotes/origin/dev_mango
  remotes/origin/dev_my_fruit
  remotes/origin/master

# List the remote commits of newly created branch
> git history origin/dev_my_fruit
d7012b1  Version 6        (HEAD -> dev_my_fruit, origin/dev_my_fruit)
d68e9c5  Version 5       
a9a329f  Version 4        (origin/master, origin/HEAD, master)
5d95c77  Version 3       
02f7753  Version 2       
691f07d  Version 1 
```

We see branch `origin/dev_my_fruit` is clearly ahead of `master` by 2 commits. The commits are now safe.

# Merge branches

Typically merging of branches lands us into two situations. Lets take a look at them

## Fast forward merge

### A look at the tree before merge

```bash
# BEFORE merge
# ------------
# Tree (Used _ intead of space in commit message)              
Version_1 -- Version_2 -- Version_3 -- Version_4                   (master)
                                        |
                                        +-- Add_Jackie             (dev_jackie)
```

Here,

- Branch `dev_jackie` is branched from commit  `Version_4` of `master`
- No commits are added to `master` after this. However, new commits are added to `dev_jackie`
- In this situation, we say "Branches `master`  and `dev_jackie` have **not** diverged" (Since they are on the same line without any fork)

### Merge feature to master -- local repository

```bash
# Ensure you are the the master branch
> git checkout master

# Merge dev_jackie to it
git-merge-branch dev_jackie

---------------------------------------------------------------------------------------------------
Pull latest commits from origin/master
---------------------------------------------------------------------------------------------------
Already on 'master'
Your branch is up to date with 'origin/master'.
Already up to date.

---------------------------------------------------------------------------------------------------
[TargetBranch=master] Top 10 commits
---------------------------------------------------------------------------------------------------
a9a329f  Version 4   (HEAD -> master, origin/master, origin/HEAD)
5d95c77  Version 3  
02f7753  Version 2  
691f07d  Version 1  

---------------------------------------------------------------------------------------------------
[SourceBranch=dev_jackie] Top 10 commits
---------------------------------------------------------------------------------------------------
c2bd70b  Add jackie   (origin/dev_jackie, dev_jackie)
a9a329f  Version 4    (HEAD -> master, origin/master, origin/HEAD)
5d95c77  Version 3   
02f7753  Version 2   
691f07d  Version 1   

---------------------------------------------------------------------------------------------------
Merge dev_jackie --> master
---------------------------------------------------------------------------------------------------
Merge dev_jackie [y]/n ?
y
Updating a9a329f..c2bd70b
Fast-forward
 fruit.txt   | 1 +
 version.txt | 1 +
 2 files changed, 2 insertions(+)

---------------------------------------------------------------------------------------------------
[Branch=master] Top 10 commits AFTER merge
---------------------------------------------------------------------------------------------------
c2bd70b  Add jackie   (HEAD -> master, origin/dev_jackie, dev_jackie)
a9a329f  Version 4    (origin/master, origin/HEAD)
5d95c77  Version 3   
02f7753  Version 2   
691f07d  Version 1   

```

The `git-merge-branch` did the following

- A `git-merge-branch` merges source branch onto the target branch. Here, source branch is `dev_jackie` and target branch is `master` (We have not explicitly provided the target branch. The target branch by default is current branch ,which in this case is `master`)
- The current branch `master` was updated with it's remote counter part `origin/master`
- The top 10 commits of target branch and source branch are displayed.
- There is a confirmation to merge `dev_jackie --> master` 
- Note that the merge is termed '**Fast-forward**'
- Finally, the top 10 commits of source branch `master` post merge is displayed

### A look at the tree after merge

```bash
# AFTER merge
# ------------
# Tree (Used _ intead of space in commit message)              
Version_1 -- Version_2 -- Version_3 -- Version_4 -- Add_Jackie     (master)
                                        |
                                        +-- Add_Jackie             (dev_jackie)
```

> The source (parent) branch gets appended with new commits. 
> The target (child) branch  is **unaffected** by merge (The target branch is neither altered nor removed)

### Persist merge -- Push to remote

Its not over yet! The merge is only done on local repository. It's not over until pushed to remote.

```bash
> git status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
...

> git push
...

# Now its merged
> git history origin/master
c2bd70b  Add jackie (origin/master, origin/HEAD)
a9a329f  Version 4   
5d95c77  Version 3  
02f7753  Version 2  
691f07d  Version 1
```

## Fork Merge

### A look at the tree before merge

```bash
# BEFORE merge
# ------------
# Tree (Used _ intead of space in commit message)              
Version_1 -- Version_2 -- Version_3 -- Version_4                    (master)
               |
               +-- Add_Mango -- Add_Raw_Mango                       (dev_mango)
```

Here,

- Branch `dev_mango` is branched from commit  `Version_2` of `master`
- New commits are added to `master` after the branch. New commits are added to `dev_mango` as well.
- In this situation, we say "Branches `master` and `dev_mango`  **have diverged**" (Since there are two different paths after branching)

### Merge feature to master -- local repository

```bash
# Ensure you are the the master branch
> git checkout master

# Merge dev_mango with master
> git-merge-branch dev_mango

---------------------------------------------------------------------------------------------------
Pull latest commits from origin/master
---------------------------------------------------------------------------------------------------
Already on 'master'
Your branch is up to date with 'origin/master'.
Already up to date.

---------------------------------------------------------------------------------------------------
[TargetBranch=master] Top 10 commits
---------------------------------------------------------------------------------------------------
a9a329f  Version 4   (HEAD -> master, origin/master, origin/HEAD)
5d95c77  Version 3  
02f7753  Version 2  
691f07d  Version 1  

---------------------------------------------------------------------------------------------------
[SourceBranch=dev_mango] Top 10 commits
---------------------------------------------------------------------------------------------------
3bf806c  Add raw mango   (origin/dev_mango, dev_mango)
1dcae00  Add mango      
02f7753  Version 2      
691f07d  Version 1      

---------------------------------------------------------------------------------------------------
Merge dev_mango --> master
---------------------------------------------------------------------------------------------------
Merge dev_mango [y]/n ?
y
Auto-merging fruit.txt
CONFLICT (content): Merge conflict in fruit.txt
Automatic merge failed; fix conflicts and then commit the result.

###################################################################################################
CAUTION: *** Merge conflicts found ***
List of conflicts
###################################################################################################
fruit.txt

Open conflicts using meld tool [y]/n ?
n

# Note that merge conflicts are staged
> git status
You have unmerged paths.
  (fix conflicts and run "git commit")

```

Here,

- The current branch `master` was updated with it's remote counter part `origin/master`
- The top 10 commits of target branch and source branch are displayed.
- There is a confirmation to merge `dev_mango --> master` 
- `Automatic merge failed; fix conflicts and then commit the result.` After branch if master and branch have altered different files, then auto merge would have succeeded.  However in our case same files are altered. This requires us to manually resolve conflict.
- We have chosen to resolve conflict later.
- A look at the status tells us there are **unmerged paths**.

### Resolve conflicts

```bash
# List files having conflict
> git-ls-conflict-files 
fruit.txt

# This shows a text representation of the conflict
> cat fruit.txt 
Apple
Banana
<<<<<<< HEAD
Cherry
Dates
=======
Mango
Raw Mango
>>>>>>> dev_mango

# Lets merge using the UI
> git mergetool
```
### 3-way merge

![](/assets/images/git/DukeGitMergeConflict.jpg)

3-way merge from branch `dev_mango` (source) to `master` (target/current)

- The source branch is merged with the target branch.
  - Column-1: fruit_LOCAL: The file fruit.txt as per the latest commit on target branch `master`
  - Column-3: fruit-REMOTE: The file fruit.txt as per the latest commit on source branch `dev_mango`
  - Column-2: fruit.txt: The file fruit.txt as per the commit common to branches  `dev_mango` and `master`
- Update Column-2 by referring to Column-1 and Column-3
- Save and Close

```bash
# File after resolving conflict
> cat fruit.txt
Apple
Banana
Cherry
Dates
Mango
Raw Mango

# Remove temp files in work
> git-rm-work
git-rm-work 
--------------------------------  Following files shall be deleted  -------------------------------
Would remove fruit.txt.orig
---------------------------------------------------------------------------------------------------
Continue [y]/n ?
y

# Commit after resolving merge conflicts
> git commit --all -m "Merge dev_jackie"
[master 3e606f2] Merge dev_jackie

> git-history
3e606f2  Merge dev_jackie   (HEAD -> master)
3bf806c  Add raw mango      (origin/dev_mango, dev_mango)
1dcae00  Add mango         
a9a329f  Version 4          (origin/master, origin/HEAD)
5d95c77  Version 3         
02f7753  Version 2         
691f07d  Version 1         
```

### A look at the tree after merge

```bash
# AFTER merge
# -----------
# Tree (Used _ intead of space in commit message)              
Version_1 -- Version_2 -- Version_3 -- Version_4 -- Add_mango -- Add_raw_mango -- Merge_dev_jackie  (master)
               |
               +-- Add_mango -- Add_raw_mango                                                       (dev_mango)
```

>The source (parent) branch gets appended with new commits. There is an **extra commit** that resolves merge conflicts between the branches.
>The target (child) branch  is **unaffected** by merge (The target branch is neither altered nor removed)

### Persist merge -- Push to remote

Following isa crucial difference between fast-forward merge and fork merge.

**Fast Forward merge (FF Merge):** No need to test after merge

- In case of fast-forward merge we saw earlier, we had tested `master` and we had tested `dev_jackie` individually before merge.
-  There is no need to test after merge, since `dev_jackie` is just an extension of `master`  (clear super-set).
-  Post merge, `master` has the exact same commits as `dev_jackie`. 
- Since `dev_jackie` is already tested there is no need to test `master` after merge.

**Fork merge:** MUST test after merge

- The working of new commits of `master` after branch (`Version_3, Version_4`) with commits coming from branch ( `Add_mango Add_raw_mango`) plus the merge commit `Merge_dev_jackie` has NEVER been tested.

> Ensure all tests succeed on local master before pushing to remote

```bash
> git status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
...

> git push
...

# Now its merged!
> git history origin/master
3e606f2  Merge dev_jackie   (origin/master, origin/HEAD)
3bf806c  Add raw mango      
1dcae00  Add mango         
a9a329f  Version 4          
5d95c77  Version 3         
02f7753  Version 2         
691f07d  Version 1 
```

# References

- [How to contribute to open source](https://github.com/firstcontributions/first-contributions)
- [Pull request workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962)














