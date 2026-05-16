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

let activeStream = null;
let activeTrack = null;
let overlayCenter = {
  x: 0,
  y: 0
};

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
    const element = document.createElement("div");
    element.className = "circle";
    element.dataset.circle = circle.id;
    element.style.setProperty("--circle-size", `${circle.size}px`);
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
  overlay.style.setProperty("--overlay-offset-x", `${overlayCenter.x}px`);
  overlay.style.setProperty("--overlay-offset-y", `${overlayCenter.y}px`);
  overlayOffsetXValue.textContent = `${overlayCenter.x}px`;
  overlayOffsetYValue.textContent = `${overlayCenter.y}px`;
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

renderCircles();
renderControls();
resetCameraControls();
updateOverlayCenter();
