/**
 * Chart configurations for all 8 graphboxes
 * Each config defines: title, type, data fields, colors, and options
 * Easy to modify appearance or add new charts
 */

const chartConfigs = {
  box3: {
    title: 'Altitude vs Time',
    type: 'line',
    dataField: 'altitude',
    datasets: (data) => [
      {
        label: 'Altitude (m)',
        data: data.map(p => p.altitude),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ],
    labels: (data) => data.map(p => p.timestamp.toFixed(2)),
  },

  box4: {
    title: 'Acceleration XYZ',
    type: 'line',
    datasets: (data) => [
      {
        label: 'Accel X',
        data: data.map(p => p.accelerx),
        borderColor: '#FF6B6B',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Accel Y',
        data: data.map(p => p.acy),
        borderColor: '#4ECDC4',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Accel Z',
        data: data.map(p => p.acz),
        borderColor: '#95E1D3',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ],
    labels: (data) => data.map(p => p.timestamp.toFixed(2)),
  },

  box5: {
    title: 'Gyroscope XYZ',
    type: 'line',
    datasets: (data) => [
      {
        label: 'Gyro X',
        data: data.map(p => p.gyrox),
        borderColor: '#FFD93D',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Gyro Y',
        data: data.map(p => p.gy),
        borderColor: '#6BCB77',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Gyro Z',
        data: data.map(p => p.gz),
        borderColor: '#4D96FF',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ],
    labels: (data) => data.map(p => p.timestamp.toFixed(2)),
  },

  box2: {
    title: 'Battery Status',
    type: 'line',
    datasets: (data) => [
      {
        label: 'Voltage (V)',
        data: data.map(p => p.batteryvolt),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 2,
        yAxisID: 'y',
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Amperage (A)',
        data: data.map(p => p.batamp),
        borderColor: '#FFD93D',
        backgroundColor: 'rgba(255, 217, 61, 0.1)',
        borderWidth: 2,
        yAxisID: 'y1',
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ],
    labels: (data) => data.map(p => p.timestamp.toFixed(2)),
    options: (baseOptions) => ({
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Voltage (V)' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'Amperage (A)' },
          grid: { drawOnChartArea: false }
        }
      }
    })
  },

  box1: {
    title: 'Temperature',
    type: 'line',
    datasets: (data) => [
      {
        label: 'Temperature (°C)',
        data: data.map(p => p.tempurature),
        borderColor: '#FF8C42',
        backgroundColor: 'rgba(255, 140, 66, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ],
    labels: (data) => data.map(p => p.timestamp.toFixed(2)),
  },

  box6: {
    title: 'GPS Location',
    type: 'scatter',
    datasets: (data) => [
      {
        label: 'Flight Path',
        data: data.map(p => ({
          x: p.gpslon,
          y: p.gpslat,
        })),
        borderColor: '#6BCB77',
        backgroundColor: 'rgba(107, 203, 119, 0.5)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      }
    ],
    labels: () => [],
    xLabel: 'Longitude',
    yLabel: 'Latitude',
  },

  box7: {
    title: 'Downrange Position',
    type: 'scatter',
    datasets: (data) => [
      {
        label: 'Position',
        data: data.map(p => ({
          x: p.downrangex,
          y: p.downy,
        })),
        borderColor: '#4D96FF',
        backgroundColor: 'rgba(77, 150, 255, 0.5)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      }
    ],
    labels: () => [],
    xLabel: 'Downrange X (m)',
    yLabel: 'Downrange Y (m)',
  },

  box8: {
    title: 'Velocity Magnitude',
    type: 'line',
    datasets: (data) => {
      // Calculate velocity magnitude from acceleration (simplified)
      const velocityMagnitude = data.map((p, i) => {
        if (i === 0) return 0;
        const accelMag = Math.sqrt(p.accelerx ** 2 + p.acy ** 2 + p.acz ** 2);
        return accelMag * 0.05; // Approximate velocity contribution
      });

      return [
        {
          label: 'Velocity Magnitude',
          data: velocityMagnitude,
          borderColor: '#A78BFA',
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
        }
      ];
    },
    labels: (data) => data.map(p => p.timestamp.toFixed(2)),
  },
};

/**
 * Get base options for all charts (dark theme)
 */
export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: '#E0E0E0',
        font: { size: 11 },
        usePointStyle: true,
        padding: 10,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#FFFFFF',
      bodyColor: '#E0E0E0',
      borderColor: '#555555',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 4,
      titleFont: { size: 12, weight: 'bold' },
      bodyFont: { size: 11 },
    }
  },
  scales: {
    x: {
      display: true,
      grid: { color: '#444444', drawBorder: true },
      ticks: { color: '#A0A0A0', font: { size: 10 } }
    },
    y: {
      display: true,
      grid: { color: '#444444', drawBorder: true },
      ticks: { color: '#A0A0A0', font: { size: 10 } }
    }
  }
};

/**
 * Get configuration for a specific graphbox
 * @param {string} boxId - Box identifier (box1, box2, etc.)
 * @param {Array} data - Telemetry data array
 * @returns {Object} Chart configuration
 */
export function getChartConfig(boxId, data) {
  const config = chartConfigs[boxId];
  if (!config) throw new Error(`Unknown chart config: ${boxId}`);

  const options = config.options ? config.options(baseChartOptions) : baseChartOptions;

  return {
    type: config.type,
    data: {
      labels: config.labels(data),
      datasets: config.datasets(data),
    },
    options: {
      ...options,
      plugins: {
        ...options.plugins,
        title: {
          display: true,
          text: config.title,
          color: '#FFFFFF',
          font: { size: 14, weight: 'bold' },
          padding: 10,
        }
      }
    }
  };
}

export default chartConfigs;
