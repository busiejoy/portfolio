// WhatsApp: one number, ready-written messages
var WHATSAPP_NUMBER = "2349021618472";

var WA_MESSAGES = {
  float: "Hello! 👋 I came across your website and would like to make an enquiry about your services. Please, I'd love to know more.",
  footer: "Hello BM Web Studio! 💙 I'd like to connect with you regarding your website design and development services. I have a project I'd love to discuss.",
  demo: "Hello BM Web Studio! 👋 I came across your Blush & Braid Studio website demo, and I'd love to see how it works and learn more about getting a similar website customised for my salon business."
};

function waLink(text) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

document.querySelectorAll("a[data-wa]").forEach(function (a) {
  var msg = WA_MESSAGES[a.dataset.wa];
  if (msg) a.href = waLink(msg);
});

// Tell the CSS that JavaScript is working
document.documentElement.classList.add("js");

// Keep the footer year up to date
var year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Pick everything that should fade in
var items = document.querySelectorAll(".card, .title, .lead, .about-text, .cta");
items.forEach(function (el) {
  el.classList.add("reveal");
});

// Show an element, then remove the animation classes
// so the card hover effects keep working
function show(el) {
  el.classList.add("in");
  setTimeout(function () {
    el.classList.remove("reveal", "in");
  }, 800);
}

if ("IntersectionObserver" in window) {
  var watcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        show(entry.target);
        watcher.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (el) {
    watcher.observe(el);
  });
} else {
  items.forEach(show);
}

// Mobile menu (animated)
var menuBtn = document.querySelector(".menu-btn");
var menu = document.getElementById("mobile-menu");

function setMenu(open) {
  menu.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

if (menuBtn && menu) {
  menuBtn.addEventListener("click", function () {
    setMenu(!menu.classList.contains("open"));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });
}

// Highlight the link of the section you're viewing
var sections = document.querySelectorAll("main section");
var navLinks = document.querySelectorAll(".nav-link, .mobile-menu a");

if ("IntersectionObserver" in window) {
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(function (s) { spy.observe(s); });
}

// Enquiry form: opens WhatsApp with a ready-made message
var enquiry = document.getElementById("enquiry");

if (enquiry) {
  enquiry.addEventListener("submit", function (e) {
    e.preventDefault(); // stop the page from reloading

    var name = document.getElementById("eq-name").value.trim();
    var type = document.getElementById("eq-type").value;
    var msg = document.getElementById("eq-msg").value.trim();

    var text = "Hello Busayo, my name is " + name + ".\n" +
               "Type of business: " + type + "\n" +
               "What I need: " + (msg || "I'd like to know more.");

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
  });
}

// Email form: sends the message to your inbox without leaving the page
var emailForm = document.getElementById("email-form");
var statusEl = document.getElementById("email-status");

if (emailForm) {
  emailForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var btn = emailForm.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending...";
    statusEl.className = "status";
    statusEl.textContent = "";
    
        var data = new FormData(emailForm);
    data.set("subject", "Portfolio enquiry: " + data.get("topic"));

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: data
    })

      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          statusEl.textContent = "Thank you! Your message has been sent. I’ll reply soon.";
          statusEl.classList.add("ok");
          emailForm.reset();
        } else {
          throw new Error(data.message);
        }
      })
      .catch(function () {
        statusEl.textContent = "Something went wrong. Please try again or message me on WhatsApp.";
        statusEl.classList.add("err");
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = "Send message";
      });
  });
}

// Project details panel
var projects = {
  juma: {
    tag: "Live project",
    title: "Juma M. Wekesa: author and speaker website",
    desc: "A single-page website that presents an author, public speaker and youth mentor.",
    role: ["Frontend Development", "Website Optimisation", "Website Deployment", "And More..."],
    features: ["Books section", "Speaking engagements", "Mentorship profile", "Mobile-friendly layout"],
    tools: ["HTML", "CSS", "JavaScript"],
    link: { text: "Visit the website", href: "https://jumawekesa.netlify.app" }
  },
  salon: {
    tag: "Concept project",
    title: "Blush & Braids Studio: salon website",
    desc: "A sample website for a braiding studio, designed so it can be customised for any service business.",
    role: ["Website Design", "Frontend Development", "Image Gallery Design", "Service & Pricing Presentation", "Booking Form Implementation", "And More..."],
    features: ["Services and prices", "Hairstyle gallery", "Booking and contact section", "Mobile-friendly layout"],
    tools: ["HTML", "CSS", "JavaScript"],
    link: { text: "Request a demo", href: waLink(WA_MESSAGES.demo) }
  },
  sourced: {
    tag: "Personal project",
    title: "Sourced by B: product sourcing website",
    desc: "My own side-business website where customers browse products by category or send a custom request.",
    role: ["Website Design", "Frontend Development", "Website Content Organisation", "WhatsApp Integration", "And More..."],
    features: ["Product categories", "Custom request form that opens in WhatsApp", "How it works steps", "Mobile-friendly layout"],
    tools: ["HTML", "CSS", "JavaScript"],
    link: { text: "Visit the website", href: "https://busiejoy.github.io/sourced-by-b/" }
  }
};

var dialog = document.getElementById("project-dialog");

function fillList(id, items) {
  var list = document.getElementById(id);
  list.textContent = "";
  items.forEach(function (text) {
    var li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
}

function openProject(key) {
  var p = projects[key];
  if (!p || !dialog) return;
  document.getElementById("pd-tag").textContent = p.tag;
  document.getElementById("pd-title").textContent = p.title;
  document.getElementById("pd-desc").textContent = p.desc;
  fillList("pd-role", p.role);
  var lastRole = document.querySelector("#pd-role li:last-child");
  if (lastRole && /^and more/i.test(lastRole.textContent)) {
    lastRole.classList.add("more-item");
  }
  fillList("pd-features", p.features);
  fillList("pd-tools", p.tools);
  var link = document.getElementById("pd-link");
  link.textContent = p.link.text;
  link.href = p.link.href;
  document.body.style.overflow = "hidden";
  if (dialog.showModal) dialog.showModal();
  else dialog.setAttribute("open", "");
}

document.querySelectorAll(".more-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    openProject(btn.dataset.project);
  });
});

var calmDialog = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeDialog() {
  if (!dialog || !dialog.open || dialog.classList.contains("closing")) return;
  if (calmDialog) { dialog.close(); return; }

  dialog.classList.add("closing");
  var finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    dialog.classList.remove("closing");
    dialog.close();
  }
  dialog.addEventListener("animationend", function onEnd(e) {
    if (e.target !== dialog) return;
    dialog.removeEventListener("animationend", onEnd);
    finish();
  });
  setTimeout(finish, 350); // safety net
}

if (dialog) {
  dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) closeDialog();   // tap outside
  });
  dialog.addEventListener("cancel", function (e) {
    e.preventDefault();                       // Esc key
    closeDialog();
  });
  dialog.addEventListener("close", function () {
    document.body.style.overflow = "";
  });
}

// Scroll progress bar and back-to-top button
var progress = document.querySelector(".progress");
var toTop = document.querySelector(".to-top");
var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function onScroll() {
  var y = window.scrollY;
  var max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  if (toTop) toTop.classList.toggle("show", y > 600);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  });
}

// Light / dark theme toggle
var root = document.documentElement;
var themeBtn = document.querySelector(".theme-btn");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeBtn) {
    themeBtn.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  }
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f3f7fd" : "#040b24");
}

applyTheme(root.getAttribute("data-theme") || "dark");

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

// Typing effect: the full title types out once and stays
var partA = document.getElementById("typed-a");
var partB = document.getElementById("typed-b");

if (partA && partB && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  var textA = "Freelance Web Designer &";
  var textB = " Frontend Developer";
  var total = textA.length + textB.length;
  var count = 0;

  partA.textContent = "";
  partB.textContent = "";

  var type = function () {
    count++;
    partA.textContent = textA.slice(0, Math.min(count, textA.length));
    partB.textContent = count > textA.length ? textB.slice(0, count - textA.length) : "";
    if (count < total) setTimeout(type, 70);
  };

  setTimeout(type, 500);
}