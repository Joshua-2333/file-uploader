// ./public/js/password.js
document.addEventListener("DOMContentLoaded", () => {
  // Password toggle functionality
  document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        toggle.textContent = "visibility_off";
      } else {
        input.type = "password";
        toggle.textContent = "visibility";
      }
    });
  });

  // Password validation & live feedback
  document.querySelectorAll(".auth-form").forEach(form => {
    const passwordInput = form.querySelector('input[type="password"]');
    const errorMsg = form.querySelector(".form-error");

    if (!passwordInput || !errorMsg) return;

    // Live validation while typing
    passwordInput.addEventListener("input", () => {
      if (passwordInput.value.length < 6) {
        passwordInput.classList.add("input-error");
        passwordInput.classList.remove("input-valid");
        errorMsg.textContent = "Password must be at least 6 characters.";
      } else {
        passwordInput.classList.remove("input-error");
        passwordInput.classList.add("input-valid");
        errorMsg.textContent = "";
      }
    });

    // Prevent form submission if invalid
    form.addEventListener("submit", e => {
      if (passwordInput.value.length < 6) {
        e.preventDefault();
        passwordInput.classList.add("input-error");
        passwordInput.classList.remove("input-valid");
        errorMsg.textContent = "Password must be at least 6 characters.";
      }
    });
  });
});
