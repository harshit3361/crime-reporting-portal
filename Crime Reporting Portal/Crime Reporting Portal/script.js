/* =========================================================
   1. VARIABLES & CONSTANTS
   ========================================================= */
var currentCaptcha = "";
var isMapInitialized = false;
var mapInstance = null;

/* =========================================================
   2. ARRAYS & OBJECTS
   ========================================================= */
var crimeIncidents = [
    {
        category: "Financial Cyber Fraud",
        location: "Connaught Place, Central Hub",
        lat: 28.6139,
        lng: 77.2090,
        colorClass: "pin-red",
        time: "10 mins ago",
        status: "Active Tracking"
    },
    {
        category: "Theft / Robbery",
        location: "Sector 18 Market, Noida",
        lat: 28.5355,
        lng: 77.3910,
        colorClass: "pin-orange",
        time: "35 mins ago",
        status: "Patrol Dispatched"
    },
    {
        category: "Harassment Report",
        location: "Cyber Hub, Gurugram",
        lat: 28.4595,
        lng: 77.0266,
        colorClass: "pin-yellow",
        time: "1 hour ago",
        status: "Case Verified"
    },
    {
        category: "Identity Theft Online",
        location: "Rohini Sector 14",
        lat: 28.7041,
        lng: 77.1025,
        colorClass: "pin-red",
        time: "3 hours ago",
        status: "Bank Server Frozen"
    }
];

var metricData = [
    { value: "100%", label: "Encrypted & Confidential" },
    { value: "< 15 Mins", label: "Average Response Time" },
    { value: "24/7", label: "Active Monitoring Units" }
];

/* =========================================================
   3. AUTO 3-SECOND LOADER (ZERO LAG / NO PAUSE)
   ========================================================= */
function initLoader() {
    var secondsLeft = 3;
    var timerElement = document.getElementById("timer");
    var loaderOverlay = document.getElementById("loaderOverlay");

    var timerInterval = setInterval(function() {
        secondsLeft--;
        if (timerElement && secondsLeft > 0) {
            timerElement.innerText = secondsLeft;
        }
    }, 1000);

    // Exact 3000ms (3 seconds) par loader screen direct remove ho jayegi
    setTimeout(function() {
        clearInterval(timerInterval);
        if (loaderOverlay) {
            loaderOverlay.remove();
        }
    }, 3000);
}

/* =========================================================
   4. FUNCTIONS (DOM, LOOPS & EVENTS)
   ========================================================= */

// Render Metrics dynamically using Loops & DOM
function renderMetrics() {
    var metricsContainer = document.querySelector(".metrics-grid");
    if (!metricsContainer) return;

    metricsContainer.innerHTML = "";

    for (var i = 0; i < metricData.length; i++) {
        var card = document.createElement("div");
        card.className = "metric-card";

        var numDiv = document.createElement("div");
        numDiv.className = "metric-num";
        numDiv.innerText = metricData[i].value;

        var labelDiv = document.createElement("div");
        labelDiv.className = "metric-label";
        labelDiv.innerText = metricData[i].label;

        card.appendChild(numDiv);
        card.appendChild(labelDiv);
        metricsContainer.appendChild(card);
    }

    var clearDiv = document.createElement("div");
    clearDiv.className = "clear";
    metricsContainer.appendChild(clearDiv);
}

// Tab Switching
function showTab(targetTabId) {
    var allPages = document.querySelectorAll(".page");
    for (var i = 0; i < allPages.length; i++) {
        allPages[i].classList.remove("active");
    }

    var targetPage = document.getElementById(targetTabId);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    var allNavLinks = document.querySelectorAll(".nav-links a");
    for (var j = 0; j < allNavLinks.length; j++) {
        allNavLinks[j].classList.remove("active");
    }

    var currentActiveLink = document.querySelector('.nav-links a[href="#' + targetTabId + '"]');
    if (currentActiveLink) {
        currentActiveLink.classList.add("active");
    }

    if (targetTabId === "map" && !isMapInitialized) {
        setTimeout(initCrimeMap, 150);
    }
}

// Leaflet Map Initialization
function initCrimeMap() {
    mapInstance = L.map("crimeMap").setView([28.6139, 77.2090], 11);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        maxZoom: 18
    }).addTo(mapInstance);

    crimeIncidents.forEach(function(incident) {
        var pinIcon = L.divIcon({
            className: "blinking-pin " + incident.colorClass,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        var marker = L.marker([incident.lat, incident.lng], { icon: pinIcon }).addTo(mapInstance);

        var popupHTML = `
            <div style="padding: 4px;">
                <strong style="color:#ef4444; font-size:13px;">${incident.category}</strong><br>
                <span>📍 <strong>Location:</strong> ${incident.location}</span><br>
                <span>⏱️ <strong>Reported:</strong> ${incident.time}</span><br>
                <span style="color:#38bdf8; font-weight:bold;">Status: ${incident.status}</span>
            </div>
        `;

        marker.bindPopup(popupHTML);

        marker.on("mouseover", function() {
            this.openPopup();
        });
    });

    isMapInitialized = true;
}

// Modal controls
function openModal() {
    document.getElementById("authModal").style.display = "block";
    generateCaptcha();
}

function closeModal() {
    document.getElementById("authModal").style.display = "none";
}

// Dynamic Captcha generator
function generateCaptcha() {
    var characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var captchaResult = "";

    for (var i = 0; i < 3; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        captchaResult += characters.charAt(randomIndex);
    }

    currentCaptcha = captchaResult;
    document.getElementById("captchaCode").innerText = captchaResult;
    document.getElementById("captchaInput").value = "";
}

// Form Handlers
function handleLogin(event) {
    event.preventDefault();
    var userInput = document.getElementById("captchaInput").value;

    if (userInput.toUpperCase() !== currentCaptcha) {
        alert("Incorrect Captcha Code! Please try again.");
        generateCaptcha();
        return false;
    }

    var authContainer = document.getElementById("navAuth");
    authContainer.innerHTML = `
        <span style="color:#f8fafc; font-size:12px; margin-right:10px;">Officer Authenticated</span>
        <button class="btn btn-outline" onclick="location.reload()">Logout</button>
    `;

    closeModal();
    alert("Official Access Granted!");
    return false;
}

function handleReportSubmit() {
    var generatedHash = "CR-" + Math.floor(100000 + Math.random() * 900000);
    alert("INCIDENT REGISTERED SECURELY\n\nReference ID: " + generatedHash + "\nStatus: Forwarded to Division");

    showTab("track");
    document.getElementById("trackId").value = generatedHash;
    return false;
}

function trackCase() {
    var searchId = document.getElementById("trackId").value;
    document.getElementById("resId").innerText = searchId;
    document.getElementById("trackResult").style.display = "block";
    return false;
}

/* =========================================================
   5. PAGE START INITIALIZATION
   ========================================================= */
window.addEventListener("DOMContentLoaded", function() {
    initLoader(); // Starts loading screen automatically on page open
    renderMetrics();
    generateCaptcha();
});
