/* ==========================================================================
   Webfast — Interaktivitas & Dinamika Halaman
   Vanilla JavaScript (Tanpa dependensi)
   ========================================================================== */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Scroll Progress Bar & Header Shadow -------------------------------- */
  var scrollProgressBar = document.getElementById("scrollProgress");
  var header = document.getElementById("siteHeader");

  function onScroll() {
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = scrolled + "%";
    }

    if (header) {
      header.classList.toggle("is-scrolled", winScroll > 12);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 2. Live WIB Clock (Waktu Indonesia Barat) ---------------------------- */
  var liveClockEl = document.getElementById("liveClock");
  function updateWibClock() {
    if (!liveClockEl) return;
    try {
      var now = new Date();
      var options = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      var timeString = new Intl.DateTimeFormat("id-ID", options).format(now);
      liveClockEl.textContent = timeString + " WIB";
    } catch (e) {
      liveClockEl.textContent = "09:00 - 18:00 WIB";
    }
  }
  updateWibClock();
  setInterval(updateWibClock, 1000);

  /* 3. Mobile Navigation Toggle ------------------------------------------ */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function closeNav() {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka menu navigasi");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* 4. Active Navigation State (Multi-page & In-page) ---------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".primary-nav a"));
  var currentFile = window.location.pathname.split("/").pop() || "index.html";
  if (currentFile === "") currentFile = "index.html";

  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var targetFile = href.split("#")[0];
    if (targetFile === currentFile) {
      link.classList.add("is-active");
    }
  });

  var observedSections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.length > 1 && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            if (link.getAttribute("href").startsWith("#")) {
              link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
            }
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    observedSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* 5. Staggered Scroll Reveal Animations --------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .hero-panel, .hero-meta, .about-grid, .workflow-card, .project, .skill-group, .standards-card, .price-card, .calc-inputs, .calc-receipt, .faq-item, .person-card, .contact-copy, .contact-actions"
  );

  if (!reducedMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );

    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      var siblings = Array.prototype.slice.call(el.parentElement.children);
      var index = siblings.indexOf(el);
      if (index > 0) {
        el.style.transitionDelay = Math.min(index, 4) * 60 + "ms";
      }
      revealObserver.observe(el);
    });
  }

  /* 6. Interactive Project Category Filtering ----------------------------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = this.getAttribute("data-filter");

      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      this.classList.add("is-active");

      projectCards.forEach(function (card) {
        var category = card.getAttribute("data-category");
        if (filter === "all" || category === filter || (category && category.indexOf(filter) !== -1)) {
          card.classList.remove("is-hidden");
          card.style.opacity = "1";
          card.style.transform = "none";
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  /* 7. Interactive Pricing Tab Filtering ---------------------------------- */
  var pricingTabs = document.querySelectorAll(".pricing-tab-btn");
  var priceCards = document.querySelectorAll(".price-card");

  pricingTabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = this.getAttribute("data-pcat");

      pricingTabs.forEach(function (b) { b.classList.remove("is-active"); });
      this.classList.add("is-active");

      priceCards.forEach(function (card) {
        var cardCat = card.getAttribute("data-pcat");
        if (cat === "all" || cardCat === cat || (cardCat && cardCat.indexOf(cat) !== -1)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* 8. Interactive Project Cost Estimator --------------------------------- */
  var calcContainer = document.getElementById("estimator");
  if (calcContainer) {
    var typeButtons = calcContainer.querySelectorAll("[data-type-price]");
    var domainButtons = calcContainer.querySelectorAll("[data-domain-price]");
    var speedButtons = calcContainer.querySelectorAll("[data-speed-mult]");
    var addonCheckboxes = calcContainer.querySelectorAll(".calc-addon-check");

    var summaryTypeEl = document.getElementById("calcSumType");
    var summaryDomainEl = document.getElementById("calcSumDomain");
    var summarySpeedEl = document.getElementById("calcSumSpeed");
    var summaryAddonsEl = document.getElementById("calcSumAddons");
    var totalAmountEl = document.getElementById("calcTotalAmount");
    var totalTimeEl = document.getElementById("calcTotalTime");
    var calcWaBtn = document.getElementById("calcWaBtn");

    var state = {
      typeName: "Company Profile",
      typePrice: 500000,
      typeTime: "7–14 hari kerja",
      domainName: "Include Domain (.com/.id)",
      domainPrice: 150000,
      speedName: "Reguler",
      speedMult: 1,
      speedDaysDiscount: 0,
      addons: []
    };

    function recalculateTotal() {
      var base = state.typePrice + state.domainPrice;
      var addonsSum = 0;
      var addonNames = [];

      addonCheckboxes.forEach(function (cb) {
        if (cb.checked) {
          var price = parseInt(cb.getAttribute("data-price"), 10) || 0;
          addonsSum += price;
          addonNames.push(cb.getAttribute("data-name"));
        }
      });

      var grandTotal = Math.round((base + addonsSum) * state.speedMult);

      // Format to Rupiah (e.g. Rp 650.000)
      var formatted = "Rp " + grandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      if (summaryTypeEl) summaryTypeEl.textContent = state.typeName;
      if (summaryDomainEl) summaryDomainEl.textContent = state.domainName;
      if (summarySpeedEl) summarySpeedEl.textContent = state.speedName;
      if (summaryAddonsEl) {
        summaryAddonsEl.textContent = addonNames.length > 0 ? addonNames.join(", ") : "Tidak ada";
      }
      if (totalAmountEl) totalAmountEl.textContent = formatted;
      if (totalTimeEl) {
        var timeText = state.speedMult > 1 ? state.typeTime + " (Express 2x lebih cepat)" : state.typeTime;
        totalTimeEl.textContent = timeText;
      }

      // WhatsApp Dynamic URL
      if (calcWaBtn) {
        var waMessage = "Halo Webfast! Saya mencoba kalkulator di website dan tertarik dengan paket:\n" +
          "- Jenis: " + state.typeName + "\n" +
          "- Domain: " + state.domainName + "\n" +
          "- Kecepatan: " + state.speedName + "\n" +
          "- Fitur Tambahan: " + (addonNames.length > 0 ? addonNames.join(", ") : "-") + "\n" +
          "- Estimasi Biaya: " + formatted + "\n\n" +
          "Apakah bisa konsultasi detail untuk memulai proyek ini?";
        
        var encoded = encodeURIComponent(waMessage);
        calcWaBtn.setAttribute("href", "https://wa.me/6285795125809?text=" + encoded);
      }
    }

    // Bind Type Option Buttons
    typeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        typeButtons.forEach(function (b) { b.classList.remove("is-selected"); });
        this.classList.add("is-selected");
        state.typeName = this.getAttribute("data-type-name");
        state.typePrice = parseInt(this.getAttribute("data-type-price"), 10);
        state.typeTime = this.getAttribute("data-type-time");
        recalculateTotal();
      });
    });

    // Bind Domain Option Buttons
    domainButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        domainButtons.forEach(function (b) { b.classList.remove("is-selected"); });
        this.classList.add("is-selected");
        state.domainName = this.getAttribute("data-domain-name");
        state.domainPrice = parseInt(this.getAttribute("data-domain-price"), 10);
        recalculateTotal();
      });
    });

    // Bind Speed Option Buttons
    speedButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        speedButtons.forEach(function (b) { b.classList.remove("is-selected"); });
        this.classList.add("is-selected");
        state.speedName = this.getAttribute("data-speed-name");
        state.speedMult = parseFloat(this.getAttribute("data-speed-mult"));
        recalculateTotal();
      });
    });

    // Bind Checkbox Addons
    addonCheckboxes.forEach(function (cb) {
      cb.addEventListener("change", recalculateTotal);
    });

    recalculateTotal();
  }

  /* 9. Interactive FAQ Accordion ------------------------------------------ */
  var faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
      var item = this.closest(".faq-item");
      var answer = item.querySelector(".faq-answer");
      var isOpen = item.classList.contains("is-open");

      // Close other accordion items
      document.querySelectorAll(".faq-item").forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove("is-open");
          var otherAnswer = otherItem.querySelector(".faq-answer");
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("is-open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* 10. Dynamic Current Year in Footer ----------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* 11. Running Text Engine (Foolproof Seamless Marquee) ------------------ */
  var marqueeTrack = document.querySelector(".marquee-track");
  var marqueeGroup = document.querySelector(".marquee-group");
  var marqueeStrip = document.querySelector(".marquee-strip");

  if (marqueeTrack && marqueeGroup) {
    // Matikan CSS animation agar tidak bentrok dengan JS ticker
    marqueeTrack.style.animation = "none";
    marqueeTrack.style.webkitAnimation = "none";

    var currentX = 0;
    var speed = 1.1; // Kecepatan pergerakan running text (px per frame)
    var isPaused = false;

    if (marqueeStrip) {
      marqueeStrip.addEventListener("mouseenter", function () { isPaused = true; });
      marqueeStrip.addEventListener("mouseleave", function () { isPaused = false; });
      marqueeStrip.addEventListener("touchstart", function () { isPaused = true; }, { passive: true });
      marqueeStrip.addEventListener("touchend", function () { isPaused = false; }, { passive: true });
    }

    function stepRunningText() {
      if (!isPaused) {
        var groupWidth = marqueeGroup.offsetWidth;
        if (groupWidth > 0) {
          currentX += speed;
          if (currentX >= groupWidth) {
            currentX = 0;
          }
          marqueeTrack.style.transform = "translate3d(-" + currentX.toFixed(2) + "px, 0, 0)";
        }
      }
      requestAnimationFrame(stepRunningText);
    }

    // Mulai animasi running text
    requestAnimationFrame(stepRunningText);
  }

  /* 12. Project Screenshot Slider ----------------------------------------- */
  var projectSliders = document.querySelectorAll("[data-slider]");

  projectSliders.forEach(function (slider) {
    var track = slider.querySelector(".slider-track");
    var slides = slider.querySelectorAll(".slider-slide");
    var prevBtn = slider.querySelector(".slider-btn--prev");
    var nextBtn = slider.querySelector(".slider-btn--next");
    var dots = slider.querySelectorAll(".slider-dot");
    var stage = slider.querySelector(".slider-stage");

    if (!track || slides.length < 2) return;

    var activeIndex = 0;
    var startX = null;

    function showSlide(nextIndex) {
      activeIndex = (nextIndex + slides.length) % slides.length;
      track.style.transform = "translateX(-" + activeIndex * 100 + "%)";

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === activeIndex);
      });

      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", i === activeIndex ? "false" : "true");
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () { showSlide(activeIndex - 1); });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () { showSlide(activeIndex + 1); });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { showSlide(i); });
    });

    slider.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        showSlide(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        showSlide(activeIndex + 1);
      }
    });

    // Geser dengan swipe pada perangkat sentuh
    if (stage) {
      stage.addEventListener("pointerdown", function (event) {
        startX = event.clientX;
      });

      stage.addEventListener("pointerup", function (event) {
        if (startX === null) return;
        var delta = event.clientX - startX;
        startX = null;
        if (Math.abs(delta) < 40) return;
        showSlide(delta < 0 ? activeIndex + 1 : activeIndex - 1);
      });

      stage.addEventListener("pointercancel", function () { startX = null; });
    }

    showSlide(0);
  });

})();
