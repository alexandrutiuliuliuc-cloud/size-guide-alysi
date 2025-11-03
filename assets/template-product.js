class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange(e) {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.updateInventoryStatus();
    this.removeErrorMessage();
    this.updateVariantStatuses();
    this.filterImgVariant();
    this.activeMediaIndicators();
    this.hideInactiveDots();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }

  filterImgVariant() {
  console.clear();
  console.log(this.currentVariant);

  if (this.currentVariant.featured_image && this.currentVariant.featured_image.alt) {
    // Show only the thumbnails of the selected color
    document.querySelectorAll("[thumbnail-alt]").forEach(img => img.style.display = "none");

    const currentImageAlt = this.currentVariant.featured_image.alt;
    const thumbnailSelector = `[thumbnail-alt='${currentImageAlt}']`;

    document.querySelectorAll(thumbnailSelector).forEach(img => img.style.display = "block");
  } else {
    // Show All thumbnails
    document.querySelectorAll("[thumbnail-alt]").forEach(img => img.style.display = "block");
  }
}

  hideInactiveDots() {
    let thumbanilsIndicator = document.querySelectorAll(".dots-wrapper .dot");
    let allProductMedia = document.querySelectorAll(".gridy-slider.product-media-slider.medium-up-hide-custom.large-hide-custom .product-media");

    let displayBlockedThumbnails = [];

    allProductMedia.forEach(media => {
      if (getComputedStyle(media).display === 'block') {
        displayBlockedThumbnails.push(media);
      }
    });

    console.clear();
    console.log(displayBlockedThumbnails);

    thumbanilsIndicator.forEach(indicator => {
      indicator.style.display = 'none';
      indicator.classList.remove('active');
    });

    displayBlockedThumbnails.forEach((displayedThumbnail, index) => {
      thumbanilsIndicator.forEach((indicator, indicatorIndex) => {
        if (displayedThumbnail.getAttribute('data-slide-custom') === indicator.getAttribute('data-slide-custom')) {
          indicator.style.display = 'block';
          if (index === 0 && indicatorIndex === 0) {
            indicator.classList.add('active');
          }
        }
      });
    });


    
  }

  activeMediaIndicators() {
const slides = document.querySelectorAll(".product-media");
const options = { threshold: 0 };

const handleIntersection = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      requestAnimationFrame(() => {
        entry.target.classList.add('active-in-viewport');
        let attributeValue = entry.target.getAttribute("data-slide-custom");
        document.querySelector(`.dot[data-slide-custom="${attributeValue}"]`).classList.add("active");
      });
    } else {
      requestAnimationFrame(() => {
        let attributeValue = entry.target.getAttribute("data-slide-custom");
        document.querySelector(`.dot[data-slide-custom="${attributeValue}"]`).classList.remove("active");
        entry.target.classList.remove('active-in-viewport');
      });
    }
  });
};

const observer = new IntersectionObserver(handleIntersection, options);

slides.forEach(slide => {
  observer.observe(slide);
});
  }

  

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;

    const mediaGridySlider = document.getElementById(`slider-${this.dataset.section}`);
    const thumbnailsGridySlider = document.getElementById(`thumbnail-slider-${this.dataset.section}`);
    
    if (mediaGridySlider) {
      mediaGridySlider.scrollToSlideByID(
        `item-${this.currentVariant.featured_media.id}`
      );
    }
    
    if (thumbnailsGridySlider) {
      thumbnailsGridySlider.scrollToSlideByID(`thumbnail-item-${this.currentVariant.featured_media.id}`)
    }
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton || !shareButton.updateUrl) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}, #product-form-${this.dataset.section}-product-buy-bar`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(variant => this.querySelector(':checked').value === variant.option1);
    const inputWrappers = [...this.querySelectorAll('.product-form__input')];
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')]
      const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
      const availableOptionInputsValue = selectedOptionOneVariants.filter(variant => variant.available && variant[`option${ index }`] === previousOptionSelected).map(variantOption => variantOption[`option${ index + 1 }`]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue)
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach(input => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.innerText = input.getAttribute('value');
      } else {
        input.innerText = window.variantStrings.unavailable_with_option.replace('[value]', input.getAttribute('value'));
      }
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  updateInventoryStatus() {
    this.productInventoryNode = document.querySelector('[data-product-inventory]');

    if (!this.productInventoryNode || !window.inventories || !window.inventories[this.dataset.productId]) return;

    this.inventoryThreshold = parseInt(this.productInventoryNode.dataset.threshold);
    this.showQuantityInStock = this.productInventoryNode.dataset.showQuantityInStock;

    const variantInventoryObject = window.inventories[this.dataset.productId][this.currentVariant?.id];

    if (!this.currentVariant || !this.currentVariant.inventory_management) {
      this.toggleInventoryQuantity(false);
      this.toggleIncomingInventory(false);

      return;
    }

    if (this.currentVariant.inventory_management === 'shopify') {
      if (variantInventoryObject.quantity <= 0 && variantInventoryObject.incoming === 'true' && variantInventoryObject.quantity < this.inventoryThreshold) {
        this.toggleInventoryQuantity(false);
        this.toggleIncomingInventory(true, variantInventoryObject.next_incoming_date);
      } else {
        this.toggleInventoryQuantity(true, variantInventoryObject.quantity);
        this.toggleIncomingInventory(false);
      }
    }
  }

  toggleInventoryQuantity(show, quantity) {
    if (show === false) {
      this.productInventoryNode.classList.add('hide');
      return;
    }

    this.productInventoryNode.classList.remove('inventory-status--in-stock', 'inventory-status--low', 'inventory-status--sold-out', 'inventory-status--sold-out-continue-selling');

    if (this.currentVariant && this.currentVariant.available && parseInt(quantity) <= parseInt(this.inventoryThreshold) && parseInt(quantity) > 0) {
      this.productInventoryNode.classList.add('inventory-status--low');
      if (!this.showQuantityInStock === 'true') {
        this.productInventoryNode.firstElementChild.textContent = window.variantStrings.inventory.few_left_with_quantity.replace('[quantity]', quantity);
      } else {
        this.productInventoryNode.firstElementChild.textContent = window.variantStrings.inventory.few_left;
      }
    } else if (this.currentVariant && this.currentVariant.available && parseInt(quantity) > parseInt(this.inventoryThreshold)) {
      this.productInventoryNode.classList.add('inventory-status--in-stock');
      if (!this.showQuantityInStock === 'true') {
        this.productInventoryNode.firstElementChild.textContent = window.variantStrings.inventory.in_stock_with_quantity.replace('[quantity]', quantity);
      } else {
        this.productInventoryNode.firstElementChild.textContent = window.variantStrings.inventory.in_stock;
      }
    } else if (this.currentVariant && this.currentVariant.available && parseInt(quantity) < 1) {
      this.productInventoryNode.classList.add('inventory-status--sold-out-continue-selling');
      this.productInventoryNode.firstElementChild.textContent = window.variantStrings.inventory.out_of_stock_continue_selling;
    } else {
      this.productInventoryNode.classList.add('inventory-status--sold-out');
      this.productInventoryNode.firstElementChild.textContent = window.variantStrings.inventory.out_of_stock;
    }

    this.productInventoryNode.classList.remove('hide');
  }

  toggleIncomingInventory(show, date) {
    const incomingInventoryNode = document.querySelector('[data-incoming-inventory]');
    if (!incomingInventoryNode) return;

    if (show == false && incomingInventoryNode) {
      incomingInventoryNode.classList.add('hide');

      return;
    }

    let string = !date ?
      window.variantStrings.inventory.waiting_for_stock : 
      window.variantStrings.inventory.will_be_in_stock_after.replace('[date]', date);

    incomingInventoryNode.classList.remove('hide');
    incomingInventoryNode.firstElementChild.textContent = string;
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const destination = document.getElementById(`price-${this.dataset.section}`);
        const destinationBuyBarInfo = document.getElementById(
          `buy-bar-info-${this.dataset.section}`
        );
        const source = html.getElementById(`price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
        const buyBarInfoSource = html.getElementById(`buy-bar-info-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
        if (source && destination) destination.innerHTML = source.innerHTML;
        if (source && destinationBuyBarInfo) destinationBuyBarInfo.innerHTML = buyBarInfoSource.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('hidden');
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      if (this.dataset.isPreorder == 'true') {
        addButtonText.textContent = window.variantStrings.preOrder;
      } else {
        addButtonText.textContent = window.variantStrings.addToCart;
      }
    }

    const productForm_BuyBar = document.getElementById(
      `product-form-${this.dataset.section}-product-buy-bar`
    );
    if (productForm_BuyBar) {
      const addButton_BuyBar = productForm_BuyBar.querySelector('[name="add"]');
      const addButtonText_BuyBar = productForm_BuyBar.querySelector(
        '[name="add"] > span'
      );

      if (disable) {
        addButton_BuyBar.setAttribute("disabled", "disabled");
        if (text) addButtonText_BuyBar.textContent = text;
      } else {
        addButton_BuyBar.removeAttribute("disabled");
        if (this.dataset.isPreorder == "true") {
          addButtonText_BuyBar.textContent = window.variantStrings.preOrder;
        } else {
          addButtonText_BuyBar.textContent = window.variantStrings.addToCart;
        }
      }
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('hidden');

    const button_BuyBar = document.getElementById(
      `product-form-${this.dataset.section}-product-buy-bar`
    );
    const addButton_BuyBar = button_BuyBar.querySelector('[name="add"]');
    const addButtonText_BuyBar = button_BuyBar.querySelector(
      '[name="add"] > span'
    );
    const price_BuyBar = document.getElementById(
      `price-${this.dataset.section}-product-buy-bar`
    );
    if (!addButton_BuyBar) return;
    addButtonText_BuyBar.textContent = window.variantStrings.unavailable;
    if (price_BuyBar) price_BuyBar.classList.add("hidden");
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach(input => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.classList.remove('disabled');
      } else {
        input.classList.add('disabled');
      }
    });
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });

    this.updateLegends();
  }

  updateLegends() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    fieldsets.forEach((fieldset) => {
      const legend = fieldset.querySelector('legend [data-variant-legend]');
      const selectedOption = Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked);
      legend.textContent = selectedOption.getAttribute('value');
    });
  }
}

customElements.define('variant-radios', VariantRadios);

// Store product handles to history for "recently-viewed" section.
(function() {
  const history = sessionStorage.getItem('Woolman_Product_History') ? sessionStorage.getItem('Woolman_Product_History').split(',') : [];
  const productHandle = window.location.pathname.split('/').pop();
  if (!productHandle) return;
  if (!history.includes(productHandle)) {

    if (history.length >= 10) { // only store up to 10 recently viewed products
      history.shift();
    }
    
    history.push(productHandle);
    sessionStorage.setItem('Woolman_Product_History', history.join(','));
  }
})();

class ProductBuyBar extends HTMLElement {
  constructor() {
    "use strict";
    super();

    let classes = { show: "show" };
    let mainProductForm = document.querySelector(".product-form");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // In view -> Hide bar
            this.classList.remove(classes.show);
          } else if (window.scrollY > 200) {
            // Out of view AND scrolled a little from top -> Show bar
            this.classList.add(classes.show);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(mainProductForm);

    // This script is loaded in product-template.liquid --> Footer observer after DOM ready
    document.addEventListener("DOMContentLoaded", function () {
      let siteFooter = document.querySelector("footer.footer");
      if (!siteFooter) return;
      observer.observe(siteFooter);
    });
  }
}
customElements.define("product-buy-bar", ProductBuyBar);

class UpsellCard extends HTMLElement {
  constructor() {
    super();
    this.select = this.querySelector('select');
    this.image = this.querySelector('.card-media img');

    if (this.select) {
      this.select.addEventListener('change', (event) => {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const newImgSrc = selectedOption.getAttribute('data-variant-img-src');
        this.updateImage(newImgSrc);
      });
    }
  }

  updateImage(newImgSrc) {
    if (this.image) {
      this.image.src = newImgSrc;
    }
  }
}

customElements.define('upsell-card', UpsellCard);