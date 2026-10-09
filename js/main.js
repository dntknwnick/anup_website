const CONFIG = {
  company: "Quasar Robotics & Automation Academy",
  phone: "+91 90000 00000",
  phoneHref: "tel:+919000000000",
  whatsapp: "919000000000",
  email: "hello@qusaraengg.com",
  address: "Bengaluru, Karnataka, India",
};

document.querySelectorAll("[data-phone]").forEach((el) => {
  el.textContent = CONFIG.phone;
  if (el.tagName === "A") el.href = CONFIG.phoneHref;
});

document.querySelectorAll("[data-email]").forEach((el) => {
  el.textContent = CONFIG.email;
  if (el.tagName === "A") el.href = `mailto:${CONFIG.email}`;
});

document.querySelectorAll("[data-address]").forEach((el) => {
  el.textContent = CONFIG.address;
});

document.querySelectorAll("[data-wa]").forEach((el) => {
  const preset = el.getAttribute("data-wa-text") || "Hi Quasar, I would like to know more about the PLC training.";
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
  link.addEventListener("click", () => document.body.classList.remove("nav-open"));
});

function leadMessage(data) {
  return [
    "New website enquiry - Quasar Robotics & Automation Academy",
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
