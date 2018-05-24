---
title: Git Essentials
categories: git
layout: post
mathjax: true
---

{% include toc.html %}

# Add Content

## WorkSpace (New) >> Stage (Newly Added) >> LocalRepo

```shell
# Create fruit.txt and version.txt 
pr -w 25 -m -t fruit.txt version.txt
Apple      v1

# WorkSpace -- New files
git status -s
?? fruit.txt
?? version.txt

# Stage v1
git add fruit.txt version.txt 
git status -s
A  fruit.txt
A  version.txt

# Commit v1 to LocalRepo
git commit -m "Version 1"

# Clean WorkSpace
git status -s

# List of commits
git log --oneline
691f07d Version 1
```

## WorkSpace >> LocalRepo

```shell
# List of commits
git log --oneline
691f07d Version 1

# Modify to add v2
pr -w 25 -m -t fruit.txt version.txt
Apple              v1
Banana             v2

# Files in WorkSpace (Red)
git status -s
 M fruit.txt
 M version.txt

# Commit v2 to LocalRepo. Skipped Staging.
git commit --all -m "Version 2"

# List of commits
git log --oneline
c62a511 Version 2
691f07d Version 1
```


## WorkSpace >> Stage >> LocalRepo

```shell
# List of commits
git log --oneline
c62a511 Version 2
691f07d Version 1

# Modify to add v3
pr -w 25 -m -t fruit.txt version.txt
Apple              v1
Banana             v2
Cherry             v3

# Files in WorkSpace (Red)
git status -s
 M fruit.txt
 M version.txt

# Stage v3
git add fruit.txt version.txt

# Files are Staged (Green)
git status -s
M  fruit.txt
M  version.txt

# Files are added to LocalRepo
git commit -m "Version 3"
```

## LocalRepo >> RemoteRepo

```shell
# Create v3
pr -m -t fruit.txt version.txt
Apple             v1
Banana            v2
Cherry            v3

# Commit changes to LocalRepo
git commit --all -m "Version 3"

# List of commits
git log --oneline
bea6802 Version 3
c17b18e Version 2
691f07d Version 1

# Push to remote repo
git push
```

# Reusable State - 3vCherry

In this section we create a create a GIT state where file `fruit.txt` has 3 different versions in WorkSpace, Stage and Local Repository. Also, file `version.txt` has a WorkSpace version but does not have a Staged version. This state can be recreated to understand the working of `git reset` in various modes -- soft, hard and mixed.

```shell
# Pull from remote
git pull

git log --oneline
bea6802 (HEAD -> master, origin/master) Version 3 (HEAD -> master, origin/master)
c17b18e Version 2
691f07d Version 1

# Create v3.1
pr -m -t fruit.txt version.txt
Apple             v1
Banana            v2
Cherry (Red)      v3.1

# Stage only fruit.txt
git add fruit.txt 

# Modify only fruit.txt after staging
pr -m -t fruit.txt version.txt
Apple             v1
Banana            v2
Cherry (Black)    v3.1

# We have following state
# --------------------------------------------------------------------------------
#                     WorkSpace           Stage           LocalRepo
# --------------------------------------------------------------------------------
# fruit.txt           Cherry(Black)       Cherry(Red)     Cherry
# version.txt         3.1                                 3
git status -s
MM fruit.txt
 M version.txt
 
# Note: 
#   - fruit.txt has different versions in WorkSpace, Stage and LocalRepo (latest commit)
#   - version.txt has WorkSpace version that is NOT staged
```

# View Content

```shell
# Get state 3vCherry

# Show WorkSpace file
# --------------------
pr -m -t fruit.txt version.txt
Apple             v1
Banana            v2
Cherry (Black)    v3.1

# Show Stage files
# ----------------
git show :fruit.txt
Apple
Banana
Cherry (Red)

git show :version.txt
v1
v2
v3.1

# Show Commit files
# -----------------
git show HEAD:fruit.txt
Apple
Banana
Cherry

git show HEAD:version.txt
v1
v2
v3

# List commits
git log --oneline
bea6802 (HEAD -> master, origin/master) Version 3
c62a511 Version 2
691f07d Version 1

# Show fruit.txt in 'Version 2' using commit Id
git show c17b18e:fruit.txt
Apple
Banana

# Show fruit.txt in 'Version1' relative to HEAD
git show HEAD~2:fruit.txt
Apple
```

# Compare

In this section, we look at comparing (diff -- difference) files across various trees. 

```shell
# We have following state
# --------------------------------------------------------------------------------
#                     WorkSpace           Stage           LocalRepo
# --------------------------------------------------------------------------------
# fruit.txt           Cherry(Black)       Cherry(Red)     Cherry
# version.txt         3.1                                 3
```

## List all files that have changed

```shell
git diff --name-only
fruit.txt
version.txt
```

## Workspace Vs Stage

```shell
# Note: By default the WorkSpce is compared with Stage
git diff fruit.txt
diff --git a/fruit.txt b/fruit.txt
index 9a0869b..e1e4565 100644
--- a/fruit.txt
+++ b/fruit.txt
@@ -1,3 +1,3 @@
 Apple
 Banana
-Cherry (Red)
+Cherry (Black)

# Note: Since no staged version exists, WorkSpace is compared with LocalRepo
git diff version.txt
diff --git a/version.txt b/version.txt
index 4b1d4d4..5a679c7 100644
--- a/version.txt
+++ b/version.txt
@@ -1,3 +1,3 @@
 v1
 v2
-v3
+v3.1
```

## WorkSpace Vs LocalRepo

```shell
git diff --cached fruit.txt
diff --git a/fruit.txt b/fruit.txt
index 797fd91..9a0869b 100644
--- a/fruit.txt
+++ b/fruit.txt
@@ -1,3 +1,3 @@
 Apple
 Banana
-Cherry
+Cherry (Red)
```

## Stage Vs LocalRepo

```shell
git diff --cached fruit.txt
diff --git a/fruit.txt b/fruit.txt
index 797fd91..9a0869b 100644
--- a/fruit.txt
+++ b/fruit.txt
@@ -1,3 +1,3 @@
 Apple
 Banana
-Cherry
+Cherry (Red)

```

## Commit Vs Commit

```shell
git log --oneline
bea6802 Version 3
c62a511 Version 2
691f07d Version 1

git diff 691f07d..bea6802 fruit.txt
diff --git a/fruit.txt b/fruit.txt
index 05ceae9..797fd91 100644
--- a/fruit.txt
+++ b/fruit.txt
@@ -1 +1,3 @@
 Apple
+Banana
+Cherry

```

# Overwrite WorkSpace Files

In this section, we shall overwrite the files in workspace with those staged or committed. During the course of development, we may want just throw away the current changes and replace with the one saved.

```shell
# We have following state
# --------------------------------------------------------------------------------
#                     WorkSpace           Stage           LocalRepo
# --------------------------------------------------------------------------------
# fruit.txt           Cherry(Black)       Cherry(Red)     Cherry
# version.txt         3.1                                 3
```

## Checkout files

The git checkout command is most frequently used in two contexts. One to checkout commits that is `git checkout <commitid` and the other to checkout files `git checkout <path>`. We are looking at the later format here.

By default  `git checkout <path>` shall **overwrite** the WorkSpace version of the file specified by the path. It is overwritten with a Staged version, if present, otherwise the version from `HEAD` commit is used.

```shell
# Current state
git status -s
MM fruit.txt
 M version.txt

# version.txt has no staged version
git checkout version.txt

# The WorkSpace version is overwritten from HEAD commit
git status -s
MM fruit.txt

cat version.txt
v1
v2
v3

# fruit.txt has a staged version
git checkout fruit.txt

# The WorkSpace version is overwritten with Staged version
git status -s
M  fruit.txt

cat fruit.txt
Apple
Banana
Cherry (Red)

# Staged version remains Staged
git show :fruit.txt
Apple
Banana
Cherry (Red)

```

# Undo

In this section we shall look at commands that shall undo typical actions.  In order to see the working of these commands, we shall recreate the 'Reusable state' that we setup earlier. The state is as follows.

```shell
# Get 'Reusable State'

# We have following state
# --------------------------------------------------------------------------------
#                     WorkSpace           Stage           HEAD
# --------------------------------------------------------------------------------
# fruit.txt           Cherry(Black)       Cherry(Red)     Cherry
# version.txt         3.1                                 3
git status -s
MM fruit.txt
 M version.txt

# Show fils in given commit
git log --oneline
bea6802 (HEAD -> master, origin/master) Version 3
c62a511 Version 2
691f07d Version 1
```

## Reset - Go back and rewrite history

Reset is a command that moves **both** `HEAD` and `branch`  (By default `master`) pointers to point to a given commit. Typically a previous commit (However, it can go to any commit).  

> Once you go back to a commit in history, the commits ahead will be **orphan** and are **marked for garbage collection**. 
>
> Garbage collection may only happen once in a month. So, we could go back and forth the commit tree using reset. However, orphaned commits are not guaranteed to exist.



|           | Soft Reset                               | Mixed Reset                              | Hard Reset                               |
| --------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Reset     | git reset --soft HEAD~1                  | git reset --hard HEAD~1                  | git reset --hard HEAD~1                  |
|           |                                          | Unstaged changes after reset:<br />M       fruit.txt<br />M       version.txt | HEAD is now at c62a511 Version 2         |
| Status    | git status -s                            | git status -s                            | git status -s                            |
|           | MM fruit.txt<br />MM  version.txt        | M fruit.txt<br /> M  version.txt         |                                          |
| WorkSpace | pr -m -t fruit.txt version.txt           | pr -m -t fruit.txt version.txt           | pr -m -t fruit.txt version.txt           |
|           | Apple             v1<br />Banana            v2<br />Cherry (Black)    v3.1 | Apple             v1<br />Banana            v2<br />Cherry (Black)    v3.1 | Apple             v1<br />Banana            v2 |
| Stage     | git show :fruit.txt<br />git show :version.txt | git show :fruit.txt<br />git show :version.txt | git show :fruit.txt<br />git show :version.txt |
|           | Apple             v1<br />Banana            v2<br />Cherry (Red)      v3 | Apple             v1<br />Banana            v2 | Apple             v1<br />Banana            v2 |
| HEAD      | git show HEAD:fruit.txt<br />git show HEAD:version.txt | git show HEAD:fruit.txt<br />git show HEAD:version.txt | git show HEAD:fruit.txt<br />git show HEAD:version.txt |
|           | Apple             v1<br />Banana            v2 | Apple             v1<br />Banana            v2 | Apple             v1<br />Banana            v2 |
| master    | git show master:fruit.txt<br />git show master:version.txt | git show master:fruit.txt<br />git show master:version.txt | git show master:fruit.txt<br />git show master:version.txt |
|           | Apple             v1<br />Banana            v2 | Apple             v1<br />Banana            v2 | Apple             v1<br />Banana            v2 |

The working of various resets is provided in the table. Typically a reset first moves the HEAD to a given commit and then (based on type of reset) saves files pointed by HEAD to Stage/WorkSpace. Only soft reset, as an exception, deals with saving files pointed by HEAD *before* moving HEAD.

| Soft Reset                               | Mixed Reset                              | Hard Reset                               |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Moves both `HEAD` and `branch` pointers to given commit. | Moves both `HEAD` and `branch` pointers to given commit. | Moves both `HEAD` and `branch` pointers to given commit. |
| Before moving the HEAD, files pointed by HEAD are Staged (if the file is not already staged). That is, an already Staged file shall NOT be overwritten.<br /><br />fruit.txt was staged and hence was not overwritten. <br /><br />version.txt did not have a staged version. The content of version.txt was staged. <br /><br />HEAD moved to HEAD-1 (previous commit) | After moving the HEAD, files pointed by HEAD are Staged. Any existing staged files are overwritten. | After moving the HEAD, files pointed by HEAD are Staged.<br /><br /> Any existing staged files are overwritten. |
| Does **not** overwrite files in WorkSpace | Does **not** overwrite files in WorkSpace | After moving the HEAD, files pointed by HEAD are copied to WorkSpace. <br /><br />Any existing WorkSpace files are overwritten. |



## Unstage (Cancel staging)

```shell
# Get 'Reusable State'

# We have following state
# --------------------------------------------------------------------------------
#                     WorkSpace           Stage           HEAD
# --------------------------------------------------------------------------------
# fruit.txt           Cherry(Black)       Cherry(Red)     Cherry
# version.txt         3.1                                 3
git status -s
MM fruit.txt
 M version.txt

# Unstage fruit.txt
git reset fruit.txt

# Note: The staged version is removed
git status -s
 M fruit.txt
 M version.txt

```



# Add Feature Using Branch

In GIT, features are added using branch. 

## Branch Basics

### The master - Local and remote branches

By default, we are already working on branch named `master`. This branch is created on local repository as well as remote repository. By default all commits are added to a branch named `master` in local repository. When commit looks great we push it to remote repository. 

The remote repository resides at a URL. In the example below the URL is `https://github.com/raghubs81/LearnGit`. The remote repository is by default named `origin` as shown below.

```shell
cat .git/config
...
...
[remote "origin"]
        url = https://github.com/raghubs81/LearnGit
...
...

ls .git/HEAD
.git/HEAD
```

### Show All Branches

```shell
git branch --all
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
```



**Summary**

| Branch        | Details                                  |
| ------------- | ---------------------------------------- |
| master        | Default branch named `master`, of local repository |
| origin        | Default name for the remote repository. See `.git/config` for the URL. |
| origin/master | Default branch named `master`, of the remote repository named `origin` |

**Details**

- The `*` indicates the current branch we are working on. In the above case, the branch name is `master`  on local repository.
- The name `remotes/origin/master` is the full name to reference the branch `master` on the remote repository `origin`.  A partial name `origin/master` shall refer to the same branch. The keyword `remotes` indicates we are referring to a remote branch. 
- Both local and remote repository has a pointer named `HEAD`. The `HEAD` pointer typically points to a branch. This can be inferred from `remotes/origin/HEAD -> origin/master`. The branch typically points to the latest commit. 

## Need for custom feature branch

Consider the following development life-cycle for a feature development.

### Scenario A:  Local commits

A feature is divided into several milestones. For each milestone, do the following.

- Several iterations of modifying and staging files until a milestone is achieved. 
- Commit all the files that make the milestone locally.

A feature with several milestones is ready. Now push all commits to the remote repository.

This approach has the several drawbacks. The biggest drawback being all commits during feature development are saved locally. This defeats one of the main purposes of version control -- Fail safe storage and distributed development. 

### Scenario B:  Remote commits

Similar to Scenario A, after a milestone is committed locally, push the commit to the remote repository.

This approach ensures that files are stored remotely and are safe. However if multiple developers are merging commits into the master. The master will be interleaved with commits from various feature developers. By the time a developer has completed his next commit, the remote master `origin/master` will be filled with commits from other developers. He may have to resolve conflicts with all these other commits before he could push his commit to `origin/master`.  This will make development chaotic. 

## Persist commits in feature branch

A branch is independent development line. 

- A developer shall create separate branch for each feature being developed. 
- The entire branch shall be pushed to the remote repository. 
- The developer shall work on the branch and all his commits shall reside on the branch, pushed to `origin/<branch_name>`.  This way all the files are safe.

Now, once the feature development is complete the branch `origin/<branch_name>` shall be merged with `origin/master`

### Create branch 

We now need to choose a point (commit) to create a branch. From this point onwards the branch is on its own -- Will have its own commits.

```shell
git log --oneline
bea6802 Version 3
c62a511 Version 2
691f07d Version 1

# Detach HEAD from 'master' to a chosen commit
git checkout 691f07d

# Create a branch from this commit
git branch frutify

# Switch to branch
git checkout frutify

# Note that at this commit had only 'Version 1'
pr -m -t fruit.txt version.txt
Apple                               v1

# Update fruit.txt to add 'Blueberry'. Note that master has its own 'Version 2' and 'Version 3'
pr -m -t fruit.txt version.txt
Apple                               v1
Blueberry                           v2

# Branch 'frutify'. Add commit
git commit --all -m 'Frutify Version 2'

# Branch 'frutify'. List commits
git log --oneline
a504b8d Frutify Version 2
691f07d Version 1
```

### Persist branch

In the previous section we created a branch `frutify` and added a commit to this branch. However, the branch is still local. The branch and the commit have to be pushed to remote in order to ensure commit is safe.

```shell
# Persist the branch
git push origin frutify

# List commits from remote frutify
git log origin/frutify --oneline
a504b8d Frutify Version 2
691f07d Version 1

# List commits from remote master
git log origin/master --oneline
bea6802 Version 3
c62a511 Version 2
691f07d Version 1
```

## Merge branch

In the previous section, we created and persisted a branch named `frutify`. We have tested our branch `frutify` and things look great. However, we need to merge our branch into `master` so that it is part of main stream and available to all.  However, many other developers could have already merged their commits to `master`. In fact, from previous section, we see that master has 'Version 2' and 'Version 3'. We had branched from 'Version 1'.

There are several ways of handling merge. 

1. Go ahead with merging `frutify` branch into `master` . Files with conflicts  (if any)  will be created in the WorkSpace. Resolve the conflicts. Add commits to local `master` and push to `origin/master`.
2. Pull all commits from `master` to `frutify` branch. Files with conflicts  (if any)  will be created in the WorkSpace. Resolve the conflicts.  Add commits to local branch `frutify` and push to `origin/frutify`. Now merge  `frutify` branch into `master` .

The first approach works if conflict resolution is simple. What if the changes in master has created huge conflicts which make require working on several milestone commits? We may want to abort merge. The second approach though longer ensures we are still working on our branch but with latest changes from master. We can consume changes in master from time to time, ensure our feature is working with the latest commit in the master and then merge.

### Pull commits into feature branch

```shell
# Jump to frutify
git checkout frutify

# Pull all changes from orign/master into the current branch 'frutify'
git pull origin master
From https://github.com/raghubs81/LearnGit
 * branch            master     -> FETCH_HEAD
Auto-merging version.txt
CONFLICT (content): Merge conflict in version.txt
Auto-merging fruit.txt
CONFLICT (content): Merge conflict in fruit.txt
Automatic merge failed; fix conflicts and then commit the result.

cat fruit.txt
Apple
<<<<<<< HEAD
Blueberry
=======
Banana
Cherry
>>>>>>> bea680236c2c7924a35e38752a0a881393da2fc4

cat version.txt
v1
v2
<<<<<<< HEAD
=======
v3
>>>>>>> bea680236c2c7924a35e38752a0a881393da2fc4

```

### Resolve and persist commits in feature branch

```shell
# Branch frutify. Conflicts are resolved in WorkSpace
pr -m -t fruit.txt version.txt
Apple                               v1
Banana,Blueberry                    v2
Cherry                              v3

# Branch frutify. Commit changes to local repository.
git commit --all -m "Integrate frutify"

# Local frutify branch after pulling master
git log --oneline
05989d3 Integrate frutify
a504b8d Frutify Version 2
bea6802 Version 3
c62a511 Version 2
691f07d Version 1

# Push all local commits in frutify to remote repo named 'origin'
git push origin frutify

# List commts in remote master branch
git log origin/master --oneline
bea6802 Version 3
c62a511 Version 2
691f07d Version 1

# List commts in remote frutify branch
git log origin/frutify --oneline
844fd24 Integrate frutify
a504b8d Frutify Version 2
bea6802 Version 3
c62a511 Version 2
691f07d Version 1
```

### Merge custom branch with master

Now that branch `frutify` is working fine with the latest commits in `master`. The branch is ready to be integrated with the master.

```shell
git checkout master

git log --oneline
bea6802 Version 3
c62a511 Version 2
691f07d Version 1

# Merge 'frutify' into the current branch (master)
git merge frutify

# The master on the local repository now has the 'frutify' merged into it.
# Note: This state is similar to creating two commits (a504b8d,844fd24) on master itself
git log --oneline
844fd24 Integrate frutify
a504b8d Frutify Version 2
bea6802 Version 3
c62a511 Version 2
691f07d Version 1

# Note that the merge was on local repo. The remote master has no commits from 'frutify'
git log origin/master --oneline
bea6802 Version 3
c62a511 Version 2
691f07d Version 1

```

### Persist merge

```shell
git checkout master

git push 

git log origin/master --oneline
844fd24 Integrate frutify
a504b8d Frutify Version 2
bea6802 Version 3
c62a511 Version 2
691f07d Version 1

```


