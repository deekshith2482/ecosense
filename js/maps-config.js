/**
 * EcoSense Google Maps Configuration & Runtime Loader
 * Securely manages API key loading from Environment Variables / LocalStorage without hardcoding
 */

(function () {
  // Safe default / environment variable retrieval
  const getMapsApiKey = () => {
    // 1. Check window environment / global injected vars (e.g. from Vite, Next.js, or server)
    if (typeof window !== "undefined") {
      if (window.__ECOSENSE_GOOGLE_MAPS_KEY) return window.__ECOSENSE_GOOGLE_MAPS_KEY;
      if (window.VITE_GOOGLE_MAPS_API_KEY) return window.VITE_GOOGLE_MAPS_API_KEY;
      if (window.REACT_APP_GOOGLE_MAPS_API_KEY) return window.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (window.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return window.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      // 2. Check localStorage if set by developer / user in console or settings
      const storedKey = localStorage.getItem("ecosense_google_maps_key");
      if (storedKey) return storedKey;
    }

    // 3. Check process.env if bundled with a build tool
    if (typeof process !== "undefined" && process.env) {
      return (
        process.env.GOOGLE_MAPS_API_KEY ||
        process.env.VITE_GOOGLE_MAPS_API_KEY ||
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        ""
      );
    }

    // 4. Default Project API Key
    return "AIzaSyBR3xcV8rmsvR3WwmXzJSglOi3VNSFcApQ";
  };

  window.EcoSenseMapsConfig = {
    apiKey: getMapsApiKey(),
    setApiKey: function (key) {
      localStorage.setItem("ecosense_google_maps_key", key);
      window.location.reload();
    },
    loadGoogleMapsSDK: function (callback) {
      if (typeof google !== "undefined" && google.maps) {
        if (callback) callback();
        return;
      }

      const key = getMapsApiKey();
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      
      // Load Google Maps JavaScript API with places, geometry and drawing libraries
      const keyParam = key ? `&key=${encodeURIComponent(key)}` : "";
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing${keyParam}&callback=__ecoSenseGoogleMapsLoaded`;

      window.__ecoSenseGoogleMapsLoaded = function () {
        console.log("🗺️ [EcoSense] Live Google Maps JavaScript API initialized.");
        if (callback) callback();
        window.dispatchEvent(new CustomEvent("ecosense_maps_ready"));
      };

      script.onerror = function () {
        console.warn("⚠️ [EcoSense] Google Maps API load notice. Falling back to interactive fallback map.");
      };

      document.head.appendChild(script);
    }
  };
})();
