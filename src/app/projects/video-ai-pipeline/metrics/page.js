'use client';

import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MetricsPage() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading metrics...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-red-600">Error loading metrics</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!metrics.length) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">No metrics available</h1>
          <p className="text-gray-600">There are no metrics to display yet.</p>
        </div>
      </div>
    );
  }

  // Process metrics data for visualizations
  const stepDurations = metrics.reduce((acc, video) => {
    if (!video.steps) return acc;
    
    video.steps.forEach(step => {
      if (!acc[step.step]) {
        acc[step.step] = [];
      }
      acc[step.step].push(step.duration_sec);
    });
    return acc;
  }, {});

  const averageDurations = Object.entries(stepDurations).map(([step, durations]) => ({
    step,
    average: durations.reduce((a, b) => a + b, 0) / durations.length,
    max: Math.max(...durations),
  }));

  const chartData = {
    labels: averageDurations.map(d => d.step),
    datasets: [
      {
        label: 'Average Duration (seconds)',
        data: averageDurations.map(d => d.average),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Max Duration (seconds)',
        data: averageDurations.map(d => d.max),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Video Generation Metrics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step Duration Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Step Durations</h2>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Average and Max Duration by Step',
                  },
                },
              }}
            />
          </div>

          {/* Memory Usage Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Memory Usage</h2>
            <Line
              data={{
                labels: metrics.map(m => m.id),
                datasets: [{
                  label: 'Memory Usage (MB)',
                  data: metrics.map(m => 
                    m.steps?.reduce((acc, step) => acc + (step.memory_diff_mb || 0), 0) || 0
                  ),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Memory Usage per Video',
                  },
                },
              }}
            />
          </div>

          {/* Summary Statistics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Total Videos Generated</p>
                <p className="text-2xl font-bold">{metrics.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Average Total Generation Time</p>
                <p className="text-2xl font-bold">
                  {metrics.length > 0
                    ? (metrics.reduce((acc, m) => 
                        acc + (m.steps?.reduce((sum, step) => sum + (step.duration_sec || 0), 0) || 0), 0) / metrics.length
                      ).toFixed(2)
                    : 0} seconds
                </p>
              </div>
            </div>
          </div>

          {/* Step Analysis */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Step Analysis</h2>
            <div className="space-y-4">
              {averageDurations.map(({ step, average, max }) => (
                <div key={step} className="border-b pb-2">
                  <p className="font-semibold">{step}</p>
                  <p className="text-sm text-gray-600">
                    Avg: {average.toFixed(2)}s | Max: {max.toFixed(2)}s
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 