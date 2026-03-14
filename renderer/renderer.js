console.log("Renderer loaded")
function createChart(divClass, datasets) {
    const container = document.querySelector(`.${divClass}`);
    const canvas = document.createElement("canvas");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    const chartDatasets = datasets.map(ds => ({
        label: ds.label,
        data: [],
        borderColor: ds.color,
        fill: false
    }));

    return new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
            labels: [],
            datasets: chartDatasets
        },
        options: {
            responsive: false,
            animation: false,
            scales: {
                x: { title: { display: true, text: "Sample" } },
                y: { title: { display: true, text: "Value" } }
            }
        }
    });
}

const graph1 = createChart("graphbox1", [{ label: "Tempurature", color: "#FF3636" }]);
const graph2 = createChart("graphbox2", [{ label: "Bat. Voltage", color: "#29FD00" }]);
const graph3 = createChart("graphbox3", [{ label: "Altitude", color: "#FF3636" }]);
const graph4 = createChart("graphbox4", [
    { label: "GyroX", color: "#FF3636" },
    { label: "GyroY", color: "#29FD00" },
    { label: "GyroZ", color: "#FFFFFF" }
]);
const graph5 = createChart("graphbox5", [
    { label: "AcclX", color: "#FF3636" },
    { label: "AcclY", color: "#29FD00" },
    { label: "AcclZ", color: "#FFFFFF" }
]);
const graph6 = createChart("graphbox6", [{ label: "Speed", color: "#FF3636" }]);
const graph7 = createChart("graphbox7", [
    { label: "DownrangeX", color: "#FF3636" },
    { label: "DownrangeY", color: "#29FD00" }
]);
const graph8 = createChart("graphbox8", [{ label: "Pressure", color: "#FF3636" }]);