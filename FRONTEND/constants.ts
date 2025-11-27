
export const INITIAL_PYTHON_CODE = `def binary_search(arr, target):
    left = 0
    right = len(arr)
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

# Test the function (this causes an IndexError due to off-by-one in initialization)
my_list = [1, 3, 5, 7, 9]
print(binary_search(my_list, 9))
`;
