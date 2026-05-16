const circles = [
  {
    id: "focusTube",
    label: "Focus tube diameter",
    size: 620,
    color: "#00a3ff",
    opacity: 100,
    min: 20,
    max: 900
  },
  {
    id: "secondaryEdge",
    label: "Outside edge of secondary",
    size: 440,
    color: "#00d084",
    opacity: 100,
    min: 20,
    max: 900
  },
  {
    id: "primaryReflection",
    label: "Primary reflection",
    size: 300,
    color: "#ffcf33",
    opacity: 100,
    min: 20,
    max: 900
  },
  {
    id: "secondaryReflection",
    label: "Secondary reflection",
    size: 170,
    color: "#ff6b35",
    opacity: 100,
    min: 20,
    max: 900
  },
  {
    id: "centerPoint",
    label: "Center point",
    size: 18,
    color: "#ffffff",
    opacity: 100,
    min: 4,
    max: 120
  }
];

const video = document.querySelector("#camera");
const overlay = document.querySelector("#overlay");
const controls = document.querySelector("#circleControls");
const startCamera = document.querySelector("#startCamera");
const cameraSelect = document.querySelector("#cameraSelect");
const cameraStatus = document.querySelector("#cameraStatus");
const brightnessControl = document.querySelector("#brightnessControl");
const brightnessValue = document.querySelector("#brightnessValue");
const focusControl = document.querySelector("#focusControl");
const focusValue = document.querySelector("#focusValue");
const overlayOffsetX = document.querySelector("#overlayOffsetX");
const overlayOffsetXValue = document.querySelector("#overlayOffsetXValue");
const overlayOffsetY = document.querySelector("#overlayOffsetY");
const overlayOffsetYValue = document.querySelector("#overlayOffsetYValue");
const presetName = document.querySelector("#presetName");
const savePreset = document.querySelector("#savePreset");
const presetSelect = document.querySelector("#presetSelect");
const loadPreset = document.querySelector("#loadPreset");
const presetStatus = document.querySelector("#presetStatus");
const viewer = document.querySelector(".viewer");

let activeStream = null;
let activeTrack = null;
let overlayCenter = {
  x: 0,
  y: 0
};
let videoOverlayScale = 1;

const cameraControlConfigs = [
  {
    input: brightnessControl,
    output: brightnessValue,
    capability: "brightness",
    constraint: "brightness"
  },
  {
    input: focusControl,
    output: focusValue,
    capability: "focusDistance",
    constraint: "focusDistance",
    useManualFocus: true
  }
];

function renderCircles() {
  overlay.replaceChildren();

  circles.forEach((circle) => {
    const scaledSize = circle.size * videoOverlayScale;
    const element = document.createElement("div");
    element.className = "circle";
    element.dataset.circle = circle.id;
    element.style.setProperty("--circle-size", `${scaledSize}px`);
    element.style.setProperty("--circle-color", circle.color);
    element.style.setProperty("--circle-opacity", circle.opacity / 100);
    overlay.appendChild(element);
  });
}

function renderControls() {
  controls.replaceChildren();

  circles.forEach((circle) => {
    const group = document.createElement("section");
    group.className = "circle-control";

    const title = document.createElement("h2");
    title.textContent = circle.label;

    const sizeRow = document.createElement("label");
    sizeRow.className = "control-row";

    const sizeLabel = document.createElement("span");
    sizeLabel.textContent = "Size";

    const sizeInput = document.createElement("input");
    sizeInput.type = "range";
    sizeInput.min = String(circle.min);
    sizeInput.max = String(circle.max);
    sizeInput.value = String(circle.size);

    const sizeValue = document.createElement("span");
    sizeValue.className = "size-value";
    sizeValue.textContent = `${circle.size}px`;

    sizeInput.addEventListener("input", () => {
      circle.size = Number(sizeInput.value);
      sizeValue.textContent = `${circle.size}px`;
      renderCircles();
    });

    sizeRow.append(sizeLabel, sizeInput, sizeValue);

    const colorRow = document.createElement("label");
    colorRow.className = "control-row";

    const colorLabel = document.createElement("span");
    colorLabel.textContent = "Color";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = circle.color;

    colorInput.addEventListener("input", () => {
      circle.color = colorInput.value;
      renderCircles();
    });

    const colorValue = document.createElement("span");
    colorValue.textContent = "";

    colorRow.append(colorLabel, colorInput, colorValue);

    const opacityRow = document.createElement("label");
    opacityRow.className = "control-row";

    const opacityLabel = document.createElement("span");
    opacityLabel.textContent = "Opacity";

    const opacityInput = document.createElement("input");
    opacityInput.type = "range";
    opacityInput.min = "0";
    opacityInput.max = "100";
    opacityInput.value = String(circle.opacity);

    const opacityValue = document.createElement("span");
    opacityValue.className = "size-value";
    opacityValue.textContent = `${circle.opacity}%`;

    opacityInput.addEventListener("input", () => {
      circle.opacity = Number(opacityInput.value);
      opacityValue.textContent = `${circle.opacity}%`;
      renderCircles();
    });

    opacityRow.append(opacityLabel, opacityInput, opacityValue);
    group.append(title, sizeRow, colorRow, opacityRow);
    controls.appendChild(group);
  });
}

function updateOverlayCenter() {
  overlay.style.setProperty("--overlay-offset-x", `${overlayCenter.x * videoOverlayScale}px`);
  overlay.style.setProperty("--overlay-offset-y", `${overlayCenter.y * videoOverlayScale}px`);
  overlayOffsetX.value = String(overlayCenter.x);
  overlayOffsetY.value = String(overlayCenter.y);
  overlayOffsetXValue.textContent = `${overlayCenter.x}px`;
  overlayOffsetYValue.textContent = `${overlayCenter.y}px`;
}

function updateVideoOverlayGeometry() {
  const viewerRect = viewer.getBoundingClientRect();
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  if (!videoWidth || !videoHeight || !viewerRect.width || !viewerRect.height) {
    overlay.style.left = "0px";
    overlay.style.top = "0px";
    overlay.style.width = `${viewerRect.width}px`;
    overlay.style.height = `${viewerRect.height}px`;
    videoOverlayScale = 1;
    updateOverlayCenter();
    renderCircles();
    return;
  }

  const videoAspect = videoWidth / videoHeight;
  const viewerAspect = viewerRect.width / viewerRect.height;
  let displayedWidth = viewerRect.width;
  let displayedHeight = viewerRect.height;

  if (viewerAspect > videoAspect) {
    displayedHeight = viewerRect.height;
    displayedWidth = displayedHeight * videoAspect;
  } else {
    displayedWidth = viewerRect.width;
    displayedHeight = displayedWidth / videoAspect;
  }

  overlay.style.left = `${(viewerRect.width - displayedWidth) / 2}px`;
  overlay.style.top = `${(viewerRect.height - displayedHeight) / 2}px`;
  overlay.style.width = `${displayedWidth}px`;
  overlay.style.height = `${displayedHeight}px`;
  videoOverlayScale = displayedWidth / videoWidth;

  updateOverlayCenter();
  renderCircles();
}

function buildPreset() {
  return {
    name: presetName.value.trim(),
    savedAt: new Date().toISOString(),
    circles: circles.map((circle) => ({
      id: circle.id,
      label: circle.label,
      size: circle.size,
      color: circle.color,
      opacity: circle.opacity
    })),
    overlayCenter: {
      x: overlayCenter.x,
      y: overlayCenter.y
    }
  };
}

function applyPreset(preset) {
  if (!preset || !Array.isArray(preset.circles)) {
    return;
  }

  preset.circles.forEach((savedCircle) => {
    const circle = circles.find((item) => item.id === savedCircle.id);

    if (!circle) {
      return;
    }

    if (Number.isFinite(savedCircle.size)) {
      circle.size = savedCircle.size;
    }

    if (typeof savedCircle.color === "string") {
      circle.color = savedCircle.color;
    }

    if (Number.isFinite(savedCircle.opacity)) {
      circle.opacity = savedCircle.opacity;
    }
  });

  if (preset.overlayCenter) {
    overlayCenter = {
      x: Number.isFinite(preset.overlayCenter.x) ? preset.overlayCenter.x : overlayCenter.x,
      y: Number.isFinite(preset.overlayCenter.y) ? preset.overlayCenter.y : overlayCenter.y
    };
  }

  if (typeof preset.name === "string") {
    presetName.value = preset.name;
  }

  renderCircles();
  renderControls();
  updateOverlayCenter();
}

async function refreshPresetList() {
  try {
    const response = await fetch("/api/presets");

    if (!response.ok) {
      throw new Error("Preset list failed");
    }

    const presets = await response.json();
    presetSelect.replaceChildren();

    if (presets.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No saved presets";
      presetSelect.appendChild(option);
      presetStatus.textContent = "No saved presets";
      return;
    }

    presets.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.file;
      option.textContent = preset.name;
      presetSelect.appendChild(option);
    });

    presetStatus.textContent = "Presets ready";
  } catch (error) {
    presetStatus.textContent = "Preset server unavailable";
  }
}

async function saveCurrentPreset() {
  const preset = buildPreset();

  if (!preset.name) {
    presetStatus.textContent = "Enter a preset name";
    return;
  }

  try {
    const response = await fetch("/api/presets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preset)
    });

    if (!response.ok) {
      throw new Error("Preset save failed");
    }

    const savedPreset = await response.json();
    await refreshPresetList();
    presetSelect.value = savedPreset.file;
    presetStatus.textContent = "Preset saved";
  } catch (error) {
    presetStatus.textContent = "Preset save failed";
  }
}

async function loadSelectedPreset() {
  if (!presetSelect.value) {
    presetStatus.textContent = "Select a preset";
    return;
  }

  try {
    const response = await fetch(`/api/presets/${encodeURIComponent(presetSelect.value)}`);

    if (!response.ok) {
      throw new Error("Preset load failed");
    }

    const preset = await response.json();
    applyPreset(preset);
    presetStatus.textContent = "Preset loaded";
  } catch (error) {
    presetStatus.textContent = "Preset load failed";
  }
}

async function openCamera() {
  startCamera.disabled = true;
  cameraStatus.textContent = "Starting camera";

  try {
    stopActiveStream();

    const deviceId = cameraSelect.value;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
      audio: false
    });

    activeStream = stream;
    activeTrack = stream.getVideoTracks()[0] || null;
    video.srcObject = stream;
    cameraStatus.textContent = "Camera active";
    await loadCameraOptions(stream);
    loadCameraControls();
    updateVideoOverlayGeometry();
  } catch (error) {
    startCamera.disabled = false;
    cameraStatus.textContent = "Camera unavailable";
    resetCameraControls();
  }
}

function stopActiveStream() {
  if (!activeStream) {
    return;
  }

  activeStream.getTracks().forEach((track) => track.stop());
  activeStream = null;
  activeTrack = null;
  resetCameraControls();
}

async function loadCameraOptions(stream) {
  const activeTrack = stream.getVideoTracks()[0];
  const activeDeviceId = activeTrack?.getSettings().deviceId || cameraSelect.value;
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === "videoinput");

  cameraSelect.replaceChildren();

  cameras.forEach((camera, index) => {
    const option = document.createElement("option");
    option.value = camera.deviceId;
    option.textContent = camera.label || `Camera ${index + 1}`;
    cameraSelect.appendChild(option);
  });

  cameraSelect.disabled = cameras.length === 0;

  if (activeDeviceId) {
    cameraSelect.value = activeDeviceId;
  }
}

function resetCameraControls() {
  cameraControlConfigs.forEach((control) => {
    control.input.disabled = true;
    control.input.removeAttribute("min");
    control.input.removeAttribute("max");
    control.input.removeAttribute("step");
    control.input.value = "";
    control.output.textContent = "--";
  });
}

function loadCameraControls() {
  resetCameraControls();

  if (!activeTrack?.getCapabilities) {
    return;
  }

  const capabilities = activeTrack.getCapabilities();
  const settings = activeTrack.getSettings ? activeTrack.getSettings() : {};

  cameraControlConfigs.forEach((control) => {
    const capability = capabilities[control.capability];

    if (!isRangeCapability(capability)) {
      control.output.textContent = "N/A";
      return;
    }

    const value = Number.isFinite(settings[control.constraint])
      ? settings[control.constraint]
      : midpoint(capability.min, capability.max);

    control.input.min = String(capability.min);
    control.input.max = String(capability.max);
    control.input.step = String(capability.step || 1);
    control.input.value = String(value);
    control.input.disabled = false;
    control.output.textContent = formatControlValue(value);
  });
}

function isRangeCapability(capability) {
  return capability
    && Number.isFinite(capability.min)
    && Number.isFinite(capability.max)
    && capability.min < capability.max;
}

function midpoint(minimum, maximum) {
  return (minimum + maximum) / 2;
}

function formatControlValue(value) {
  return Number(value).toFixed(1).replace(/\.0$/, "");
}

async function applyCameraControl(control) {
  if (!activeTrack) {
    return;
  }

  const value = Number(control.input.value);
  const advancedConstraint = {
    [control.constraint]: value
  };

  if (control.useManualFocus) {
    advancedConstraint.focusMode = "manual";
  }

  try {
    await activeTrack.applyConstraints({
      advanced: [advancedConstraint]
    });
    control.output.textContent = formatControlValue(value);
  } catch (error) {
    cameraStatus.textContent = "Camera control unavailable";
    loadCameraControls();
  }
}

startCamera.addEventListener("click", openCamera);
cameraSelect.addEventListener("change", openCamera);
cameraControlConfigs.forEach((control) => {
  control.input.addEventListener("input", () => {
    control.output.textContent = formatControlValue(control.input.value);
  });

  control.input.addEventListener("change", () => {
    applyCameraControl(control);
  });
});
overlayOffsetX.addEventListener("input", () => {
  overlayCenter.x = Number(overlayOffsetX.value);
  updateOverlayCenter();
});
overlayOffsetY.addEventListener("input", () => {
  overlayCenter.y = Number(overlayOffsetY.value);
  updateOverlayCenter();
});
savePreset.addEventListener("click", saveCurrentPreset);
loadPreset.addEventListener("click", loadSelectedPreset);
video.addEventListener("loadedmetadata", updateVideoOverlayGeometry);
window.addEventListener("resize", updateVideoOverlayGeometry);

if ("ResizeObserver" in window) {
  const resizeObserver = new ResizeObserver(updateVideoOverlayGeometry);
  resizeObserver.observe(viewer);
}

renderCircles();
renderControls();
resetCameraControls();
updateVideoOverlayGeometry();
refreshPresetList();
