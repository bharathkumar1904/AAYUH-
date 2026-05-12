// =====================================================
// 🔹 AAYUH! - script.js
// Handles: PWA Install, Firebase check, Service Worker
// =====================================================

// -----------------------------
// 1️⃣ Firebase Initialization
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDVZNBKutvRFrQOFQunVgSBwJFLMvrct0Q",
  authDomain: "aayuh-c9a87.firebaseapp.com",
  projectId: "aayuh-c9a87",
  storageBucket: "aayuh-c9a87.firebasestorage.app",
  messagingSenderId: "459370049467",
  appId: "1:459370049467:web:4354a11c6b43d3f6dede9e",
  measurementId: "G-GNFKCBES0L"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => console.log("✅ Persistent login enabled."))
  .catch(error => console.error("Persistence error:", error.message));

// -----------------------------
// 2️⃣ PWA: Install Prompt Logic
// -----------------------------
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("📱 PWA install prompt available.");
  if (installBtn) installBtn.style.display = 'block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);
    deferredPrompt = null;
  });
}

// -----------------------------
// 3️⃣ Service Worker Registration
// -----------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => {
      console.log("✅ Service Worker registered successfully.");

      // Detect new updates
      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            const updatePopup = document.getElementById('updatePopup');
            if (updatePopup) updatePopup.style.display = 'flex';
          }
        };
      };
    })
    .catch(err => console.error("❌ Service Worker registration failed:", err));
}

// Refresh button logic for update popup
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
    }
    window.location.reload();
  });
}

// -----------------------------
// 4️⃣ Auth State Check
// -----------------------------
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("👤 Logged in as:", user.email);
    if (window.location.pathname.includes('index.html')) {
      window.location.href = 'dashboard.html';
    }
  } else {
    console.log("🚪 No user logged in.");
  }
});

// -----------------------------
// 5️⃣ Download / Zip builder
// -----------------------------
// Builds a zip of core site files in the browser using JSZip (from CDN).
// Usage: window.createAppZip({ onProgress: (msg) => { /* ... */ } })
window.createAppZip = async function ({ onProgress } = {}) {
  if (!window.JSZip) throw new Error('JSZip not found. Ensure the JSZip CDN is loaded.');
  const zip = new JSZip();

  const toFetch = [
    'index.html',
    'home.html',
    'about.html',
    'Contact Us.html',
    'dashboard.html',
    'debug-auth.html',
    'disease.html',
    'Emergency.html',
    'manifest.json',
    'medical history.html',
    'medicines.html',
    'register.html',
    'service-worker.js',
    'settings.html',
    'style.css',
    'script.js',
    'Symptoms.html',
    'Terms and Conditions.html'
  ];

  // helper to safely fetch text or binary
  async function tryFetchText(path) {
    try {
      const res = await fetch(encodeURI(path));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      console.warn('Skipping', path, err.message);
      return null;
    }
  }

  async function tryFetchBlob(path) {
    try {
      const res = await fetch(encodeURI(path));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.blob();
    } catch (err) {
      console.warn('Skipping binary', path, err.message);
      return null;
    }
  }

  // Fetch text files
  for (let i = 0; i < toFetch.length; i++) {
    const path = toFetch[i];
    if (onProgress) onProgress(`Fetching: ${path} (${i+1}/${toFetch.length})`);
    const text = await tryFetchText(path);
    if (text !== null) zip.file(path, text);
  }

  // Try some common icon files (binary)
  const iconCandidates = [
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/manifest-icon.png',
    'icons/favicon.ico'
  ];

  for (let j = 0; j < iconCandidates.length; j++) {
    const p = iconCandidates[j];
    if (onProgress) onProgress(`Fetching asset: ${p}`);
    const b = await tryFetchBlob(p);
    if (b) zip.file(p, b);
  }

  if (onProgress) onProgress('Generating zip...');
  const blob = await zip.generateAsync({ type: 'blob' }, meta => {
    if (onProgress) onProgress(`Zipping: ${Math.round(meta.percent)}%`);
  });

  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aayuh-webapp.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  if (onProgress) onProgress('Download started');
};
