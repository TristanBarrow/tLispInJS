
const colog = require('colog');

module.exports = (code) => {
    code = code.split('\n');
    code = code.join(' ');

    let strings = {};
    let stringsIndex = 0;
    while (code.match(/"[^"]+"/) !== null) {
        let matchObj = code.match(/"[^"]+"/);

        code = code.replace(matchObj[0], `<string:${stringsIndex}>`)
        strings = {
            ...strings,
            [`string_${stringsIndex}`]:matchObj[0]
        }
        stringsIndex++;
    }

    //console.log(code);
    for (let i = code.length; i >= 0; i--) {
        if (code[i] === '(') {
           code = code.substr(0, i+1) + " " + code.substr(i+1)
        } else if (code[i] === ')') {
           code = code.substr(0, i) + " " + code.substr(i)
        } else if (code[i] === '>') {
            if (code[i+1] !== ' ') {
                code = code.substr(0, i+1) + " " + code.substr(i+1)
            }
        } else if (code[i] === '<') {
            if (code[i-1] !== ' ') {
                code = code.substr(0, i) + " " + code.substr(i)
            }
        }

    }

    code = code.trim(); 

    let array = code.split(' ');
    //console.log(array);

    let numbers = {};
    let numbersIndex = 0;
    for (i = 0; i < array.length; i++) {
        if (array[i].match(/\)\(/)) {
            array.splice(i, 1, ")", "(");
        } else if (array[i].match(/^\d+$|^\d+\.\d+$/)) {
            numbers = {
                ...numbers,
                [`number_${numbersIndex}`]: parseFloat(array[i])
            }
            array.splice(i, 1, `<number:${numbersIndex}>`)
            numbersIndex++;
        } else if (array[i].match(/^[a-zA-Z_][-_a-zA-Z0-9]*$/) ||
                   array[i].charAt(0) === '+' ||
                   array[i].charAt(0) === '-' ||
                   array[i].charAt(0) === '*' ||
                   array[i].charAt(0) === '/' ||
                   array[i].charAt(0) === '%' ||
                   array[i].charAt(0) === '!' ||
                   array[i].charAt(0) === '&' ||
                   array[i].charAt(0) === '|' ||
                   array[i].charAt(0) === '~' ||
                   array[i].charAt(0) === '=') {
            if (array[i-1] === '(') {
                array.splice(i,1,`<func:${array[i]}>`)
            } else {
                if (array[i] === array[i].toUpperCase()) {
                    array.splice(i,1,`<CONST:${array[i]}>`)
                } else {
                    array.splice(i,1,`<var:${array[i]}>`)
                }
                
            } 
        }
    }
    while (array.indexOf('') !== -1) {
        array.splice(array.indexOf(''), 1);
    }
    
    // Check for invalid syntax
    let char;
    // loop through every thing
    for (i = 0; i < array.length; i++) {
        //  for readability
        char = array[i].charAt(0);
        // if the first char is not one of these  '<' '(' ')' than something went wrong
        if (char !== '(' && char !== ')' && char !== '<') {
            colog.log(colog.color('Invalid Syntax:','red') +
                      colog.color(` ${array[i]}  `, 'white'));
        }
    }

    return {
        tokens: array.join(' '),
        strings,
        numbers
    }
}




