import { ChartType } from "src/app/core/models/charts.model";

const metaChart: ChartType = {
  chart: {
    height: 200,
    type: "radialBar",
    offsetY: -10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: "13px",
          color: undefined,
          offsetY: 60,
        },
        value: {
          offsetY: 22,
          fontSize: "16px",
          color: undefined,
          formatter: (val) => {
            return val + "%";
          },
        },
      },
    },
  },
  colors: ["#556ee6"],
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  stroke: {
    dashArray: 4,
  },
  series: [0],
  labels: ["Meta"],
};

export { metaChart };
