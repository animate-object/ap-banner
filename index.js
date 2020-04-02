import { ApBanner } from "./src/banner.js";

if (window && "customElements" in window) {
  console.debug("registering ap-banner web component");
  window.customElements.define("ap-banner", ApBanner);
} else {
  console.warn("custom elements not supported, ap-banner cannot render");
}
