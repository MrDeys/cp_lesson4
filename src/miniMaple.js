class MiniMaple{
    diff(expr, variable){
        if (/[^a-zA-Z0-9+\-*^\s]/.test(expr)) {
            throw new Error();
        }

        expr = expr.replaceAll(' ', '');
        expr = expr.replaceAll('-', '+-');

        const terms = expr.split('+');

        const diffTerms = [];
        for(const term of terms){
            const d = this.diffTerm(term, variable);
            if(d === '0'){
                continue;
            }
            else{
                diffTerms.push(d);
            }
        }

        let result = '';
        if(diffTerms.length === 0){
            return '0';
        }else{
            for(const term of diffTerms){
                if(result === ''){
                    result += term;
                }else{
                    if(term.includes('-')){
                        result += ' - ' + term.slice(1);
                    }else{
                        result += ' + ' + term;
                    }
                }
            }
        }

        return result;
    }

    diffTerm(term, variable){
        if(!term.includes(variable)){
            return '0';
        }

        let b;
        if(!term.includes('^')){
            b = 1;
        }
        else{
            b = parseInt(term.split('^')[1]);
        }

        let a;
        const beforeX = term.split(variable)[0];
        if(beforeX.includes('*')){
            a = parseInt(beforeX.split('*')[0]);
        }
        else if(beforeX === '' || beforeX === '+'){
            a = 1;
        }
        else if(beforeX === '-'){
            a = -1;
        }
        else{
            return '0';
        }

        if (b === 1){
            return `${a}`;
        } else if (b === 2){
            return `${a * b}*${variable}`;
        }else{
            return `${a * b}*${variable}^${b - 1}`;
        }
    }
}

export {MiniMaple}