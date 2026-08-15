/**
 * EcoSense - Firebase Cloud Backend & Real-Time Sync Service
 * Supports: Cloud Firestore, Auth, Storage with automatic LocalStorage fallback
 */

const FIREBASE_DEFAULT_CONFIG = {
  apiKey: "AIzaSyCh4145q5uR_GOwPCPYLqHlWd5d0_jdlgs",
  authDomain: "ecosense-a0a15.firebaseapp.com",
  projectId: "ecosense-a0a15",
  storageBucket: "ecosense-a0a15.firebasestorage.app",
  messagingSenderId: "658907606767",
  appId: "1:658907606767:web:c6cd349e05c627fa66351a",
  measurementId: "G-ZWJDHKTE7W"
};

// Check if user has saved custom Firebase config in localStorage
function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem("ecosense_firebase_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return FIREBASE_DEFAULT_CONFIG;
}

class EcoSenseFirebaseService {
  constructor() {
    this.isInitialized = false;
    this.db = null;
    this.auth = null;
    this.storage = null;
    this.listeners = [];
    this.init();
  }

  init() {
    try {
      if (typeof firebase !== "undefined" && firebase.initializeApp) {
        const config = getActiveFirebaseConfig();
        
        // Prevent duplicate app initialization
        if (!firebase.apps.length) {
          this.app = firebase.initializeApp(config);
        } else {
          this.app = firebase.app();
        }

        if (firebase.firestore) {
          this.db = firebase.firestore();
          // Enable offline persistence if supported
          this.db.enablePersistence({ synchronizeTabs: true }).catch(err => {
            // Tab synchronization or persistence fallback
          });
        }
        if (firebase.auth) {
          this.auth = firebase.auth();
        }
        if (firebase.storage) {
          this.storage = firebase.storage();
        }
        this.isInitialized = true;
        console.log("☁️ [EcoSense] Firebase Cloud Service initialized successfully.");
      } else {
        console.warn("⚠️ [EcoSense] Firebase SDK not loaded from CDN. Falling back to local offline mode.");
      }
    } catch (err) {
      console.warn("⚠️ [EcoSense] Firebase auto-connection notice:", err.message);
      this.isInitialized = false;
    }
  }

  // --- Real-time Incident Cloud Sync ---
  subscribeToIncidents(callback) {
    if (this.isInitialized && this.db) {
      try {
        const unsubscribe = this.db.collection("incidents")
          .orderBy("timestamp", "desc")
          .onSnapshot(snapshot => {
            const incidents = [];
            snapshot.forEach(doc => {
              incidents.push({ ...doc.data(), id: doc.id });
            });
            if (incidents.length > 0) {
              callback(incidents);
            }
          }, err => {
            console.warn("Firestore snapshot listener notice, using local cache:", err.message);
          });
        this.listeners.push(unsubscribe);
        return unsubscribe;
      } catch (e) {
        console.warn("Firestore sync fallback to local store:", e);
      }
    }
    return null;
  }

  // Save or Create Incident in Cloud Firestore
  async saveIncident(incident) {
    if (this.isInitialized && this.db) {
      try {
        const docRef = this.db.collection("incidents").doc(incident.id);
        await docRef.set(incident, { merge: true });
        console.log("☁️ [EcoSense Cloud] Incident synced to Firebase Firestore:", incident.id);
        return { success: true, mode: "cloud", id: incident.id };
      } catch (err) {
        console.warn("Cloud save notice, syncing locally:", err.message);
      }
    }
    return { success: true, mode: "local", id: incident.id };
  }

  // Update Incident Status (e.g. resolve, assign, dispute)
  async updateIncidentStatus(incidentId, updateFields) {
    if (this.isInitialized && this.db) {
      try {
        await this.db.collection("incidents").doc(incidentId).update(updateFields);
        console.log("☁️ [EcoSense Cloud] Incident status updated in Firestore:", incidentId);
        return true;
      } catch (err) {
        console.warn("Cloud update fallback:", err.message);
      }
    }
    return false;
  }

  // Save User Profile and EcoPoints to Cloud
  async syncUserProfile(user) {
    if (this.isInitialized && this.db && user.phone) {
      try {
        const userId = user.phone.replace(/[^0-9]/g, "") || "user_" + Date.now();
        await this.db.collection("users").doc(userId).set({
          name: user.name,
          role: user.role,
          ward: user.ward,
          ecoPoints: user.ecoPoints || 0,
          reportsCount: user.reportsCount || 0,
          lastActive: Date.now()
        }, { merge: true });
        console.log("☁️ [EcoSense Cloud] User profile synced to Firestore:", user.name);
      } catch (err) {
        console.warn("User sync notice:", err.message);
      }
    }
  }

  // Update Custom Config via Settings UI
  setCustomConfig(configObj) {
    localStorage.setItem("ecosense_firebase_config", JSON.stringify(configObj));
    location.reload();
  }
}

// Attach globally
window.EcoSenseFirebase = new EcoSenseFirebaseService();
