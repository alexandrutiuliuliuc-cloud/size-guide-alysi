function  hideInactiveDotsOnPageLoad() {
    let thumbanilsIndicator = document.querySelectorAll(".dots-wrapper .dot");
    let allProductMedia = document.querySelectorAll(".gridy-slider.product-media-slider.medium-up-hide-custom.large-hide-custom .product-media");

    let displayBlockedThumbnails = [];

    allProductMedia.forEach(media => {
      if (getComputedStyle(media).display === 'block') {
        displayBlockedThumbnails.push(media);
      }
    });


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

function activeMediaIndicatorsOnPageLoad() {
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

document.addEventListener("DOMContentLoaded", function () {
   hideInactiveDotsOnPageLoad();
   activeMediaIndicatorsOnPageLoad();
});

