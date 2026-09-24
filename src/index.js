import { MiniMaple } from "./miniMaple.js";

document.addEventListener("DOMContentLoaded", setup);

function setup() {
  const diffButton = document.getElementById("diffButton");
  const miniMaple = new MiniMaple();
  diffButton.addEventListener("click", () => {
    const expressionInput = document.getElementById("expression");
    const variableInput = document.getElementById("variable");
    const resultSpan = document.getElementById("result");

    resultSpan.textContent = miniMaple.diff(
      expressionInput.value,
      variableInput.value,
    );
  });
}
