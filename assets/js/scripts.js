document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Collapsible sections
  const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
  
  collapsibleHeaders.forEach(header => {
    header.addEventListener('click', function() {
      this.classList.toggle('active');
      
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
  
  // Add animation class to candidate cards when they come into view
  const observeElements = document.querySelectorAll('.candidate-card');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    observeElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers without intersection observer
    observeElements.forEach(element => {
      element.classList.add('animate');
    });
  }
  
  // Image lightbox functionality
  const candidateImages = document.querySelectorAll('.candidate-image img');
  let lightbox = null;
  
  candidateImages.forEach(img => {
    img.addEventListener('click', function() {
      // Create lightbox if it doesn't exist
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <img src="" alt="Cardinal">
            <span class="close-lightbox">&times;</span>
          </div>
        `;
        document.body.appendChild(lightbox);
        
        // Close lightbox when clicking the close button or outside the image
        const closeBtn = lightbox.querySelector('.close-lightbox');
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) {
            closeLightbox();
          }
        });
      }
      
      // Set the image source and show the lightbox
      const lightboxImg = lightbox.querySelector('img');
      lightboxImg.src = this.src;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
  
  function closeLightbox() {
    if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
  
  // Close lightbox with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });
});

// Add CSS for lightbox functionality
const style = document.createElement('style');
style.textContent = `
  .lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    justify-content: center;
    align-items: center;
  }
  
  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
  }
  
  .lightbox-content img {
    max-width: 100%;
    max-height: 90vh;
    display: block;
    border: 3px solid #D4AF37;
  }
  
  .close-lightbox {
    position: absolute;
    top: -40px;
    right: 0;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }
  
  .candidate-card {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s, transform 0.5s;
  }
  
  .candidate-card.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  .collapsible-header {
    cursor: pointer;
    padding-right: 30px;
    position: relative;
  }
  
  .collapsible-header::after {
    content: '+';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s;
  }
  
  .collapsible-header.active::after {
    transform: translateY(-50%) rotate(45deg);
  }
  
  .collapsible-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
  }
`;
document.head.appendChild(style);