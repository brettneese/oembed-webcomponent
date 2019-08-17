customElements.define(
  "o-embed",
  class extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    async init() {
      const divElem = document.createElement("div");
      const url = this.getAttribute("ref");
      divElem.textContent = url;

      const shadowRoot = this.attachShadow({ mode: "open" });
      this.embed(url, shadowRoot);
    }

    async embed(url, shadowRoot) {
      let endpoint = await this.getOembedEndpoint(url);

      let response = await fetch(`${endpoint}?url=${url}`);
      let json = await response.json();
      let html = await json.html;

      shadowRoot.innerHTML = html;
    }

    async getEndpoints() {
      let response = await fetch(
        `https://brettneese.github.io/oembed-webcomponent/endpoints.json`
      );
      let json = await response.json();

      return json;
    }

    // https://github.com/thangman22/oembed-component
    async getOembedEndpoint(url) {
      let endpoints = await this.getEndpoints();

      console.log(endpoints);

      let r = Object.keys(endpoints).filter(endpoint => {
        let foundPattern = endpoints[endpoint].filter(pattern =>
          new RegExp(pattern).test(url)
        );
        return foundPattern.length > 0;
      })[0];

      return r;
    }
  }
);
