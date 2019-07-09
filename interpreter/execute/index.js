const TYPES = {
    NUMBER: 'number',
    CONST: 'CONST',
    STRING: 'string',
    FUNCTION: 'func',
    EXP: 'expression'

}

const func = {
    'func_+': (args) => {
        let sum = 0;
        for (let i = 0; i < args.length; i++) {
            sum += args[i];
        }
        return sum;
    }
    
}

const resolve = (exp, env) => {
    return env[exp.substring(1, exp.length - 1).split(':').join('_')];
}

const expTypeOf = (exp) => {
    return exp.substring(1, exp.length - 1).split(':')[0];
}

const executeExp = (exp, env) => {
    let fullExp = resolve(exp,env);
    fullExp = fullExp.substring(2,fullExp.length - 2).split(' ');
    fullExp = fullExp.map((token) => {
        if (expTypeOf(token) === TYPES.EXP) {
            return executeExp(token,env);
        }
        return resolve(token, env);
    })
    const func = fullExp.shift();
    return func(fullExp)
}

module.exports = (prog) => {
    let mainExp = prog.tokens;
    let env = {
        ...prog.strings,
        ...prog.numbers,
        ...prog.expressions,
        ...func
    }


    console.log(executeExp(mainExp, env))






}