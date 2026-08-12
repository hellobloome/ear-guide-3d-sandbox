const viewer = document.querySelector("#earViewer");
const modelStatus = document.querySelector("#modelStatus");
const calibrationHotspot = document.querySelector("#calibrationHotspot");

const placementToggle = document.querySelector("#placementToggle");
const clearCalibration = document.querySelector("#clearCalibration");
const calibrationReadout = document.querySelector("#calibrationReadout");
const calibrationPosition = document.querySelector("#calibrationPosition");
const calibrationNormal = document.querySelector("#calibrationNormal");
const copyCalibration = document.querySelector("#copyCalibration");
const toggleLabels = document.querySelector("#toggleLabels");

const lockedPoints = {
  "endocrine": {
    "id": "endocrine",
    "name": "Endocrine",
    "position": "0.009773924042668837m -0.014079374316460704m -0.0018216833743757571m",
    "normal": "0.47519742534282616m 0.7657524390068502m -0.43337121397551237m"
  },
  "sympathetic": {
    "id": "sympathetic",
    "name": "Sympathetic",
    "position": "0.011181402923839887m 0.011667931795852654m -0.00113929592513589m",
    "normal": "-0.5132019242580357m 0.14157027620511384m -0.8465114540471718m"
  },
  "subcortex": {
    "id": "subcortex",
    "name": "Subcortex",
    "position": "0.005622201022628646m -0.008027627583324322m -0.007285956116623894m",
    "normal": "0.42477898955910637m 0.9031278682878421m -0.06263276739058284m"
  },
  "thalamus": {
    "id": "thalamus",
    "name": "Thalamus",
    "position": "0.005539053244458796m -0.00920252511047151m -0.004354114972614249m",
    "normal": "0.4434051161040665m 0.6844891516128396m 0.5786765109602033m"
  }
};

let placementMode = false;
let calibrationPoint = null;
let labelsHidden = false;

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

function pointTarget(position){
  const parts = position.trim().split(/\s+/);
  return parts.slice(0,3).join(" ");
}

viewer.addEventListener("load", () => {
  modelStatus.textContent = "Ear 1 ready · 4 locked points";

  Object.values(lockedPoints).forEach((point) => {
    viewer.updateHotspot({
      name: `hotspot-${point.id}`,
      position: point.position,
      normal: point.normal
    });
    viewer.updateHotspot({
      name: `hotspot-${point.id}-label`,
      position: point.position,
      normal: point.normal
    });
  });

  applyView(views.front);
});

viewer.addEventListener("progress", (event) => {
  const bar = viewer.querySelector(".progress-bar");
  if (bar) bar.style.transform = `scaleX(${event.detail.totalProgress})`;
});

document.querySelector("#frontView").addEventListener("click", () => applyView(views.front));
document.querySelector("#lowerConchaView").addEventListener("click", () => applyView(views.lower));
document.querySelector("#sideView").addEventListener("click", () => applyView(views.side));
document.querySelector("#resetView").addEventListener("click", () => applyView(views.front));

document.querySelectorAll("[data-focus-point]").forEach((button) => {
  button.addEventListener("click", () => {
    const point = lockedPoints[button.dataset.focusPoint];
    if (!point) return;

    viewer.cameraTarget = pointTarget(point.position);
    viewer.fieldOfView = "25deg";
  });
});

toggleLabels.addEventListener("click", () => {
  labelsHidden = !labelsHidden;
  document.querySelectorAll(".locked-label").forEach((label) => {
    label.classList.toggle("is-hidden", labelsHidden);
  });
  toggleLabels.setAttribute("aria-pressed", String(labelsHidden));
  toggleLabels.textContent = labelsHidden ? "Show point labels" : "Hide point labels";
});

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

document.querySelectorAll(".copy-locked-point").forEach((button) => {
  button.addEventListener("click", async () => {
    const point = lockedPoints[button.dataset.copyPoint];
    if (!point) return;

    const text =
`Bloomé 3D locked point
Point: ${point.name}
Ear: 1
Position: ${point.position}
Normal: ${point.normal}`;

    const original = button.textContent.trim();
    try{
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
      setTimeout(() => button.textContent = original, 1300);
    }catch{
      button.textContent = "Copy unavailable";
    }
  });
});
