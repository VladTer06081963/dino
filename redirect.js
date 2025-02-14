/** @format */

// Проверяем, мобильное устройство или нет
function isMobile() {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

// Если мобильное устройство и мы на `index.html`, перенаправляем на `mobile.html`
if (isMobile() && !window.location.href.includes("mobile.html")) {
  window.location.href = "mobile.html";
}

// Если ПК и мы на `mobile.html`, перенаправляем обратно на `index.html`
if (!isMobile() && window.location.href.includes("mobile.html")) {
  window.location.href = "index.html";
}
