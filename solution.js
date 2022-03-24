// Problem: find the index of the start of the longest palindrome in a string
const testStrings = [
    "abc",
    "aba",
    "abba",
    "zabax",
    "zabbax",
    "zxaba",
    "zxabba",
    "abazx",
    "abbazx",
    "abcbdefhabcdefghgfedcbabcg",
    "abcbdefhabcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcbabcg\
-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz\
-zzzzzzzz1zzzzzzzzzzzzzzzzzzzzzz8zzzzzzz1zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz\
-zzzzz1zzzzzzzzzzzzzzzzzzzzzzzzzzzzz7zzzzzzzzzzz1zzzzzzzzzzzzzzzzzzzzzzzzzzzzz\
-zzzzzzz1zzzzzzzzzzzzzzzzzzzzzzzzzzz6zzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzzzzzzzzzzz\
-zzzzzzzzzz1zzzzzzzzzzzzzzzzzzzzzzzz5zzzzzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzzzzzzzz\
-zzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzzzzz41zzzzzzzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzzzzz\
-zzzzzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzz3zzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzzzz\
-zzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzzzz2zzzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzzzzz\
-zzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzzz11zzzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzzzz\
-zzzzzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzz9zzzzzzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzz\
-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz1zzzz8zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzz\
-zzzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzz7zzzzzzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzz\
-zzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzzzz6zzzzzzzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzz\
-zzzzzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzz5zzzzzzzzzzzzzzzzzzzzzzzz1zzzzzzzzzzzzzzzz\
-zzzzzzzzzzzzz1zzzzzzzzzzzzzzzzzzzzz41zzzzzzzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzzzzz\
-zzzzzzzzz1zzzzzzzzzzzzzzzzzzzzzzzzz3zzzzzzzzzzzzzzzz1zzzzzzzzzzzzzzzzzzzzzzzz\
-zzzzz1zzzzzzzzzzzzzzzzzzzzzzzzzzzzz2zzzzzzzzzz1zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz\
-zz1zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz11zzz1zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
];

// principles for the solution:
// I know I want the longest palindrom, once I've found it I can stop
//   so I should start with longest sections and work down
// I'd like to do as little work as possible, so I don't want to 
//   calculate a whole tree of data first, then look for solutions,
//   I'd prefer to build up the tree of data as I go.
// I don't want to repeat myself, so storing results in a HashMap
//   will allow me to quickly look them up and only calculate them if missing
// No need to store if a section is a palindrome, since we are workng from largest 
//   to smallest and we will stop as soon as we find what we are looking for.
// I think there is an efficient solution based around sums of letter values...
//   the efficiency coming from not comparing sides which have different sums
//   also we can calculate new sums as we go by taking one character away (although
//   the initial sum of whole string still needs to be calculated but we can store some
//   of the results of this work as we go - seems wasteful to throw it away).


const makeSectionKey = (sectionStart, sectionEnd) => "" + sectionStart + "-" + sectionEnd;

const generateInitialSums = (letters, sums) => {
    const lettersLength = letters.length;
    const maxIndex = lettersLength -1;
    const fullStringKey = makeSectionKey(0, maxIndex);
    if (!sums[fullStringKey]){
        //climb up left side...
        let leftSum = 0
        for (let x = 0; x < (lettersLength / 2); x++) {
            leftSum += letters.charCodeAt(x);
            const sectionKey = makeSectionKey(0, x);
            sums[sectionKey] = leftSum;
        };
        //climb the right side...
        let rightSum = 0;
        for (let x = maxIndex; x >= Math.floor(lettersLength / 2); x--) {
            rightSum += letters.charCodeAt(x);
            const sectionKey = makeSectionKey(x, maxIndex);
            sums[sectionKey] = rightSum;
        }
    }
}

const lookupSum = (sectionStart, sectionEnd, letters, sums, maxIndex) => {
    // we're either in one half or the other, move rapidly toward nearest outer edge
    // because of the initialisation I will always have vallues for [0,?]  and [?,maxIndex]
    const sectionKey = makeSectionKey(sectionStart, sectionEnd);
    if (!sums[sectionKey]) {
        // oh dear, need to calculate it from a parent, move toward nearest edge...
        if (sectionEnd < maxIndex/2) {
            const parentKey = makeSectionKey(sectionStart -1, sectionEnd);
            const childSum = lookupSum(sectionStart -1, sectionEnd, letters, sums, maxIndex) - letters.charCodeAt(sectionStart -1);
            sums[sectionKey] = childSum;
        } else if (sectionStart > Math.floor(maxIndex/2)) {
            const childSum = lookupSum(sectionStart, sectionEnd +1, letters, sums, maxIndex) - letters.charCodeAt(sectionEnd +1);
            sums[sectionKey] = childSum;
        } else {
            // it spans halfs that I originally initialised, TODO
            sums[sectionKey] = letters.slice(sectionStart, sectionEnd+1).split('').reduce(
                (accVal, thisChar, idx) => {
                    const thisSum = accVal + thisChar.charCodeAt(0);
                    const thisSectionKey = makeSectionKey(sectionStart, sectionStart+idx);
                    if (!sums[thisSectionKey]) {
                        sums[thisSectionKey] = thisSum;
                    }
                    return thisSum;
                }, 0);
            generateInitialSums(letters, sums);
        }
    }
    return sums[sectionKey];
}

const isPalendrome = (sectionStart, sectionEnd, letters, sums, maxIndex) => {
    const sectionLength = sectionEnd - sectionStart +1;
    const halfSectionLengthTrunc = Math.floor(sectionLength / 2);
    // does the lhs match the rhs, working cradually away from the middle
    for (let x = halfSectionLengthTrunc -1; x >= 0; x--) {
        const leftSideEnd = sectionStart + x;
        const rightSideStart = sectionEnd - x;
        const lhsSum = lookupSum(sectionStart, leftSideEnd, letters, sums, maxIndex);
        const rhsSum = lookupSum(rightSideStart, sectionEnd, letters, sums, maxIndex);
        if (lhsSum !== rhsSum) {
            return false;
        }
    }
    return true;
}

const mainLoop = (letters, lettersLength, offset, sums, maxIndex) => {
    // starting with longest section, and then each section 1 smaller,
    //   and so on, do we have results for it yet?  If not calculate sum and store.
    //   Then check is it a palindrome (diff function, using sums to help build)
    const noOfSections = offset +1;
    if (noOfSections === lettersLength) {
        // at the point of single letters, solution is the first letter
        return {
            index: 0,
            length: 1,
            string: letters[0]
        }
    }
    
    // can spread keys of new Array to get range array and then convert to sections...
    // const indexes = [...Array(noOfSections).keys()];
    // ...or I can do it all in one go, mapping over new array, ignoring values and just using keys
    let result;
    [...Array(noOfSections)].find((_, step) => {
        const stepBack = offset - step;
        const sectionStart = step;
        const sectionEnd = maxIndex - stepBack;
        // is this section a palindrome?
        if (isPalendrome(sectionStart, sectionEnd, letters, sums, maxIndex)) {
            result = {
                index: sectionStart,
                length: sectionEnd - sectionStart + 1,
                string: letters.slice(sectionStart, sectionEnd +1)
            }
            return true;
        } else {
            return false;
        }
    });
    if (result) {
        return result;
    }
    // if we haven't stopped yet, then keep going...
    return mainLoop(letters, lettersLength, offset+1, sums, maxIndex);
}

// attempt to get topmost sum (only happens once)
testStrings.forEach((letters) => {
        const lettersLength = letters.length;
        const maxIndex = lettersLength -1;
        const sums = {};//we'll use object properties to get a HashMap of sections sums

        console.log('\nletters='+letters);
        generateInitialSums(letters, sums);
        const result = mainLoop(letters, lettersLength, 0, sums, maxIndex);
        console.log("result="+JSON.stringify(result));
    }
);