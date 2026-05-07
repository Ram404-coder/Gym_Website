let settings = JSON.parse(localStorage.getItem("gymSettings")) || {};

// Load saved settings
window.onload = () => {
    document.querySelectorAll("input, select").forEach(el => {
        if (settings[el.id] !== undefined) {
            if (el.type === "checkbox") el.checked = settings[el.id];
            else el.value = settings[el.id];
        }
    });
};

// Save settings
function saveSettings() {
    document.querySelectorAll("input, select").forEach(el => {
        settings[el.id] = el.type === "checkbox" ? el.checked : el.value;
    });

    localStorage.setItem("gymSettings", JSON.stringify(settings));

    // demo notification
    if (Notification.permission === "granted") {
        new Notification("Settings Updated", {
            body: "Your notification preferences are saved."
        });
    }
}

// Enable browser notifications
function enableNotifications() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification("Notifications Enabled 🔔", {
                body: "You will now receive gym alerts"
            });
        }
    });
}

// Demo: simulate class reminder
setTimeout(() => {
    if (Notification.permission === "granted") {
        if (settings.classReminder) {
            new Notification("Yoga Class Reminder", {
                body: "Your class starts soon!"
            });
        }
    }
}, 5000);