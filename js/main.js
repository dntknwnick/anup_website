function leadMessage(data, config) {
  return [
    `New academy enquiry - ${config.brandName}`,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email || "-"}`,
    `I am a: ${data.learnerType}`,
    `Interested in: ${data.interest}`,
    `Message: ${data.message || "-"}`,
  ].join("\n");
}

function initCarousel(carousel) {
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-slide-to]"));
  const pauseButton = carousel.querySelector("[data-carousel-toggle]");
  const progress = carousel.querySelector(".carousel-progress");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (slides.length < 2) return;

  let activeIndex = 0;
  let manuallyPaused = reducedMotion;
  let temporarilyPaused = false;
  let timer;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === activeIndex;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (progress) {
      progress.classList.remove("is-running");
      void progress.offsetWidth;
      if (!manuallyPaused && !temporarilyPaused) progress.classList.add("is-running");
    }
  }

  function stopTimer() {
    window.clearInterval(timer);
    timer = undefined;
    if (progress) progress.classList.remove("is-running");
  }

  function startTimer() {
    stopTimer();
    if (manuallyPaused || temporarilyPaused || document.hidden) return;
    if (progress) {
      void progress.offsetWidth;
      progress.classList.add("is-running");
    }
    timer = window.setInterval(() => showSlide(activeIndex + 1), 2000);
  }

  function syncPlayback() {
    if (pauseButton) {
      pauseButton.textContent = manuallyPaused ? "Play" : "Pause";
      pauseButton.setAttribute("aria-label", manuallyPaused ? "Play carousel" : "Pause carousel");
    }
    if (manuallyPaused || temporarilyPaused || document.hidden) stopTimer();
    else startTimer();
  }

  carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    syncPlayback();
  });
  carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    syncPlayback();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideTo));
      syncPlayback();
    });
  });
  pauseButton?.addEventListener("click", () => {
    manuallyPaused = !manuallyPaused;
    if (!manuallyPaused) temporarilyPaused = false;
    syncPlayback();
  });
  carousel.addEventListener("pointerenter", () => {
    temporarilyPaused = true;
    syncPlayback();
  });
  carousel.addEventListener("pointerleave", () => {
    temporarilyPaused = carousel.contains(document.activeElement);
    syncPlayback();
  });
  carousel.addEventListener("focusin", () => {
    temporarilyPaused = true;
    syncPlayback();
  });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget) && !carousel.matches(":hover")) {
      temporarilyPaused = false;
      syncPlayback();
    }
  });
  document.addEventListener("visibilitychange", syncPlayback);
  showSlide(0);
  syncPlayback();
}

function initSite(config) {
  window.SITE_CONFIG = config;

  const titlePrefix = document.querySelector("title[data-title-prefix]")?.dataset.titlePrefix;
  if (titlePrefix) document.title = `${titlePrefix} | ${config.brandName}`;
  document.querySelectorAll("[data-og-prefix]").forEach((meta) => {
    meta.content = `${meta.dataset.ogPrefix} | ${config.brandName}`;
  });
  const canonicalLink = document.querySelector("link[rel=canonical][data-canonical-path]");
  if (canonicalLink) {
    const url = `${config.canonicalBase}${canonicalLink.dataset.canonicalPath}`;
    canonicalLink.href = url;
    const openGraphUrl = document.querySelector('meta[property="og:url"]');
    if (openGraphUrl) openGraphUrl.content = url;
  }

  document.querySelectorAll("[data-brand]").forEach((element) => {
    element.textContent = element.classList.contains("short-brand") ? config.shortName : config.brandName;
  });
  document.querySelectorAll("[data-phone]").forEach((element) => {
    element.textContent = config.phone;
    if (element.tagName === "A") element.href = config.phoneHref;
  });
  document.querySelectorAll("[data-phone-secondary]").forEach((element) => {
    element.textContent = config.secondaryPhone;
    if (element.tagName === "A") element.href = config.secondaryPhoneHref;
  });
  document.querySelectorAll("[data-phone-link]").forEach((element) => {
    element.href = config.phoneHref;
  });
  document.querySelectorAll("[data-email]").forEach((element) => {
    element.textContent = config.email;
    if (element.tagName === "A") element.href = `mailto:${config.email}`;
  });
  document.querySelectorAll("[data-address]").forEach((element) => {
    element.textContent = config.address;
  });
  document.querySelectorAll("[data-site-link]").forEach((element) => {
    element.textContent = config.website.replace(/^https?:\/\//, "");
    element.href = config.website;
  });
  document.querySelectorAll("[data-maps]").forEach((element) => {
    element.href = config.mapsUrl;
  });
  document.querySelectorAll("[data-wa]").forEach((element) => {
    const preset = element.getAttribute("data-wa-text") || `Hi ${config.shortName}, I would like to know more about the programme.`;
    element.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(preset)}`;
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(document.body.classList.contains("nav-open")));
  });
  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-copy-phone]").forEach((button) => {
    button.addEventListener("click", async () => {
      const phone = button.parentElement.querySelector("[data-phone], [data-phone-secondary]");
      if (!phone) return;
      try {
        await navigator.clipboard.writeText(phone.textContent.trim());
        button.textContent = "Copied";
      } catch (error) {
        button.textContent = "Copy failed";
        console.error("Could not copy the phone number.", error);
      }
    });
  });

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".section-head, .stage-card, .module-row, .project-visual").forEach((element) => {
      element.classList.add("will-reveal");
      revealObserver.observe(element);
    });
  }

  const organizationSchema = {
    "@type": "EducationalOrganization",
    name: config.brandName,
    url: `${config.canonicalBase}/`,
    email: config.email,
    telephone: [config.phone, config.secondaryPhone],
    address: {
      "@type": "PostalAddress",
      streetAddress: config.address,
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560040",
      addressCountry: "IN",
    },
  };
  const schemas = [organizationSchema];
  if (document.body.dataset.schema === "course") {
    schemas.push({
      "@type": "Course",
      name: "Industrial Automation & Robotics",
      url: `${config.canonicalBase}/training/`,
      description: "A 3-month hands-on industrial automation programme covering PLC and HMI, electrical and automation, industrial robotics, AI and machine vision, and an integrated capstone.",
      timeRequired: "P3M",
      provider: { "@type": "EducationalOrganization", name: config.brandName, url: `${config.canonicalBase}/` },
    });
  }
  const schemaScript = document.createElement("script");
  schemaScript.type = "application/ld+json";
  schemaScript.textContent = JSON.stringify(schemas.length === 1
    ? { "@context": "https://schema.org", ...organizationSchema }
    : { "@context": "https://schema.org", "@graph": schemas });
  document.head.append(schemaScript);

  document.querySelectorAll("form.enquiry-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const alertBox = form.querySelector(".alert");
      const honeypot = form.elements.namedItem("company_website");
      if (honeypot && honeypot.value) return;

      const data = {
        name: form.elements.namedItem("name").value.trim(),
        phone: form.elements.namedItem("phone").value.trim(),
        email: form.elements.namedItem("email").value.trim(),
        learnerType: form.elements.namedItem("learner_type").value,
        interest: form.elements.namedItem("interest").value,
        message: form.elements.namedItem("message").value.trim(),
      };
      const normalizedPhone = data.phone.replace(/[\s-]/g, "").replace(/^\+?91/, "");
      const emailInput = form.elements.namedItem("email");
      if (!data.name || !/^[6-9]\d{9}$/.test(normalizedPhone) || !emailInput.validity.valid) {
        if (alertBox) {
          alertBox.className = "alert alert-err show";
          alertBox.textContent = !data.name
            ? "Enter your name."
            : !/^[6-9]\d{9}$/.test(normalizedPhone)
              ? "Enter a valid Indian mobile number."
              : "Enter a valid email address or leave the email field blank.";
        }
        return;
      }

      const whatsappUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(leadMessage(data, config))}`;
      sessionStorage.setItem("academy_lead", JSON.stringify(data));
      sessionStorage.removeItem("academy_whatsapp_popup_blocked");
      const whatsappWindow = window.open(whatsappUrl, "_blank");
      if (!whatsappWindow) sessionStorage.setItem("academy_whatsapp_popup_blocked", "true");
      try {
        const response = await fetch("/send.php", { method: "POST", body: new FormData(form) });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || `Email submission failed: ${response.status}`);
        }
      } catch (error) {
        if (alertBox) {
          alertBox.className = "alert alert-err show";
          alertBox.textContent = "We could not submit your enquiry. Please try WhatsApp or call admissions.";
        }
        console.error("Academy enquiry submission failed.", error);
        return;
      }

      window.location.href = "/thank-you/";
    });
  });

  document.querySelectorAll("[data-copy-enquiry]").forEach((button) => {
    button.addEventListener("click", async () => {
      const form = button.closest("form");
      const alertBox = form?.querySelector(".alert");
      if (!form) return;
      const data = {
        name: form.elements.namedItem("name").value.trim(),
        phone: form.elements.namedItem("phone").value.trim(),
        email: form.elements.namedItem("email").value.trim(),
        learnerType: form.elements.namedItem("learner_type").value,
        interest: form.elements.namedItem("interest").value,
        message: form.elements.namedItem("message").value.trim(),
      };
      try {
        await navigator.clipboard.writeText(leadMessage(data, config));
        if (alertBox) {
          alertBox.className = "alert alert-ok show";
          alertBox.textContent = "Enquiry copied. Paste it into your message.";
        }
      } catch (error) {
        if (alertBox) {
          alertBox.className = "alert alert-err show";
          alertBox.textContent = "Could not copy your enquiry. Please select and copy the details manually.";
        }
        console.error("Could not copy the academy enquiry.", error);
      }
    });
  });

  const resendButton = document.getElementById("wa-again");
  const savedEnquiry = sessionStorage.getItem("academy_lead");
  const whatsappStatus = document.getElementById("whatsapp-status");
  if (whatsappStatus && sessionStorage.getItem("academy_whatsapp_popup_blocked") === "true") {
    whatsappStatus.textContent = "Your browser blocked WhatsApp from opening automatically. Use the button below to send your enquiry.";
    sessionStorage.removeItem("academy_whatsapp_popup_blocked");
  }
  if (resendButton && savedEnquiry) {
    try {
      resendButton.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(leadMessage(JSON.parse(savedEnquiry), config))}`;
    } catch (error) {
      console.error("Could not prepare the saved enquiry for WhatsApp.", error);
    }
  }
}

fetch("/site-config.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Site configuration request failed: ${response.status}`);
    return response.json();
  })
  .then(initSite)
  .catch((error) => {
    console.error("Could not initialize the academy website.", error);
    const configAlert = document.createElement("p");
    configAlert.className = "config-error";
    configAlert.setAttribute("role", "alert");
    configAlert.textContent = "Contact details are temporarily unavailable. Please try again later.";
    document.body.prepend(configAlert);
    document.querySelectorAll("[data-config-error]").forEach((element) => {
      element.textContent = "Contact details are temporarily unavailable. Please try again later.";
    });
  });
