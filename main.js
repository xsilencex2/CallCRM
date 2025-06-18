import anime from "animejs";
import * as XLSX from "xlsx";
import { saveCalls, loadCalls } from "./storage.js";
import { formatDate, getResultDesc, getResultIcon } from "./utils.js";
import { animateCard, blinkOption } from "./animations.js";

// --- Data & Persistence ---
const STORAGE_KEY = "crm-calls";
let calls = [];

function renderCalls() {
  const list = document.getElementById('calls-list');
  list.innerHTML = '';
  if (calls.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><br>Пока нет звонков</div>`;
    return;
  }
  calls.slice().reverse().forEach((call, idx) => {
    const card = document.createElement('div');
    card.className = "call-card";
    card.style.animationDelay = (idx * 0.07) + "s";
    card.innerHTML = `
      <button class="delete-btn" title="Удалить"><i class="fas fa-trash"></i></button>
      <div class="call-number">${call.phone}</div>
      <div class="call-date">${formatDate(call.date)}</div>
      <div class="call-result-label" data-result="${call.result}">
        ${getResultIcon(call.result)}
        ${getResultDesc(call.result)}
      </div>
    `;
    card.querySelector('.delete-btn').onclick = () => {
      const idxToDelete = calls.length - 1 - idx;
      calls.splice(idxToDelete, 1);
      saveCalls(calls, STORAGE_KEY);
      anime({
        targets: card,
        opacity: [1, 0],
        scale: [1, 0.88],
        duration: 230,
        easing: 'easeOutCubic',
        complete: renderCalls
      });
    };
    list.appendChild(card);
    animateCard(card);
  });
}

// --- Result Option Logic ---
let selectedResult = null;
document.querySelectorAll('.call-result-option').forEach(opt => {
  opt.addEventListener('click', () => {
    selectedResult = opt.dataset.result;
    document.querySelectorAll('.call-result-option').forEach(el =>
      el.classList.toggle('selected', el.dataset.result === selectedResult)
    );
    blinkOption(opt);
  });
});
// --- Form Logic ---
document.getElementById('call-form').onsubmit = (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone-input').value.trim();
  if (!phone) {
    document.getElementById('phone-input').style.background = "#ffe8e8";
    anime({
      targets: '#phone-input',
      translateX: [
        { value: -8, duration: 80 },
        { value: 8, duration: 80 },
        { value: 0, duration: 80 }
      ],
      easing: 'easeInOutQuad'
    });
    setTimeout(() =>
      document.getElementById('phone-input').style.background = "#f3f7fe", 430
    );
    return false;
  }
  if (!selectedResult) {
    anime({
      targets: '#result-options',
      scale: [1, 1.08, 1],
      background: [
        { value: "#ffcfcf", duration: 80 },
        { value: "#fff", duration: 200 }
      ],
      easing: 'easeOutCubic'
    });
    return false;
  }
  calls.push({ phone, result: selectedResult, date: new Date().toISOString() });
  saveCalls(calls, STORAGE_KEY);
  renderCalls();
  // Reset form
  e.target.reset();
  selectedResult = null;
  document.querySelectorAll('.call-result-option').forEach(el => el.classList.remove('selected'));
};
// --- Excel export functionality ---
document.getElementById("export-excel-btn").onclick = () => {
  if (calls.length === 0) {
    anime({
      targets: "#export-excel-btn",
      scale: [1, 1.08, 1],
      background: [
        { value: "#ffe8e8", duration: 80 },
        { value: "#41C77A", duration: 200 }
      ],
      easing: "easeOutCubic"
    });
    return;
  }
  const exportData = calls.map((call, i) => ({
    "№": i + 1,
    "Телефон": call.phone,
    "Результат": getResultDesc(call.result),
    "Дата": formatDate(call.date)
  }));
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Звонки");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "calls.xlsx";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 120);
};

// --- Init ---
calls = loadCalls(STORAGE_KEY);
renderCalls();

// ==== INPUT ANIMATION LOGIC ====
// Label float & focus states
const animGroup = document.getElementById('input-anim-group');
const inp = document.getElementById('phone-input');
function updateAnimGroup() {
  animGroup.classList.toggle('input-anim-focused', document.activeElement === inp);
  animGroup.classList.toggle('input-anim-filled', !!inp.value);
}
inp.addEventListener('focus', updateAnimGroup);
inp.addEventListener('blur', updateAnimGroup);
inp.addEventListener('input', updateAnimGroup);
setTimeout(updateAnimGroup, 50);