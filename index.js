const getCommandLineArguments = () => {
    return process.argv.slice(2)
}

const logErrorAndExit = (errorMessage) => {
    console.error(errorMessage)
    process.exit(1)
}

const validateArgumentsReceived = (arguments) => {
    if (arguments.length == 2) return 
    if (arguments.length > 2) {
        logErrorAndExit("Too many arguments. Please enter only 2 names.")
    }
    if (arguments.length < 2) {
        logErrorAndExit("Too few arguments. Please enter 2 names.")
    }
}

const convertArgumentsToLowerCase = (arguments) => {
    return arguments.map(argument => argument.toLowerCase())
}

const validateArgumentsOnlyAlphabetic = (arguments) => {
    var alphabetRegex = /^[A-Za-z]+$/;
    arguments.forEach(argument => {
        if (!argument.match(alphabetRegex)) {
            console.error('Error: Only alphabet characters allowed in the names.')
            process.exit(1)
        }
    })   
}

const constructBaseSentence = (arguments) => {
    return `${arguments[0]} matches ${arguments[1]}`
}

// Remove whitespace from sentence, as this will affect the calculation
const removeAllWhiteSpaces = (sentence) => {
    const splitWords = sentence.split(' ')
    return splitWords.join('')
}

// Use recursion to complete duplicate char count
const getDuplicateCharCounts = (sentence, letterCounts) => {
    if (!letterCounts) letterCounts = []
    
    // remove whitespaces
    sentence = removeAllWhiteSpaces(sentence)

    let sentenceChars = sentence.split('')

    let count = 0
    let letter = sentenceChars[0]
    sentenceChars.forEach(char => {
        char === letter ? count++ : count;
    })

    letterCounts.push(count)
    sentenceChars = sentenceChars.filter(char => char !== letter)
    sentence = sentenceChars.join('')

    if (sentenceChars.length)
        getDuplicateCharCounts(sentence, letterCounts)
    
    return letterCounts
}

const transformToSingleDigits = (arrayOfNumbers) => {
    return arrayOfNumbers.join('').split('').map(stringNumber => parseInt(stringNumber))
}

const computeMatchPercentage = (letterCounts, computedResult) => {
    if (!computedResult) computedResult = []
    // Adjust element number to array format if more than 1 element, else 0 if only one element left
    const finalLetterElementNumber = letterCounts.length ? letterCounts.length - 1 : 0
    const countSum = finalLetterElementNumber ? letterCounts[0] + letterCounts[finalLetterElementNumber] : letterCounts[finalLetterElementNumber]
    computedResult.push(countSum)

    letterCounts.shift()
    letterCounts.pop()

    if (letterCounts.length)
        computeMatchPercentage(letterCounts, computedResult)

    return transformToSingleDigits(computedResult)
}

const calculateMatchPercentage = (letterCounts) => {
    let matchPercentage = 0
    while (true) {
        letterCounts = computeMatchPercentage(letterCounts)
        matchPercentage = parseInt(letterCounts.join(''))
        if (matchPercentage <= 100) break
    }

    return matchPercentage
}

const generateOutputMessage = (matchPercentage, baseSentence) => {
    const greatMatchSuffix = matchPercentage > 80 ? `, good match` : ''
    return `${baseSentence} ${matchPercentage}%${greatMatchSuffix}`
}

// ***********************
// Program execution
// ***********************
const commandlineArguments = getCommandLineArguments()
console.log(commandlineArguments)

validateArgumentsReceived(commandlineArguments)

// Connvert to lowercase to so no unicode differences between character cases
const lowerCasedArguments = convertArgumentsToLowerCase(commandlineArguments)

validateArgumentsOnlyAlphabetic(lowerCasedArguments)

const baseSentence = constructBaseSentence(lowerCasedArguments)

let letterCounts = getDuplicateCharCounts(baseSentence)

let matchPercentage = calculateMatchPercentage(letterCounts)

const outputMessage = generateOutputMessage(matchPercentage, constructBaseSentence(commandlineArguments))

console.log(outputMessage)