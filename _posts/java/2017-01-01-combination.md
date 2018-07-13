---
title: Lexicographical Sequence Of Combination  
category: java
typora-root-url: ../../
---


# Lexicographical Sequence Of Combination

  

## Simple example  

Lets take a simple example with 5 elements {A, B, C, D, E} and section of 3 elements. So, n=5 and r=3.  

### Sample Combination Tree

Total combinations - nCr = 5C3 = 5C2 = (5\*4)/(2\*1) = 10 combinations  

Seq#  

Combination  

Level one tree size  

Level two tree size  

1  

A B C  

Sub-tree with A  
  
A is chosen.  
4 elements are left  
2 needs to be chosen.  
  
4C2 = 6  

Sub-tree with A,B  
  
A,B are chosen  
3 elements are left  
1 needs to be chosen  
  
3C1 = 3  

2  

A B D  

3  

A B E  

4

A C D  

Sub-tree with A,C  
  
A,C are chosen  
  2 elements are left  
1 needs to be chosen  
  
2C1 = 2  

5

A C E  

6

A D E

Sub-tree with A,D  
  
A,D are chosen  
  1 element left  
1 needs to be chosen  
  
1C1 = 1

7  

B C D  

Sub-tree with B  
  
B is chosen.  
3 elements are left  
2 needs to be chosen  
  
3C2 = 3

Sub-tree with B,C  
  
B,C are chosen  
  2 element left  
1 needs to be chosen  
  
2C1 = 1

8  

B C E  

9  

B D E  

Sub-tree with B,D  
  
B,D are chosen  
  1 element left  
1 needs to be chosen  
  
1C1 = 1  

10  

C D E  

Sub-tree with C  
  
C is chosen  
2 elements are left  
2 needs to be chosen  
  
2C2 = 1  

Sub-tree with C,D  
  
C,D are chosen  
  1 element left  
1 needs to be chosen  
  
1C1 = 1  

## Generic Combination Tree

Seq#  

Chosen Elements  

Size of the sub tree

Latest  
chosen  
element  

Unavailable  
Elements  

1  

A  

n-1Cr-1

A  

-  

1.1  

A B  

n-2Cr-2  

B  

-  

1.2  

A C  

n-3Cr-2  

C  

B  

1.3

A D  

n-4Cr-2  

D  

B C  

2  

B  

n-2Cr-1  

B  

A  

2.1

B C  

n-3Cr-2  

C  

A  

2.1.1  

B C D  

n-4Cr-3  

D  

A  

2.1.1  

B C E  

n-5Cr-3  

E  

A D  

2.1.2  

B C F  

n-6Cr-3

F  

A D E  

2.2  

B D  

n-4Cr-2  

D  

A C  

2.2.1  

B D E  

n-5Cr-3  

E  

A C  

2.2.2  

B D F  

n-6Cr-3  

F  

A C E  

2.2.3  

B D G  

n-7Cr-3  

G  

A C E F  

3  

C  

n-3Cr-1  

C  

A B  

3.1  

C D  

n-4Cr-2  

D  

A B  

3.2  

C E  

n-5Cr-2  

E  

A B D  

### Terms

Size of sub tree - The number of combinations possible after choosing the given elements  
Latest chosen element - The largest element in the lexicographical sequence among the chosen elements.  
Unavailable elements - Elements that are not chosen and are less than the "Largest chosen element".  

### Relations between nodes of tree

The below relations are metioned by considering the current node's sub tree size as nCr.  

#### The sub-tree size of immediate sibling is n-1Cr  

*   Immediate sibling will have  to work with one lesser element (Since the element chosen earlier is not available later), hence the value of n reduces by 1.
*   Siblings will have to choose the same number of elements,  hence the value of r remains.
*   We can observe this pattern by comparing the following rows  
    

*   1, 2 and 3  
    
*   1.1, .1.2 and 1.3
*   2.1 and 2.2  
    

#### The sub-tree size of first child is n-1Cr-1

*   The first child choses an additional element than the parent reducing the value of n by 1
*   The first child choses an additional element than the parent hence reducing the value of r by 1 as well.
*   We can observe this pattern by comparing the following rows

*   1 and 1.1
*   2 and 2.1
*   2.1 and 2.1.1  
    

#### Parent node has n-r+1 children  

*   A parent node's first child will begin with the next element (after the latest chosen element of the parent). r-1 elements need to be chosen.  
    
*   A parent node's second child will begin with the second element. r-1 elements need to be chosen.  
    
*   A parent node's last child will have only r-1 elements left. (See Seq#10).
*   A parent node shall have n-(r-1) children. That is n-r+1  
    

## Derivations

### Relation between (n-1)! and n!

![Formula-1](https://blogs.oracle.com/brewing-tests/resource/algorithm/Combination01.jpg)  

### Relation between nCr and n-1Cr-1  

![Formula-2](https://blogs.oracle.com/brewing-tests/resource/algorithm/Combination02.jpg)  
  

### Relation between nCr and n-1Cr  

![Formula-3](https://blogs.oracle.com/brewing-tests/resource/algorithm/Combination03.jpg)  
  

## Application

Repetitive calculation of nCr could be expensive. Given n and r and current value of nCr  

The number of children is found using (n-r+1)  
The size of the sub tree of first child is obtained from parent using (r/n) * nCr  
The size of the sub tree of other children are obtained from previous sibling using ((n-r)/n) * nCr

Lets begin with a class that creates a Combiation object and stores a one-time calculated value of nCr. The value of nCr is also the total tree size.  
```java
public class Combination  
{  
   private int n = -1;  
  
   private int r = -1;  
  
   private int totalTreeSize = -1;  
  
   public Combination(int n, int r)  
   {  
      this.n = n;  
      this.r = r;  
      if (n <= 0 || r < 0 || n < r)  
         throw new IllegalArgumentException("Invalid Arguments. Ensure n >= r, n > 0 and r >= 0");  
      this.totalTreeSize = getValue ();  
   }  
  
   /**  
*  @return nCr - The value of the combination.  
    */  
   public int getValue()  
   {  
      int numerator = 1;  
      for (int i = 0; i < r; ++i)  
         numerator = numerator * (n - i);  
  
      int denominator = 1;  
      for (int i = 0; i < r; ++i)  
         denominator = denominator * (r - i);  
  
      return numerator / denominator;  
   }  
}
```
We need to get the lexicographical sequence for a given sequence number.  
  
```java
public class Combination  
{  
   ...  
  
   /**  
* Lexicographical sequence for the sequence number.   
*    
*  @param seqNum The sequence number of the combination.  
*  @return An array of index providing the lexicographical sequence for <b>seqNum</b>.  
    */  
   public int[] getIndicies(int seqNum)  
   {  
      if (seqNum < 1 || seqNum > totalTreeSize)  
         throw new IllegalArgumentException("Count should be within limits 1-" \+ totalTreeSize + "");  
  
      List<Integer\> listIndex = new ArrayList<Integer>();  
      for (int i = 0; i < n; ++i)  
         listIndex.add(i);  
  
      int currN = n;  
      int currR = r;  
      int currChildTreeSize = totalTreeSize;  
      int index[] = new int[r], currIndex = 0;  
      Arrays.fill(index, -1);  
        
 // r indexes need to filled and stored in an array  
      while (currIndex < index.length)  
      {  
         // Get the child count for this parent node.   
         int childCount = currN - currR + 1;  
           
 // Iterate over each child //   - Calculate TreeSize using formula    
         //       - First child =  (r/n) * nCr.   
         //       - Other child = ((n-r)/r) * nCr  
         for (int childIndex = 0; childIndex < childCount; ++childIndex)  
         {  
            if (childIndex == 0)  
            {  
               // First child gets its tree size from parent.  
               currChildTreeSize = (int) (((double) currR / currN) * currChildTreeSize);  
               // The value of r is reduced by 1  
               currR--;  
            }  
            else  
            {  
               // Subsequent children get their tree size from its previous sibling.  
               currChildTreeSize = (int) (((double) (currN - currR) / currN) * currChildTreeSize);  
            }              
              
            if (seqNum <= currChildTreeSize)  
            {  
               // Choose the child. Going one level deeper into the tree  
               index[currIndex++] = listIndex.remove(0);  
                 
 // Getting into the sub tree reduces N by 1  
               currN--;  
               break;  
            }  
              
            // Moving on to the next child.   
            listIndex.remove(0);  
            currN--;  
              
 // Remove the current tree size from the sequence number.   
            seqNum -= currChildTreeSize;  
         }  
      }  
      return index;  
   }  
  
}
```
  
Print all lexicographical sequences.  
```java
public class Combination  
{  
   ...  
  
   public static void main(String arg[])  
   {  
      Combination c = new Combination(7, 3);  
      int nCr = c.getValue();  
      for (int i = 1; i <= nCr; ++i)  
         System.out.println(i + ") " \+ Arrays.toString(c.getIndicies(i)));  
   }  
}
```
```java
Output:  
1) [0, 1, 2]  
2) [0, 1, 3]  
3) [0, 1, 4]  
4) [0, 2, 3]  
5) [0, 2, 4]  
6) [0, 3, 4]  
7) [1, 2, 3]  
8) [1, 2, 4]  
9) [1, 3, 4]  
10) [2, 3, 4]  
  

```