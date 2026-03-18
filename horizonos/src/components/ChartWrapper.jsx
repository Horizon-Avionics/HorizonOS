import { useEffect, useRef } from 'react';

/**
 * ChartWrapper - Wraps Chart.js and manages lifecycle
 * Handles chart creation, updates, and cleanup
 */
function ChartWrapper({ chartType, labels, datasets, options }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: options,
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [chartType, labels, datasets, options]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', flexGrow: 1 }} />
    </div>
  );
}

export default ChartWrapper;
