class Atom {
    diff(sym) {
        throw new Error("diff() must be implemented in subclass");
    }
    toLaTeX() {
        throw new Error("toLaTeX() must be implemented in subclass");
    }
}

class Symbol extends Atom {
    constructor(name) {
        super();
        this.name = String(name).trim();
    }

    diff(sym) {
        const target = sym instanceof Symbol ? sym.name : String(sym);
        return this.name === target ? 1 : 0;
    }

    toLaTeX() {
        return this.name;
    }

    toString() {
        return this.name;
    }
}

class Term extends Atom {
    constructor(coeff, symbol, power = 1) {
        super();
        this.coeff = Number(coeff);
        this.symbol = symbol instanceof Symbol ? symbol : new Symbol(symbol);
        this.power = Number(power);
    }

    diff(sym) {
        const target = sym instanceof Symbol ? sym.name : String(sym);

        if (this.symbol.name !== target) {
            return 0;
        }

        const newCoeff = this.coeff * this.power;
        const newPower = this.power - 1;

        if (newCoeff === 0) return 0;
        if (newPower === 0) return newCoeff;

        return new Term(newCoeff, this.symbol, newPower);
    }

    toLaTeX() {
        if (this.coeff === 0) return "0";
        if (this.power === 0) return `${this.coeff}`;

        let coeffPart = "";
        if (this.coeff === -1) coeffPart = "-";
        else if (this.coeff !== 1) coeffPart = `${this.coeff}`;

        const symPart = this.symbol.toLaTeX();

        if (this.power === 1) return `${coeffPart}${symPart}`;
        return `${coeffPart}${symPart}^{${this.power}}`;
    }

    toString() {
        if (this.coeff === 0) return "0";
        if (this.power === 0) return `${this.coeff}`;

        let coeffPart = "";
        if (this.coeff === -1) coeffPart = "-";
        else if (this.coeff !== 1) coeffPart = `${this.coeff}*`;

        const symPart = this.symbol.name;
        if (this.power === 1) return `${coeffPart}${symPart}`;
        return `${coeffPart}${symPart}^${this.power}`;
    }
}

class MiniMaple {
    parse(str) {
        if (!str || typeof str !== 'string') return [];

        const expr = [];
        let sign = 1;         
        let currentToken = ''; 

        const clean = str.replace(/\s+/g, '');

        for (let i = 0; i < clean.length; i++) {
            const ch = clean[i];

            if (ch === '-' && !currentToken.endsWith('^')) {
                if (currentToken) {
                    this._addTokenToExpr(expr, currentToken, sign);
                    currentToken = '';
                    sign = 1; 
                }
                sign *= -1;
            } 
            else if (ch === '+' && !currentToken.endsWith('^')) {
                if (currentToken) {
                    this._addTokenToExpr(expr, currentToken, sign);
                    currentToken = '';
                    sign = 1;
                }
            } 
            else {
                currentToken += ch;
            }
        }

        if (currentToken) {
            this._addTokenToExpr(expr, currentToken, sign);
        }

        return expr;
    }

    _addTokenToExpr(expr, token, sign) {
        if (!isNaN(Number(token))) {
            expr.push(Number(token) * sign);
            return;
        }

        const termRegex = /^(\d*)\*?([a-zA-Z])(?:\^([+-]?\d+))?$/;
        const match = token.match(termRegex);

        if (match) {
            let [, cStr, symStr, pStr] = match;
            let coeff = (cStr !== '' && cStr !== undefined) ? parseInt(cStr, 10) : 1;
            coeff *= sign;

            let power = pStr !== undefined ? parseInt(pStr, 10) : 1;
            expr.push(new Term(coeff, symStr, power));
        }
    }

    diffList(expr, sym) {
        const v = [];
        for (const t of expr) {
            if (typeof t === 'number' || Number.isFinite(t)) {
                continue;
            }

            if (t instanceof Atom || typeof t.diff === 'function') {
                const d = t.diff(sym);
                if (d !== 0) {
                    v.push(d);
                }
            }
        }
        return this.simplify(v);
    }

    simplify(expr) {
        const termMap = new Map();
        let constSum = 0;

        for (const item of expr) {
            if (typeof item === 'number') {
                constSum += item;
            } else if (item instanceof Term) {
                const key = `${item.symbol.name}^${item.power}`;
                if (termMap.has(key)) {
                    termMap.get(key).coeff += item.coeff;
                } else {
                    termMap.set(key, new Term(item.coeff, item.symbol, item.power));
                }
            }
        }

        const result = [];
        for (const term of termMap.values()) {
            if (term.coeff !== 0) {
                result.push(term);
            }
        }

        if (constSum !== 0) {
            result.push(constSum);
        }

        return result.length === 0 ? [0] : result;
    }

    exprToString(expr) {
        if (!expr || expr.length === 0) return "0";
        if (expr.length === 1 && expr[0] === 0) return "0";

        return expr.map((item, idx) => {
            const str = typeof item === 'number' ? `${item}` : item.toString();
            if (idx > 0 && !str.startsWith('-')) {
                return `+ ${str}`;
            }
            if (str.startsWith('-') && idx > 0) {
                return `- ${str.substring(1)}`;
            }
            return str;
        }).join(' ');
    }

    toLaTeX(expr) {
        if (!expr || expr.length === 0) return "0";
        if (expr.length === 1 && expr[0] === 0) return "0";

        return expr.map((item, idx) => {
            const str = typeof item === 'number' ? `${item}` : item.toLaTeX();
            if (idx > 0 && !str.startsWith('-')) {
                return `+ ${str}`;
            }
            if (str.startsWith('-') && idx > 0) {
                return `- ${str.substring(1)}`;
            }
            return str;
        }).join(' ');
    }

    diff(input, sym = 'x') {
        const exprList = Array.isArray(input) ? input : this.parse(input);
        const differentiated = this.diffList(exprList, sym);
        return this.exprToString(differentiated);
    }
}

export { MiniMaple, Atom, Symbol, Term };