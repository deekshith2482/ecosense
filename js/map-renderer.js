/**
 * EcoSense Interactive Map Renderer (Leaflet.js)
 * Manages Bangalore ward geospatial layers, custom zone pins, and popup triage
 */

export class MapRenderer {
  constructor(mapContainerId, onIncidentSelect) {
    this.containerId = mapContainerId;
    this.onIncidentSelect = onIncidentSelect;
    this.map = null;
    this.markersLayer = null;
    this.wardPolygonsLayer = null;
    this.currentFilter = "all";
    this.incidents = [];
  }

  initMap() {
    if (typeof L === "undefined") {
      console.warn("Leaflet library not loaded yet.");
      return;
    }

    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Centered on Bangalore City
    this.map = L.map(this.containerId, {
      center: [12.9650, 77.6200],
      zoom: 12,
      zoomControl: true
    });

    // Dark-themed sleek basemap (CartoDB Dark Matter / OSM)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | EcoSense BBMP GIS',
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.wardPolygonsLayer = L.layerGroup().addTo(this.map);

    this._drawBangaloreWards();
  }

  _drawBangaloreWards() {
    // Simulated BBMP Ward boundary polygons with subtle thematic tint
    const wardZones = [
      { name: "Indiranagar (Ward 112)", coords: [[12.980, 77.630], [12.985, 77.655], [12.965, 77.658], [12.960, 77.632]], color: "#ef4444" },
      { name: "Koramangala (Ward 151)", coords: [[12.945, 77.615], [12.948, 77.640], [12.925, 77.638], [12.922, 77.612]], color: "#f97316" },
      { name: "HSR Layout (Ward 174)", coords: [[12.920, 77.635], [12.922, 77.660], [12.900, 77.655], [12.902, 77.630]], color: "#eab308" },
      { name: "Malleshwaram (Ward 45)", coords: [[13.010, 77.560], [13.012, 77.585], [12.988, 77.580], [12.985, 77.558]], color: "#10b981" },
      { name: "Whitefield (Ward 84)", coords: [[12.995, 77.735], [12.998, 77.765], [12.970, 77.760], [12.972, 77.730]], color: "#ef4444" }
    ];

    wardZones.forEach(w => {
      L.polygon(w.coords, {
        color: w.color,
        weight: 1.5,
        fillColor: w.color,
        fillOpacity: 0.08,
        dashArray: "4, 4"
      }).bindTooltip(`<b>${w.name}</b><br>EcoSense Monitoring Sector`, { sticky: true }).addTo(this.wardPolygonsLayer);
    });
  }

  setIncidents(incidents) {
    this.incidents = incidents;
    this.renderMarkers();
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.renderMarkers();
  }

  renderMarkers() {
    if (!this.markersLayer) return;
    this.markersLayer.clearLayers();

    const filtered = this.incidents.filter(inc => {
      if (this.currentFilter === "all") return true;
      if (this.currentFilter === "resolved") return inc.status === "resolved";
      return inc.zone === this.currentFilter && inc.status !== "resolved";
    });

    filtered.forEach(inc => {
      const pinHtml = this._getMarkerHtml(inc);
      const icon = L.divIcon({
        className: "custom-leaflet-pin",
        html: pinHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([inc.lat, inc.lng], { icon }).addTo(this.markersLayer);

      const popupContent = `
        <div style="font-family: sans-serif; font-size: 13px; max-width: 240px; color: #1e293b;">
          <div style="font-weight: 800; color: ${inc.zone === 'red' ? '#dc2626' : inc.zone === 'orange' ? '#ea580c' : inc.zone === 'yellow' ? '#ca8a04' : '#059669'}; margin-bottom: 4px;">
            ${inc.zoneTitle}
          </div>
          <img src="${inc.image}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin: 4px 0;" />
          <div style="font-weight: 700; margin-top: 4px;">${inc.location}</div>
          <div style="font-size: 11px; color: #64748b;">${inc.society} (${inc.ward})</div>
          <div style="margin-top: 6px; font-size: 11px; background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
            <b>AI Volume:</b> ${inc.aiAnalysis.volumeM3} m³ (${inc.aiAnalysis.estimatedWeightKg} kg)<br>
            <b>SLA Urgency:</b> < ${inc.slaHours} Hours
          </div>
          <button id="popup-btn-${inc.id}" style="width: 100%; margin-top: 8px; background: #059669; color: white; border: none; padding: 5px 8px; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Inspect & Manage
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("popupopen", () => {
        const btn = document.getElementById(`popup-btn-${inc.id}`);
        if (btn) {
          btn.onclick = () => {
            if (this.onIncidentSelect) this.onIncidentSelect(inc.id);
          };
        }
      });
    });
  }

  _getMarkerHtml(inc) {
    if (inc.status === "resolved") {
      return `<div class="custom-zone-pin pin-green">✓</div>`;
    }
    if (inc.zone === "red") {
      return `<div class="custom-zone-pin pin-red">🔴</div>`;
    }
    if (inc.zone === "orange") {
      return `<div class="custom-zone-pin pin-orange">🟠</div>`;
    }
    return `<div class="custom-zone-pin pin-yellow">🟡</div>`;
  }

  flyToIncident(inc) {
    if (!this.map) return;
    this.map.flyTo([inc.lat, inc.lng], 15, { duration: 1.2 });
  }
}
