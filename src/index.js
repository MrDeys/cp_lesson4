import { MiniMaple } from './miniMaple.js';

document.addEventListener('DOMContentLoaded',setup)

function setup() {
    const diffButton = document.getElementById('diffButton');
    diffButton.addEventListener('click', () => {
        const expressionInput = document.getElementById('expression');
        const variableInput = document.getElementById('variable');
        const resultSpan = document.getElementById('result');
        
        const miniMaple = new MiniMaple();
        resultSpan.textContent = miniMaple.diff(expressionInput.value, variableInput.value);
    });

}
