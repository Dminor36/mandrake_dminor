// 資源與曼德拉草數據初始化
let fruit = 100;

const mandrakes = {
  normal: {
    count: 0,
    baseCost: 10,
    cost: 10,
    baseProduction: 0.1,
    production: 0.1,
    costGrowth: 1.15,
    prodGrowth: 1.05
  },
  fire: {
    count: 0,
    baseCost: 50,
    cost: 50,
    baseProduction: 0.5,
    production: 0.5,
    costGrowth: 1.20,
    prodGrowth: 1.07
  },
  cat: {
    count: 0,
    baseCost: 100,
    cost: 100,
    baseProduction: 1.0,
    production: 1.0,
    costGrowth: 1.30,
    prodGrowth: 1.10
  }
};

function saveGame() {
  const saveData = {
    fruit,
    mandrakes: {
      normal: mandrakes.normal.count,
      fire: mandrakes.fire.count,
      cat: mandrakes.cat.count
    }
  };
  localStorage.setItem("mandrakeSave", JSON.stringify(saveData));
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem("mandrakeSave"));
  if (save) {
    fruit = save.fruit ?? 0;
    for (const type in save.mandrakes) {
      mandrakes[type].count = save.mandrakes[type];
      updateMandrakeStats(type);
    }
  }
}

// 更新成本與生產力（每次購買後依照各自成長率遞增）
function updateMandrakeStats(type) {
  const plant = mandrakes[type];
  plant.cost = Math.floor(plant.baseCost * Math.pow(plant.costGrowth, plant.count));
  plant.production = (plant.baseProduction * Math.pow(plant.prodGrowth, plant.count));
}

function updateCosts() {
  for (const type in mandrakes) {
    const button = document.getElementById(`${type}-button`);
    button.innerText = `種植（${mandrakes[type].cost}）`;

    button.onmousemove = (e) => showTooltip(e, type);
    button.onmouseleave = hideTooltip;
  }
}

let lastMouseX = 0;
let lastMouseY = 0;

function showTooltip(event, type) {
  lastMouseX = event.pageX;
  lastMouseY = event.pageY;
  const plant = mandrakes[type];
  const nextProduction = plant.baseProduction * Math.pow(plant.prodGrowth, plant.count + 1);
  const delta = nextProduction - plant.production;

  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "block";
  tooltip.innerText = `升級後產量增加：約 +${delta.toFixed(2)} /秒`;
  tooltip.style.left = event.pageX + 10 + "px";
  tooltip.style.top = event.pageY + 10 + "px";
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}

// 種植函式
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
      showTooltip(fakeEvent, type);
    }
  } else {
    alert("果實不足！");
  }
}

// 每秒自動生產果實
setInterval(() => {
  let totalProduction = 0;
  for (const type in mandrakes) {
    totalProduction += mandrakes[type].count * mandrakes[type].production;
  }
  fruit += totalProduction;
  updateUI();
  saveGame();
}, 1000);

// 更新畫面顯示
function updateUI() {
  document.getElementById("fruit").innerText = fruit.toFixed(1);
  document.getElementById("production-rate").innerText = (
    mandrakes.normal.count * mandrakes.normal.production +
    mandrakes.fire.count * mandrakes.fire.production +
    mandrakes.cat.count * mandrakes.cat.production
  ).toFixed(1);

  document.getElementById("normal-count").innerText = mandrakes.normal.count;
  document.getElementById("fire-count").innerText = mandrakes.fire.count;
  document.getElementById("cat-count").innerText = mandrakes.cat.count;

  document.getElementById("normal-production").innerText = (mandrakes.normal.count * mandrakes.normal.production).toFixed(1);
  document.getElementById("fire-production").innerText = (mandrakes.fire.count * mandrakes.fire.production).toFixed(1);
  document.getElementById("cat-production").innerText = (mandrakes.cat.count * mandrakes.cat.production).toFixed(1);

  const total = mandrakes.normal.count + mandrakes.fire.count + mandrakes.cat.count;
  document.getElementById("mandrakes").innerText = total;

  updateCosts();
} 

// 啟動時載入並更新畫面
loadGame();
updateUI();
