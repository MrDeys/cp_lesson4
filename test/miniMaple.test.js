import { MiniMaple, Atom, Symbol, Term } from "../src/miniMaple";

describe('MiniMaple OOP & Diff tests', () => {
    let mm;

    beforeEach(() => {
        mm = new MiniMaple();
    });

    test('Atom abstract methods throw errors', () => {
        const atom = new Atom();
        expect(() => atom.diff('x')).toThrow();
        expect(() => atom.toLaTeX()).toThrow();
    });

    test('Symbol diff and string representations', () => {
        const x = new Symbol('x');
        expect(x.diff('x')).toBe(1);
        expect(x.diff(new Symbol('x'))).toBe(1);
        expect(x.diff('y')).toBe(0);
        expect(x.toLaTeX()).toBe('x');
        expect(x.toString()).toBe('x');
    });

    test('Term differentiation and formatting', () => {
        const t1 = new Term(4, 'x', 3);
        const dt1 = t1.diff('x');
        expect(dt1.coeff).toBe(12);
        expect(dt1.power).toBe(2);
        expect(t1.toString()).toBe('4*x^3');
        expect(t1.toLaTeX()).toBe('4x^{3}');

        const t2 = new Term(3, 'x', 1);
        expect(t2.diff('x')).toBe(3);
        expect(t2.toString()).toBe('3*x');
        expect(t2.toLaTeX()).toBe('3x');

        const t3 = new Term(-1, 'x', 2);
        expect(t3.diff('x').coeff).toBe(-2);
        expect(t3.toString()).toBe('-x^2');
        expect(t3.toLaTeX()).toBe('-x^{2}');

        const t4 = new Term(1, 'x', 1);
        expect(t4.diff('x')).toBe(1);
        expect(t4.toString()).toBe('x');
        expect(t4.toLaTeX()).toBe('x');

        const tOther = new Term(4, 'y', 2);
        expect(tOther.diff('x')).toBe(0);

        const tZero = new Term(0, 'x', 2);
        expect(tZero.diff('x')).toBe(0);
        expect(tZero.toString()).toBe('0');
        expect(tZero.toLaTeX()).toBe('0');

        const tConst = new Term(5, 'x', 0);
        expect(tConst.diff('x')).toBe(0);
        expect(tConst.toString()).toBe('5');
        expect(tConst.toLaTeX()).toBe('5');
    });

    test('diffList logic with [Term, ..., number]', () => {
        const expr = [new Term(3, 'x', 2), new Term(5, 'x', 1), 4];
        const res = mm.diffList(expr, 'x');

        expect(res.length).toBe(2);
        expect(res[0].coeff).toBe(6);
        expect(res[0].power).toBe(1);
        expect(res[1]).toBe(5);
    });

    test('Parsing and complete diff workflow', () => {
        expect(mm.diff("4*x^3 - x^2 + 5", "x")).toBe("12*x^2 - 2*x");
        expect(mm.diff("2*x^2 + 3*x^2", "x")).toBe("10*x");
        expect(mm.diff("42", "x")).toBe("0");
        expect(mm.diff("", "x")).toBe("0");
        expect(mm.diff("4*x^3 + 2*x", "y")).toBe("0");
    });

    test('LaTeX generation from expression list', () => {
        const expr = [new Term(4, 'x', 3), new Term(-2, 'x', 1), 5];
        expect(mm.toLaTeX(expr)).toBe("4x^{3} - 2x + 5");
        expect(mm.toLaTeX([])).toBe("0");
        expect(mm.toLaTeX([0])).toBe("0");
    });

    test('Handling multiple signs like --x and +-x', () => {
    expect(mm.diff("--x", "x")).toBe("1");
    expect(mm.diff("---x", "x")).toBe("-1");
    expect(mm.diff("4*x^2 - -2*x", "x")).toBe("8*x + 2");
    });
});