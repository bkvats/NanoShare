import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components with Chart.js
ChartJS.register(
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const RealTimeSpeedGraph = () => {
  const [speedData, setSpeedData] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeed = Math.random() * 1200; // Simulating speed data
      const currentTime = new Date().toLocaleTimeString();

      setSpeedData((prev) => {
        const updatedData = [...prev, newSpeed];
        return updatedData.length > 20 ? updatedData.slice(1) : updatedData; // Keep only the latest 20 points
      });

      setTimeLabels((prev) => {
        const updatedLabels = [...prev, currentTime];
        return updatedLabels.length > 20 ? updatedLabels.slice(1) : updatedLabels; // Keep only the latest 20 labels
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: "Speed (KB/s)",
        data: speedData,
        borderColor: "blue",
        borderWidth: 2,
        backgroundColor: "rgba(0, 0, 255, 0.3)", // Shading color under the line
        fill: true, // Fill the area under the line
      },
    ],
  };

  const options = {
    animation: false,
    maintainAspectRatio: false, // Allow custom sizing
    scales: {
      x: {
        type: "category",
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ width: "600px", height: "300px" }}> {/* Adjust the size */}
      <Line data={data} options={options} />
    </div>
  );
};

export default RealTimeSpeedGraph;
