console.log("verify.js loaded");

const Auth = window.aws_amplify.Auth;

// Pre-fill email from localStorage (set during signup)
const emailInput = document.getElementById("email");
const savedEmail = localStorage.getItem("pendingEmail");
if (savedEmail && emailInput) {
  emailInput.value = savedEmail;
}

// OTP VERIFY
const verifyForm = document.getElementById("verifyForm");
verifyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const otp = document.getElementById("otp").value.trim();
  const verifyBtn = document.getElementById("verifyBtn");
  const verifyBtnText = document.getElementById("verifyBtnText");
  const verifySpinner = document.getElementById("verifySpinner");
  const otpError = document.getElementById("otpError");

  if (!email || !otp) {
    if (otpError) otpError.textContent = "Please fill in both fields.";
    return;
  }
  if (otpError) otpError.textContent = "";

  // Loading state
  verifyBtn.disabled = true;
  if (verifyBtnText) verifyBtnText.innerText = "Verifying...";
  if (verifySpinner) verifySpinner.style.display = "inline-block";

  try {
    await Auth.confirmSignUp(email, otp);
    console.log("Verification Success!");
    localStorage.removeItem("pendingEmail");
    alert("Account verified! You can now sign in.");
    window.location.href = "login.html";

  } catch (error) {
    console.error("Verification Error:", error);
    if (otpError) otpError.textContent = error.message;
  } finally {
    verifyBtn.disabled = false;
    if (verifyBtnText) verifyBtnText.innerText = "Verify Account";
    if (verifySpinner) verifySpinner.style.display = "none";
  }
});

// RESEND OTP
const resendLink = document.getElementById("resendLink");
if (resendLink) {
  resendLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await Auth.resendSignUp(email);
      alert("OTP resent! Check your email.");
    } catch (error) {
      alert("Error resending OTP: " + error.message);
    }
  });
}