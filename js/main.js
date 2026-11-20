const CONFIG = {
  company: "Quasar Robotics Academy",
  phone: "+91 80951 56211",
  phoneHref: "tel:+918095156211",
  secondaryPhone: "+91 96867 75483",
  secondaryPhoneHref: "tel:+919686775483",
  whatsapp: "918095156211",
  email: "hello@qusaraengg.com",
  address: "1st Floor, 4, 17th Cross Road, behind Maruthi Mandir, Govindaraja Nagar Ward, MC Layout, Vijayanagar, Bengaluru, Karnataka 560040",
};

document.querySelectorAll("[data-phone]").forEach((el) => {
  el.textContent = CONFIG.phone;
  if (el.tagName === "A") el.href = CONFIG.phoneHref;
});

document.querySelectorAll("[data-phone-secondary]").forEach((el) => {
  el.textContent = CONFIG.secondaryPhone;
  if (el.tagName === "A") el.href = CONFIG.secondaryPhoneHref;
});

document.querySelectorAll("[data-email]").forEach((el) => {
  el.textContent = CONFIG.email;
  if (el.tagName === "A") el.href = `mailto:${CONFIG.email}`;
});

document.querySelectorAll("[data-address]").forEach((el) => {
  el.textContent = CONFIG.address;
});

document.querySelectorAll("[data-wa]").forEach((el) => {
  const preset = el.getAttribute("data-wa-text") || "Hi Quasar Robotics Academy, I would like to know more about your automation services or training.";
  el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(preset)}`;
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const toggle = document.querySelector(".nav-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", document.body.classList.contains("nav-open"));
  });
}

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
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
  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      manuallyPaused = !manuallyPaused;
      if (!manuallyPaused) temporarilyPaused = false;
      syncPlayback();
    });
  }

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
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-head, .service-card, .stage-card, .module-row, .project-visual").forEach((element) => {
    element.classList.add("will-reveal");
    revealObserver.observe(element);
  });
}

function leadMessage(data) {
  return [
    "New website enquiry - Quasar Robotics Academy",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email || "-"}`,
    `Interest: ${data.interest}`,
    `Message: ${data.message || "-"}`,
  ].join("\n");
}

async function handleEnquiry(form) {
  const alertBox = form.querySelector(".alert");
  const honeypot = form.querySelector('[name="company_website"]');
  if (honeypot && honeypot.value) return;

  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email ? form.email.value.trim() : "",
    interest: form.interest.value,
    message: form.message ? form.message.value.trim() : "",
  };

  if (!data.name || !data.phone) {
    if (alertBox) {
      alertBox.className = "alert alert-err show";
      alertBox.textContent = "Please enter your name and phone number.";
    }
    return;
  }

  const body = new FormData(form);
  let emailed = false;
  try {
    const res = await fetch("/send.php", { method: "POST", body });
    emailed = res.ok;
  } catch (err) {
    emailed = false;
  }

  const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(leadMessage(data))}`;
  sessionStorage.setItem("qusara_lead", JSON.stringify({ ...data, emailed }));
  window.open(waUrl, "_blank");
  window.location.href = "/thank-you/";
}

document.querySelectorAll("form.enquiry-form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleEnquiry(form);
  });
});
