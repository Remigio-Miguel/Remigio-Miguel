const form = document.querySelector("#service-search-form");
const params = new URLSearchParams(window.location.search);
const serviceSelect = document.querySelector("#service");
const districtSelect = document.querySelector("#district");
const serviceParam = params.get("servicio") || sessionStorage.getItem("hogario-selected-service");
if (serviceParam && serviceSelect) serviceSelect.value = serviceParam;
if (params.has("distrito") && districtSelect) districtSelect.value = params.get("distrito");
const searchSummary = document.querySelector("#search-summary");
const updateSummary = () => {
  const service = serviceSelect?.value || "Elige un servicio";
  const district = districtSelect?.value || "Elige un distrito";
  if (searchSummary) searchSummary.innerHTML = `<span class="pill">${service}</span><span class="pill">${district}</span>`;
};
serviceSelect?.addEventListener("change", updateSummary);
districtSelect?.addEventListener("change", updateSummary);
updateSummary();
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  sessionStorage.setItem("hogario-selected-service", data.get("servicio"));
  window.location.href = window.Hogario.url(`/resultados/?${new URLSearchParams(data).toString()}`);
});
