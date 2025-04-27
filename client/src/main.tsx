import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Function to load the Google Identity Services script
function loadGoogleScript() {
  // Check if the script is already loaded
  if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
    console.log("Google Identity Services script already loaded");
    return;
  }

  console.log("Loading Google Identity Services script");
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log("Google Identity Services script loaded successfully");
  };
  script.onerror = (error) => {
    console.error("Error loading Google Identity Services script:", error);
  };
  document.head.appendChild(script);
}

// Load Google Identity Services script
loadGoogleScript();

// When the window loads, notify that Google script should be available
window.addEventListener("load", () => {
  console.log("Window loaded, Google Identity Services script should be loading");
  if (window.google && window.google.accounts) {
    console.log("Google Identity Services loaded successfully on window load");
  } else {
    console.warn("Google Identity Services not loaded on window load - will retry in auth page");
  }
});

createRoot(document.getElementById("root")!).render(<App />);
