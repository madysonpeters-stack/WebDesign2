// Within Reach: small front-end interactions for the class prototype.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Anonymous intake form: recommends starter resources based on selected needs.
  const intake = document.querySelector("#intake-form");
  const output = document.querySelector("#recommendations");
  if (intake && output) {
    intake.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(intake);
      const selected = data.getAll("needs");
      const transport = data.get("transport");
      const budget = data.get("budget");
      const group = data.get("group");
      const time = data.get("timeframe");
      const notes = String(data.get("notes") || "").trim();

      const resources = [
        { id: "foodbank", name: "Missoula Food Bank & Community Center", category: ["food"], info: "Food assistance and community support. Check the organization website for current program details.", url: "https://missoulafoodbank.org/", hours: "Check current hours online", phone: "See current contact information online" },
        { id: "applymt", name: "Montana DPHHS / Apply for Benefits", category: ["utilities", "living"], info: "Online starting point for state benefit applications, including eligible assistance programs.", url: "https://apply.mt.gov/", hours: "Online portal; program hours vary", phone: "Use the official site for current contact options" },
        { id: "mountainline", name: "Mountain Line", category: ["transportation"], info: "Missoula public transportation routes, maps, and schedules.", url: "https://mountainline.com/your-trip/maps-schedules/", hours: "Check current schedules", phone: "See Mountain Line contact page" },
        { id: "poverello", name: "Poverello Center", category: ["housing", "food", "free"], info: "Local services and support for people experiencing homelessness and hardship.", url: "https://www.thepoverellocenter.org/", hours: "Confirm current service hours", phone: "See official website for current number" },
        { id: "watershed", name: "Watershed Navigation Center", category: ["housing", "free"], info: "A local navigation and resource connection point. Confirm available services and access details before visiting.", url: "https://www.missoulacounty.us/", hours: "Confirm current hours", phone: "Confirm current contact details" },
        { id: "library", name: "Missoula Public Library", category: ["free", "living"], info: "Library services may include public computers, Wi-Fi, learning resources, and community spaces.", url: "https://www.missoulapubliclibrary.org/", hours: "Check current library hours", phone: "See official website for current number" }
      ];

      let matches = resources.filter(resource => selected.some(need => resource.category.includes(need)));
      if (selected.includes("free") && !matches.some(r => r.id === "library")) {
        matches.push(resources.find(r => r.id === "library"));
      }
      if (transport === "yes") {
        const transit = resources.find(r => r.id === "mountainline");
        if (!matches.some(r => r.id === transit.id)) matches.push(transit);
      }
      if (!selected.length) matches = resources;

      const safe = (value) => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
      const cards = matches.map(resource => `
        <article class="result-card">
          <div class="resource-top"><h3>${safe(resource.name)}</h3><span class="pill">${safe(resource.category[0])}</span></div>
          <p>${safe(resource.info)}</p>
          <div class="result-meta"><span>Hours: ${safe(resource.hours)}</span><span>Phone: ${safe(resource.phone)}</span></div>
          <a class="btn btn-outline" href="${resource.url}" target="_blank" rel="noopener">Visit official website ↗</a>
        </article>`).join("");

      output.innerHTML = `
        <h2>Your starting points</h2>
        <p class="muted">These are suggestions based on the needs you selected. Confirm current eligibility, hours, and availability with each organization.</p>
        ${cards || '<div class="empty-state">No exact matches yet. Try selecting another need or browse all resources.</div>'}
        <p class="small">Your selections are processed in this browser only. This prototype does not save or send your answers.</p>
        <p class="small">Preferences: budget ${safe(budget || "not specified")}; ${safe(group || "not specified")}; timeframe ${safe(time || "not specified")}.</p>
        ${notes ? `<p class="small">Your note stays on this page and is not sent: ${safe(notes)}</p>` : ""}
      `;
      output.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const reset = document.querySelector("#reset-intake");
    if (reset) reset.addEventListener("click", () => { output.innerHTML = ""; });
  }

  // Resource search filters the starter resource list by text and category.
  const searchInput = document.querySelector("#resource-search");
  const categoryFilter = document.querySelector("#category-filter");
  const resourceItems = [...document.querySelectorAll("[data-resource]")];
  function filterResources() {
    const term = (searchInput?.value || "").toLowerCase().trim();
    const category = categoryFilter?.value || "all";
    resourceItems.forEach(item => {
      const matchesText = item.textContent.toLowerCase().includes(term);
      const categories = (item.dataset.category || "").split(" ");
      const matchesCategory = category === "all" || categories.includes(category);
      item.hidden = !(matchesText && matchesCategory);
    });
  }
  if (searchInput) searchInput.addEventListener("input", filterResources);
  if (categoryFilter) categoryFilter.addEventListener("change", filterResources);
});
