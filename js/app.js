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

const areaModeToggle = document.querySelector("#areaModeToggle");
const undoAreaPoint = document.querySelector("#undoAreaPoint");
const clearArea = document.querySelector("#clearArea");
const copyArea = document.querySelector("#copyArea");
const copyLockedArea = document.querySelector("#copyLockedArea");
const focusOcciputArea = document.querySelector("#focusOcciputArea");
const areaCount = document.querySelector("#areaCount");
const areaReadout = document.querySelector("#areaReadout");
const areaPointList = document.querySelector("#areaPointList");
const areaHotspots = Array.from({ length: 10 }, (_, i) => document.querySelector(`#areaHotspot${i + 1}`));

const lockedPoints = {
  endocrine: {
    id: "endocrine",
    name: "Endocrine",
    position: "0.009773924042668837m -0.014079374316460704m -0.0018216833743757571m",
    normal: "0.47519742534282616m 0.7657524390068502m -0.43337121397551237m",
    type: "point"
  },
  sympathetic: {
    id: "sympathetic",
    name: "Sympathetic",
    position: "0.011181402923839887m 0.011667931795852654m -0.00113929592513589m",
    normal: "-0.5132019242580357m 0.14157027620511384m -0.8465114540471718m",
    type: "point"
  },
  subcortex: {
    id: "subcortex",
    name: "Subcortex",
    position: "0.005622201022628646m -0.008027627583324322m -0.007285956116623894m",
    normal: "0.42477898955910637m 0.9031278682878421m -0.06263276739058284m",
    type: "point"
  },
  thalamus: {
    id: "thalamus",
    name: "Thalamus",
    position: "0.005539053244458796m -0.00920252511047151m -0.004354114972614249m",
    normal: "0.4434051161040665m 0.6844891516128396m 0.5786765109602033m",
    type: "point"
  },
  adrenal: {
    id: "adrenal",
    name: "Adrenal",
    position: "0.013371002694813033m -0.005945040577114045m -0.004568411531561872m",
    normal: "0.18959473971573781m -0.0024429091862066257m -0.9818593926152713m",
    type: "point"
  }
};

const lockedArea = {
  id: "occiput",
  name: "Occiput",
  type: "area",
  centerPosition: "0.0018973902953472828m -0.01262926626828471m -0.010344359682963027m",
  centerNormal: "0.213429930731119m 0.1358585307522248m -0.9674731929840318m",
  boundaryPoints: [
    {
      position: "0.005580083851689066m -0.009140114582105684m -0.0092023583290608m",
      normal: "0.45019971124962516m 0.2287415412921462m -0.8631323926710477m"
    },
    {
      position: "0.0053748263485127595m -0.015453982899116623m -0.00933496738997372m",
      normal: "0.3623864002652049m 0.13970017651045677m -0.9214987561498789m"
    },
    {
      position: "-0.007839476639670225m -0.0168302670952966m -0.013301590085479195m",
      normal: "-0.2738923027760284m -0.15047271366569762m -0.9499162957451176m"
    },
    {
      position: "0.00447412762085753m -0.009092700496619938m -0.009538522927338394m",
      normal: "0.26651585400939254m 0.2938716110112666m -0.9179372395775688m"
    }
  ]
};

let placementMode = false;
let areaMode = false;
let calibrationPoint = null;
let areaPoints = [];
let labelsHidden = false;

const views = {
  front: { orbit: "0deg 75deg 105%", target: "0m 0m 0m", fov: "32deg" },
  lower: { orbit: "-14deg 78deg 64%", target: "0m -0.009m 0m", fov: "28deg" },
  side: { orbit: "-68deg 78deg 105%", target: "0m 0m 0m", fov: "32deg" },
  occiput: { orbit: "-40deg 82deg 70%", target: "0.0018973902953472828m -0.01262926626828471m -0.010344359682963027m", fov: "24deg" }
};

function applyView(view) {
  viewer.cameraTarget = view.target;
  viewer.cameraOrbit = view.orbit;
  viewer.fieldOfView = view.fov;
}

function pointTarget(position) {
  return position.trim().split(/\s+/).slice(0, 3).join(" ");
}

function setPointMode(on) {
  placementMode = on;
  if (on) setAreaMode(false);
  placementToggle.classList.toggle("is-on", on);
  placementToggle.setAttribute("aria-pressed", String(on));
  placementToggle.textContent = on
    ? "Point placement is ON — tap Ear 1"
    : "Turn on point placement mode";
}

function setAreaMode(on) {
  areaMode = on;
  if (on) {
    placementMode = false;
    placementToggle.classList.remove("is-on");
    placementToggle.setAttribute("aria-pressed", "false");
    placementToggle.textContent = "Turn on point placement mode";
  }
  areaModeToggle.classList.toggle("is-on", on);
  areaModeToggle.setAttribute("aria-pressed", String(on));
  areaModeToggle.textContent = on
    ? "Area calibration is ON — tap boundary"
    : "Turn on area calibration mode";
}

function clearTemporaryPoint() {
  calibrationPoint = null;
  calibrationHotspot.classList.remove("is-active");
  calibrationReadout.hidden = true;
  clearCalibration.disabled = true;
}

function renderAreaPoints() {
  areaHotspots.forEach((hotspot, index) => {
    const point = areaPoints[index];
    if (point) {
      viewer.updateHotspot({
        name: `hotspot-area-${index + 1}`,
        position: point.position,
        normal: point.normal
      });
      hotspot.classList.add("is-active");
    } else {
      hotspot.classList.remove("is-active");
    }
  });

  areaCount.textContent = String(areaPoints.length);
  undoAreaPoint.disabled = areaPoints.length === 0;
  clearArea.disabled = areaPoints.length === 0;
  areaReadout.hidden = areaPoints.length === 0;

  areaPointList.innerHTML = areaPoints
    .map(
      (point, index) => `
    <section class="area-data-row">
      <strong>Boundary ${index + 1}</strong>
      <div><span>Position</span><code>${point.position}</code></div>
      <div><span>Normal</span><code>${point.normal}</code></div>
    </section>
  `
    )
    .join("");
}

viewer.addEventListener("load", () => {
  modelStatus.textContent = "Ear 1 ready · 5 locked points + 1 locked area";

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

  viewer.updateHotspot({
    name: "hotspot-occiput-center",
    position: lockedArea.centerPosition,
    normal: lockedArea.centerNormal
  });
  viewer.updateHotspot({
    name: "hotspot-occiput-center-label",
    position: lockedArea.centerPosition,
    normal: lockedArea.centerNormal
  });

  lockedArea.boundaryPoints.forEach((point, index) => {
    viewer.updateHotspot({
      name: `hotspot-occiput-boundary-${index + 1}`,
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

focusOcciputArea?.addEventListener("click", () => applyView(views.occiput));

document.querySelectorAll("[data-focus-point]").forEach((button) => {
  button.addEventListener("click", () => {
    const point = lockedPoints[button.dataset.focusPoint];
    if (!point) return;
    viewer.cameraTarget = pointTarget(point.position);
    viewer.fieldOfView = "25deg";
  });
});

document.querySelectorAll("[data-focus-area]").forEach((button) => {
  button.addEventListener("click", () => applyView(views.occiput));
});

toggleLabels.addEventListener("click", () => {
  labelsHidden = !labelsHidden;
  document.querySelectorAll(".locked-label").forEach((label) => {
    label.classList.toggle("is-hidden", labelsHidden);
  });
  toggleLabels.setAttribute("aria-pressed", String(labelsHidden));
  toggleLabels.textContent = labelsHidden ? "Show point labels" : "Hide point labels";
});

placementToggle.addEventListener("click", () => setPointMode(!placementMode));
areaModeToggle.addEventListener("click", () => setAreaMode(!areaMode));

viewer.addEventListener("click", (event) => {
  if (!placementMode && !areaMode) return;

  const hit = viewer.positionAndNormalFromPoint(event.clientX, event.clientY);
  if (!hit) return;

  const position = hit.position.toString();
  const normal = hit.normal.toString();

  if (areaMode) {
    if (areaPoints.length >= 10) return;
    areaPoints.push({ position, normal });
    renderAreaPoints();
    return;
  }

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

undoAreaPoint.addEventListener("click", () => {
  areaPoints.pop();
  renderAreaPoints();
});

clearArea.addEventListener("click", () => {
  areaPoints = [];
  renderAreaPoints();
});

copyCalibration.addEventListener("click", async () => {
  if (!calibrationPoint) return;
  const text = `Bloomé 3D calibration point\nEar: ${calibrationPoint.ear}\nPosition: ${calibrationPoint.position}\nNormal: ${calibrationPoint.normal}`;

  try {
    await navigator.clipboard.writeText(text);
    copyCalibration.textContent = "Copied";
    setTimeout(() => (copyCalibration.textContent = "Copy temporary point data"), 1300);
  } catch {
    copyCalibration.textContent = "Copy unavailable";
  }
});

copyArea.addEventListener("click", async () => {
  if (areaPoints.length === 0) return;

  const lines = areaPoints
    .map(
      (point, index) => `Boundary ${index + 1}\nPosition: ${point.position}\nNormal: ${point.normal}`
    )
    .join("\n\n");

  const text = `Bloomé 3D area calibration\nArea: Occiput\nEar: 1\nBoundary points: ${areaPoints.length}\n\n${lines}`;

  try {
    await navigator.clipboard.writeText(text);
    copyArea.textContent = "Copied";
    setTimeout(() => (copyArea.textContent = "Copy Occiput area data"), 1300);
  } catch {
    copyArea.textContent = "Copy unavailable";
  }
});

copyLockedArea?.addEventListener("click", async () => {
  const lines = lockedArea.boundaryPoints
    .map(
      (point, index) => `Boundary ${index + 1}\nPosition: ${point.position}\nNormal: ${point.normal}`
    )
    .join("\n\n");

  const text = `Bloomé 3D locked area\nArea: Occiput\nEar: 1\nBoundary points: ${lockedArea.boundaryPoints.length}\n\n${lines}`;

  try {
    await navigator.clipboard.writeText(text);
    copyLockedArea.textContent = "Copied";
    setTimeout(() => (copyLockedArea.textContent = "Copy locked Occiput data"), 1300);
  } catch {
    copyLockedArea.textContent = "Copy unavailable";
  }
});

document.querySelectorAll(".copy-locked-point").forEach((button) => {
  button.addEventListener("click", async () => {
    const point = lockedPoints[button.dataset.copyPoint];
    if (!point) return;

    const text = `Bloomé 3D locked point\nPoint: ${point.name}\nEar: 1\nPosition: ${point.position}\nNormal: ${point.normal}`;

    const original = button.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
      setTimeout(() => (button.textContent = original), 1300);
    } catch {
      button.textContent = "Copy unavailable";
    }
  });
});
