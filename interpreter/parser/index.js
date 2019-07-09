
const extractExp = (prog, expIndex) => {
    let { tokens, expressions } = prog;
    let openIndex = 0;

    for (let i = 0; i < tokens.length; i++) {
        if (tokens.charAt(i) === '(') {
            openIndex = i;
        } else if (tokens.charAt(i) === ')') {
            let exp = tokens.slice(openIndex, i + 1);
            let isParsed = false
            if (exp === tokens) {
                isParsed = true;
            }
                
            prog = {
                ...prog,
                tokens: tokens.replace(exp, `<expression:${expIndex}>`),
                expressions: {
                    ...expressions,
                    [`expression_${expIndex}`]: exp
                },
                isParsed
            }
            return prog;
        }
    }
}

module.exports = (prog) => {
    prog = {
        ...prog,
        expressions: {},
        isParsed: false
    }
    let expIndex = 0;
    while (!prog.isParsed) {
        prog = extractExp(prog, expIndex)
        expIndex++;
    }
    return prog;
}