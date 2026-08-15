/**
 * EcoSense BBMP Municipal Authority Portal Module
 * Real-time triage feed, crew dispatch, SLA management, and proof-of-clearance verification
 */

import { BBMP_FLEET_CREWS, SAMPLE_IMAGES } from './mock-data.js';

export class BBMPPortal {
  constructor(appState, onIncidentUpdated) {
    this.state = appState;
    this.onIncidentUpdated = onIncidentUpdated;
    this.currentFilter = "all";
    this.currentWardFilter = "all";
  }

  init() {
    this._bindEvents();
    this.renderMetrics();
    this.renderIncidentGrid();
  }

  _bindEvents() {
    // Filter buttons
    const filterBtns = document.querySelectorAll(".bbmp-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        filterBtns.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.currentFilter = e.currentTarget.dataset.filter;
        this.renderIncidentGrid();
      });
    });

    const wardSelect = document.getElementById("bbmp-ward-filter");
    if (wardSelect) {
      wardSelect.addEventListener("change", (e) => {
        this.currentWardFilter = e.target.value;
        this.renderIncidentGrid();
      });
    }
  }

  renderMetrics() {
    const redCount = this.state.incidents.filter(i => i.zone === "red" && i.status !== "resolved").length;
    const orangeCount = this.state.incidents.filter(i => i.zone === "orange" && i.status !== "resolved").length;
    const yellowCount = this.state.incidents.filter(i => i.zone === "yellow" && i.status !== "resolved").length;
    const resolvedCount = this.state.incidents.filter(i => i.status === "resolved").length;

    // Calculate total cleared tonnage today
    const clearedTonnage = this.state.incidents
      .filter(i => i.status === "resolved")
      .reduce((sum, i) => sum + (i.aiAnalysis.estimatedWeightKg || 250), 1200) / 1000;

    const elRed = document.getElementById("bbmp-metric-red");
    const elOrange = document.getElementById("bbmp-metric-orange");
    const elYellow = document.getElementById("bbmp-metric-yellow");
    const elCleared = document.getElementById("bbmp-metric-tonnage");
    const elResolvedCount = document.getElementById("bbmp-metric-resolved");

    if (elRed) elRed.textContent = redCount;
    if (elOrange) elOrange.textContent = orangeCount;
    if (elYellow) elYellow.textContent = yellowCount;
    if (elCleared) elCleared.textContent = `${clearedTonnage.toFixed(2)} MT`;
    if (elResolvedCount) elResolvedCount.textContent = resolvedCount;
  }

  renderIncidentGrid() {
    const grid = document.getElementById("bbmp-incident-grid");
    if (!grid) return;

    const filtered = this.state.incidents.filter(inc => {
      // Zone filter
      if (this.currentFilter === "red" && inc.zone !== "red") return false;
      if (this.currentFilter === "orange" && inc.zone !== "orange") return false;
      if (this.currentFilter === "yellow" && inc.zone !== "yellow") return false;
      if (this.currentFilter === "resolved" && inc.status !== "resolved") return false;
      if (this.currentFilter === "active" && inc.status === "resolved") return false;

      // Ward filter
      if (this.currentWardFilter !== "all" && !inc.ward.includes(this.currentWardFilter)) return false;

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h3>No Incidents in this Queue</h3>
          <p style="margin-top: 0.25rem;">All reported spots in this filter category have been dispatched or cleared.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(inc => {
      const isResolved = inc.status === "resolved";
      const zoneClass = isResolved ? "status-resolved" : `status-${inc.zone}`;
      
      const zoneTagStyle = inc.zone === "red" 
        ? "background: rgba(239, 68, 68, 0.85);" 
        : inc.zone === "orange" 
        ? "background: rgba(249, 115, 22, 0.85);" 
        : "background: rgba(234, 179, 8, 0.85); color: #000;";

      // Crew Assignment pill
      const crewBadge = inc.assignedCrew 
        ? `<span class="meta-chip" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">🚛 ${inc.assignedCrew.unitName}</span>`
        : `<span class="meta-chip" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">⚠️ Unassigned</span>`;

      // Dynamic action buttons based on status
      let actionButtons = "";
      if (!isResolved) {
        if (!inc.assignedCrew) {
          actionButtons = `
            <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="window.ecoApp.openDispatchModal('${inc.id}')">
              🚛 Dispatch Unit
            </button>
          `;
        } else if (inc.status === "assigned") {
          actionButtons = `
            <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="window.ecoApp.markInProgress('${inc.id}')">
              ⚡ Start Cleanup
            </button>
            <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="window.ecoApp.openResolutionModal('${inc.id}')">
              📸 Upload Proof
            </button>
          `;
        } else if (inc.status === "in_progress") {
          actionButtons = `
            <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8125rem; background: var(--zone-green);" onclick="window.ecoApp.openResolutionModal('${inc.id}')">
              ✓ Verify & Close
            </button>
          `;
        }
      } else {
        actionButtons = `
          <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="window.ecoApp.openIncidentModal('${inc.id}')">
            🔍 Before/After View
          </button>
        `;
      }

      return `
        <div class="incident-action-card ${zoneClass}">
          <div class="card-image-wrap">
            <img src="${inc.image}" alt="${inc.location}" />
            <span class="card-zone-tag" style="${zoneTagStyle}">
              ${isResolved ? "🟢 RESOLVED" : inc.zoneTitle.split(" - ")[0]}
            </span>
          </div>
          <div class="card-body">
            <div class="card-location">${inc.location}</div>
            <div style="font-size: 0.8125rem; color: var(--text-tertiary);">
              <b>${inc.society}</b> • ${inc.ward}
            </div>
            
            <p style="font-size: 0.8125rem; margin-top: 0.25rem; line-height: 1.4;">
              ${inc.description}
            </p>

            <div class="card-meta-chips">
              <span class="meta-chip">📦 Vol: ${inc.aiAnalysis.volumeM3} m³</span>
              <span class="meta-chip">⚖️ ~${inc.aiAnalysis.estimatedWeightKg} kg</span>
              <span class="meta-chip">⏱️ SLA: < ${inc.slaHours}h</span>
              ${crewBadge}
            </div>
          </div>
          <div class="card-footer-actions">
            <button class="btn btn-secondary" style="padding: 0.5rem 0.75rem; font-size: 0.75rem;" onclick="window.ecoApp.openIncidentModal('${inc.id}')">
              AI Report
            </button>
            <div style="display: flex; gap: 0.4rem;">
              ${actionButtons}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  assignCrewToIncident(incidentId, crewId) {
    const incident = this.state.incidents.find(i => i.id === incidentId);
    const crew = BBMP_FLEET_CREWS.find(c => c.id === crewId) || BBMP_FLEET_CREWS[0];

    if (incident) {
      incident.assignedCrew = {
        unitId: crew.id,
        unitName: crew.name,
        leadOfficer: "Officer In-Charge",
        contact: "+91 80 2266 0000"
      };
      incident.status = "assigned";
      this.state.saveState();
      this.renderMetrics();
      this.renderIncidentGrid();
      
      if (this.onIncidentUpdated) {
        this.onIncidentUpdated(incident, `Assigned ${crew.name} to ${incident.location}`);
      }
    }
  }

  markIncidentInProgress(incidentId) {
    const incident = this.state.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = "in_progress";
      this.state.saveState();
      this.renderMetrics();
      this.renderIncidentGrid();
      if (this.onIncidentUpdated) {
        this.onIncidentUpdated(incident, `Cleanup in progress for ${incident.location}`);
      }
    }
  }

  resolveIncident(incidentId, proofImage, notes) {
    const incident = this.state.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = "resolved";
      incident.resolvedImage = proofImage || SAMPLE_IMAGES.cleaned_street;
      incident.resolvedAt = "Just now";
      incident.clearanceNotes = notes || "Site thoroughly cleared, swept, and treated with disinfectant powder.";
      
      this.state.saveState();
      this.renderMetrics();
      this.renderIncidentGrid();
      
      if (this.onIncidentUpdated) {
        this.onIncidentUpdated(incident, `🎉 Incident at ${incident.location} marked as RESOLVED & citizen notified!`);
      }
    }
  }
}
