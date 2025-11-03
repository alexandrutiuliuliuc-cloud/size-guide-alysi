customElements.define('recently-viewed-products', class RecentlyViewedProducts extends HTMLElement {
  constructor() {
    super();

    this.containers = [
      this.querySelector('[data-context="recently_viewed"] .grid')
    ];

    this.limit = this.dataset.limit;
    this.showAsThumbnails = this.dataset.showAsThumbnails != undefined ? JSON.parse(this.dataset.showAsThumbnails) : false;

    // Hide section if no history data found
    // History data is set from global.js 
    this.history = sessionStorage.getItem('Woolman_Product_History') ? sessionStorage.getItem('Woolman_Product_History').split(',') : [];

    if (this.history.length === 0) {
      return;
    }

    this.fetchProductHtml();
  }

  /* This function fetches item HTML snippets and passes them to initContainer function */
  async fetchProductHtml() {
    let currentIndex = 1;
    const promises = [];
    const rootUrl = window.routes.root == '/' ? '/' : window.routes.root + '/'; // if user has selected locale convert root url from /en-gb to /en-gb/
    
    for (const productHandle of this.history) {
      let cardView = 'ajax-card';
      if (this.showAsThumbnails) {
        cardView = 'ajax-card-thumbnail';
      }
      promises.push(fetch(`${rootUrl}products/${productHandle}?view=${cardView}`));
      currentIndex++;
      if (currentIndex > this.limit) {
        break;
      }
    }

    this.containers.forEach((container) => {
      container.innerHTML = '';
      container.closest('recently-viewed-products').removeAttribute('hidden');
    });

    const settledPromises = await Promise.allSettled(promises);
    settledPromises.forEach(async (promise) => {
      try {
        const res = await promise.value;
        if (res.status !== 200) { throw res.status }
        const htmlString = await res.text();
        // Create a new DOMParser
        const parser = new DOMParser();

        // Parse the HTML string into a DOM document
        const doc = parser.parseFromString(htmlString, "text/html");
        
        this.containers.forEach((container) => {
          container.appendChild(doc.body.firstChild)
        });
      } catch(err) {
        console.error(err)
        return;
      }
    });
  }
})