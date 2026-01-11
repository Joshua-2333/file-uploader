/*./public/js/passwordToggle.js*/
document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".toggle-password");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = toggle.previousElementSibling;

      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      toggle.textContent = isPassword ? "visibility_off" : "visibility";
      toggle.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );
    });
  });
});
