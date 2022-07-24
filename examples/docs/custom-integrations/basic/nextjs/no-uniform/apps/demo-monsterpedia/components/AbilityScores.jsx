import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import Color from "color";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function AbilityScores({
  scores,
  label = "Points",
  height = "250px",
  width = "250px",
  color = "rgba(255, 127, 63)",
}) {
  const data = getRadarChartData(scores, label, color);
  if (!data) {
    return <div />;
  }
  return (
    <div>
      <Radar
        width={width}
        height={height}
        data={data}
        options={{ scales: { r: { max: 30 } }, aspectRatio: false }}
      />
    </div>
  );
}

function getRadarChartData(scores, label, color) {
  if (!scores || Object.keys(scores).length === 0) return;
  return {
    labels: Object.keys(scores),
    datasets: [
      {
        label,
        data: Object.values(scores),
        backgroundColor: Color(color).alpha(0.2).toString(),
        borderColor: Color(color).toString(),
        borderWidth: 1,
      },
    ],
  };
}
