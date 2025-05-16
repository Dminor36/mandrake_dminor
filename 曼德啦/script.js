// 資源與曼德拉草數據初始化
let fruit = 100;

const mandrakes = {
  normal: { count: 0, cost: 10, production: 0.1 },
  fire:   { count: 0, cost: 50, production: 0.5 },
  cat:    { count: 0, cost: 100, production: 1.0 }
};

// 稍後可用公式改為遞增成本
function updateCosts() {
  document.getElementById("normal-button").innerText = `種植（${mandrakes.normal.cost}）`;
  document.getElementById("fire-button").innerText = `種植（${mandrakes.fire.cost}）`;
  document.getElementById("cat-button").innerText = `種植（${mandrakes.cat.cost}）`;
}

// 種植函式
function buyMandrake(type) {
  const plant = mandrakes[type];
  if (fruit >= plant.cost) {
    fruit -= plant.cost;
    plant.count++;
    updateUI();
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

// 預設啟動畫面
updateUI();
