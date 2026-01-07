// src/components/ScoringCharts.jsx
import { useEffect, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const ScoringCharts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/scoring/184")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error("Error fetching scoring data", err));
  }, []);

  const pointScoreData = data.map((row, idx) => ({
    x: idx + 1,          // or row.user_id
    y: row.point_score,
  }));

  const percentageData = data.map((row, idx) => ({
    x: idx + 1,
    y: row.percentage,
  }));

  return (
    <div className="management-charts">
      <div className="chart-card">
        <h2>PointScore</h2>
        <ScatterChart width={600} height={320} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#4b5563" />
          <XAxis type="number" dataKey="x" />
          <YAxis type="number" dataKey="y" />
          <Tooltip />
          <Scatter data={pointScoreData} fill="#f97316" />
        </ScatterChart>
      </div>

      <div className="chart-card">
        <h2>Percentage</h2>
        <LineChart width={600} height={320} data={percentageData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#4b5563" />
          <XAxis dataKey="x" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#f97316" dot />
        </LineChart>
      </div>
    </div>
  );
};

export default ScoringCharts;
