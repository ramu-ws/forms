/**
 * Custom cards component
 * Based on: Radio Group
 */
 
/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The DOM element containing the field wrapper. Refer to the documentation for its structure for each component.
 * @param {Object} fieldJson - The form json object for the component.
 * @param {HTMLElement} parentElement - The parent container element of the field.
 * @param {string} formId - The unique identifier of the form.
 */
import { createOptimizedPicture } from "../../../../scripts/aem.js";
import { subscribe } from "../../rules/index.js";
 
function createCard(element, enums) {
  element.querySelectorAll(".radio-wrapper").forEach((radioWrapper, index) => {
    if (enums[index]?.name) {
      let label = radioWrapper.querySelector("label");
      if (!label) {
        label = document.createElement("label");
        radioWrapper.appendChild(label);
      }
      label.textContent = enums[index]?.name;
    }
    radioWrapper.querySelector("input").dataset.index = index;
    let imageUrl = enums[index].image;
    if (imageUrl && imageUrl !== undefined) {
      imageUrl = imageUrl.replace("hlx", "aem");
    }
    const image = createOptimizedPicture(
      imageUrl || "https://main--afb--jalagari.aem.page/lab/images/card.png",
      "card-image",
    );
    radioWrapper.appendChild(image);
  });
}
 
export default function decorate(element, fieldJson, container, formId) {
  element.classList.add("card");
  createCard(element, fieldJson.enum);
  subscribe(element, formId, (fieldDiv, fieldModel) => {
    fieldModel.subscribe((e) => {
      const { payload } = e;
      payload?.changes?.forEach((change) => {
        if (change?.propertyName === "enum") {
          createCard(element, change.currentValue);
        }
      });
    });
 
    element.addEventListener("change", (e) => {
      e.stopPropagation();
      const value = fieldModel.enum?.[parseInt(e.target.dataset.index, 10)];
      fieldModel.value = value.name;
    });
  });
  return element;
}
