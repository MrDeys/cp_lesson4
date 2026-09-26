import { MiniMaple } from "./miniMaple.js";

document.addEventListener('DOMContentLoaded', setup);

function setup() {
    const btn = document.getElementById('demoButton');
    if (btn) {
        btn.onclick = computeDiff;
    }
}

function computeDiff() {
    const exprInput = document.getElementById('exprInput').value;
    const symInput = document.getElementById('symInput').value || 'x';
    const container = document.getElementById('container');

    const mm = new MiniMaple();
    const parsedExpr = mm.parse(exprInput);
    const diffList = mm.diffList(parsedExpr, symInput);

    const originalLatex = mm.toLaTeX(parsedExpr);
    const resultLatex = mm.toLaTeX(diffList);

    container.innerHTML = `
        <p><strong>Исходная функция:</strong> \\( f(${symInput}) = ${originalLatex} \\)</p>
        <p><strong>Производная:</strong> \\( \\frac{df}{d${symInput}} = ${resultLatex} \\)</p>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}