/**
 * Prints all combinations of sizes r in array of size n
 * @param {Array} arr A row
 * @param {Array} sizes Array of combination sizes
 * @returns {Array}
 */
function printCombination(arr, sizes) {
    const results = [];
    const n = arr.length;
    sizes.forEach((size) => {
        combinationUtil(arr, results, [], 0, n - 1, 0, size);
    });
    return results;
}

/**
 * Generates a combination from input array of a given size
 * @param {Array} arr Input Array
 * @param {Array} results Output Array
 * @param {Array} acc Accumulator(temp store) for current combination
 * @param {Number} start Start index in arr[]
 * @param {Number} end End index in arr[]
 * @param {Number} index Current index in acc[]
 * @param {Number} r Size of a combination to be printed
 */
function combinationUtil(arr, results, acc, start, end, index, r) {
    if (index === r) {
        results.push(acc.slice(0));
        return;
    }
    let i = start;
    while(i <= end && (end - i + 1 >= r - index)) {
        acc[index] = arr[i];
        combinationUtil(arr, results, acc, i + 1, end, index + 1, r);
        i += 1;
    }
}

exports.handler = async (event) => {
    const { arr, sizes } = event;
    return printCombination(arr, sizes);
}