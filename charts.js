// ============================
// Graph Studio
// charts.js
// ============================

let chart;

// -------------------------
// Random Colors
// -------------------------

function randomColor(alpha = 0.7){

    const r = Math.floor(Math.random()*256);
    const g = Math.floor(Math.random()*256);
    const b = Math.floor(Math.random()*256);

    return `rgba(${r},${g},${b},${alpha})`;

}

// -------------------------
// Create Graph
// -------------------------

function generateGraph(){

    const title =
        document.getElementById("graphTitle").value || "Untitled Graph";

    const type =
        document.getElementById("graphType").value;

    const legend =
     document.getElementById("settingLegend").checked;

    const grid =
     document.getElementById("settingGrid").checked;

    const xAxis =
        document.getElementById("xLabel").value;

    const yAxis =
        document.getElementById("yLabel").value;

    const rows =
        document.querySelectorAll("#dataTable tbody tr");

    const labels = [];
    const values = [];

    rows.forEach(row=>{

        const label =
            row.cells[0].querySelector("input").value;

        const value =
            Number(row.cells[1].querySelector("input").value);

        if(label!=="" && !isNaN(value)){

            labels.push(label);
            values.push(value);

        }

    });

    if(labels.length===0){

        alert("Please enter some data.");

        return;

    }

    if(chart){

        chart.destroy();

    }

    const ctx =
        document.getElementById("graphCanvas").getContext("2d");

    // Scatter chart needs x/y coordinates
    if(type==="scatter"){

        const scatterData = values.map((value,index)=>({

            x:index+1,
            y:value

        }));

        chart = new Chart(ctx,{

            type:"scatter",

            data:{
                datasets:[{

                    label:title,
                    data:scatterData,
                    backgroundColor:"#2b6cff"

                }]
            },

            options:{

                responsive:true,

                plugins:{

                    title:{
                        display:true,
                        text:title
                    },

                    legend:{
    display:document.getElementById("settingLegend").checked
}

                },

                scales:{

                    x:{
                        title:{
                            display:true,
                            text:xAxis
                        },
                        grid:{
    display:document.getElementById("settingGrid").checked
}
                    },

                    y:{
                        title:{
                            display:true,
                            text:yAxis
                        },
                        grid:{
    display:document.getElementById("settingGrid").checked
}
                    }

                }

            }

        });

        return;

    }

    // All other charts

    chart = new Chart(ctx,{

        type:type,

        data:{

            labels:labels,

            datasets:[{

                label:title,

                data:values,

                backgroundColor:labels.map(()=>randomColor()),

                borderColor:"#2b6cff",

                borderWidth:2,

                fill:type==="line" ? false : true,

                tension:.35

            }]

        },

        options:{

            responsive:true,

            plugins:{

                title:{
                    display:true,
                    text:title,
                    font:{
                        size:20
                    }
                },

                legend:{
    display:document.getElementById("settingLegend").checked
}

            },

            scales:

            type==="pie" ||
            type==="doughnut" ||
            type==="polarArea"

            ?

            {}

            :

            {

                x:{

                    title:{
                        display:true,
                        text:xAxis
                    },

                    grid:{
    display:document.getElementById("settingGrid").checked
}

                },

                y:{

                    beginAtZero:true,

                    title:{
                        display:true,
                        text:yAxis
                    },

                    grid:{
    display:document.getElementById("settingGrid").checked
}

                }

            }

        }

    });

}

// -------------------------
// Download PNG
// -------------------------

document
.getElementById("downloadPNG")
.addEventListener("click",()=>{

    if(!chart){

        alert("Generate a graph first!");

        return;

    }

    const link = document.createElement("a");

    link.download="graph.png";

    link.href=chart.toBase64Image();

    link.click();

});