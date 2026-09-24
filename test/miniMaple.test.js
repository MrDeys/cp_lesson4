import {MiniMaple} from "../src/miniMaple";

test("first test", () => {
    const miniMaple = new MiniMaple();
    const res = miniMaple.diff('2','x');
    expect(res).toBe('0');
});

test("second test", () => {
    const miniMaple = new MiniMaple();
    const res = miniMaple.diff('x','x');
    expect(res).toBe('1');
});

test("third test", () => {
    const miniMaple = new MiniMaple();
    const res = miniMaple.diff('4*x','x');
    expect(res).toBe('4');
});


test("fourth test", () => {
    const miniMaple = new MiniMaple();
    const res = miniMaple.diff('4*x^3','x');
    expect(res).toBe('12*x^2');
});

test("fifth test", () => {
    const miniMaple = new MiniMaple();
    const res = miniMaple.diff('4*x^3','y');
    expect(res).toBe('0');
});

test("sixth test", () => {
    const miniMaple = new MiniMaple();
    const res = miniMaple.diff('4*x^3-x^2','x');
    expect(res).toBe('12*x^2 - 2*x');
});

test("error", () => {
    const miniMaple = new MiniMaple();
    expect(() => miniMaple.diff('4*x / 2', 'x')).toThrow();
});