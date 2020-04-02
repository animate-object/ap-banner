// goals
// x banner component that spreads across the screen
// x banner can be expanded for more detailed content,
//   including links
// x banner content is provided by consumer
// - banner is disimissable, and won't appear again on page load once dismissed

const BANNER_TEMPLATE_ID = "ap-banner-template";
const LOCAL_STORAGE_KEY_PREFIX = "ap-banner-cached-state";

const storageKey = item => `${LOCAL_STORAGE_KEY_PREFIX}.${item}`;

export class ApBanner extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "closed" });
    this.setState({
      expanded: false,
      hidden: localStorage.getItem(storageKey("hidden")) === "true"
    });
    if (!this.getState().hidden) {
      console.debug(
        "ap-banner has been hidden by the user -- to see it again, clear your cache"
      );
      this.firstDraw();
      this.update();
    }
  }

  firstDraw = () => {
    // container spans the width of the viewport
    this.banner_template = this._banner_template();

    this.shadow.appendChild(this.styles());
    this.templateFragment = this.banner_template.content.cloneNode(true);
    this.bannerEl = this.templateFragment.firstChild;
    this.shadow.appendChild(this.templateFragment);
  };

  update = newState => {
    this.setState(newState);

    if (this.state.hidden) {
      while (this.shadow.firstChild) {
        this.shadow.removeChild(this.shadow.lastChild);
      }
      return;
    }

    if (!this.bannerEl) {
      return;
    }

    const titleEl = this.bannerEl.getElementsByClassName("expansion-handle")[0];
    if (titleEl) {
      this.expandOnClick(titleEl);
    }

    const closeForeverEl = this.bannerEl.getElementsByClassName(
      "close-link"
    )[0];
    if (closeForeverEl) {
      this.closeForeverOnClick(closeForeverEl);
    }

    const arrowEl = this.bannerEl.getElementsByClassName("arrow")[0];
    if (arrowEl) {
      this.updateArrowEl(arrowEl);
    }
    const moreInfoEl = this.bannerEl.getElementsByClassName("more-info")[0];
    if (moreInfoEl) {
      this.updateMoreInfo(moreInfoEl);
    }
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
    return arrow;
  };

  sourceCodeLink = () => {
    const anchor = document.createElement("a");
    anchor.classList.add("action-link");
    anchor.classList.add("source-link");
    anchor.textContent = "project source code";
    anchor.setAttribute("href", this.getAttribute("source"));
    anchor.setAttribute("target", "_blank");
    const container = document.createElement("div");
    container.appendChild(anchor);
    return container;
  };

  closeForeverLink = () => {
    const anchor = document.createElement("a");
    anchor.classList.add("action-link");
    anchor.classList.add("close-link");
    anchor.textContent = "hide this";
    const container = document.createElement("div");
    container.appendChild(anchor);
    return container;
  };

  updateArrowEl = el => {
    if (this.state.expanded) {
      el.classList.add("expanded");
    } else {
      el.classList.remove("expanded");
    }
  };

  expandOnClick = el => {
    el.onclick = () => this.update({ expanded: !this.state.expanded });
  };

  closeForeverOnClick = el => {
    el.onclick = () => {
      localStorage.setItem(storageKey("hidden"), "true");
      this.update({ hidden: true });
    };
  };

  updateMoreInfo = el => {
    if (this.state.expanded) {
      el.classList.add("expanded");
    } else {
      el.classList.remove("expanded");
    }
  };

  _banner_template = () => {
    const template = document.createElement("template");
    template.setAttribute("id", BANNER_TEMPLATE_ID);

    const banner = document.createElement("div");
    banner.setAttribute("class", "banner");

    const primaryContent = document.createElement("span");
    primaryContent.setAttribute("class", "expansion-handle");
    primaryContent.appendChild(this.arrow());
    primaryContent.appendChild(this.title());

    const linkContainer = document.createElement("links");
    linkContainer.setAttribute("class", "link-container");
    linkContainer.appendChild(this.sourceCodeLink());
    linkContainer.appendChild(this.closeForeverLink());

    const titleContainer = document.createElement("div");
    titleContainer.setAttribute("class", "title-container");
    titleContainer.appendChild(primaryContent);
    titleContainer.appendChild(linkContainer);

    banner.appendChild(titleContainer);

    const moreInfo = document.createElement("div");
    moreInfo.setAttribute("class", "more-info");
    const infoSlot = document.createElement("slot");
    infoSlot.setAttribute("name", "more-info");
    moreInfo.appendChild(infoSlot);
    banner.appendChild(moreInfo);

    // important note: when dynamically creating a <template /> (i.e. in JS),
    // children must be attached via the content property
    // or they will not render after cloning
    template.content.appendChild(banner);

    // adding the template to the document sort of 'registers' it for later use
    // but does not render it.
    document.body.appendChild(template);

    return template;
  };
}
