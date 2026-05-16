const circles = [
  {
    id: "focusTube",
    label: "Focus tube diameter",
    size: 620,
    color: "#00a3ff",
    min: 20,
    max: 900
  },
  {
    id: "secondaryEdge",
    label: "Outside edge of secondary",
    size: 440,
    color: "#00d084",
    min: 20,
    max: 900
  },
  {
    id: "primaryReflection",
    label: "Primary reflection",
    size: 300,
    color: "#ffcf33",
    min: 20,
    max: 900
  },
  {
    id: "secondaryReflection",
    label: "Secondary reflection",
    size: 170,
    color: "#ff6b35",
    min: 20,
    max: 900
  },
  {
    id: "centerPoint",
    label: "Center point",
    size: 18,
    color: "#ffffff",
    min: 4,
    max: 120
  }
];

const video = document.querySelector("#camera");
const overlay = document.querySelector("#overlay");
const controls = document.querySelector("#circleControls");
const startCamera = document.querySelector("#startCamera");
const cameraStatus = document.querySelector("#cameraStatus");

function renderCircles() {
  overlay.replaceChildren();

  circles.forEach((circle) => {
    const element = document.createElement("div");
    element.className = "circle";
    element.dataset.circle = circle.id;
    element.style.setProperty("--circle-size", `${circle.size}px`);
    element.style.setProperty("--circle-color", circle.color);
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
    group.append(title, sizeRow, colorRow);
    controls.appendChild(group);
  });
}

async function openCamera() {
  startCamera.disabled = true;
  cameraStatus.textContent = "Starting camera";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    video.srcObject = stream;
    cameraStatus.textContent = "Camera active";
  } catch (error) {
    startCamera.disabled = false;
    cameraStatus.textContent = "Camera unavailable";
  }
}

startCamera.addEventListener("click", openCamera);

renderCircles();
renderControls();
