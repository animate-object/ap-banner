// goals
// x banner component that spreads across the screen
// - banner can be expanded for more detailed content,
//   including links
// - banner content is provided by consumer
// - banner is disimissable, and won't appear again on page load once dismissed

const BANNER_TEMPLATE_NAME = "ap-banner-template";
class ApBanner extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "closed" });
    this.setState({ expanded: false });
    this.firstDraw();
  }

  firstDraw = () => {
    console.log({ at: "draw", state: this.state });
    // container spans the width of the viewport
    this.template = this._template();

    const banner = document.createElement("div");
    banner.setAttribute("class", "banner");

    this.arrow = this.arrow();
    banner.appendChild(this.arrow);
    banner.appendChild(this.title());
    banner.appendChild(template.content.cloneNode(true));

    this.shadow.appendChild(this.styles());
    this.shadow.appendChild(banner);
  };

  update = newState => {
    this.setState(newState);
    this.updateArrowEl(this.arrow);
  };

  setState = newState => {
    this.state = { ...this.state, ...newState };
  };

  getState = () => this.state;

  title = () => {
    const title = document.createElement("span");
    const titleText = this.getAttribute("title");
    title.textContent = titleText;
    return title;
  };

  styles = () => {
    const linkEl = document.createElement("link");
    linkEl.setAttribute("rel", "stylesheet");
    linkEl.setAttribute("href", "./assets/banner.css");
    return linkEl;
  };

  arrow = () => {
    const arrow = document.createElement("span");
    arrow.textContent = ">";
    arrow.setAttribute("class", "arrow");
    this.updateArrowEl(arrow);
    return arrow;
  };

  updateArrowEl = el => {
    console.log(el, this.state);
    if (this.state.expanded) {
      el.classList.add("expanded");
    } else {
      el.classList.remove("expanded");
    }
    el.onclick = () => this.update({ expanded: !this.state.expanded });
  };

  _template = () => {
    const template = document.createElement("template");
    template.setAttribute("id", BANNER_TEMPLATE_NAME);
    const contentSlot = document.createElement("slot");
    contentSlot.setAttribute("name", "ap-banner-content");
    template.appendChild(contentSlot);

    // by adding this template to the document, is made available for later use
    document.body.appendChild(this.template);

    return template;
  };
}

customElements.define("ap-banner", ApBanner);
