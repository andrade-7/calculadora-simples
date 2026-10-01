const display = document.querySelector('#display');
const keys = document.querySelector('.keys');
let expression = '';

function updateDisplay(value = expression || '0') {
  display.value = String(value).replaceAll('.', ',');
}

function append(value) {
  const currentNumber = expression.split(/[+\-*/]/).pop();
  if (value === '.' && currentNumber.includes('.')) return;
  expression += value;
  updateDisplay();
}

function calculate() {
  if (!expression) return;
  try {
    if (!/^[0-9+\-*/. ]+$/.test(expression)) throw new Error();
    const result = Function(`"use strict"; return (${expression})`)();
    if (!Number.isFinite(result)) throw new Error();
    expression = String(Number(result.toFixed(10)));
    updateDisplay();
  } catch {
    updateDisplay('Erro');
    expression = '';
  }
}

keys.addEventListener('click', ({ target }) => {
  if (!(target instanceof HTMLButtonElement)) return;
  if (target.dataset.value) append(target.dataset.value);
  if (target.dataset.action === 'clear') { expression = ''; updateDisplay(); }
  if (target.dataset.action === 'backspace') { expression = expression.slice(0, -1); updateDisplay(); }
  if (target.dataset.action === 'calculate') calculate();
});

document.addEventListener('keydown', ({ key }) => {
  if (/^[0-9+\-*/.]$/.test(key)) append(key);
  else if (key === 'Enter' || key === '=') calculate();
  else if (key === 'Backspace') { expression = expression.slice(0, -1); updateDisplay(); }
  else if (key === 'Escape') { expression = ''; updateDisplay(); }
});
