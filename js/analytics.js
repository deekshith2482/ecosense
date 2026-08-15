/**
 * EcoSense BBMP Municipal Analytics & ESG Dashboard
 * Visualizes ward performance, waste composition, and SLA adherence using Chart.js
 */

export class AnalyticsDashboard {
  constructor(appState) {
    this.state = appState;
    this.chartWard = null;
    this.chartComposition = null;
    this.chartZones = null;
  }

  init() {
    this.renderCharts();
  }

  renderCharts() {
    if (typeof Chart === "undefined") {
      console.warn("Chart.js not loaded.");
      return;
    }
    setTimeout(() => {
      this._renderWardChart();
      this._renderCompositionChart();
      this._renderZoneDistribution();
    }, 50);
  }

  _renderWardChart() {
    const canvas = document.getElementById("chart-ward-performance");
    if (!canvas) return;

    if (this.chartWard) {
      try { this.chartWard.destroy(); } catch (e) {}
    }

    const ctx = canvas.getContext("2d");
    const wards = ["Indiranagar", "Koramangala", "HSR Layout", "Malleshwaram", "Whitefield", "Jayanagar"];
    const reportedData = [14, 11, 8, 5, 18, 7];
    const resolvedData = [12, 9, 7, 5, 13, 6];

    this.chartWard = new Chart(ctx, {
      type: "bar",
      data: {
        labels: wards,
        datasets: [
          {
            label: "Reported Spots",
            data: reportedData,
            backgroundColor: "rgba(239, 68, 68, 0.8)",
            borderColor: "#ef4444",
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: "Cleared by BBMP",
            data: resolvedData,
            backgroundColor: "rgba(16, 185, 129, 0.85)",
            borderColor: "#10b981",
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: {
          legend: { labels: { color: "#a7f3d0", font: { family: "Plus Jakarta Sans", weight: 600 } } }
        },
        scales: {
          x: { ticks: { color: "#6ee7b7" }, grid: { color: "rgba(52, 211, 153, 0.12)" } },
          y: { ticks: { color: "#6ee7b7" }, grid: { color: "rgba(52, 211, 153, 0.12)" }, beginAtZero: true }
        }
      }
    });
  }

  _renderCompositionChart() {
    const canvas = document.getElementById("chart-waste-composition");
    if (!canvas) return;

    if (this.chartComposition) {
      try { this.chartComposition.destroy(); } catch (e) {}
    }

    const ctx = canvas.getContext("2d");
    this.chartComposition = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Plastics & Packaging (48%)", "Organic / Wet Waste (34%)", "Construction / Inerts (12%)", "Hazardous / Bio (6%)"],
        datasets: [{
          data: [48, 34, 12, 6],
          backgroundColor: ["#38bdf8", "#10b981", "#fbbf24", "#ef4444"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: {
          legend: { position: "right", labels: { color: "#a7f3d0", font: { family: "Plus Jakarta Sans", weight: 600 } } }
        }
      }
    });
  }

  _renderZoneDistribution() {
    const canvas = document.getElementById("chart-zone-distribution");
    if (!canvas) return;

    if (this.chartZones) {
      try { this.chartZones.destroy(); } catch (e) {}
    }

    const incidents = (this.state && this.state.incidents) ? this.state.incidents : [];
    const redCount = incidents.filter(i => i.zone === "red" && i.status !== "resolved").length || 2;
    const orangeCount = incidents.filter(i => i.zone === "orange" && i.status !== "resolved").length || 3;
    const yellowCount = incidents.filter(i => i.zone === "yellow" && i.status !== "resolved").length || 1;
    const resolvedCount = incidents.filter(i => i.status === "resolved").length || 4;

    const ctx = canvas.getContext("2d");
    this.chartZones = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["🔴 Red (Critical)", "🟠 Orange (Moderate)", "🟡 Yellow (Minor)", "🟢 Resolved (Clean)"],
        datasets: [{
          data: [redCount, orangeCount, yellowCount, resolvedCount],
          backgroundColor: ["#ef4444", "#f97316", "#eab308", "#10b981"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: {
          legend: { position: "right", labels: { color: "#a7f3d0", font: { family: "Plus Jakarta Sans", weight: 600 } } }
        }
      }
    });
  }
}
