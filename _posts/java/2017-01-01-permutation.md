---
title: Lexicographical Sequence Of Permutation  
category: java
typora-root-url: ../../
---


# Lexicographical Sequence Of Permutation

  
  

## Simple Example  

Lets take a simple example with 5 elements {A, B, C, D, E} and section of 3 elements. So, n=5 and r=3.  
Total permutations = nPr = 5P3 = 5\*4\*3 = 60 permutations.  
  

#  

Permutation  

Level one tree size

Permutation  

Level two tree size

1-12  

A B C  
  
A B D  
  
A B E  
  
A C B  
  
A C D  
  
A C E  
  
A D B  
  
A D C  
  
A D E  
  
A E B  
  
A E C  
  
A E D  

Sub-tree with A  
  
A is chosen.  
4 elements are left  
2 needs to be chosen.  
  
4P2 = 12

B C  
  
B D  
  
B E

Sub-tree with A,B  
  
A,B are chosen  
3 elements are left  
1 needs to be chosen  
  
3P1 = 3

C B  
  
C D  
  
C E

Sub-tree with A,C  
  
A,C are chosen  
3 elements are left  
1 needs to be chosen  
  
3P1 = 3

D B  
  
D C  
  
D E

Sub-tree with A,D  
  
A,D are chosen  
3 elements are left  
1 needs to be chosen  
  
3P1 = 3

E B  
  
E C  
  
E D

Sub-tree with A,E  
  
A,E are chosen  
3 elements are left  
1 needs to be chosen  
  
3P1 = 3

13-24  

B A C  
  
B A D  
  
B A E  
  
B C A  
  
B C D  
  
B C E  
  
B D A  
  
B D C  
  
B D E  
  
B E A  
  
B E C  
  
 B E D   

Sub-tree with B  
  
  B is chosen.  
4 elements are left  
2 needs to be chosen.  
  
4P2 = 12

A C  
  
A D  
  
A E

Sub-tree with B,A  
  
B,A are chosen  
3 elements are left  
1 needs to be chosen  
  
3P1 = 3

C A  
  
C B  
  
C D  

Sub-tree with B,C  
  
B,C are chosen  
3 elements are left  
1 needs to be chosen  
  
3P1 = 3

D A  
  
D C  
  
D E

Sub-tree with B,D  
  
B,D are chosen  
3 elements are left  
1 needs to be chosen  
  
3P1 = 3

E A  
  
E C  
  
E D

Sub-tree with B,E  
  
B,E are chosen  
3 elements are left  
1 needs to be chosen  
  
3P1 = 3

25-36  

C A B  
...  
C E D  

Sub-tree with C  
  
  C is chosen.  
4 elements are left  
2 needs to be chosen.  
  
4P2 = 12

...  

...  

37-48  

D A B  
...  
D E C  

Sub-tree with D  
  
  D is chosen.  
4 elements are left  
2 needs to be chosen.  
  
4P2 = 12

...  

...  

49-60  

E A B  
..  
E D C  

Sub-tree with E  
  
  E is chosen.  
4 elements are left  
2 needs to be chosen.  
  
4P2 = 12

...  

...  

  

## Derivations

### Relation between nPr and n-1Pr-1  

```java
nPr = n!/(n-r)!  
  
(n-1)P(r-1) = (n-1)! / (n-1-r+1)!   
            = (n-1)! / (n-r)!  
            = (1/n) * n!/(n-r)!  
            = (1/n) * nPr  

```
Consider the above example,  

*   Total number of permutations are 5P3 = 60.
*   With N as 5, (1/n *nPr) = 60/5 = 12. There are 5 subtrees each with subtree size 12.
*   Each sub tree has a root with with it starts.  
    

*   For example, seq 1-12 consists of a subtree with A as root
*   For example, seq 13-24 consists of a subtree with B as root

*   For next level, with N as 4, (1/n *nPr) = 12/4 = 3. There are 4 subtrees each with a subtree size of 3.  
    

  

## Application

Repetitive calculation of nPr could be expensive. Given n and r and current value of nPr.  

The number of iterations is  r. This is because a sequence of r elements have to be formed.  
The size of the sub tree of first child is obtained from parent using (1/n) * nPr  

Lets begin with a class that creates a Permutation object and stores a one-time calculated value of nCr. The value of nCr is also the total tree size.
```java
public class Permutation  
{  
   private int n = -1;  
     
   private int r = -1;  
     
   private int nPr = -1;  
     
   public Permutation (int n, int r)  
   {  
      this.n = n;  
      this.r = r;  
      if (n <= 0 || r < 0 || n < r)  
         throw new IllegalArgumentException("Invalid Arguments. Ensure n >= r, n > 0 and r >= 0");  
        
      this.nPr = Permutation.nPr (n, r);  
   }  
     
   public static void main (String arg[])  
   {  
      int n = 5, r = 3;  
      Permutation p = new Permutation(n, r);  
      for (int i = 1; i <= Permutation.nPr(n, r); ++i)  
         System.out.println(Arrays.toString(p.getIndicies(i)));  
   }  
     
   public static int nPr (int n, int r)  
   {  
      int product = 1;  
      for (int i = 0; i < r; ++i)  
         product = product * (n - i);  
      return product;  
   }  
}
```
We need to get the lexicographical sequence for a given sequence number.
```java
public class Permutation  
{  
   ...  
  
   public int[] getIndicies (int seqNum)  
   {  
      if (seqNum < 1 || seqNum > nPr)  
         throw new IllegalArgumentException("Sequence number should be within limits 1-" \+ nPr + "");  
        
      List<Integer\> listIndex = new ArrayList<> ();  
      for (int i = 0; i < n; ++i)  
         listIndex.add (i);  
  
      int seq[] = new int [r];  
      int subTreeSize = nPr;        
      --seqNum;  
      for (int i = 0; i < seq.length; ++i)  
      {  
         // There are currN trees, each of equal size, that is equal to subTreeSize  
         int currN = n - i;  
  
         // The size of a subTree  is the number of paths (from top to leaf) in the subTree   
         // A subTree at ith index has root element as listIndex(i)   
         subTreeSize = subTreeSize / currN;  
           
         // seqNum/subTreeSize gives the index of the subTree where seqNum fits.  
         // Thus, (seqNum/subTreeSize) tells us which subTree among currN subtrees has to be chosen.  
         // Element at index (seqNum/subTreeSize) is the root element of the subtree.  
         // As we know the root element, remove it and add it to the lexicographical sequence.   
         seq[i] = listIndex.remove (seqNum / subTreeSize);  
           
         // We found the tree and its root element. We now need to go one level deeper.  
         seqNum = seqNum % subTreeSize;  
      }  
      return seq;  
   }  
}
```
Print all lexicographical sequences.
```java
public class Permutation  
{  
   ...  
  
   public static void main (String arg[])  
   {  
      int n = 5, r = 3;  
      Permutation p = new Permutation(n, r);  
      for (int i = 1; i <= Permutation.nPr(n, r); ++i)  
         System.out.println(String.format("%02d) %s", i, Arrays.toString(p.getIndicies(i))));  
   }  
}
```
  
```java
Output:  
01) [0, 1, 2]  
02) [0, 1, 3]  
03) [0, 1, 4]  
04) [0, 2, 1]  
05) [0, 2, 3]  
06) [0, 2, 4]  
07) [0, 3, 1]  
08) [0, 3, 2]  
09) [0, 3, 4]  
10) [0, 4, 1]  
11) [0, 4, 2]  
12) [0, 4, 3]  
  
...  
...  
  
58) [4, 3, 0]  
59) [4, 3, 1]  
60) [4, 3, 2]  
  

```
  
  
afds