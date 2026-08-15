/**
 * EcoSense Citizen Reporting Module
 * Handles photo capture, AI scanning triggers, report submission, and citizen timeline tracking
 */

export class CitizenPortal {
  constructor(appState, aiEngine, onReportSubmitted) {
    this.state = appState;
    this.aiEngine = aiEngine;
    this.onReportSubmitted = onReportSubmitted;
    this.currentImage = null;
    this.currentAiResult = null;
  }

  init() {
    this._bindEvents();
    this.renderMyReports();
  }

  _bindEvents() {
    const fileInput = document.getElementById("citizen-file-input");
    const dropzone = document.getElementById("citizen-dropzone");
    const samplePresets = document.querySelectorAll(".preset-pill");
    const scanBtn = document.getElementById("btn-run-ai-scan");
    const submitBtn = document.getElementById("btn-submit-report");
    const gpsBtn = document.getElementById("btn-get-gps");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", (e) => this._handleFileSelect(e));
      
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });
      dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this._loadFileData(e.dataTransfer.files[0]);
        }
      });
    }

    samplePresets.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const presetUrl = e.currentTarget.dataset.img;
        const presetHint = e.currentTarget.dataset.hint;
        const presetWard = e.currentTarget.dataset.ward;
        const presetLoc = e.currentTarget.dataset.loc;
        const presetSociety = e.currentTarget.dataset.society;

        this._loadPreset(presetUrl, presetHint, presetWard, presetLoc, presetSociety);
      });
    });

    if (scanBtn) {
      scanBtn.addEventListener("click", () => this.runAiScan());
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.submitReport());
    }

    if (gpsBtn) {
      gpsBtn.addEventListener("click", () => this.fetchGPSLocation());
    }
  }

  _handleFileSelect(e) {
    if (e.target.files && e.target.files[0]) {
      this._loadFileData(e.target.files[0]);
    }
  }

  _loadFileData(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.currentImage = ev.target.result;
      this._updatePreviewImage(this.currentImage);
      document.getElementById("btn-run-ai-scan").disabled = false;
      document.getElementById("scan-status-text").textContent = "Photo loaded. Click 'Analyze with AI' to identify waste & zone.";
    };
    reader.readAsDataURL(file);
  }

  _loadPreset(url, hint, ward, loc, society) {
    this.currentImage = url;
    this._updatePreviewImage(url);
    
    if (ward) document.getElementById("citizen-ward-select").value = ward;
    if (loc) document.getElementById("citizen-location-input").value = loc;
    if (society) document.getElementById("citizen-society-input").value = society;

    document.getElementById("btn-run-ai-scan").disabled = false;
    document.getElementById("scan-status-text").textContent = `Preset '${hint}' loaded. Ready for AI inspection.`;
    
    // Auto trigger scan for delight
    this.runAiScan(hint);
  }

  _updatePreviewImage(src) {
    const imgEl = document.getElementById("ai-preview-img");
    const container = document.getElementById("ai-preview-container");
    const emptyState = document.getElementById("ai-preview-empty");
    
    if (imgEl) {
      imgEl.src = src;
      imgEl.style.display = "block";
    }
    if (emptyState) emptyState.style.display = "none";

    // Clear existing bounding boxes
    const bboxLayer = document.getElementById("ai-bbox-layer");
    if (bboxLayer) bboxLayer.innerHTML = "";
    
    document.getElementById("ai-results-panel").style.display = "none";
    document.getElementById("btn-submit-report").disabled = true;
  }

  async runAiScan(forcedHint = "auto") {
    if (!this.currentImage) return;

    const container = document.getElementById("ai-preview-container");
    const scanStatus = document.getElementById("scan-status-text");
    const scanBtn = document.getElementById("btn-run-ai-scan");

    container.classList.add("ai-scanning");
    scanBtn.disabled = true;

    try {
      this.currentAiResult = await this.aiEngine.analyzeGarbageImage(
        this.currentImage, 
        forcedHint, 
        (progress) => {
          scanStatus.textContent = `[${progress.progress}%] ${progress.text}`;
        }
      );

      this._renderAiResults(this.currentAiResult);
      document.getElementById("btn-submit-report").disabled = false;
    } catch (err) {
      console.error(err);
      scanStatus.textContent = "AI Analysis encountered an error. Please retry.";
    } finally {
      container.classList.remove("ai-scanning");
      scanBtn.disabled = false;
    }
  }

  _renderAiResults(result) {
    const panel = document.getElementById("ai-results-panel");
    const bboxLayer = document.getElementById("ai-bbox-layer");
    panel.style.display = "block";

    // Render Bounding Boxes
    bboxLayer.innerHTML = "";
    result.detectedObjects.forEach(obj => {
      const box = document.createElement("div");
      box.className = `bbox-tag ${obj.type}`;
      box.style.left = `${obj.x}%`;
      box.style.top = `${obj.y}%`;
      box.style.width = `${obj.w}%`;
      box.style.height = `${obj.h}%`;
      box.innerHTML = `<span class="bbox-label">${obj.label}</span>`;
      bboxLayer.appendChild(box);
    });

    // Render Zone Card
    const zoneCard = document.getElementById("ai-zone-card");
    zoneCard.className = `zone-badge-card ${result.zone}`;
    document.getElementById("ai-zone-title").textContent = result.zoneTitle;
    document.getElementById("ai-zone-sla").textContent = `SLA: < ${result.slaHours}h`;
    document.getElementById("ai-zone-action").textContent = result.recommendedAction;

    // Metrics
    document.getElementById("ai-metric-volume").textContent = `${result.volumeM3} m³`;
    document.getElementById("ai-metric-weight").textContent = `~${result.estimatedWeightKg} kg`;
    document.getElementById("ai-metric-hazard").textContent = `${result.healthHazardScore} / 10`;

    // Material Bars
    const { plastic, organic, hazardous, inert } = result.composition;
    this._setBar("mat-bar-plastic", "mat-val-plastic", plastic);
    this._setBar("mat-bar-organic", "mat-val-organic", organic);
    this._setBar("mat-bar-hazard", "mat-val-hazard", hazardous);
    this._setBar("mat-bar-inert", "mat-val-inert", inert);
  }

  _setBar(barId, valId, val) {
    const bar = document.getElementById(barId);
    const text = document.getElementById(valId);
    if (bar) bar.style.width = `${val}%`;
    if (text) text.textContent = `${val}%`;
  }

  fetchGPSLocation() {
    const gpsLabel = document.getElementById("gps-coords-label");
    gpsLabel.innerHTML = `<span style="color:#38bdf8;">🛰️ Accessing Device Geolocation GPS...</span>`;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          const accuracy = Math.round(pos.coords.accuracy || 5);
          gpsLabel.innerHTML = `📍 Live Device GPS: <b>${lat}° N, ${lng}° E</b> (Accuracy: ±${accuracy}m)`;
          gpsLabel.dataset.lat = lat;
          gpsLabel.dataset.lng = lng;
        },
        (err) => {
          // Fallback to Bangalore Coordinates
          console.warn("Geolocation permission or hardware unavailable, using Bangalore sector fallback:", err);
          const lat = (12.9300 + Math.random() * 0.07).toFixed(4);
          const lng = (77.6000 + Math.random() * 0.09).toFixed(4);
          gpsLabel.innerHTML = `📍 GPS Fixed: <b>${lat}° N, ${lng}° E</b> (Bangalore Sector)`;
          gpsLabel.dataset.lat = lat;
          gpsLabel.dataset.lng = lng;
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      const lat = (12.9300 + Math.random() * 0.07).toFixed(4);
      const lng = (77.6000 + Math.random() * 0.09).toFixed(4);
      gpsLabel.innerHTML = `📍 GPS Fixed: <b>${lat}° N, ${lng}° E</b>`;
      gpsLabel.dataset.lat = lat;
      gpsLabel.dataset.lng = lng;
    }
  }

  submitReport() {
    if (!this.currentImage || !this.currentAiResult) return;

    const ward = document.getElementById("citizen-ward-select").value;
    const location = document.getElementById("citizen-location-input").value.trim() || "Society Perimeter / Main Gate";
    const society = document.getElementById("citizen-society-input").value.trim() || "Green Valley Residents Association";
    const desc = document.getElementById("citizen-desc-input").value.trim() || "Garbage accumulation detected via EcoSense citizen app.";
    
    const gpsLabel = document.getElementById("gps-coords-label");
    const lat = parseFloat(gpsLabel.dataset.lat) || (12.9500 + Math.random() * 0.05);
    const lng = parseFloat(gpsLabel.dataset.lng) || (77.6200 + Math.random() * 0.05);

    const newIncident = {
      id: `ECO-BLR-${Math.floor(1000 + Math.random() * 9000)}`,
      zone: this.currentAiResult.zone,
      zoneTitle: this.currentAiResult.zoneTitle,
      ward: ward,
      location: location,
      society: society,
      lat: lat,
      lng: lng,
      reportedBy: "You (Citizen)",
      citizenAvatar: "ME",
      reportedAt: "Just now",
      timestamp: Date.now(),
      status: "pending",
      slaHours: this.currentAiResult.slaHours,
      slaDeadline: Date.now() + this.currentAiResult.slaHours * 3600 * 1000,
      image: this.currentImage,
      resolvedImage: null,
      description: desc,
      aiAnalysis: this.currentAiResult,
      assignedCrew: null
    };

    // Add to global store
    this.state.incidents.unshift(newIncident);
    this.state.ecoPoints += 50;
    this.state.citizenReportsCount += 1;
    this.state.saveState();

    // Reset Form
    this._resetForm();
    this.renderMyReports();

    if (this.onReportSubmitted) {
      this.onReportSubmitted(newIncident);
    }
  }

  _resetForm() {
    this.currentImage = null;
    this.currentAiResult = null;
    const imgEl = document.getElementById("ai-preview-img");
    const emptyState = document.getElementById("ai-preview-empty");
    if (imgEl) imgEl.style.display = "none";
    if (emptyState) emptyState.style.display = "flex";
    document.getElementById("ai-results-panel").style.display = "none";
    document.getElementById("ai-bbox-layer").innerHTML = "";
    document.getElementById("btn-run-ai-scan").disabled = true;
    document.getElementById("btn-submit-report").disabled = true;
    document.getElementById("citizen-desc-input").value = "";
    document.getElementById("scan-status-text").textContent = "Upload or pick a photo above to begin AI analysis.";
  }

  renderMyReports() {
    const container = document.getElementById("citizen-reports-list");
    if (!container) return;

    if (this.state.incidents.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: var(--text-tertiary); padding: 2rem;">No incidents reported yet.</p>`;
      return;
    }

    container.innerHTML = this.state.incidents.map(inc => {
      const isResolved = inc.status === "resolved";
      const statusBadge = isResolved
        ? `<span class="meta-chip" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">✓ Cleared by BBMP</span>`
        : inc.status === "in_progress"
        ? `<span class="meta-chip" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">⚡ Truck Dispatched</span>`
        : `<span class="meta-chip" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">⏳ Pending Action</span>`;

      return `
        <div class="incident-card-item" onclick="window.ecoApp.openIncidentModal('${inc.id}')">
          <img src="${inc.image}" class="incident-thumb" alt="Garbage photo" />
          <div class="incident-info">
            <div class="incident-header-row">
              <span class="incident-loc">${inc.location}</span>
              ${statusBadge}
            </div>
            <div class="incident-meta">
              <b>${inc.society}</b> • ${inc.ward}<br>
              Zone: <span style="font-weight:700; color:${inc.zone === 'red' ? '#ef4444' : inc.zone === 'orange' ? '#f97316' : '#eab308'};">${inc.zone.toUpperCase()}</span> • Vol: ${inc.aiAnalysis.volumeM3} m³
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}
