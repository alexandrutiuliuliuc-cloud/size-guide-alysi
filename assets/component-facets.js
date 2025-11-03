Woolman.Utils.prepareQueryParams();
Woolman.Collection = document.querySelector('[data-ajax-parent]');

/**
 * Generates search params from form data for filtering collection or search results.
 * @param {HTMLElement} formElement - Form element to turn into search params.
 * @returns
 */
const generateSearchParamsFromFormData = (formElement) => {
  const checkboxesToKeep = {};
  for (const element of formElement.elements) {
    const key = element.getAttribute('name');
    if (!key || !key.includes('filter')) continue;
    const value = element.value;
    const inputType = element.getAttribute('type');

    if (value === '') continue;

    if (inputType == 'number' && (element.hasAttribute('data-min') || element.hasAttribute('data-max'))) {
      if (!element.closest('price-range').hasAttribute('data-updated')) {
        continue;
      }
    }

    if (inputType == 'checkbox') {
      if (element.checked) {
        if (!checkboxesToKeep[key]) {
          checkboxesToKeep[key] = [value];
          continue;
        } else {
          checkboxesToKeep[key].push(value);
          continue;
        }
      }

      if (Shopify.queryParams[key] && !checkboxesToKeep[key]) {
        Shopify.queryParams[key] = undefined;
      }
      continue;
    } else {
      Shopify.queryParams[key] = value;
    }
  }

  if (Object.entries(checkboxesToKeep).length > 0) {
    for (const [key, value] of Object.entries(checkboxesToKeep)) {
      Shopify.queryParams[key] = value.join(',');
    }
  }

  return Shopify.queryParams;
};

/**
 * This function fetches fresh collection page via AJAX request to collection's url.
 * @param {Array} selectors - Array of HTML element selectors to update.
 */
const getCollectionAJAX = async (selectors) => {
  Shopify.queryParams.page = 1;
  if (selectors) {
    try {
      const url = location.pathname + '?' + getCollectionURL();
      const res = await fetch(url);
      const body = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(body, 'text/html');
      console.log(doc);

      for (const selector of selectors) {
        if (!document.querySelector(selector) || !doc.querySelector(selector)) continue;
        document.querySelector(selector).innerHTML = doc.querySelector(selector).innerHTML;
      }

      const historyStateUrl = location.pathname + '?' + getCollectionURL();
      window.history.replaceState('', '', historyStateUrl);
      Woolman.Collection.classList.remove('processing');

    } catch (err) {
      location.search = getCollectionURL();
    }
  } else {
    location.search = getCollectionURL();
  }
};

/**
 * Returns URL for current collection. Utilizes URL parameters to save user's filters, sorting and pagination.
 * @param {string} view - Template name to load with view attribute, e.g. 'ajax'
 * @returns
 */
const getCollectionURL = (view) => {
  Shopify.queryParams.view = view || undefined;
  const urlToReturn = new URLSearchParams(JSON.parse(JSON.stringify(Shopify.queryParams))).toString();
  return decodeURIComponent(urlToReturn);
};

class SortBySelect extends HTMLElement {
  constructor() {
    'use strict';
    super();

    this.el = this.querySelector('select');
    this.selectors = {
      grid: '#product-grid-ajax',
      //facets: '#facets',
      //currentFacets: '#current-facets-ajax',
      pagination: '#pagination-ajax',
    };

    if (Shopify.queryParams['sort_by']) {
      this.el.value = Shopify.queryParams['sort_by'];
    }

    this.el.addEventListener('change', this.onSelectChange.bind(this));
  }

  async onSelectChange(event) {
    Woolman.Collection.classList.add('processing');
    Woolman.Utils.prepareQueryParams();
    const value = event.target.value;
    Shopify.queryParams.sort_by = value;
    getCollectionAJAX(Object.values(this.selectors));
  }
}

if (customElements.get('sort-by') === undefined) {
  customElements.define('sort-by', SortBySelect);
}

class FacetsForm extends HTMLElement {
  constructor() {
    'use strict';
    super();

    this.el = this.querySelector('form');
    this.selectors = {
      grid: '#product-grid-ajax',
      //facets: '#facets',
      count: '#products-count-ajax',
      currentFacets: '#current-facets-ajax',
      pagination: '#pagination-ajax',
    };
    const inputs = this.el.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('change', debounce(this.onCheckboxChanged.bind(this), 150));
    });

    this.el.addEventListener('submit', this.onFormSubmit.bind(this));
  }

  async onFormSubmit(event) {
    event.preventDefault();
    Woolman.Collection.classList.add('processing');
    Woolman.Utils.prepareQueryParams();
    generateSearchParamsFromFormData(this.el);

    Woolman.ModalsAndDrawers.closeModalOrDrawer(this.closest('[data-drawer]').getAttribute('id'));
    getCollectionAJAX(Object.values(this.selectors));
  }

  async onCheckboxChanged() {
    Woolman.Collection.classList.add('processing');
    generateSearchParamsFromFormData(this.el);
    getCollectionAJAX(Object.values(this.selectors));
  }
}

if (customElements.get('facets-form') === undefined) {
  customElements.define('facets-form', FacetsForm);
}
