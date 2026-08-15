/**
 * EcoSense - Supabase Cloud Backend & PostgreSQL Real-Time Service
 * Supports: PostgreSQL Cloud Database, Realtime Subscriptions, Auth, and Storage with LocalStorage fallback
 */

const SUPABASE_DEFAULT_CONFIG = {
  url: "https://wjonphfvbluowdhdhcop.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqb25waGZ2Ymx1b3dkaGRoY29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDEwMDYsImV4cCI6MjEwMjM3NzAwNn0.HxGwh7Pfjcg7cJLTUuq0xS0e8DuOnYHOsUItfyUhsYE"
};

function getActiveSupabaseConfig() {
  try {
    const saved = localStorage.getItem("ecosense_supabase_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return SUPABASE_DEFAULT_CONFIG;
}

class EcoSenseSupabaseService {
  constructor() {
    this.isInitialized = false;
    this.client = null;
    this.channel = null;
    this.init();
  }

  init() {
    try {
      if (typeof window.supabase !== "undefined" && window.supabase.createClient) {
        const config = getActiveSupabaseConfig();
        this.client = window.supabase.createClient(config.url, config.anonKey);
        this.isInitialized = true;
        console.log("⚡ [EcoSense] Supabase PostgreSQL Cloud Client initialized.");
      } else {
        console.warn("⚠️ [EcoSense] Supabase JS SDK not detected from CDN. Running in local fallback mode.");
      }
    } catch (err) {
      console.warn("⚠️ [EcoSense] Supabase init notice:", err.message);
      this.isInitialized = false;
    }
  }

  // --- Real-time PostgreSQL Incident Subscription ---
  subscribeToIncidents(callback) {
    if (this.isInitialized && this.client) {
      try {
        // Initial Fetch from Supabase Table
        this.client
          .from("incidents")
          .select("*")
          .order("timestamp", { ascending: false })
          .then(({ data, error }) => {
            if (!error && data && data.length > 0) {
              callback(data);
            }
          });

        // Listen to live INSERT / UPDATE / DELETE events
        this.channel = this.client
          .channel("public:incidents")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "incidents" },
            (payload) => {
              console.log("⚡ [Supabase Realtime] Change received:", payload);
              // Fetch latest dataset to keep all devices in exact sync
              this.client
                .from("incidents")
                .select("*")
                .order("timestamp", { ascending: false })
                .then(({ data, error }) => {
                  if (!error && data) callback(data);
                });
            }
          )
          .subscribe();

        return this.channel;
      } catch (e) {
        console.warn("Supabase subscription fallback:", e);
      }
    }
    return null;
  }

  // Insert or Upsert Incident in Supabase
  async saveIncident(incident) {
    if (this.isInitialized && this.client) {
      try {
        const { data, error } = await this.client
          .from("incidents")
          .upsert([incident], { onConflict: "id" });

        if (error) {
          console.warn("Supabase upsert note:", error.message);
        } else {
          console.log("⚡ [EcoSense Cloud] Incident synced to Supabase:", incident.id);
          return { success: true, mode: "supabase", id: incident.id };
        }
      } catch (err) {
        console.warn("Supabase cloud save fallback:", err.message);
      }
    }
    return { success: true, mode: "local", id: incident.id };
  }

  // Update Incident Status in Supabase
  async updateIncidentStatus(incidentId, updateFields) {
    if (this.isInitialized && this.client) {
      try {
        const { error } = await this.client
          .from("incidents")
          .update(updateFields)
          .eq("id", incidentId);

        if (!error) {
          console.log("⚡ [EcoSense Cloud] Supabase ticket updated:", incidentId);
          return true;
        }
      } catch (err) {
        console.warn("Supabase update error:", err.message);
      }
    }
    return false;
  }

  // Sync User Profile & EcoPoints
  async syncUserProfile(user) {
    if (this.isInitialized && this.client && user.phone) {
      try {
        const userId = user.phone.replace(/[^0-9]/g, "") || "user_" + Date.now();
        await this.client.from("users").upsert([
          {
            id: userId,
            name: user.name,
            role: user.role,
            ward: user.ward,
            eco_points: user.ecoPoints || 0,
            reports_count: user.reportsCount || 0,
            last_active: new Date().toISOString()
          }
        ], { onConflict: "id" });
      } catch (err) {
        console.warn("User sync to Supabase note:", err.message);
      }
    }
  }

  // Set Custom Project Config
  setCustomConfig(url, anonKey) {
    localStorage.setItem("ecosense_supabase_config", JSON.stringify({ url, anonKey }));
    location.reload();
  }
}

// Attach globally
window.EcoSenseSupabase = new EcoSenseSupabaseService();
