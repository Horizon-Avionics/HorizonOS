const portsSelect = document.getElementById('ports');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const output = document.getElementById('output');

async function loadPorts() {
  try {
    const ports = await window.api.listPorts();
    console.log("Ports found:", ports);
    portsSelect.innerHTML = ports.length
      ? ports.map(p => `<option value="${p}">${p}</option>`).join('')
      : `<option value="">No ports found</option>`;
  } catch (err) {
    console.error("Failed to load ports:", err);
    portsSelect.innerHTML = `<option value="">Error loading ports</option>`;
  }
}

// Ensure DOM and preload API are ready
document.addEventListener('DOMContentLoaded', () => {
  loadPorts();

  startBtn.addEventListener('click', () => {
    const selectedPort = portsSelect.value;
    if (!selectedPort) {
      alert('Please select a COM port!');
      return;
    }
    window.api.startSerial(selectedPort);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    output.textContent = '';
  });

  stopBtn.addEventListener('click', () => {
    window.api.stopSerial();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

  window.api.onSerialData(data => {
    output.textContent += data;
    output.scrollTop = output.scrollHeight;
  });

  window.api.onSerialError(err => {
    output.textContent += `\n[Error] ${err}\n`;
  });
});
