---
title: "Why and How: Markdowns"
date: "2023-07-10T22:12:03.284Z"
description: "Need a introduction to Big O Notation, then read this and I'll work thru some"
featuredImage: "bigOchart.png"
---

This blog is meant for people who are new to Big-O Notation or people who need a refresher on what Big-O Notation is. If you don't need this this [bigo cheatsheet](https://www.bigocheatsheet.com/), might be more up your alley. It covers common data structure operations and array sorting algorithms.

![bigOChar](./bigOchart.png)


# What is Big O Notation

Big O notation is a method for programmers to tell how fast a algorithm is. This method tracks the operations with respect to the input for the the algorithm. It not a way to measure the runtime a algorithm, this is meant to account for differnt clock speeds on CPUs.

In other words Big O notation just counts the steps it takes to get the solution.

```c
#include <stdio.h>

int linearSearch(int arr[], int arrSize, int value){
    
    // loop thru everyElement to find the index value 
    //  if it exists in the array
    for(int i = 0; i < arrSize; i++){
        if(arr[i] == value){
            return i;
        }
    }
    
    // return -1 if not found
    return -1;
}


int main() {
    int arr[10] = {0,1,2,3,4,5,6,7,8,9};
    int found = linearSearch(arr,10, 9);
    
    printf("Found at %d",found);

    return 0;
}
```

Looking at the above example then we have a linear search, it just looks at all items in the array one by one until it finds the value it is looking for. When calcualting the Big O notation it is important to do so for the worst case of the algorithm. So in this case the Big O would be O(n), since for a array of size N it would need to traverse the entire array until it finds the value it's looking for. 

