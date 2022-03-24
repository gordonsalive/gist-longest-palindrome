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
// This time I will use symetry to try to avoid effort - longest possible palindrome spans 
//   whole length and mirrors along the middle.  If that isn't a palindrom, then reduce length by 1 giving
//   two sections and I can repeat the mirror process, and again if not them reduce length by 1 giving 3 sections
//   and so on.
// While checking mirrors I can store longest palindrome - if I have a longer one than I've found so far
//   replace it, if I've found one the same length but starting earlier, replace it.
//   If my section lengths get smaller than my current longest palindrome, stop there and report.
// There is another efficiency: when I get to 3 sections, the middle one is the same as my original 1 section, but with
//   a character taken off each side - there is not additional benefit to checking one.  This happens again when I have
//   4 sections, since the middle two are the same process and the larger 2 when I only 2 sections.  So, I only need to
//   the sections on either extreme (because I'm collecting the longest palindrome as I go, so no need to repeat).

const checkMirror = (letters, bestPalindrome, sectionStart, sectionEnd, sectionLength) => {
    // if length is odd then mirror around middle letter else start mirror with middle two letters
    for (let x = Math.floor(sectionLength/2) -1; x >= 0; x--) {
        const mirrorLeft = sectionStart + x;
        const mirrorRight = sectionEnd - x;
        const palindromeLength = mirrorRight - mirrorLeft +1;
        if (letters[mirrorLeft] === letters[mirrorRight]) {
            // is this my best palindrome yet?
            if ((palindromeLength > bestPalindrome.length) ||
                ((palindromeLength === bestPalindrome.length) && (mirrorLeft < bestPalindrome.start))) {
                bestPalindrome = {
                    start: mirrorLeft,
                    length: palindromeLength,
                    palindrome: letters.slice(mirrorLeft, mirrorRight+1)
                }
            } else {
                // keep looking through this section
            }
        } else {
            // no point continuing, it's not a palindrome
            break;
        }
    }
    return bestPalindrome;
}

const mainLoop = (letters, bestPalindrome, sectionStart, sectionEnd) => {
    // the problem with doing it recursively like this is it goes all the way down the left side, 
    //   then looks down the right side
    const sectionLength = sectionEnd - sectionStart + 1;
    if ((sectionLength > bestPalindrome.length) ||
        ((sectionLength === bestPalindrome.length) && (sectionStart < bestPalindrome.start))) {
        
        bestPalindrome = checkMirror(letters, bestPalindrome, sectionStart, sectionEnd, sectionLength);
        // now try the sections shorter than this one, but only the sections on either end
        //   (since these are the only ones based around new mirror points we haven't already looked at)
        if (sectionStart === 0) {
            bestPalindrome = mainLoop(letters, bestPalindrome, 0, sectionEnd-1);
        }
        if (sectionEnd === letters.length -1){
            bestPalindrome = mainLoop(letters, bestPalindrome, sectionStart+1, letters.length -1);
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
        const result = mainLoop(letters, bestPalindrome, 0, letterLength-1);
        console.log("result="+JSON.stringify(result));
    }
);