const viewer = document.querySelector("#earViewer");
const modelStatus = document.querySelector("#modelStatus");

const endocrineHotspot = document.querySelector("#endocrineHotspot");
const calibrationHotspot = document.querySelector("#calibrationHotspot");

const placementToggle = document.querySelector("#placementToggle");
const clearCalibration = document.querySelector("#clearCalibration");
const calibrationReadout = document.querySelector("#calibrationReadout");
const calibrationPosition = document.querySelector("#calibrationPosition");
const calibrationNormal = document.querySelector("#calibrationNormal");
const copyCalibration = document.querySelector("#copyCalibration");
const copyPoint = document.querySelector("#copyPoint");

const lockedPoint = {
  point: "Endocrine",
  ear: 1,
  position: "0.009558152093243306m -0.013357561336935955m -0.00036221876286193777m",
  normal: "0.4400594620926465m 0.8495934728511428m -0.29075522473631493m"
};

let placementMode = false;
let calibrationPoint = null;

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

function clearTemporaryPoint(){
  calibrationPoint = null;
  calibrationHotspot.classList.remove("is-active");
  calibrationReadout.hidden = true;
  clearCalibration.disabled = true;
}

viewer.addEventListener("load", () => {
  modelStatus.textContent = "Ear 1 ready";
  applyView(views.front);

  viewer.updateHotspot({
    name: "hotspot-endocrine",
    position: lockedPoint.position,
    normal: lockedPoint.normal
  });
  viewer.updateHotspot({
    name: "hotspot-endocrine-label",
    position: lockedPoint.position,
    normal: lockedPoint.normal
  });
});

viewer.addEventListener("progress", (event) => {
  const bar = viewer.querySelector(".progress-bar");
  if (bar) bar.style.transform = `scaleX(${event.detail.totalProgress})`;
});

document.querySelector("#frontView").addEventListener("click", () => applyView(views.front));
document.querySelector("#lowerConchaView").addEventListener("click", () => applyView(views.lower));
document.querySelector("#sideView").addEventListener("click", () => applyView(views.side));
document.querySelector("#resetView").addEventListener("click", () => applyView(views.front));

placementToggle.addEventListener("click", () => {
  placementMode = !placementMode;
  placementToggle.classList.toggle("is-on", placementMode);
  placementToggle.setAttribute("aria-pressed", String(placementMode));
  placementToggle.textContent = placementMode
    ? "Placement mode is ON — tap Ear 1"
    : "Turn on placement mode";
});

viewer.addEventListener("click", (event) => {
  if (!placementMode) return;

  const hit = viewer.positionAndNormalFromPoint(event.clientX, event.clientY);
  if (!hit) return;

  const position = hit.position.toString();
  const normal = hit.normal.toString();

  viewer.updateHotspot({
    name: "hotspot-calibration",
    position,
    normal
  });

  calibrationHotspot.classList.add("is-active");
  calibrationPosition.textContent = position;
  calibrationNormal.textContent = normal;
  calibrationReadout.hidden = false;
  clearCalibration.disabled = false;

  calibrationPoint = {
    ear: 1,
    position,
    normal
  };
});

clearCalibration.addEventListener("click", clearTemporaryPoint);

copyCalibration.addEventListener("click", async () => {
  if (!calibrationPoint) return;
  const text =
`Bloomé 3D calibration point
Ear: ${calibrationPoint.ear}
Position: ${calibrationPoint.position}
Normal: ${calibrationPoint.normal}`;

  try{
    await navigator.clipboard.writeText(text);
    copyCalibration.textContent = "Copied";
    setTimeout(() => copyCalibration.textContent = "Copy temporary point data", 1300);
  }catch{
    copyCalibration.textContent = "Copy unavailable";
  }
});

copyPoint.addEventListener("click", async () => {
  const text =
`Bloomé 3D locked point
Point: ${lockedPoint.point}
Ear: ${lockedPoint.ear}
Position: ${lockedPoint.position}
Normal: ${lockedPoint.normal}`;

  try{
    await navigator.clipboard.writeText(text);
    copyPoint.textContent = "Copied";
    setTimeout(() => copyPoint.textContent = "Copy Endocrine data", 1300);
  }catch{
    copyPoint.textContent = "Copy unavailable";
  }
});
