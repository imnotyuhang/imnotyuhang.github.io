const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
const sidebar = document.querySelector("[data-sidebar]");
const searchInput = document.querySelector("[data-search-input]");
const entries = Array.from(document.querySelectorAll("[data-entry]"));
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

let activeFilter = "all";

function closeSidebar() {
  if (!sidebarToggle || !sidebar) return;
  sidebarToggle.setAttribute("aria-expanded", "false");
  sidebar.classList.remove("is-open");
}

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", () => {
    const isOpen = sidebarToggle.getAttribute("aria-expanded") === "true";
    sidebarToggle.setAttribute("aria-expanded", String(!isOpen));
    sidebar.classList.toggle("is-open", !isOpen);
  });

  sidebar.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeSidebar();
  });
}

function entryMatchesFilter(entry) {
  if (activeFilter === "all") return true;
  const category = entry.dataset.category || "";
  const tags = entry.dataset.tags || "";
  return category.includes(activeFilter) || tags.includes(activeFilter);
}

function entryMatchesSearch(entry, query) {
  if (!query) return true;
  return entry.textContent.toLowerCase().includes(query);
}

function updateEntries() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  entries.forEach((entry) => {
    const isVisible = entryMatchesFilter(entry) && entryMatchesSearch(entry, query);
    entry.classList.toggle("is-hidden", !isVisible);
  });
}

if (searchInput && entries.length) {
  searchInput.addEventListener("input", updateEntries);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    if (searchInput) searchInput.value = "";
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    updateEntries();
  });
});
