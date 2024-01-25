/**
 * @param {HTMLInputElement} customCheckbox
 * @param {boolean} checked
 */
function setCustomCheckboxChecked(customCheckbox, checked) {
  customCheckbox.setAttribute("aria-checked", checked ? "true" : "false");
}

document
  .querySelectorAll(
    '.custom-checkbox input[type="checkbox"]:has(+ [role="checkbox"])'
  )
  .forEach((/** @type {HTMLInputElement} */ nativeCheckbox) => {
    /** @type {HTMLInputElement} */ const customCheckbox =
      nativeCheckbox.nextElementSibling;

    nativeCheckbox.addEventListener("click", (e) => {
      setCustomCheckboxChecked(customCheckbox, e.currentTarget.checked);
    });

    nativeCheckbox.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        setCustomCheckboxChecked(customCheckbox, e.currentTarget.checked);
      }
    });

    customCheckbox.addEventListener("click", () => {
      const nextChecked =
        customCheckbox.getAttribute("aria-checked") === "false";

      setCustomCheckboxChecked(customCheckbox, nextChecked);
      nativeCheckbox.checked = nextChecked;
    });

    customCheckbox.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        const nextChecked =
          customCheckbox.getAttribute("aria-checked") === "false";

        setCustomCheckboxChecked(customCheckbox, nextChecked);

        // This feels right, but is not specified by the acceptance criteria. Maybe remove?
        nativeCheckbox.checked = nextChecked;
      }
    });
  });
