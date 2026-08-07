(function () {
  var VALID_EMAIL = "juan.gomez@virtuallatinos.com";
  var VALID_PASSWORD = "VLPassword123!";
  var MAX_ATTEMPTS = 3;

  var STORAGE_EMAIL = "va_login_email";
  var STORAGE_PASSWORD_LENGTH = "va_login_password_length";
  var STORAGE_ATTEMPTS = "va_login_attempts";

  var DESTINATIONS = {
    tooManyRequests: "login-too-many-requests.html",
    wrongEmail: "login-wrong-email.html",
    wrongPassword: "login-wrong-password.html",
  };

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  onReady(function () {
    var view = document.body.getAttribute("data-login-view") || "default";
    var form = document.querySelector("[data-login-form]");
    var emailInput = document.querySelector("[data-field='email']");
    var passwordInput = document.querySelector("[data-field='password']");
    var submitButton = document.querySelector("[data-action='submit']");
    var forgotLink = document.querySelector("[data-action='forgot-password']");

    prefill(view, emailInput, passwordInput);
    updateSubmitState();

    [emailInput, passwordInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener("input", updateSubmitState);
    });

    if (forgotLink) {
      forgotLink.addEventListener("click", function (event) {
        event.preventDefault();
        alert("Pantalla de \"Forgot your password?\" pendiente por conectar.");
      });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        handleSubmit(emailInput.value, passwordInput.value);
      });
    }

    function updateSubmitState() {
      if (!submitButton) return;
      var hasEmail = emailInput && emailInput.value.trim().length > 0;
      var hasPassword = passwordInput && passwordInput.value.length > 0;
      submitButton.disabled = !(hasEmail && hasPassword);
    }
  });

  function prefill(view, emailInput, passwordInput) {
    var storedEmail = sessionStorage.getItem(STORAGE_EMAIL);
    var storedPasswordLength = parseInt(sessionStorage.getItem(STORAGE_PASSWORD_LENGTH) || "0", 10);

    if (view === "default") return;

    if (emailInput) {
      emailInput.value = storedEmail || (view === "wrong-email" ? "" : VALID_EMAIL);
    }
    if (passwordInput) {
      var length = storedPasswordLength > 0 ? storedPasswordLength : 12;
      passwordInput.value = new Array(length + 1).join("x");
    }
  }

  function handleSubmit(email, password) {
    var attempts = parseInt(sessionStorage.getItem(STORAGE_ATTEMPTS) || "0", 10);
    var emailOk = email.trim().toLowerCase() === VALID_EMAIL;
    var passwordOk = password === VALID_PASSWORD;

    sessionStorage.setItem(STORAGE_EMAIL, email.trim());
    sessionStorage.setItem(STORAGE_PASSWORD_LENGTH, String(password.length));

    if (emailOk && passwordOk) {
      sessionStorage.removeItem(STORAGE_ATTEMPTS);
      alert("Inicio de sesion exitoso. (La pantalla de destino se conectara mas adelante.)");
      return;
    }

    attempts += 1;
    sessionStorage.setItem(STORAGE_ATTEMPTS, String(attempts));

    if (attempts >= MAX_ATTEMPTS) {
      window.location.href = DESTINATIONS.tooManyRequests;
      return;
    }

    window.location.href = emailOk ? DESTINATIONS.wrongPassword : DESTINATIONS.wrongEmail;
  }
})();
