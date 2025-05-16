// ✅ 初始化：果實與曼德拉草資料結構
let fruit = 100;

const mandrakes = {
  normal: { name: "普通曼德拉草", icon: "🌱", count: 0, baseCost: 10, cost: 10, baseProduction: 0.1, production: 0.1, costGrowth: 1.15, prodGrowth: 1.05 },
  fire: { name: "火曼德拉草", icon: "🔥", count: 0, baseCost: 50, cost: 50, baseProduction: 0.5, production: 0.5, costGrowth: 1.20, prodGrowth: 1.07 },
  cat: { name: "貓曼德拉草", icon: "🐱", count: 0, baseCost: 100, cost: 100, baseProduction: 1.0, production: 1.0, costGrowth: 1.30, prodGrowth: 1.10 }
};

// ✅ 動態生成 UI：依照 mandrakes 自動插入畫面元素
function generateMandrakeUI() {
  const container = document.getElementById("mandrake-list");
  container.innerHTML = "";

  for (const type in mandrakes) {
    const plant = mandrakes[type];

    const row = document.createElement("div");
    row.className = "plant-row";
    row.innerHTML = `
      <div>
        <div>${plant.icon} ${plant.name}：<span id="${type}-count">0</span> 株</div>
        <div>產量：<span id="${type}-production">0.0</span>/秒</div>
      </div>
      <button id="${type}-button" onclick="buyMandrake('${type}')">種植（${plant.cost}）</button>
    `;
    container.appendChild(row);
  }
}

// ✅ 更新單一曼德拉草的價格與生產力
function updateMandrakeStats(type) {
  const plant = mandrakes[type];
  plant.cost = Math.floor(plant.baseCost * Math.pow(plant.costGrowth, plant.count));
  plant.production = plant.baseProduction * Math.pow(plant.prodGrowth, plant.count);
}

// ✅ 更新所有按鈕成本與 tooltip 綁定
function updateCosts() {
  for (const type in mandrakes) {
    const button = document.getElementById(`${type}-button`);
    if (button) {
      button.innerText = `種植（${mandrakes[type].cost}）`;
      button.onmousemove = (e) => showTooltip(e, type);
      button.onmouseleave = hideTooltip;
    }
  }
}

// ✅ 滑鼠位置記錄（for tooltip 定位）
let lastMouseX = 0;
let lastMouseY = 0;

// ✅ 顯示滑鼠提示框（升級後產量增加）
function showTooltip(event, type) {
  lastMouseX = event.pageX;
  lastMouseY = event.pageY;
  const plant = mandrakes[type];

  const currentTotal = plant.count * plant.production;
  const nextSingle = plant.baseProduction * Math.pow(plant.prodGrowth, plant.count + 1);
  const nextTotal = (plant.count + 1) * nextSingle;
  const delta = nextTotal - currentTotal;

  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "block";
  tooltip.innerText = `升級後產量增加：約 +${delta.toFixed(1)} /秒`;
  tooltip.style.left = event.pageX + 10 + "px";
  tooltip.style.top = event.pageY + 10 + "px";
}

// ✅ 隱藏 tooltip
function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}

// ✅ 購買特定種類的曼德拉草
function buyMandrake(type) {
  const plant = mandrakes[type];
  if (fruit >= plant.cost) {
    fruit -= plant.cost;
    plant.count++;
    updateMandrakeStats(type);
    updateUI();
saveGame();

    const tooltip = document.getElementById("tooltip");
    if (tooltip.style.display === "block") {
      const fakeEvent = { pageX: lastMouseX, pageY: lastMouseY };
      requestAnimationFrame(() => showTooltip(fakeEvent, type));
    }
  } else {
    alert("果實不足！");
  }
}

// ✅ 每秒進行資源生產與畫面更新
setInterval(() => {
  let totalProduction = 0;
  for (const type in mandrakes) {
    totalProduction += mandrakes[type].count * mandrakes[type].production;
  }
  fruit += totalProduction;
  updateUI();
}, 1000);

// ✅ 畫面更新：果實數、各類數量與產量、總數
function updateUI() {
  document.getElementById("fruit").innerText = fruit.toFixed(1);

  let totalProduction = 0;
  let totalCount = 0;

  for (const type in mandrakes) {
    totalProduction += mandrakes[type].count * mandrakes[type].production;
    totalCount += mandrakes[type].count;

    const countEl = document.getElementById(`${type}-count`);
    const prodEl = document.getElementById(`${type}-production`);

    if (countEl) countEl.innerText = mandrakes[type].count;
    if (prodEl) prodEl.innerText = (mandrakes[type].count * mandrakes[type].production).toFixed(1);
  }

  document.getElementById("production-rate").innerText = totalProduction.toFixed(1);
  document.getElementById("mandrakes").innerText = totalCount;

  updateCosts();
}

// ✅ 儲存進度到 localStorage
function saveGame() {
  const saveData = {
    fruit,
    mandrakes: {}
  };
  for (const type in mandrakes) {
    saveData.mandrakes[type] = mandrakes[type].count;
  }
  localStorage.setItem("mandrakeSave", JSON.stringify(saveData));
}

// ✅ 載入進度（如果有）
function loadGame() {
  const save = JSON.parse(localStorage.getItem("mandrakeSave"));
  if (save) {
    fruit = save.fruit ?? 0;
    for (const type in save.mandrakes) {
      if (mandrakes[type]) {
        mandrakes[type].count = save.mandrakes[type];
        updateMandrakeStats(type);
      }
    }
  }
}

// ✅ 初始化 UI
loadGame();
generateMandrakeUI();
updateUI();
