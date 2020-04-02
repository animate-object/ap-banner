import { ApBanner } from "./assets/banner";

if (window && "customElements" in window) {
  console.debug("Register ap-banner web component");
  window.customElements.define("ap-banner", ApBanner);
} else {
  console.warn("Custom elements not supported, ap-banner cannot render");
}
