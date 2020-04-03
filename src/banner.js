// goals
// x banner component that spreads across the screen
// x banner can be expanded for more detailed content,
//   including links
// x banner content is provided by consumer
// - banner is disimissable, and won't appear again on page load once dismissed

const STYLES = `.banner,
.banner > * {
  --text-lite: #373743;
  --text-norm: #242331;
  --text-bold: #0e0d12;

  --primary-lite: #fefefe;
  --primary-norm: #fafafa;
  --primary-bold: #efefef;

  --accent-lite: #8b8bfa;
  --accent-norm: #4838ff;
  --accent-bold: #3300ff;

  --font-lg: 1.2rem;
  --font-md: 1rem;
}

.banner {
  width: 100%;
  z-index: 1;
  padding: 0.25rem;
  font-family: Arial, Helvetica, sans-serif;
  box-sizing: border-box;

  font-size: var(--font-lg);

  background-color: var(--primary-lite);
  border-bottom: 1px solid var(--accent-lite);
  color: var(--text-lite);
}

.banner:hover {
  transition: background-color ease-in 100ms;

  background-color: var(--primary-norm);
  border-bottom: 1px solid var(--accent-norm);
  color: var(--text-norm);
}

.banner:active {
  background-color: var(--primary-bold);
  border-bottom: 1px solid var(--accent-bold);
  color: var(--text-bold);
}

.title-container {
  display: flex;
  justify-content: space-between;
}

.expansion-handle {
  margin-right: 0.25px;
}

.expansion-handle {
  padding-right: 0.5rem;
  transition: background-color ease-in 100ms;
}

.expansion-handle:hover {
  background-color: var(--primary-bold);
  border-radius: 4px;
}

.arrow {
  display: inline-block;
  transition: transform 500ms ease;
  text-align: center;
  width: var(--font-lg);
  height: var(--font-lg);
}
.arrow.expanded {
  transform-origin: center;
  transform: rotate(90deg);
}

.more-info {
  position: relative;
  padding: 0 16px;
  max-height: 0;
  transition: max-height ease-in-out 250ms;
  font-size: var(--font-md);
  overflow: hidden;
}

.more-info.expanded {
  padding: 16px;
  max-height: 100vh;
}

.action-link {
  font-size: var(--font-md);
}

.link-container {
  display: flex;
  flex-shrink: 0;
}

.link-container > *:not(:last-child) {
  margin-right: 0.5rem;
}

.link-container:last-child {
  margin-right: 0.25rem;
}

a,
a:visited {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: blue;
  color: blue;
}
`;

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
      this.firstDraw();
      this.update();
    } else {
      console.debug(
        "ap-banner has been hidden by the user -- to see it again, clear your cache"
      );
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
    const style = document.createElement("style");
    style.textContent = STYLES;
    return style;
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

    const linkContainer = document.createElement("div");
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
