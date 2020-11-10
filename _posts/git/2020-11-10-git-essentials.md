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

A version control system (like git, ADE, clear-case) is used for distributed software storage, development and versioning. So, a version control provides
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

- Sign into to your repository at "https://github.com/<your_login>"
- Go to https://github.com/raghubs81/LearnGit
- Click on "Fork button"
- Now this will clone "LearnGit" into your account

```bash
> git clone https://github.com/<your_login>/LearnGit
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
04c22ee  Update scripts   (origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1

# Modify fruit.txt and version.txt to add 'Orange' at version 'v4'
> paste fruit.txt version.txt 
Apple   v1
Banana	v2
Cherry	v3
Orange	v4

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
> git commit --all -m "Version 4"
[master a2bfba5] Version 4

# Yes! We have "Version 4", a commit with ID 'f7dda77'
> git-history
a2bfba5  Version 4        (HEAD -> master)
04c22ee  Update scripts   (origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1

# Push this to the server
> git push
Username for 'https://github.com': <Enter username>
Password for 'https://cafeduke@github.com': <Enter password>
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 4 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 342 bytes | 342.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To https://github.com/cafeduke/LearnGit
   04c22ee..a2bfba5  master -> master

# Lets check the history now!
> git-history
a2bfba5  Version 4        (HEAD -> master, origin/master, origin/HEAD)
04c22ee  Update scripts  
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       
   
```

>  Go to https://github.com/<your_git_id>/LearnGit and verify you see 'Orange'

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
a2bfba5  Version 4        (HEAD -> master, origin/master, origin/HEAD)
04c22ee  Update scripts  
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       

# This commit file looks good!
# Just FYI, we could have accessed the same as 'git-cat-commit-file HEAD fruit.txt'
> git-cat-commit-file a2bfba5 fruit.txt 
Apple
Banana
Cherry
Orange

# Lets restore from commit
> git-cp-commit-work a2bfba5 -- fruit.txt 
> cat fruit.txt 
Apple
Banana
Cherry
Orange
```

In the above workflow, we cloned an existing project, modified existing files, staged them, committed them and pushed it to the remote server. We also saw restoring files from stage and commit. We covered a core portion of the workflow. If you are maintaining a repo on Git as a single contributor, this is probably what you shall most often need. However, this could be considered the "Hello World!" of git :)

# Undo push

Lets undo push and understand the commands in later sections. In a new section, we shall assume the stage (similar to a newly forked and cloned repository)

```bash
> git reset --hard HEAD~1
HEAD is now at 04c22ee Update scripts

> git-history
04c22ee  Update scripts   (HEAD -> master)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       

# The regular 'git push' fails
> git push        
Username for 'https://github.com': cafeduke
Password for 'https://cafeduke@github.com': 
To https://github.com/cafeduke/LearnGit
 ! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to 'https://github.com/cafeduke/LearnGit'

# Lets do a force push
> git push --force
Username for 'https://github.com': cafeduke
Password for 'https://cafeduke@github.com': 
Total 0 (delta 0), reused 0 (delta 0)
To https://github.com/cafeduke/LearnGit
 + a2bfba5...04c22ee master -> master (forced update)
```

# Digging little deeper

## More committed

In this section lets get to know more about commit. A commit contains a set of files (and directories) that were created, updated or deleted. A commit represents a milestone. A text summary describes (summarises) the milestone.

> The commit represents a milestone in the journey of developing a feature.

We see that `git-history` lists few commits. Each commit is a seven digit hexadecimal number, along with its description. Few commits have some additional information as well. Lets learn more on these.

Lets take a look at a more detailed history.

```bash
git-history --long
04c22ee14d6c09515cc5b7328dc9cca60365832e  Update scripts  Raghunandan.Seshadri  Wed,24-Jun-2020 00:44:25   (HEAD -> master, origin/master, origin/HEAD)
bea680236c2c7924a35e38752a0a881393da2fc4  Version 3       Raghunandan.Seshadri  Sun,13-May-2018 00:14:31  
c62a5116a106ca90dee7da22ddf9ec5c3b90e5b1  Version 2       Raghunandan.Seshadri  Sun,13-May-2018 00:13:56  
691f07d0eecd58f59815098c38abed675e49e802  Version 1       Raghunandan.Seshadri  Sat,12-May-2018 08:37:39  
```

- A commit is a 160bit (20 byte) SHA1 hash code of the files. The same set of files, with the same change will generate the same hash. So, cloning project duke-git `git clone https://github.com/<your_login>/LearnGit` will produce the same commit IDs as given above.
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
	url = https://github.com/cafeduke/LearnGit
	...
[branch "master"]
	remote = origin
	...

```

- A remote (remote repository) named `origin` is configured with the URL `https://github.com/cafeduke/LearnGit` -- This is the remote server storing our project.
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
04c22ee  Update scripts   (HEAD -> master, origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       

# Get history of commits on remote repo's master using 'origin/master'
> git history origin/master
04c22ee  Update scripts   (HEAD -> master, origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       

# Now lets add a version 4, Grape
> paste fruit.txt version.txt 
Apple	  v1
Banana	v2
Cherry	v3
Grape	  v4

# Lets add to local repo using commit
> git commit --all -m "Version 4"
[master b62a20c] Version 4

# NOTE: It reads "Your branch is ahead of 'origin/master' by 1 commit"
> git status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
...

# Get the history of local branch now
> git-history master
b62a20c  Version 4        (HEAD -> master)
04c22ee  Update scripts   (origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1 
```

In the output of `git-history master` ,

- The local repository's master branch (or just `master` ) as usual points to the latest commit. Now, the latest commit is `b62a20c`. So, `master` is pointing to this.
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
  - For example `git reset --hard c62a511` shall take HEAD to this commit "Version 2"

```bash
> git-history
b62a20c  Version 4        (HEAD -> master)
04c22ee  Update scripts   (origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1      

# Relative reset. 
# Absolute equivalent of the command would be "git reset --hard c62a511"
> git reset --hard HEAD~3
HEAD is now at c62a511 Version 2

> git-history
c62a511  Version 2   (HEAD -> master)
691f07d  Version 1  

# You can reset to a commit not in history! This just undid our previous reset.
> git reset --hard b62a20c
HEAD is now at b62a20c Version 4

> git-history
b62a20c  Version 4        (HEAD -> master)
04c22ee  Update scripts   (origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       


```

> **Warnings**
>
> 1. Hard reset deletes all tracked files in work and stage
> 2.  Hard reset moves both HEAD and master points to the target commit.
> 3. After HARD reset, the commits that are no more part of history are made available for garbage collection. (Similar to Java objects that have no reference)
> 4. In order to reset to a commit not in history, we need to know the commit ID and hope it is not garbage collected.

# Push, git-refresh and conflict resolution

## push

As we keep committing to the local repository, the local repository is not only out of sync with remote (in case someone else needs to check on the progress). It is also **not safe**. As we have already seen, we need to push commits to remote.

> We should periodically push commits to remote

#### What commits are we pushing?

Git push will NOT push the entire local repository tree to the remote. It will only push the **new commits** of the **current branch**. 

#### Where are we pusing?

From `.git/config` we see that `master` branch uses a remote named `origin`. We see `origin` uses URL `https://github.com/cafeduke/LearnGit`. This is the remote destination for the commits.

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
b62a20c  Version 4        (HEAD -> master)
04c22ee  Update scripts   (origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       

> git reset --hard c62a511
HEAD is now at c62a511 Version 2

# We see that our branch is behind by 2 commits
> git status
On branch master
Your branch is behind 'origin/master' by 2 commits, and can be fast-forwarded.

> git-refresh
---------------------------------------------------------------------------------------------------
Pull latest commits from origin/master
---------------------------------------------------------------------------------------------------
From https://github.com/cafeduke/LearnGit
 * branch            master     -> FETCH_HEAD
Updating c62a511..04c22ee
Fast-forward
...
...

---------------------------------------------------------------------------------------------------
[Branch=master] Top 10 commits AFTER pull
---------------------------------------------------------------------------------------------------
04c22ee  Update scripts   (HEAD -> master, origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       

```

## git-refresh -- conflict

```bash
# Lets reset to 'Version 2'
> git-history
b62a20c  Version 4        (HEAD -> master)
04c22ee  Update scripts   (origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1       

> git reset --hard c62a511
HEAD is now at c62a511 Version 2

# Commit with "Cactus" fruit for "Version 3"
> paste fruit.txt version.txt 
Apple	  v1
Banana	v2
Cactus	v3

> git commit --all -m "My Version 3"
[master fe7d8b3] My Version 3

# We see that the status says branch 'master' has diverged from remote 'origin/master'
> git status
On branch master
Your branch and 'origin/master' have diverged,
and have 1 and 2 different commits each, respectively.
...

# These are the commits on local master
> git-history 
fe7d8b3  My Version 3   (HEAD -> master)
c62a511  Version 2     
691f07d  Version 1     

# These are the commits on remote origin/master
> git-history origin/master
04c22ee  Update scripts   (origin/master, origin/HEAD)
bea6802  Version 3       
c62a511  Version 2       
691f07d  Version 1
```

Here,

- `git status` mentions that `Your branch and 'origin/master' have diverged`
- The local and remote branches have same commits until "Version 2". After that we have our own commits while the remote has its own.

### Handling conflict with meld

```bash
# Execute git-refresh now
> git-refresh
---------------------------------------------------------------------------------------------------
Pull latest commits from origin/master
---------------------------------------------------------------------------------------------------
From https://github.com/cafeduke/LearnGit
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

```bash
Normal merge conflict for 'fruit.txt':
  {local}: modified file
  {remote}: modified file

---------------------------------------------------------------------------------------------------
[Branch=master] Top 10 commits AFTER pull
---------------------------------------------------------------------------------------------------
fe7d8b3  My Version 3   (HEAD -> master)
c62a511  Version 2     
691f07d  Version 1     

###################################################################################################
Double check the conflict resolution and execute 'git commit --all -m <commit message>'
###################################################################################################

```

Note that we need to check if the merge is fine and commit the files.

```bash
# Note: The mesage says conflicts are fixed. Yet, commit is pending.
# There are a bunch of files that are staged but these are from remote. We did not create them. 
# There is one untracked file 'fruit.txt.orig'
> git status
...
...
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)

Changes to be committed:
	deleted:    fruit.3.1.mod.txt
	modified:   fruit.txt
	new file:   scripts/doStageAndModify.sh
	new file:   scripts/doTakeMasterAheadOfDev.sh
	new file:   scripts/doTakeMasterAheadOfDevFF.sh
	renamed:    fruit.3.1.txt -> scripts/fruit.v4.1.txt
	new file:   scripts/fruit.v4.2.txt
	renamed:    version.3.1.txt -> scripts/version.v4.1.txt
	deleted:    set_state.sh
	deleted:    state_resue.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	fruit.txt.orig

# The untracked file is just a backup of the conflict. Lets discard the untracked file
> git-rm-work
--------------------------------  Following files shall be deleted  -------------------------------
Would remove fruit.txt.orig
---------------------------------------------------------------------------------------------------
Continue [y]/n ?
y
Removing fruit.txt.orig

---------------------------------------------------------------------------------------------------
Status
---------------------------------------------------------------------------------------------------
...

# Lets check the staged fruit.txt and version.txt
> git-cat-stage-file fruit.txt 
Apple
Banana
Cherry Citric

> git-cat-stage-file version.txt 
v1
v2
v3


> git commit --all -m "My merge of version 3"
[master a3104e0] My merge of version 3

> git-history
a3104e0  My merge of version 3   (HEAD -> master)
fe7d8b3  My Version 3           
04c22ee  Update scripts          (origin/master, origin/HEAD)
bea6802  Version 3              
c62a511  Version 2              
691f07d  Version 1

```

### Understanding merge

```bash
# Before merge
master         : v1 -- v2 -- my_v3
origin/master  : v1 -- v2 -- v3 -- update_script

# After merge
master         : v1 -- v2 -- v3 -- update_script -- my_v3 -- my_merge_of_v3

In General
----------

# Before Merge
master        : A -- B -- P
origin/master : A -- B -- C -- D

# After Merge
master        : A -- B -- C -- D -- P -- M1
```

### Merging later

```bash
# Lets go back to that state before refresh
> git reset --hard fe7d8b3
HEAD is now at fe7d8b3 My Version 3

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

# Lets use meld to merge now
> git mergetool
```






# References

https://www.zdnet.com/article/github-to-replace-master-with-main-starting-next-month/

https://github.com/zyedidia/micro/pull/1547















