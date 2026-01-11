//./public/js/password.js
// Toggle password visibility
document.querySelectorAll(".toggle-password").forEach(icon => {
  const input = document.getElementById(icon.dataset.target);

  icon.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
  });
});

// Password validation
document.querySelectorAll(".auth-form").forEach(form => {
  form.addEventListener("submit", e => {
    const password = form.querySelector('input[type="password"]');
    const error = form.querySelector(".form-error");

    if (password && password.value.length < 6) {
      e.preventDefault();
      password.classList.add("input-error");
      error.textContent = "Password must be at least 6 characters long.";
    }
  });
});
