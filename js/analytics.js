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
    if (typeof Chart === "undefined") {
      console.warn("Chart.js not loaded.");
      return;
    }
    this.renderCharts();
  }

  renderCharts() {
    this._renderWardChart();
    this._renderCompositionChart();
    this._renderZoneDistribution();
  }

  _renderWardChart() {
    const ctx = document.getElementById("chart-ward-performance");
    if (!ctx) return;

    if (this.chartWard) this.chartWard.destroy();

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
            backgroundColor: "rgba(239, 68, 68, 0.75)",
            borderRadius: 6
          },
          {
            label: "Cleared by BBMP",
            data: resolvedData,
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#a7f3d0", font: { family: "Plus Jakarta Sans", weight: 600 } } }
        },
        scales: {
          x: { ticks: { color: "#6ee7b7" }, grid: { color: "rgba(52, 211, 153, 0.1)" } },
          y: { ticks: { color: "#6ee7b7" }, grid: { color: "rgba(52, 211, 153, 0.1)" } }
        }
      }
    });
  }

  _renderCompositionChart() {
    const ctx = document.getElementById("chart-waste-composition");
    if (!ctx) return;

    if (this.chartComposition) this.chartComposition.destroy();

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
        plugins: {
          legend: { position: "right", labels: { color: "#a7f3d0", font: { family: "Plus Jakarta Sans", weight: 600 } } }
        }
      }
    });
  }

  _renderZoneDistribution() {
    const redCount = this.state.incidents.filter(i => i.zone === "red" && i.status !== "resolved").length;
    const orangeCount = this.state.incidents.filter(i => i.zone === "orange" && i.status !== "resolved").length;
    const yellowCount = this.state.incidents.filter(i => i.zone === "yellow" && i.status !== "resolved").length;
    const resolvedCount = this.state.incidents.filter(i => i.status === "resolved").length;

    const ctx = document.getElementById("chart-zone-distribution");
    if (!ctx) return;

    if (this.chartZones) this.chartZones.destroy();

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
        plugins: {
          legend: { position: "bottom", labels: { color: "#a7f3d0", font: { family: "Plus Jakarta Sans", weight: 600 } } }
        }
      }
    });
  }
}
