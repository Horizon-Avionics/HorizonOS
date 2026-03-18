/**
 * Data service for loading and managing telemetry data
 * Can be easily extended to support real-time API updates
 */

let cachedData = null;
let subscribers = [];

/**
 * Load telemetry data from JSON file
 * @returns {Promise<Array>} Array of telemetry packets
 */
export async function loadTelemetryData() {
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch('/telemetry_log.json');
    if (!response.ok) throw new Error('Failed to load telemetry data');
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
    console.error('Error loading telemetry data:', error);
    throw error;
  }
}

/**
 * Subscribe to data updates (for real-time streaming)
 * Currently a no-op, but ready for API implementation
 * @param {Function} callback - Called with new data packet
 * @returns {Function} Unsubscribe function
 */
export function subscribeToData(callback) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
}

/**
 * Publish data update to all subscribers (internal use)
 * @param {Object} packet - New telemetry packet
 */
export function publishDataUpdate(packet) {
  subscribers.forEach(callback => callback(packet));
}

/**
 * Clear cached data (useful for refreshing)
 */
export function clearCache() {
  cachedData = null;
}
