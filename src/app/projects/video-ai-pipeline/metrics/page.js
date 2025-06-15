'use client';

import { useEffect, useState } from 'react';
import { Line, Bar, Scatter } from 'react-chartjs-2';
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
  TimeScale,
  ScatterController,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ScatterController,
);

export default function MetricsPage() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricsVersion, setMetricsVersion] = useState("2.0");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        
        // Aggregate metrics by video ID
        const aggregatedMetrics = {};
        (Array.isArray(data) ? data : []).forEach(video => {
          if (!aggregatedMetrics[video.id]) {
            aggregatedMetrics[video.id] = { ...video, steps: [] };
          }
          if (video.steps) {
            aggregatedMetrics[video.id].steps.push(...video.steps);
          }
        });
        setMetrics(Object.values(aggregatedMetrics));
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Video Generation Metrics</h1>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <label htmlFor="metrics-version" className="text-sm font-medium text-gray-700 mb-1">
                  Versão das Métricas
                </label>
                <select
                  id="metrics-version"
                  value={metricsVersion}
                  onChange={(e) => setMetricsVersion(e.target.value)}
                  className="block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="2.0">Novas (com Timestamp)</option>
                  <option value="1.0">Antigas (sem Timestamp)</option>
                  <option value="all">Todas as Métricas</option>
                </select>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold">Loading metrics...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Video Generation Metrics</h1>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <label htmlFor="metrics-version" className="text-sm font-medium text-gray-700 mb-1">
                  Versão das Métricas
                </label>
                <select
                  id="metrics-version"
                  value={metricsVersion}
                  onChange={(e) => setMetricsVersion(e.target.value)}
                  className="block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="2.0">Novas (com Timestamp)</option>
                  <option value="1.0">Antigas (sem Timestamp)</option>
                  <option value="all">Todas as Métricas</option>
                </select>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-red-600">Error loading metrics</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Filter metrics based on version
  const filteredMetrics = metricsVersion === "all"
    ? metrics
    : metrics.filter(m => {
        if (metricsVersion === "2.0") {
          // New metrics have timestamp
          return m.steps?.some(step => step.timestamp);
        } else {
          // Old metrics don't have timestamp
          return m.steps?.some(step => !step.timestamp);
        }
      });

  // Process metrics data for visualizations
  const stepDurations = filteredMetrics.reduce((acc, video) => {
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

  // Process memory metrics
  const resourceMetrics = filteredMetrics.map(video => {
    const steps = video.steps || [];
    const totalMemory = steps.reduce((acc, step) => acc + (step.memory_diff_mb || 0), 0);
    const maxMemory = Math.max(...steps.map(step => step.memory_diff_mb || 0));
    const avgMemory = totalMemory / (steps.length || 1);

    const startTimestamp = video.steps?.[0]?.timestamp;
    const endTimestamp = video.steps?.[video.steps.length - 1]?.timestamp;
    
    return {
      id: video.id,
      totalMemory,
      maxMemory,
      avgMemory,
      steps: steps.length,
      // Use timestamp if available, otherwise fallback to a default date (e.g., 1970 for older data)
      startTime: startTimestamp ? new Date(startTimestamp * 1000) : new Date(0),
      endTime: endTimestamp ? new Date(endTimestamp * 1000) : new Date(0),
    };
  });

  // Sort by start time, handling cases where startTime might be Date(0) for old metrics
  resourceMetrics.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  // Calculate parallel processing periods
  // Filter out events that have 1970 timestamp, as they are not valid for parallel processing analysis
  const validResourceMetrics = resourceMetrics.filter(m => m.startTime.getTime() !== 0);

  const events = [];
  validResourceMetrics.forEach(video => {
    events.push({ time: video.startTime, type: 'start', id: video.id });
    events.push({ time: video.endTime, type: 'end', id: video.id });
  });
  events.sort((a, b) => a.time - b.time);

  let currentVideos = new Set();
  let parallelPeriods = [];
  let lastTime = null;

  events.forEach(event => {
    if (lastTime !== null && currentVideos.size > 0) {
      // Only push periods if the duration is meaningful (i.e., start and end times are different)
      if (event.time.getTime() > lastTime.getTime()) {
        parallelPeriods.push({
          start: lastTime,
          end: event.time,
          videos: Array.from(currentVideos),
          totalMemory: Array.from(currentVideos).reduce((sum, id) => {
            const v = validResourceMetrics.find(vm => vm.id === id);
            return sum + (v ? v.totalMemory : 0);
          }, 0),
        });
      }
    }
    if (event.type === 'start') {
      currentVideos.add(event.id);
    } else {
      currentVideos.delete(event.id);
    }
    lastTime = event.time;
  });

  // Ensure parallelPeriods has at least one entry for summary if there's valid data
  if (parallelPeriods.length === 0 && validResourceMetrics.length > 0) {
    // Create a dummy period for summary statistics if no true parallel periods are found
    // This will happen if all videos are sequential or have instant processing
    const totalMemory = validResourceMetrics.reduce((sum, v) => sum + v.totalMemory, 0);
    parallelPeriods.push({
      start: validResourceMetrics[0].startTime,
      end: validResourceMetrics[validResourceMetrics.length - 1].endTime,
      videos: validResourceMetrics.map(v => v.id),
      totalMemory: totalMemory,
    });
  }

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

  // Process data for Generation Time vs. Video Duration scatter plot
  const generationVsDurationData = filteredMetrics
    .map(video => {
      const exportStep = video.steps?.find(step => step.step === 'export_video');
      const totalGenerationTime = video.steps?.reduce((sum, step) => sum + (step.duration_sec || 0), 0) || 0;
      const videoDuration = exportStep?.final_video_duration_sec || 0;

      // Only include data points where both generation time and video duration are positive
      if (totalGenerationTime > 0 && videoDuration > 0) {
        return {
          x: totalGenerationTime,
          y: videoDuration,
          id: video.id, // Keep video ID for tooltip or future reference
        };
      }
      return null;
    })
    .filter(Boolean); // Remove null entries

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Video Generation Metrics</h1>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <label htmlFor="metrics-version" className="text-sm font-medium text-gray-700 mb-1">
                Versão das Métricas
              </label>
              <select
                id="metrics-version"
                value={metricsVersion}
                onChange={(e) => setMetricsVersion(e.target.value)}
                className="block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="2.0">Novas (com Timestamp)</option>
                <option value="1.0">Antigas (sem Timestamp)</option>
                <option value="all">Todas as Métricas</option>
              </select>
            </div>
          </div>
        </div>

        {!filteredMetrics.length ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">No metrics available</h2>
            <p className="text-gray-600">There are no metrics to display for the selected version.</p>
          </div>
        ) : (
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

            {/* Resource Usage Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Memory Usage per Video</h2>
              <Line
                data={{
                  labels: resourceMetrics.map(m => m.id),
                  datasets: [
                    {
                      label: 'Memory (MB)',
                      data: resourceMetrics.map(m => m.totalMemory),
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                    }
                  ],
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

            {/* Generation Time vs. Video Duration Scatter Plot */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Tempo de Geração vs. Duração do Vídeo</h2>
              <Scatter
                data={{
                  datasets: [
                    {
                      label: 'Vídeos',
                      data: generationVsDurationData,
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const dataPoint = context.raw;
                          return `ID: ${dataPoint.id}, Geração: ${dataPoint.x.toFixed(2)}s, Duração: ${dataPoint.y.toFixed(2)}s`;
                        }
                      }
                    },
                    title: {
                      display: true,
                      text: 'Tempo Total de Geração vs. Duração do Vídeo',
                    },
                  },
                  scales: {
                    x: {
                      type: 'linear',
                      position: 'bottom',
                      title: {
                        display: true,
                        text: 'Tempo Total de Geração (segundos)',
                      },
                    },
                    y: {
                      type: 'linear',
                      title: {
                        display: true,
                        text: 'Duração do Vídeo (segundos)',
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Parallel Processing Analysis */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Parallel Processing Analysis</h2>
              <div className="space-y-4">
                {parallelPeriods.length === 0 ? (
                  <p className="text-gray-600">No parallel processing periods to display for the selected version.</p>
                ) : (
                  parallelPeriods.map((period, index) => (
                    <div key={index} className="border-b pb-4">
                      <p className="font-semibold">Period {index + 1}</p>
                      <p className="text-sm text-gray-600">
                        Start: {period.start.toLocaleString()}<br />
                        End: {period.end.toLocaleString()}<br />
                        Videos in parallel: {period.videos.length}<br />
                        Total memory used: {period.totalMemory.toFixed(2)} MB<br />
                        Average memory per video: {(period.totalMemory / period.videos.length).toFixed(2)} MB
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Total Videos Generated</p>
                  <p className="text-2xl font-bold">{filteredMetrics.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Average Total Generation Time</p>
                  <p className="text-2xl font-bold">
                    {filteredMetrics.length > 0
                      ? (filteredMetrics.reduce((acc, m) => 
                          acc + (m.steps?.reduce((sum, step) => sum + (step.duration_sec || 0), 0) || 0), 0) / filteredMetrics.length
                        ).toFixed(2)
                      : 0} seconds
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Average Memory per Video</p>
                  <p className="text-2xl font-bold">
                    {(resourceMetrics.reduce((acc, m) => acc + m.totalMemory, 0) / resourceMetrics.length).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Maximum Parallel Videos</p>
                  <p className="text-2xl font-bold">
                    {parallelPeriods.length > 0 ? Math.max(...parallelPeriods.map(p => p.videos.length)) : 0}
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
        )}
      </div>
    </div>
  );
} 