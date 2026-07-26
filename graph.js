// ==========================
// Graph Studio
// graph.js
// ==========================

// Buttons
const addRowBtn = document.getElementById("addRow");
const addDatasetBtn = document.getElementById("addDataset");
const resetBtn = document.getElementById("resetBtn");
const sampleBtn = document.getElementById("sampleBtn");
const generateBtn = document.getElementById("generateBtn");

// Containers
const tableBody = document.querySelector("#dataTable tbody");
const datasetContainer = document.getElementById("datasetContainer");

// Statistics
const sumText = document.getElementById("sum");
const averageText = document.getElementById("average");
const minimumText = document.getElementById("minimum");
const maximumText = document.getElementById("maximum");
const medianText = document.getElementById("median");

// -------------------------
// Add Row
// -------------------------

addRowBtn.addEventListener("click", () => {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="text" placeholder="Label"></td>
        <td><input type="number" placeholder="Value"></td>
    `;

    tableBody.appendChild(row);

});

// -------------------------
// Add Dataset
// -------------------------

let datasetCount = 1;

addDatasetBtn.addEventListener("click", () => {

    datasetCount++;

    const dataset = document.createElement("div");

    dataset.className = "dataset";

    dataset.innerHTML = `
        <label>Dataset Name</label>
        <input type="text" placeholder="Dataset ${datasetCount}">

        <label>Color</label>
        <input type="color">
    `;

    datasetContainer.appendChild(dataset);

});

// -------------------------
// Get Values
// -------------------------

function getValues() {

    const rows = tableBody.querySelectorAll("tr");

    const values = [];

    rows.forEach(row => {

        const value = Number(
            row.cells[1].querySelector("input").value
        );

        if(!isNaN(value) && row.cells[1].querySelector("input").value !== "")
            values.push(value);

    });

    return values;

}

// -------------------------
// Statistics
// -------------------------

function updateStatistics(){

    const values = getValues();

    if(values.length === 0){

        sumText.textContent = 0;
        averageText.textContent = 0;
        minimumText.textContent = 0;
        maximumText.textContent = 0;
        medianText.textContent = 0;

        return;

    }

    const sum = values.reduce((a,b)=>a+b,0);

    const average = sum / values.length;

    const sorted = [...values].sort((a,b)=>a-b);

    const minimum = sorted[0];

    const maximum = sorted[sorted.length-1];

    let median;

    if(sorted.length % 2 === 0){

        median =
        (sorted[sorted.length/2] +
        sorted[sorted.length/2-1])/2;

    }else{

        median = sorted[Math.floor(sorted.length/2)];

    }

    sumText.textContent = sum;

    averageText.textContent = average.toFixed(2);

    minimumText.textContent = minimum;

    maximumText.textContent = maximum;

    medianText.textContent = median;

}

// -------------------------
// Update stats while typing
// -------------------------

document.addEventListener("input",()=>{

    updateStatistics();

    saveProject();

});

// -------------------------
// Sample Data
// -------------------------

sampleBtn.addEventListener("click", () => {

    tableBody.innerHTML = "";

    const sample = [
        ["January",120],
        ["February",95],
        ["March",150],
        ["April",180],
        ["May",135]
    ];

    sample.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=`
            <td><input type="text" value="${item[0]}"></td>
            <td><input type="number" value="${item[1]}"></td>
        `;

        tableBody.appendChild(row);

    });

    document.getElementById("graphTitle").value="Monthly Sales";

    updateStatistics();

});

// -------------------------
// Reset
// -------------------------

resetBtn.addEventListener("click",()=>{

    location.reload();

});

// -------------------------
// Generate Button
// -------------------------

generateBtn.addEventListener("click",()=>{

    updateStatistics();

    generateGraph();

});

// Initial Statistics

updateStatistics();

// ============================
// SETTINGS
// ============================

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");
const darkMode = document.getElementById("darkMode");

settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.add("open");
});

closeSettings.addEventListener("click", () => {
    settingsPanel.classList.remove("open");
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    darkMode.checked = true;
}

darkMode.addEventListener("change", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// -------------------------
// Generate Button
// -------------------------

generateBtn.addEventListener("click",()=>{

    updateStatistics();

    generateGraph();

});

// ============================
// LIVE PREVIEW
// ============================

document.addEventListener("input", () => {

    if(document.getElementById("livePreview").checked){

        updateStatistics();
        generateGraph();

    }

});

// Initial Statistics

updateStatistics();

// ============================
// SETTINGS
// ============================

// ... all your settings code ...

// ============================
// SETTINGS AUTO UPDATE
// ============================

document.querySelectorAll("#settingsPanel input, #settingsPanel select")
.forEach(setting => {

    setting.addEventListener("change", () => {

        if(chart){

            generateGraph();

        }

        saveProject();

    });

}); 

// ============================
// AUTO SAVE
// ============================

function saveProject(){

    const rows = [];

    document.querySelectorAll("#dataTable tbody tr").forEach(row=>{

        rows.push({

            label: row.cells[0].querySelector("input").value,

            value: row.cells[1].querySelector("input").value

        });

    });

    const project = {

        title: document.getElementById("graphTitle").value,

        graphType: document.getElementById("graphType").value,

        xAxis: document.getElementById("xLabel").value,

        yAxis: document.getElementById("yLabel").value,

        rows: rows,

        darkMode: document.body.classList.contains("dark"),

        livePreview: document.getElementById("livePreview").checked,

        legend: document.getElementById("settingLegend").checked,

        grid: document.getElementById("settingGrid").checked

    };

    localStorage.setItem(
        "graphStudioProject",
        JSON.stringify(project)
    );

}