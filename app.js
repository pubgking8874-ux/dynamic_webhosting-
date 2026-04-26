console.log("JS loaded");

const Auth = window.aws_amplify.Auth;

const form = document.getElementById("signupForm");
const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("togglePass");
const eyeIcon = document.getElementById("eyeIcon");

// SVG paths for open/closed eye
const EYE_OPEN = `
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
`;
const EYE_CLOSED = `
  <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
`;

// 1. SHOW / HIDE PASSWORD — swaps icon paths
toggleBtn.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.innerHTML = EYE_CLOSED;
    toggleBtn.style.color = "#5b9cf6";
  } else {
    passwordInput.type = "password";
    eyeIcon.innerHTML = EYE_OPEN;
    toggleBtn.style.color = "";
  }
});

// 2. PASSWORD STRENGTH METER
passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;
  const fill = document.getElementById("strengthFill");
  const lbl = document.getElementById("strengthLabel");
  if (!fill || !lbl) return;

  let strength = 0;
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  fill.className = "strength-fill";
  if (val.length === 0) {
    fill.style.width = "0%";
    lbl.textContent = "";
    lbl.className = "strength-lbl";
  } else if (strength <= 1) {
    fill.classList.add("weak");
    lbl.textContent = "Weak";
    lbl.className = "strength-lbl weak";
  } else if (strength <= 2) {
    fill.classList.add("medium");
    lbl.textContent = "Medium";
    lbl.className = "strength-lbl medium";
  } else {
    fill.classList.add("strong");
    lbl.textContent = "Strong";
    lbl.className = "strength-lbl strong";
  }
});

// 3. SIGNUP LOGIC
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const signupBtn = document.getElementById("signupBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");

  // Loading state
  signupBtn.disabled = true;
  if (btnText) btnText.innerText = "Creating account...";
  if (btnSpinner) btnSpinner.style.display = "inline-block";

  try {
    const user = await Auth.signUp({
      username: email,
      password: password,
      attributes: { email: email }
    });

    console.log("Signup Success:", user);
    localStorage.setItem("pendingEmail", email);
    window.location.href = "verify.html";

  } catch (error) {
    console.error("Signup Error:", error);
    alert("Error: " + error.message);
  } finally {
    signupBtn.disabled = false;
    if (btnText) btnText.innerText = "Create Account";
    if (btnSpinner) btnSpinner.style.display = "none";
  }
});