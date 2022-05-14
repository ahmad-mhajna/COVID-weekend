// chart
let Chartdata = [1, 1, 1, 1];
let charttype = "bar";
const ctx = document.getElementById("myChart").getContext("2d");
const Changetypebutton = document.querySelectorAll(".changeType");
Changetypebutton.forEach((button) => {
  button.addEventListener("click", changetype);
});

let myChart;
function changetype(event) {
  const previousbutton = document.querySelector("#selectedType");
  const currentbutton = event.target;
  previousbutton.id = "";
  currentbutton.id = "selectedType";
  charttype = event.target.getAttribute("data-type");
  genChart();
}
function genChart() {
  if (myChart) myChart.destroy();
  myChart = new Chart(ctx, {
    type: charttype,
    data: {
      labels: ["deaths", "confirmed", "recovered", "critical"],
      datasets: [
        {
          label: "# of Votes",
          data: Chartdata,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      maintainAspectRatio: false,
    },
  });
  if (charttype === "pie" || charttype === "doughnut") {
    myChart.options.scales.y.display = false;
    myChart.update();
  }
}
