const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const statusDiv = document.getElementById("username-status");
const submitBtn = document.querySelector("button[type='submit']");
const form = document.querySelector("form");
let debounceTimer;
let usernameAvailable = false;

// Live username check
usernameInput.addEventListener("input", () => {
clearTimeout(debounceTimer);
const username = usernameInput.value.trim();
if (!username) {
    statusDiv.textContent = "";
    usernameAvailable = false;
    validateForm();
    return;
}

statusDiv.textContent = "Checking...";
statusDiv.style.color = "#555";

debounceTimer = setTimeout(() => {
    fetch(`/check-username?username=${encodeURIComponent(username)}`)
    .then(res => res.json())
    .then(data => {
        if (data.available) {
        statusDiv.textContent = "✅ Available";
        statusDiv.style.color = "green";
        usernameAvailable = true;
        } else {
        statusDiv.textContent = "❌ Username already taken";
        statusDiv.style.color = "red";
        usernameAvailable = false;
        }
        validateForm();
    })
    .catch(() => {
        statusDiv.textContent = "Error checking";
        statusDiv.style.color = "orange";
        usernameAvailable = false;
        validateForm();
    });
}, 400);
});

function validateForm() {
const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
const passwordValid = passwordInput.value.trim().length >= 3;
submitBtn.disabled = !(usernameAvailable && emailValid && passwordValid);
}

emailInput.addEventListener("input", validateForm);
passwordInput.addEventListener("input", validateForm);

// Handle form submission via AJAX
form.addEventListener("submit", (e) => {
e.preventDefault();

const data = {
    username: usernameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
};

fetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
})
    .then(res => res.json())
    .then(result => {
    if (result.success) {
        // success overlay
        const overlay = document.createElement("div");
        overlay.className = "success-overlay";
        overlay.innerHTML = `
        ✅ ${result.message}<br>
        Redirecting in <span id="countdown">3</span> seconds...
        `;
        document.querySelector(".form-container").appendChild(overlay);

        let seconds = 3;
        const timer = setInterval(() => {
        seconds--;
        const countdownEl = document.getElementById("countdown");
        if (countdownEl) countdownEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(timer);
            window.location.href = "/users";
        }
        }, 1000);
    } else {
        // show alert without reload
        alert(result.message);
    }
    })
    .catch(() => alert("Something went wrong. Please try again later."));
});