
const searchForm = document.querySelector("#home-search");

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(searchForm);
  const params = new URLSearchParams(data);

  window.location.href =
    `${window.Hogario.route("buscar-servicio")}?${params.toString()}`;
});
