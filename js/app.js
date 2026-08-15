/**
 * EcoSense Main Application Controller
 * Orchestrates views, roles, modals, state persistence, and cross-portal synchronizations
 */

import { INITIAL_INCIDENTS, BBMP_FLEET_CREWS, SAMPLE_IMAGES } from './mock-data.js';
import { AIVisionEngine } from './ai-engine.js';
import { MapRenderer } from './map-renderer.js';
import { CitizenPortal } from './citizen-portal.js';
import { BBMPPortal } from './bbmp-portal.js';
import { AnalyticsDashboard } from './analytics.js';

class AppState {
  constructor() {
    this.storageKey = "ecosense_state_v1";
    this.incidents = [];
    this.ecoPoints = 250;
    this.citizenReportsCount = 3;
    this.currentRole = "citizen"; // citizen | bbmp
    this.currentView = "citizen-view"; // citizen-view | bbmp-view | map-view | ai-sandbox | analytics-view
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.incidents = parsed.incidents || INITIAL_INCIDENTS;
        this.ecoPoints = parsed.ecoPoints || 250;
        this.citizenReportsCount = parsed.citizenReportsCount || 3;
      } else {
        this.incidents = [...INITIAL_INCIDENTS];
      }
    } catch (e) {
      console.warn("Could not load localStorage, using defaults", e);
      this.incidents = [...INITIAL_INCIDENTS];
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        incidents: this.incidents,
        ecoPoints: this.ecoPoints,
        citizenReportsCount: this.citizenReportsCount
      }));
      // Trigger a custom event for same-tab updates
      window.dispatchEvent(new CustomEvent("ecosense_sync"));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  resetDemo() {
    localStorage.removeItem(this.storageKey);
    this.loadState();
    window.location.reload();
  }
}

class EcoSenseApp {
  constructor() {
    this.state = new AppState();
    this.aiEngine = new AIVisionEngine();
    this.mapRenderer = null;
    this.citizenPortal = null;
    this.bbmpPortal = null;
    this.analyticsDashboard = null;
    this.activeIncidentForModal = null;
  }

  init() {
    this._initModules();
    this._bindNavigation();
    this._bindRoleSwitcher();
    this._bindModals();
    this._bindRealtimeSync();
    this.updateUserHeaderStats();

    // Expose app instance globally for inline onclick handlers
    window.ecoApp = this;
  }

  _bindRealtimeSync() {
    // Cross-tab real-time sync via Storage API
    window.addEventListener("storage", (e) => {
      if (e.key === this.state.storageKey) {
        this.state.loadState();
        this._syncAllUI();
        this.showToast("⚡ Real-time update received from another session!", "info");
      }
    });

    // Same-tab internal event sync
    window.addEventListener("ecosense_sync", () => {
      this._syncAllUI();
    });
  }

  _syncAllUI() {
    this.updateUserHeaderStats();
    if (this.mapRenderer) this.mapRenderer.setIncidents(this.state.incidents);
    if (this.bbmpPortal) {
      this.bbmpPortal.renderMetrics();
      this.bbmpPortal.renderIncidentGrid();
    }
    if (this.citizenPortal) this.citizenPortal.renderMyReports();
    if (this.analyticsDashboard) this.analyticsDashboard.renderCharts();
  }

  _initModules() {
    // 1. Citizen Portal
    this.citizenPortal = new CitizenPortal(this.state, this.aiEngine, (newIncident) => {
      this.showToast(`🎉 Garbage report submitted! +50 EcoPoints earned.`, "success");
      this.updateUserHeaderStats();
      if (this.mapRenderer) this.mapRenderer.setIncidents(this.state.incidents);
      if (this.bbmpPortal) {
        this.bbmpPortal.renderMetrics();
        this.bbmpPortal.renderIncidentGrid();
      }
      if (this.analyticsDashboard) this.analyticsDashboard.renderCharts();
    });
    this.citizenPortal.init();

    // 2. BBMP Portal
    this.bbmpPortal = new BBMPPortal(this.state, (updatedInc, msg) => {
      this.showToast(msg, "info");
      if (this.mapRenderer) this.mapRenderer.setIncidents(this.state.incidents);
      if (this.citizenPortal) this.citizenPortal.renderMyReports();
      if (this.analyticsDashboard) this.analyticsDashboard.renderCharts();
    });
    this.bbmpPortal.init();

    // 3. Interactive Map
    this.mapRenderer = new MapRenderer("leaflet-map", (incidentId) => {
      this.openIncidentModal(incidentId);
    });
    this.mapRenderer.initMap();
    this.mapRenderer.setIncidents(this.state.incidents);
    this._bindMapFilters();

    // 4. Analytics
    this.analyticsDashboard = new AnalyticsDashboard(this.state);
    this.analyticsDashboard.init();
  }

  _bindNavigation() {
    const navTabs = document.querySelectorAll(".nav-tab");
    navTabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        const targetView = e.currentTarget.dataset.view;
        this.switchView(targetView);
      });
    });
  }

  _bindRoleSwitcher() {
    const btnCitizen = document.getElementById("role-btn-citizen");
    const btnBBMP = document.getElementById("role-btn-bbmp");

    if (btnCitizen && btnBBMP) {
      btnCitizen.addEventListener("click", () => {
        this.state.currentRole = "citizen";
        btnCitizen.classList.add("active");
        btnBBMP.classList.remove("active");
        this.switchView("citizen-view");
        this.showToast("Switched to Citizen Reporting View", "info");
      });

      btnBBMP.addEventListener("click", () => {
        this.state.currentRole = "bbmp";
        btnBBMP.classList.add("active");
        btnCitizen.classList.remove("active");
        this.switchView("bbmp-view");
        this.showToast("Switched to BBMP Municipal Command View", "info");
      });
    }
  }

  switchView(viewId) {
    this.state.currentView = viewId;
    
    // Update nav tab styling
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.view === viewId);
    });

    // Update view visibility
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.toggle("active", sec.id === viewId);
    });

    // Refresh components if needed
    if (viewId === "map-view") {
      setTimeout(() => {
        if (this.mapRenderer && this.mapRenderer.map) {
          this.mapRenderer.map.invalidateSize();
        }
        this._renderMapSidebar();
      }, 150);
    } else if (viewId === "bbmp-view") {
      this.bbmpPortal.renderMetrics();
      this.bbmpPortal.renderIncidentGrid();
    } else if (viewId === "analytics-view") {
      setTimeout(() => {
        this.analyticsDashboard.renderCharts();
      }, 100);
    }
  }

  _bindMapFilters() {
    const filterBtns = document.querySelectorAll(".map-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        filterBtns.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const filter = e.currentTarget.dataset.filter;
        this.mapRenderer.setFilter(filter);
        this._renderMapSidebar(filter);
      });
    });
  }

  _renderMapSidebar(filter = "all") {
    const container = document.getElementById("map-sidebar-list");
    if (!container) return;

    const filtered = this.state.incidents.filter(inc => {
      if (filter === "all") return true;
      if (filter === "resolved") return inc.status === "resolved";
      return inc.zone === filter && inc.status !== "resolved";
    });

    if (filtered.length === 0) {
      container.innerHTML = `<p style="padding: 1rem; color: var(--text-tertiary);">No incidents match this filter.</p>`;
      return;
    }

    container.innerHTML = filtered.map(inc => `
      <div class="incident-card-item" onclick="window.ecoApp.focusMapIncident('${inc.id}')">
        <img src="${inc.image}" class="incident-thumb" alt="garbage" />
        <div class="incident-info">
          <div class="incident-header-row">
            <span class="incident-loc">${inc.location}</span>
            <span style="font-size: 0.7rem; font-weight: 800; color: ${inc.zone === 'red' ? '#ef4444' : inc.zone === 'orange' ? '#f97316' : '#eab308'};">
              ${inc.zone.toUpperCase()}
            </span>
          </div>
          <div class="incident-meta">
            ${inc.society}<br>
            Vol: <b>${inc.aiAnalysis.volumeM3} m³</b> • SLA: < ${inc.slaHours}h
          </div>
        </div>
      </div>
    `).join("");
  }

  focusMapIncident(incidentId) {
    const inc = this.state.incidents.find(i => i.id === incidentId);
    if (inc && this.mapRenderer) {
      this.mapRenderer.flyToIncident(inc);
    }
  }

  updateUserHeaderStats() {
    const ecoEl = document.getElementById("header-ecopoints-val");
    if (ecoEl) ecoEl.textContent = this.state.ecoPoints;

    const citPoints = document.getElementById("citizen-stat-points");
    const citReports = document.getElementById("citizen-stat-reports");
    if (citPoints) citPoints.textContent = this.state.ecoPoints;
    if (citReports) citReports.textContent = this.state.citizenReportsCount;
  }

  /* ==========================================================================
     Modals Management
     ========================================================================== */
  _bindModals() {
    // Close modal on click outside or close button
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("active");
        }
      });
    });

    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
      });
    });

    // Dispatch confirm button
    const btnConfirmDispatch = document.getElementById("btn-confirm-dispatch");
    if (btnConfirmDispatch) {
      btnConfirmDispatch.addEventListener("click", () => {
        const crewId = document.getElementById("modal-crew-select").value;
        if (this.activeIncidentForModal) {
          this.bbmpPortal.assignCrewToIncident(this.activeIncidentForModal.id, crewId);
          document.getElementById("modal-dispatch").classList.remove("active");
        }
      });
    }

    // Resolution proof confirm button
    const btnConfirmResolve = document.getElementById("btn-confirm-resolve");
    if (btnConfirmResolve) {
      btnConfirmResolve.addEventListener("click", () => {
        const notes = document.getElementById("resolution-notes-input").value;
        const proofImg = document.getElementById("resolution-proof-preview").src;
        if (this.activeIncidentForModal) {
          this.bbmpPortal.resolveIncident(this.activeIncidentForModal.id, proofImg, notes);
          document.getElementById("modal-resolution").classList.remove("active");
        }
      });
    }

    // Compare slider event
    const compareSlider = document.getElementById("compare-slider-input");
    if (compareSlider) {
      compareSlider.addEventListener("input", (e) => {
        const overlay = document.getElementById("compare-overlay-box");
        if (overlay) {
          overlay.style.width = `${e.target.value}%`;
        }
      });
    }
  }

  openIncidentModal(incidentId) {
    const inc = this.state.incidents.find(i => i.id === incidentId);
    if (!inc) return;

    this.activeIncidentForModal = inc;
    const modal = document.getElementById("modal-incident-detail");
    
    document.getElementById("modal-inc-title").textContent = `${inc.zoneTitle} - ${inc.location}`;
    document.getElementById("modal-inc-society").textContent = `${inc.society} (${inc.ward})`;
    document.getElementById("modal-inc-desc").textContent = inc.description;
    
    // Timeline steps
    const isAssigned = inc.assignedCrew != null || inc.status === "assigned" || inc.status === "in_progress" || inc.status === "resolved";
    const isInProg = inc.status === "in_progress" || inc.status === "resolved";
    const isResolved = inc.status === "resolved";

    document.getElementById("timeline-step-reported").className = "timeline-step completed";
    document.getElementById("timeline-step-ai").className = "timeline-step completed";
    document.getElementById("timeline-step-dispatch").className = `timeline-step ${isAssigned ? (isInProg ? 'completed' : 'active') : ''}`;
    document.getElementById("timeline-step-resolved").className = `timeline-step ${isResolved ? 'completed' : ''}`;

    // Before / After View
    const compareWrapper = document.getElementById("modal-compare-wrapper");
    const singleImageWrapper = document.getElementById("modal-single-image-wrapper");

    if (isResolved && inc.resolvedImage) {
      compareWrapper.style.display = "block";
      singleImageWrapper.style.display = "none";
      document.getElementById("compare-before-img").src = inc.image;
      document.getElementById("compare-after-img").src = inc.resolvedImage;
    } else {
      compareWrapper.style.display = "none";
      singleImageWrapper.style.display = "block";
      document.getElementById("modal-single-img").src = inc.image;
    }

    // AI Details
    document.getElementById("modal-ai-conf").textContent = `${inc.aiAnalysis.confidence}%`;
    document.getElementById("modal-ai-vol").textContent = `${inc.aiAnalysis.volumeM3} m³`;
    document.getElementById("modal-ai-wt").textContent = `~${inc.aiAnalysis.estimatedWeightKg} kg`;
    document.getElementById("modal-ai-hazard").textContent = `${inc.aiAnalysis.healthHazardScore}/10`;
    document.getElementById("modal-ai-action").textContent = inc.aiAnalysis.recommendedAction || "Immediate sanitation clearance";

    modal.classList.add("active");
  }

  openDispatchModal(incidentId) {
    const inc = this.state.incidents.find(i => i.id === incidentId);
    if (!inc) return;

    this.activeIncidentForModal = inc;
    const modal = document.getElementById("modal-dispatch");
    document.getElementById("dispatch-modal-loc").textContent = `${inc.location} (${inc.ward})`;
    document.getElementById("dispatch-modal-zone").textContent = inc.zoneTitle;

    // Populate Crew Select
    const select = document.getElementById("modal-crew-select");
    select.innerHTML = BBMP_FLEET_CREWS.map(c => `
      <option value="${c.id}">${c.name} [${c.type.toUpperCase()}] - Ward: ${c.ward} (Cap: ${c.capacityKg}kg)</option>
    `).join("");

    modal.classList.add("active");
  }

  markInProgress(incidentId) {
    this.bbmpPortal.markIncidentInProgress(incidentId);
  }

  openResolutionModal(incidentId) {
    const inc = this.state.incidents.find(i => i.id === incidentId);
    if (!inc) return;

    this.activeIncidentForModal = inc;
    const modal = document.getElementById("modal-resolution");
    document.getElementById("resolution-modal-loc").textContent = `${inc.location} - ${inc.society}`;
    
    // Preset before image and cleaned proof preview
    document.getElementById("resolution-before-thumb").src = inc.image;
    document.getElementById("resolution-proof-preview").src = SAMPLE_IMAGES.cleaned_street;
    document.getElementById("resolution-notes-input").value = "Spot completely cleared, debris loaded into compactor, road sanitized.";

    modal.classList.add("active");
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✓" : type === "alert" ? "⚠️" : "ℹ️";
    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  const app = new EcoSenseApp();
  app.init();
});
