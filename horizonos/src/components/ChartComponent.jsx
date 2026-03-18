import { useState, useEffect } from 'react';
import { loadTelemetryData, subscribeToData } from '../services/dataService';
import { getChartConfig } from '../config/chartConfigs';
import ChartWrapper from './ChartWrapper';

/**
 * ChartComponent - Manages a single chart instance
 * Loads data, applies config, and passes to ChartWrapper
 */
function ChartComponent({ boxId }) {
  const [chartConfig, setChartConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = null;

    const loadChart = async () => {
      try {
        // Load initial data
        const data = await loadTelemetryData();

        if (!isMounted) return;

        // Generate chart config from data
        const config = getChartConfig(boxId, data);
        setChartConfig(config);

        // Subscribe to future updates (real-time)
        unsubscribe = subscribeToData((newPacket) => {
          if (isMounted) {
            // Reload data and update chart on new packets
            loadTelemetryData().then(updatedData => {
              if (isMounted) {
                const updatedConfig = getChartConfig(boxId, updatedData);
                setChartConfig(updatedConfig);
              }
            });
          }
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error(`Error loading chart ${boxId}:`, err);
        }
      }
    };

    loadChart();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [boxId]);

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FF6B6B',
        fontSize: '12px',
        padding: '10px',
        textAlign: 'center',
      }}>
        Error: {error}
      </div>
    );
  }

  if (!chartConfig) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#A0A0A0',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ChartWrapper
      chartType={chartConfig.type}
      labels={chartConfig.data.labels}
      datasets={chartConfig.data.datasets}
      options={chartConfig.options}
    />
  );
}

export default ChartComponent;
