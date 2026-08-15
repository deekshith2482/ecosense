/**
 * EcoSense Live Google Maps Interactive Renderer
 * 
 * Features:
 * 1. Live Google Maps JavaScript API integration (Satellite & Hybrid views, Road Map, Terrain)
 * 2. Full zooming, panning, and modern sleek custom-styled controls
 * 3. Browser Geolocation auto-detection with custom Eco-Pulse marker
 * 4. Map click-to-coordinate picker that updates the EcoSense GPS reporting interface
 * 5. Incident triage pins with SLA color codes & rich InfoWindows
 * 6. Responsive, mobile & desktop optimized
 */

export class MapRenderer {
  constructor(mapContainerId, onIncidentSelect) {
    this.containerId = mapContainerId;
    this.onIncidentSelect = onIncidentSelect;
    this.map = null;
    this.markers = [];
    this.userLocationMarker = null;
    this.clickPinMarker = null;
    this.infoWindow = null;
    this.currentFilter = "all";
    this.incidents = [];
    this.bangaloreCenter = { lat: 12.9716, lng: 77.5946 };
  }

  initMap() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (typeof google === "undefined" || !google.maps) {
      // If Google Maps SDK is loading asynchronously, wait for it or load via EcoSenseMapsConfig
      if (window.EcoSenseMapsConfig && window.EcoSenseMapsConfig.loadGoogleMapsSDK) {
        window.EcoSenseMapsConfig.loadGoogleMapsSDK(() => this._createGoogleMap(container));
      } else {
        window.addEventListener("ecosense_maps_ready", () => this._createGoogleMap(container));
      }
      return;
    }

    this._createGoogleMap(container);
  }

  _createGoogleMap(container) {
    if (this.map) return; // Already initialized

    // Dark lush eco styled theme for Google Maps
    const ecoDarkStyle = [
      { elementType: "geometry", stylers: [{ color: "#0f2e22" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#041812" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#6ee7b7" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#a7f3d0" }]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#34d399" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#093829" }]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4ade80" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#164e3b" }]
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#064e3b" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#a7f3d0" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#047857" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#065f46" }]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#0d3b2e" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#042018" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#38bdf8" }]
      }
    ];

    this.map = new google.maps.Map(container, {
      center: this.bangaloreCenter,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_LEFT
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      fullscreenControl: true,
      styles: ecoDarkStyle
    });

    this.infoWindow = new google.maps.InfoWindow();

    // 1. Detect User Geolocation automatically with permission
    this._detectUserLocation();

    // 2. Click anywhere on Google Map to retrieve and display coordinates
    this._bindMapClickCoordinates();

    // 3. Render incident markers and Bangalore zone bounds
    this.renderMarkers();
    this._drawBangaloreZones();
  }

  _detectUserLocation() {
    if (!navigator.geolocation || !this.map) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Create Custom User Location Marker (Pulsing Eco-Blue Ring)
        if (this.userLocationMarker) this.userLocationMarker.setMap(null);

        this.userLocationMarker = new google.maps.Marker({
          position: userPos,
          map: this.map,
          title: "Your Live Location (GPS Active)",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: "#38bdf8",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2.5
          },
          zIndex: 999
        });

        // Update GPS label in Citizen reporting form if on citizen page
        this._updateReportingGpsLabel(userPos.lat, userPos.lng, "📍 Live GPS Locked (User Location)");
      },
      (error) => {
        console.log("ℹ️ Geolocation permission prompt result:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  _bindMapClickCoordinates() {
    if (!this.map) return;

    this.map.addListener("click", (e) => {
      const clickedLat = +e.latLng.lat().toFixed(5);
      const clickedLng = +e.latLng.lng().toFixed(5);

      // Place / Move interactive click pin
      if (!this.clickPinMarker) {
        this.clickPinMarker = new google.maps.Marker({
          position: { lat: clickedLat, lng: clickedLng },
          map: this.map,
          title: "Selected Incident Location",
          animation: google.maps.Animation.DROP,
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 1.5,
            scale: 1.5,
            anchor: new google.maps.Point(12, 24)
          }
        });
      } else {
        this.clickPinMarker.setPosition({ lat: clickedLat, lng: clickedLng });
      }

      // Update EcoSense GPS label and location inputs
      this._updateReportingGpsLabel(clickedLat, clickedLng, `📍 Map Picked: ${clickedLat}° N, ${clickedLng}° E`);
    });
  }

  _updateReportingGpsLabel(lat, lng, labelText) {
    const gpsBadge = document.getElementById("gps-coords-label");
    if (gpsBadge) {
      gpsBadge.setAttribute("data-lat", lat);
      gpsBadge.setAttribute("data-lng", lng);
      gpsBadge.textContent = labelText || `📍 Coordinates: ${lat}° N, ${lng}° E`;
    }
  }

  _drawBangaloreZones() {
    if (!this.map) return;

    const zones = [
      {
        name: "East Zone (Indiranagar / CV Raman / Ulsoor)",
        coords: [
          { lat: 12.980, lng: 77.610 },
          { lat: 12.995, lng: 77.665 },
          { lat: 12.960, lng: 77.670 },
          { lat: 12.955, lng: 77.615 }
        ],
        color: "#10b981"
      },
      {
        name: "South Zone (Koramangala / Jayanagar / JP Nagar)",
        coords: [
          { lat: 12.945, lng: 77.560 },
          { lat: 12.950, lng: 77.640 },
          { lat: 12.905, lng: 77.635 },
          { lat: 12.895, lng: 77.565 }
        ],
        color: "#f97316"
      },
      {
        name: "Bommanahalli Zone (HSR / Begur / Electronic City)",
        coords: [
          { lat: 12.920, lng: 77.620 },
          { lat: 12.922, lng: 77.670 },
          { lat: 12.860, lng: 77.665 },
          { lat: 12.862, lng: 77.595 }
        ],
        color: "#eab308"
      },
      {
        name: "West Zone (Malleshwaram / Rajajinagar / Vijayanagar)",
        coords: [
          { lat: 13.015, lng: 77.530 },
          { lat: 13.018, lng: 77.585 },
          { lat: 12.955, lng: 77.580 },
          { lat: 12.950, lng: 77.525 }
        ],
        color: "#38bdf8"
      },
      {
        name: "Mahadevapura Zone (Whitefield / Bellandur / Marathahalli)",
        coords: [
          { lat: 13.010, lng: 77.670 },
          { lat: 13.012, lng: 77.770 },
          { lat: 12.920, lng: 77.765 },
          { lat: 12.922, lng: 77.670 }
        ],
        color: "#ef4444"
      }
    ];

    zones.forEach(z => {
      new google.maps.Polygon({
        paths: z.coords,
        strokeColor: z.color,
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        fillColor: z.color,
        fillOpacity: 0.08,
        map: this.map
      });
    });
  }

  setIncidents(incidents) {
    this.incidents = incidents || [];
    this.renderMarkers();
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.renderMarkers();
  }

  renderMarkers() {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    const filtered = this.incidents.filter(inc => {
      if (this.currentFilter === "all") return true;
      if (this.currentFilter === "resolved") return inc.status === "resolved";
      if (this.currentFilter === "fraud") return inc.fraudAlert != null;
      return inc.zone === this.currentFilter && inc.status !== "resolved";
    });

    filtered.forEach(inc => {
      const color = inc.fraudAlert
        ? "#ef4444"
        : inc.status === "resolved"
        ? "#10b981"
        : inc.zone === "red"
        ? "#ef4444"
        : inc.zone === "orange"
        ? "#f97316"
        : "#eab308";

      const marker = new google.maps.Marker({
        position: { lat: inc.lat, lng: inc.lng },
        map: this.map,
        title: inc.location,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: color,
          fillOpacity: 0.95,
          strokeColor: "#ffffff",
          strokeWeight: 1.5,
          scale: 1.6,
          anchor: new google.maps.Point(12, 24)
        }
      });

      const infoHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; max-width: 250px; color: #0f172a; padding: 4px;">
          <div style="font-weight: 800; color: ${color}; margin-bottom: 4px; font-size: 13px;">
            ${inc.fraudAlert ? '🚨 FRAUD / MISMATCH ALERT' : inc.zoneTitle || inc.zone.toUpperCase()}
          </div>
          ${inc.image ? `<img src="${inc.image}" style="width:100%; height:90px; object-fit:cover; border-radius:6px; margin: 4px 0;" />` : ''}
          <div style="font-weight: 700; font-size: 13px; margin-top: 2px;">${inc.location}</div>
          <div style="font-size: 11px; color: #64748b;">${inc.society} (${inc.ward})</div>
          <div style="margin-top: 6px; font-size: 11px; background: #f1f5f9; padding: 5px 7px; border-radius: 4px;">
            <b>Status:</b> ${inc.status.toUpperCase()} | <b>SLA:</b> < ${inc.slaHours}h
          </div>
          <button id="gmap-btn-${inc.id}" style="width: 100%; margin-top: 8px; background: #059669; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            Inspect Incident
          </button>
        </div>
      `;

      marker.addListener("click", () => {
        this.infoWindow.setContent(infoHtml);
        this.infoWindow.open(this.map, marker);

        setTimeout(() => {
          const btn = document.getElementById(`gmap-btn-${inc.id}`);
          if (btn) {
            btn.onclick = () => {
              if (this.onIncidentSelect) this.onIncidentSelect(inc.id);
            };
          }
        }, 100);
      });

      this.markers.push(marker);
    });
  }

  flyToIncident(inc) {
    if (!this.map || !inc) return;
    this.map.panTo({ lat: inc.lat, lng: inc.lng });
    this.map.setZoom(16);
  }
}
