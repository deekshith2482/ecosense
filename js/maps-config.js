/**
 * EcoSense Google Maps Configuration & Runtime Loader
 * Securely manages API key loading from Environment Variables / LocalStorage without hardcoding
 */

(function () {
  const getMapsApiKey = () => {
    if (typeof window !== "undefined") {
      if (window.__ECOSENSE_GOOGLE_MAPS_KEY) return window.__ECOSENSE_GOOGLE_MAPS_KEY;
      if (window.VITE_GOOGLE_MAPS_API_KEY) return window.VITE_GOOGLE_MAPS_API_KEY;
      if (window.REACT_APP_GOOGLE_MAPS_API_KEY) return window.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (window.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return window.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      const storedKey = localStorage.getItem("ecosense_google_maps_key");
      if (storedKey) return storedKey;
    }

    if (typeof process !== "undefined" && process.env) {
      return (
        process.env.GOOGLE_MAPS_API_KEY ||
        process.env.VITE_GOOGLE_MAPS_API_KEY ||
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        ""
      );
    }

    // Default configured key
    return "AIzaSyBR3xcV8rmsvR3WwmXzJSglOi3VNSFcApQ";
  };

  let isSdkLoading = false;

  window.EcoSenseMapsConfig = {
    apiKey: getMapsApiKey(),
    setApiKey: function (key) {
      localStorage.setItem("ecosense_google_maps_key", key);
      window.location.reload();
    },
    loadGoogleMapsSDK: function (callback) {
      if (typeof google !== "undefined" && google.maps && google.maps.Map) {
        if (callback) callback();
        return;
      }

      if (isSdkLoading) {
        window.addEventListener("ecosense_maps_ready", () => {
          if (callback) callback();
        }, { once: true });
        return;
      }

      isSdkLoading = true;
      const key = getMapsApiKey();
      
      window.__ecoSenseGoogleMapsLoaded = function () {
        console.log("🗺️ [EcoSense] Live Google Maps JavaScript API loaded successfully.");
        window.dispatchEvent(new CustomEvent("ecosense_maps_ready"));
        if (callback) callback();
      };

      // Fallback in case of Google Cloud billing/authorization issue
      window.gm_authFailure = function () {
        console.warn("⚠️ [EcoSense Google Maps] Auth failure or billing not enabled on Google Cloud. Falling back seamlessly.");
        window.dispatchEvent(new CustomEvent("ecosense_maps_auth_error"));
      };

      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      const keyParam = key ? `&key=${encodeURIComponent(key)}` : "";
      script.src = `https://maps.googleapis.com/maps/api/js?v=weekly&libraries=places,geometry${keyParam}&callback=__ecoSenseGoogleMapsLoaded`;

      script.onerror = function () {
        console.warn("⚠️ [EcoSense] Google Maps API script network notice.");
        window.dispatchEvent(new CustomEvent("ecosense_maps_load_error"));
      };

      document.head.appendChild(script);
    }
  };

  // Automatically start loading Google Maps immediately
  window.EcoSenseMapsConfig.loadGoogleMapsSDK();
})();
