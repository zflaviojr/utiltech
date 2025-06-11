// Dark mode
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
  }
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
    document.getElementById('dark-toggle').checked = true;
  }
  
  // Sidebar toggle (mobile)
  /*
  function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('-translate-x-full');
  }*/

  function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const isMobile = window.innerWidth < 768;

  // Alterna visibilidade
  if (sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.remove('-translate-x-full');

    // Se for mobile, fecha depois de 2 segundos
    if (isMobile) {
      setTimeout(() => {
        sidebar.classList.add('-translate-x-full');
      }, 2000);
    }
  } else {
    sidebar.classList.add('-translate-x-full');
  }
}

  
  // Navigation
  function startApp() {
    document.getElementById('landing').classList.add('hidden');
    document.querySelectorAll('.tool-container').forEach(el => el.classList.add('hidden'));
  }
  function showWelcome() {
    document.getElementById('landing').classList.remove('hidden');
    document.querySelectorAll('.tool-container').forEach(el => el.classList.add('hidden'));
  }
  function showMosaic() {
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('welcome-panel').classList.add('hidden');
    document.getElementById('mosaic').classList.remove('hidden');
    document.querySelectorAll('.tool-container').forEach(el => el.classList.add('hidden'));
  }
  function showTool(id) {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('mosaic').classList.add('hidden');
    document.querySelectorAll('.tool-container').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${id}-container`).classList.remove('hidden');
    if (window.innerWidth <= 768) toggleSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Simple Calculator
  let calcDisplay = document.getElementById('calc-display'),
      calcValue = '0', calcWaiting = false, calcOp = null, calcPrev = 0;
  function calcInput(d) {
    if (calcWaiting) {
      calcDisplay.textContent = d;
      calcValue = d;
      calcWaiting = false;
    } else {
      calcValue = calcDisplay.textContent === '0' ? d : calcDisplay.textContent + d;
      calcDisplay.textContent = calcValue;
    }
  }
  function clearCalc() {
    calcDisplay.textContent = '0';
    calcValue = '0';
    calcWaiting = false;
    calcOp = null;
    calcPrev = 0;
  }
  function calculate() {
    const cur = parseFloat(calcValue);
    if      (calcOp === '+') calcPrev += cur;
    else if (calcOp === '-') calcPrev -= cur;
    else if (calcOp === '*') calcPrev *= cur;
    else if (calcOp === '/') calcPrev /= cur;
    else                     calcPrev = cur;
    calcDisplay.textContent = calcPrev;
    calcWaiting = true;
    calcOp = null;
  }
  document.querySelectorAll('#simple-calculator-container button').forEach(btn => {
    const t = btn.textContent.trim();
    if (['+','-','×','*','÷','/'].includes(t)) {
      const op = t === '×' ? '*' : t === '÷' ? '/' : t;
      btn.onclick = () => {
        calcOp = op;
        calcPrev = parseFloat(calcDisplay.textContent);
        calcWaiting = true;
      };
    }
  });
  
  // Scientific Calculator
  let sciDisplay = document.getElementById('sci-display'), sciExp = '';
  function sciInput(v) {
    if (v === 'pi') {
      sciExp += 'Math.PI';
      sciDisplay.textContent = Math.PI;
    } else {
      sciExp += v;
      sciDisplay.textContent = sciDisplay.textContent === '0' ? v : sciDisplay.textContent + v;
    }
  }
  function clearSciCalc() {
    sciDisplay.textContent = '0';
    sciExp = '';
  }
  function sciCalculate() {
    try {
      let expr = sciExp.replace(/\^/g, '**');
      const res = eval(expr);
      sciDisplay.textContent = res;
      sciExp = res.toString();
    } catch {
      sciDisplay.textContent = 'Erro';
      sciExp = '';
    }
  }
  
  // Bioimpedance
  function calculateBioimpedance() {
    const gender   = document.querySelector('input[name="gender"]:checked').value;
    const age      = +document.getElementById('age').value;
    const heightCm = +document.getElementById('height').value;
    const weight   = +document.getElementById('weight').value;
    const activity = +document.getElementById('activity-level').value;
    const res      = +document.getElementById('resistance').value || null;
  
    // IMC
    const hM = heightCm / 100;
    const bmi = weight / (hM * hM);
    document.getElementById('bmi-result').textContent = bmi.toFixed(1);
    // Categoria IMC
    let cat;
    if (bmi < 18.5) cat = 'Abaixo do peso';
    else if (bmi < 25) cat = 'Peso normal';
    else if (bmi < 30) cat = 'Sobrepeso';
    else cat = 'Obesidade';
    document.getElementById('bmi-category').textContent = cat;
  
    // % Gordura (fórmula Deurenberg sem impedância)
    let fat = (1.2 * bmi) + (0.23 * age) - (gender === 'male' ? 16.2 : 5.4);
    document.getElementById('fat-percent-result').textContent = fat.toFixed(1) + '%';
    // Categoria gordura
    document.getElementById('fat-category').textContent =
      fat < 15 ? 'Baixa' :
      fat < 25 ? 'Aceitável' : 'Alta';
  
    // Massa magra e % músculo
    const leanKg = weight * (1 - fat / 100);
    const leanPct = (leanKg / weight) * 100;
    document.getElementById('lean-percent-result').textContent = leanPct.toFixed(1) + '%';
  
    // Água corporal: 60% peso
    //const waterPct = 60;
    //document.getElementById('water-percent-result').textContent = waterPct.toFixed(1) + '%';
    // Água corporal: estimativa de 73% da massa magra
    const waterKg = leanKg * 0.73;
    const waterPct = (waterKg / weight) * 100;
    document.getElementById('water-percent-result').textContent = waterPct.toFixed(1) + '%';

    // Água recomendada para ingestão diária (em litros)
    let waterIntake;
    if (gender === 'male') {
      waterIntake = weight * 35; // 35 ml/kg
    } else {
      waterIntake = weight * 31; // 31 ml/kg
    }
    document.getElementById('water-intake-result').textContent = (waterIntake / 1000).toFixed(2) + ' L';
  
    // Massa óssea: estimativa ~5%
    const bonePct = 5;
    document.getElementById('bone-percent-result').textContent = bonePct.toFixed(1) + '%';
  
    // Metabolismo basal (Harris–Benedict + atividade)
    let bmr = gender === 'male'
      ? 88.36 + (13.4 * weight) + (4.8 * heightCm) - (5.7 * age)
      : 447.6 + (9.2 * weight) + (3.1 * heightCm) - (4.3 * age);
    bmr = Math.round(bmr * activity);
    document.getElementById('bmr-result').textContent = bmr + ' kcal';
  
    // Distribuição
    const pf = fat;
    const pm = leanPct - bonePct; // massa magra menos osso
    const pw = waterPct;
    const pb = bonePct;
    const total = pf + pm + pw + pb;
    document.getElementById('dist-fat').style.width     = (pf/total*100) + '%';
    document.getElementById('dist-muscle').style.width  = (pm/total*100) + '%';
    document.getElementById('dist-water').style.width   = (pw/total*100) + '%';
    document.getElementById('dist-bone').style.width    = (pb/total*100) + '%';
    
  }
  
  
  // Date Calculator
  function calculateDateDifference() {
    const sd = new Date(document.getElementById('start-date').value);
    const ed = new Date(document.getElementById('end-date').value);
    if (isNaN(sd) || isNaN(ed)) {
      document.getElementById('date-difference-result').textContent = 'Datas inválidas';
      return;
    }
    const diffDays = Math.ceil(Math.abs(ed - sd)/(1000*60*60*24));
    let years  = ed.getFullYear()  - sd.getFullYear();
    let months = ed.getMonth()     - sd.getMonth();
    let days   = ed.getDate()      - sd.getDate();
    if (days < 0) {
      months--;
      days += new Date(ed.getFullYear(), ed.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--; months += 12;
    }
    document.getElementById('date-difference-result').innerHTML =
      `<div>Total: <strong>${diffDays}</strong> dias</div>
       <div>${years} anos, ${months} meses, ${days} dias</div>`;
  }
  function addToDate() {
    const base = new Date(document.getElementById('base-date').value);
    if (isNaN(base)) {
      document.getElementById('date-result').textContent = 'Data inválida';
      return;
    }
    const y = +document.getElementById('years-to-add').value;
    const m = +document.getElementById('months-to-add').value;
    const d = +document.getElementById('days-to-add').value;
    base.setFullYear(base.getFullYear() + y);
    base.setMonth(base.getMonth() + m);
    base.setDate(base.getDate() + d);
    document.getElementById('date-result').textContent = base.toLocaleDateString('pt-BR');
  }
  function subtractFromDate() {
    const base = new Date(document.getElementById('base-date').value);
    if (isNaN(base)) {
      document.getElementById('date-result').textContent = 'Data inválida';
      return;
    }
    const y = +document.getElementById('years-to-add').value;
    const m = +document.getElementById('months-to-add').value;
    const d = +document.getElementById('days-to-add').value;
    base.setFullYear(base.getFullYear() - y);
    base.setMonth(base.getMonth() - m);
    base.setDate(base.getDate() - d);
    document.getElementById('date-result').textContent = base.toLocaleDateString('pt-BR');
  }
  
  // Password Generator
  function updateLengthValue() {
    document.getElementById('length-value').textContent =
      document.getElementById('password-length').value;
  }
  function generatePassword() {
    const len = +document.getElementById('password-length').value;
    const upper = document.getElementById('uppercase').checked;
    const lower = document.getElementById('lowercase').checked;
    const nums  = document.getElementById('numbers').checked;
    const syms  = document.getElementById('symbols').checked;
    let cs = '';
    if (upper) cs += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) cs += 'abcdefghijklmnopqrstuvwxyz';
    if (nums ) cs += '0123456789';
    if (syms ) cs += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!cs) { alert('Selecione ao menos um tipo'); return; }
    let pwd = '';
    for (let i=0; i<len; i++) {
      pwd += cs[Math.floor(Math.random()*cs.length)];
    }
    document.getElementById('generated-password').value = pwd;
    document.getElementById('multiple-passwords').classList.add('hidden');
  }
  function generateMultiplePasswords() {
    const len = +document.getElementById('password-length').value;
    const upper = document.getElementById('uppercase').checked;
    const lower = document.getElementById('lowercase').checked;
    const nums  = document.getElementById('numbers').checked;
    const syms  = document.getElementById('symbols').checked;
    let cs = '';
    if (upper) cs += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) cs += 'abcdefghijklmnopqrstuvwxyz';
    if (nums ) cs += '0123456789';
    if (syms ) cs += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!cs) { alert('Selecione ao menos um tipo'); return; }
    const list = document.getElementById('password-list');
    list.innerHTML = '';
    for (let n=0; n<8; n++){
      let pwd='';
      for (let i=0; i<len; i++){
        pwd += cs[Math.floor(Math.random()*cs.length)];
      }
      const div = document.createElement('div');
      div.className = 'flex items-center';
      div.innerHTML = `
        <input type="text" value="${pwd}" readonly
          class="flex-1 px-2 py-1 border rounded-l-lg bg-gray-50 dark:bg-gray-700 text-sm"/>
        <button class="px-2 py-1 rounded-r-lg bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-white text-sm"
                onclick="copyThisPassword(this)">
          <i class="fas fa-copy"></i>
        </button>`;
      list.appendChild(div);
    }
    document.getElementById('multiple-passwords').classList.remove('hidden');
  }
  function copyPassword() {
    const f = document.getElementById('generated-password');
    f.select(); document.execCommand('copy');
    alert('Senha copiada!');
  }
  function copyThisPassword(btn) {
    const inp = btn.previousElementSibling;
    inp.select(); document.execCommand('copy');
    alert('Senha copiada!');
  }
  
  // Countdown Timer
  let countdownInterval;
  function startCountdown() {
    const name = document.getElementById('event-name').value;
    const dt   = new Date(document.getElementById('event-datetime').value).getTime();
    if (!name||isNaN(dt)) { alert('Preencha evento e data'); return; }
    document.getElementById('countdown-event').textContent = name;
    updateCountdown(dt);
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => updateCountdown(dt), 1000);
  }
  function updateCountdown(eventDate) {
    const now = Date.now(), dist = eventDate - now;
    if (dist < 0) { clearInterval(countdownInterval); return; }
    const days = Math.floor(dist/(1000*60*60*24));
    const hours = Math.floor((dist%(1000*60*60*24))/(1000*60*60));
    const mins  = Math.floor((dist%(1000*60*60))/(1000*60));
    const secs  = Math.floor((dist%(1000*60))/1000);
    document.getElementById('countdown-days').textContent   = String(days).padStart(2,'0');
    document.getElementById('countdown-hours').textContent  = String(hours).padStart(2,'0');
    document.getElementById('countdown-minutes').textContent= String(mins).padStart(2,'0');
    document.getElementById('countdown-seconds').textContent= String(secs).padStart(2,'0');
  }
  function resetCountdown() {
    clearInterval(countdownInterval);
    ['countdown-days','countdown-hours','countdown-minutes','countdown-seconds']
      .forEach(id=>document.getElementById(id).textContent='00');
    document.getElementById('countdown-event').textContent='--';
  }
  
  // Stopwatch
  let swInterval, swStart, swElapsed=0, swRunning=false;
  const swDisplay = document.getElementById('stopwatch-display');
  document.getElementById('start-stopwatch').onclick = startStopwatch;
  document.getElementById('stop-stopwatch').onclick  = stopStopwatch;
  document.getElementById('lap-stopwatch').onclick   = lapStopwatch;
  document.getElementById('reset-stopwatch').onclick = resetStopwatch;
  function startStopwatch() {
    if (!swRunning) {
      swStart = Date.now() - swElapsed;
      swInterval = setInterval(updateStopwatch, 10);
      swRunning = true;
      document.getElementById('start-stopwatch').disabled = true;
      document.getElementById('stop-stopwatch').disabled  = false;
    }
  }
  function stopStopwatch() {
    if (swRunning) {
      clearInterval(swInterval);
      swRunning = false;
      document.getElementById('start-stopwatch').disabled = false;
      document.getElementById('stop-stopwatch').disabled  = true;
    }
  }
  function lapStopwatch() {
    if (!swRunning) return;
    const time = swDisplay.textContent;
    const container = document.getElementById('lap-times');
    if (container.firstChild.textContent.includes('Nenhuma volta')) container.innerHTML = '';
    const item = document.createElement('div');
    item.className = 'flex justify-between py-1 border-b border-gray-200 dark:border-gray-600';
    item.innerHTML = `<span>Volta ${container.children.length+1}</span><span>${time}</span>`;
    container.prepend(item);
  }
  function resetStopwatch() {
    clearInterval(swInterval);
    swRunning = false;
    swElapsed = 0;
    swDisplay.textContent = '00:00:00.00';
    document.getElementById('lap-times').innerHTML = '<div class="text-center text-gray-500 dark:text-gray-400">Nenhuma volta registrada</div>';
    document.getElementById('start-stopwatch').disabled = false;
    document.getElementById('stop-stopwatch').disabled  = true;
  }
  function updateStopwatch() {
    swElapsed = Date.now() - swStart;
    const ms = Math.floor((swElapsed % 1000)/10);
    const totalSec = Math.floor(swElapsed/1000);
    const secs = totalSec % 60;
    const mins = Math.floor(totalSec/60) % 60;
    const hrs  = Math.floor(totalSec/3600);
    swDisplay.textContent = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}.${String(ms).padStart(2,'0')}`;
  }
  
  // Random Draw
  let randInterval, randTimeout;
  function startRandomDraw() {
    const min = +document.getElementById('min-number').value;
    const max = +document.getElementById('max-number').value;
    const qty = +document.getElementById('quantity').value;
    const t   = +document.getElementById('draw-time').value * 1000;
    if (min >= max) { alert('Mínimo deve ser menor que máximo'); return; }
    if (qty < 1 || qty > 20) { alert('Quantidade entre 1 e 20'); return; }
    clearInterval(randInterval); clearTimeout(randTimeout);
    const anim = document.getElementById('random-draw-animation');
    const res  = document.getElementById('random-draw-result');
    const hist = document.getElementById('random-draw-history');
    anim.textContent='...'; anim.classList.add('animate-pulse'); res.textContent='';
    let count=0;
    randInterval = setInterval(()=>{
      const fake = Array.from({length:qty},()=>Math.floor(Math.random()*(max-min+1))+min).join(', ');
      anim.textContent = fake;
      count += 100;
      if (count >= t) clearInterval(randInterval);
    },100);
    randTimeout = setTimeout(()=>{
      anim.classList.remove('animate-pulse');
      const nums=[];
      while (nums.length<qty){
        const n = Math.floor(Math.random()*(max-min+1))+min;
        if (qty>1? !nums.includes(n): true) nums.push(n);
      }
      anim.textContent = nums.join(qty>1?', ':'');
      res.textContent  = nums.join(qty>1?', ':'');
      const now = new Date().toLocaleTimeString();
      hist.innerHTML += `${now}: ${nums.join(', ')}<br/>`;
    }, t);
  }
  
  // Initialize defaults
  document.addEventListener('DOMContentLoaded', ()=>{
    const today = new Date().toISOString().split('T')[0];
    ['start-date','end-date','base-date'].forEach(id=>document.getElementById(id).value = today);
    const ev=new Date(); ev.setHours(ev.getHours()+1);
    document.getElementById('event-datetime').value = ev.toISOString().slice(0,16);
    generatePassword();
  });
  

  // Lista de tarefas
  // --- Lista de Tarefas ---
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
const listEl   = document.getElementById('todo-list');
const inputEl  = document.getElementById('todo-input');
const addBtn   = document.getElementById('todo-add-btn');
const countEl  = document.getElementById('todo-count');
const clearBtn = document.getElementById('todo-clear');
const clearAllBtn = document.getElementById('todo-clear-all');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  listEl.innerHTML = '';
  todos.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = t.done ? 'completed' : '';
    li.innerHTML = `
      <label class="flex items-center space-x-2">
        <input type="checkbox" ${t.done?'checked':''} 
               onchange="toggleTodo(${i})"/>
        <span>${t.text}</span>
      </label>
      <button onclick="deleteTodo(${i})">
        <i class="fas fa-trash-alt"></i>
      </button>`;
    listEl.appendChild(li);
  });
  const doneCount = todos.filter(t=>t.done).length;
  countEl.textContent = `${todos.length} tarefas`;
  clearBtn.style.visibility = doneCount ? 'visible' : 'hidden';
  clearAllBtn.style.visibility = todos.length != 0 ? 'visible' : 'hidden';
}

function addTodo() {
  const text = inputEl.value.trim();
  if (!text) return;
  todos.push({ text, done: false });
  inputEl.value = '';
  saveTodos();
  renderTodos();
}

function toggleTodo(i) {
  todos[i].done = !todos[i].done;
  saveTodos();
  renderTodos();
}

function deleteTodo(i) {
  todos.splice(i,1);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter(t => !t.done);
  saveTodos();
  renderTodos();
}

// event listeners
addBtn.onclick = addTodo;
clearBtn.onclick = clearCompleted;
inputEl.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTodo();
});
clearAllBtn.onclick = clearAll;

/**
 * remove todas as tarefas
 */
function clearAll() {
  todos = [];
  saveTodos();
  renderTodos();
}

// inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
});

// === Gerador de CPF ===

// gera um CPF válido
function generateCPF() {
  const rand = () => Math.floor(Math.random() * 9);
  const calc = (digs) => {
    let soma = digs
      .map((d, i) => d * (digs.length + 1 - i))
      .reduce((a, b) => a + b, 0);
    let resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  let nums = Array.from({ length: 9 }, () => rand());
  nums.push(calc(nums));   // 1º dígito verificador
  nums.push(calc(nums));   // 2º dígito verificador
  const str = nums.join('');
  return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,
                     (_, a,b,c,d) => `${a}.${b}.${c}-${d}`);
}

document.getElementById('cpf-generate').onclick = () => {
  const out = document.getElementById('cpf-output');
  out.value = generateCPF();
  out.select();
};

document.getElementById('cpf-copy').onclick = () => {
  const out = document.getElementById('cpf-output');
  if (!out.value) return;
  out.select();
  document.execCommand('copy');
  const btn = document.getElementById('cpf-copy');
  btn.innerHTML = '<i class="fas fa-check"></i>';
  setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i>', 1000);
};

// auto-gerar no load
document.addEventListener('DOMContentLoaded', () => {
  // garante que o gerador só rode depois de carregar o DOM
  const genBtn = document.getElementById('cpf-generate');
  if (genBtn) genBtn.click();
});


// === Lista de Compras ===
document.addEventListener('DOMContentLoaded', () => {
  const shopListEl = document.getElementById('shopping-list');
  const shopItemEl = document.getElementById('shopping-item');
  const shopPriceEl = document.getElementById('shopping-price');
  const shopQtyEl = document.getElementById('shopping-qty');
  const incQtyBtn = document.getElementById('inc-qty');
  const decQtyBtn = document.getElementById('dec-qty');
  const shopAddBtn = document.getElementById('shopping-add-btn');
  const shopTotalEl = document.getElementById('shopping-total');
  const clearSelBtn = document.getElementById('shopping-clear-selected');
  const clearAllBtn = document.getElementById('shopping-clear-all');

  if (!shopItemEl) return;

  let shoppingData = JSON.parse(localStorage.getItem('shopping') || '[]');

  function saveShopping() {
    localStorage.setItem('shopping', JSON.stringify(shoppingData));
  }

  function formatMoney(v) {
    return 'R$ ' + v.toFixed(2).replace('.', ',');
  }

  function renderShoppingList() {
    shopListEl.innerHTML = '';
    let total = 0;

    shoppingData.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const li = document.createElement('li');
      li.className = 'flex items-center justify-between flex-wrap gap-3 p-2 rounded bg-gray-100 dark:bg-gray-700';
      li.innerHTML = `
        <label class="flex-1 flex items-center space-x-2">
          <input type="checkbox" data-index="${index}" class="shop-checkbox" ${item.selected ? 'checked' : ''}/>
          <span>${item.name}</span>
        </label>
        <input type="number" min="0" step="0.01" value="${parseFloat(item.price).toFixed(2)}" data-index="${index}" class="edit-price"/>
        <input type="number" min="0" step="1" value="${item.qty}" data-index="${index}" class="edit-qty"/>
        <span class="font-bold">${formatMoney(itemTotal)}</span>
        <button data-index="${index}" class="shop-delete"><i class="fas fa-trash-alt text-red-500"></i></button>
      `;
      shopListEl.appendChild(li);
    });

    shopTotalEl.textContent = `Total: ${formatMoney(total)}`;
    clearSelBtn.style.visibility = shoppingData.some(it => it.selected) ? 'visible' : 'hidden';
    clearAllBtn.style.visibility = shoppingData.length ? 'visible' : 'hidden';

    shopListEl.querySelectorAll('.shop-delete').forEach(btn => {
      btn.onclick = () => {
        shoppingData.splice(btn.dataset.index, 1);
        saveShopping();
        renderShoppingList();
      };
    });

    shopListEl.querySelectorAll('.shop-checkbox').forEach(chk => {
      chk.onchange = () => {
        shoppingData[chk.dataset.index].selected = chk.checked;
        saveShopping();
        renderShoppingList();
      };
    });
  }

  incQtyBtn.onclick = () => {
    shopQtyEl.textContent = Math.max(0, parseInt(shopQtyEl.textContent) + 1);
  };

  decQtyBtn.onclick = () => {
    shopQtyEl.textContent = Math.max(0, parseInt(shopQtyEl.textContent) - 1);
  };

  shopAddBtn.onclick = () => {
    const name = shopItemEl.value.trim();
    const price = parseFloat(shopPriceEl.value) || 0;
    const qty = parseInt(shopQtyEl.textContent) || 0;

    if (!name) return;

    shoppingData.push({ name, price, qty, selected: false });
    shopItemEl.value = '';
    shopPriceEl.value = '';
    shopQtyEl.textContent = '0';
    saveShopping();
    renderShoppingList();
  };

  clearSelBtn.onclick = () => {
    shoppingData = shoppingData.filter(it => !it.selected);
    saveShopping();
    renderShoppingList();
  };

  clearAllBtn.onclick = () => {
    shoppingData = [];
    saveShopping();
    renderShoppingList();
  };

document.addEventListener('input', function (e) {
  if (e.target.classList.contains('edit-price') || e.target.classList.contains('edit-qty')) {
    if (e.target.value.includes(',')) {
      e.target.value = e.target.value.replace(',', '.');
    }

    const index = e.target.dataset.index;
    const item = shoppingData[index];

    // NÃO renderiza a lista aqui — apenas atualiza o valor
    if (e.target.classList.contains('edit-price')) {
      const newPrice = parseFloat(e.target.value);
      if (!isNaN(newPrice)) item.price = newPrice;
    } else {
      const newQty = parseInt(e.target.value);
      if (!isNaN(newQty)) item.qty = Math.max(0, newQty);
    }

    saveShopping();
    updateShoppingTotalOnly(); // função que atualiza só o total geral
  }
});

  document.addEventListener('blur', function (e) {
    if (e.target.classList.contains('edit-price') || e.target.classList.contains('edit-qty')) {
      renderShoppingList(); // só agora re-renderiza
    }
  }, true); // usar capture=true para escutar corretamente o blur

  // Adiciona evento de tecla Enter para adicionar item
  document.getElementById('shopping-item').addEventListener('keydown', function (e) {
    if (e.key.toString() === 'Enter') {
      document.getElementById('shopping-add-btn').click();
    }
  });

  // Adiciona evento de tecla Enter para adicionar item
  document.getElementById('shopping-price').addEventListener('keydown', function (e) {
    if (e.key.toString() === 'Enter') {
      document.getElementById('shopping-add-btn').click();
    }
  });


  renderShoppingList();
});

