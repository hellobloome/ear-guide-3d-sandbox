
const viewer = document.querySelector("#earViewer");
const modelStatus = document.querySelector("#modelStatus");
const choices = [...document.querySelectorAll(".ear-choice")];
const hotspot = document.querySelector("#testHotspot");
const placementToggle = document.querySelector("#placementToggle");
const pointReadout = document.querySelector("#pointReadout");
const positionValue = document.querySelector("#positionValue");
const normalValue = document.querySelector("#normalValue");
const copyPoint = document.querySelector("#copyPoint");

let currentEar = 1;
let placementMode = false;
let pointData = null;

const views = {
  front: {orbit:"0deg 75deg 105%", target:"0m 0m 0m", fov:"32deg"},
  lower: {orbit:"-14deg 78deg 64%", target:"0m -0.009m 0m", fov:"28deg"},
  side: {orbit:"-68deg 78deg 105%", target:"0m 0m 0m", fov:"32deg"}
};

function applyView(view){
  viewer.cameraTarget = view.target;
  viewer.cameraOrbit = view.orbit;
  viewer.fieldOfView = view.fov;
}

function clearTestPoint(){
  hotspot.classList.remove("is-active");
  pointReadout.hidden = true;
  pointData = null;
}

choices.forEach(btn => {
  btn.addEventListener("click", () => {
    currentEar = Number(btn.dataset.ear);
    choices.forEach(b => b.classList.toggle("active", b === btn));
    modelStatus.textContent = `Loading Ear ${currentEar}…`;
    clearTestPoint();
    viewer.src = `./models/ear-${currentEar}.glb`;
  });
});

viewer.addEventListener("load", () => {
  modelStatus.textContent = `Ear ${currentEar} ready`;
  applyView(views.front);
});

viewer.addEventListener("progress", (event) => {
  const bar = viewer.querySelector(".progress-bar");
  if (bar) bar.style.transform = `scaleX(${event.detail.totalProgress})`;
});

document.querySelector("#frontView").addEventListener("click", () => applyView(views.front));
document.querySelector("#lowerConchaView").addEventListener("click", () => applyView(views.lower));
document.querySelector("#sideView").addEventListener("click", () => applyView(views.side));
document.querySelector("#resetView").addEventListener("click", () => {
  clearTestPoint();
  applyView(views.front);
});

placementToggle.addEventListener("click", () => {
  placementMode = !placementMode;
  placementToggle.classList.toggle("is-on", placementMode);
  placementToggle.setAttribute("aria-pressed", String(placementMode));
  placementToggle.textContent = placementMode
    ? "Placement mode is ON — tap the ear"
    : "Turn on placement mode";
});

viewer.addEventListener("click", (event) => {
  if (!placementMode) return;

  const hit = viewer.positionAndNormalFromPoint(event.clientX, event.clientY);
  if (!hit) return;

  const position = hit.position.toString();
  const normal = hit.normal.toString();

  viewer.updateHotspot({
    name: "hotspot-test",
    position,
    normal
  });

  hotspot.classList.add("is-active");
  positionValue.textContent = position;
  normalValue.textContent = normal;
  pointReadout.hidden = false;

  pointData = {
    ear: currentEar,
    position,
    normal
  };
});

copyPoint.addEventListener("click", async () => {
  if (!pointData) return;
  const text =
`Bloomé 3D test point
Ear: ${pointData.ear}
Position: ${pointData.position}
Normal: ${pointData.normal}`;

  try{
    await navigator.clipboard.writeText(text);
    copyPoint.textContent = "Copied";
    setTimeout(() => copyPoint.textContent = "Copy point data", 1300);
  }catch{
    copyPoint.textContent = "Copy unavailable";
  }
});
