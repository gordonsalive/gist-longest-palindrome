// Problem: find the index of the start of the longest palindrome in a string
const testStrings = [
    "aba",
    "abba",
    "zabax",
    "zabbax",
    "zxaba",
    "zxabba",
    "abazx",
    "abbazx",
    "zababccc",
    "zababcbc",
    "abacbbc",
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
// This time I'm going to brute force it.  I want to solve this quickly and with fewlines of code, I don't care how 
//   efficient it is.
// A palindrome is the same in both directions, so simplest test is reverse string and compare.
// I want the longest palindrom nearest the start, starting on the left look for palindromes of reducing length,
//   never look for a palindrome of less or equal length than I lready have.
// I was able to write this quite quickly, but it much slower for longer strings.

const isPalindrom = (section) => {
    return section === section.split('').reverse().join('');
}

const mainLoop = (letters, bestPalindrome) => {
    // starting on the left, simply loop through
    for (let start = 0; start < letters.length; start++) {
        // for each decreasing length greater than best so far, is it a palindrome?
        for (let end = letters.length -1; end > start; end--) {
            if (end - start +1 > bestPalindrome.length) {
                const section = letters.slice(start, end+1);
                if (isPalindrom(section)) {
                    bestPalindrome = {
                        start: start,
                        length: end - start + 1,
                        palindrome: section
                    };
                }
            }
        }
    }

    return bestPalindrome;
}

// attempt to get topmost sum (only happens once)
testStrings.forEach((letters) => {
        console.log('\nletters='+letters);

        const letterLength = letters.length;
        const bestPalindrome = {
            start: 0,
            length: 1,
            palindrome: letters[0]
        };
        const result = mainLoop(letters, bestPalindrome);
        console.log("result="+JSON.stringify(result));
    }
);