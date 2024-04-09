window.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".show-panel");
  const wrapper = document.querySelector(".wrapper");
  btn.addEventListener("click", () => {
    wrapper.classList.toggle("side-panel-open");
  });
});
