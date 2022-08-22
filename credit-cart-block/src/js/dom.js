import Crelt from "crelt";
import Validator from "validator";
import CardValidator from "card-validator";
import { create as createMask } from "maska";

import stockIcon from "../assets/svg/stock-icon.svg";
import mastercardIcon from "../assets/svg/mastecard-icon.svg";
import visaIcon from "../assets/svg/visa-icon.svg";
import mirIcon from "../assets/svg/mir-icon.svg";

export function createInput(labelText, params = {}) {
  let label = Crelt("label", { class: "input-label" }, labelText);
  let input = Crelt("input", { class: "input-inputfield" });
  let errorBlock = Crelt(
    "div",
    { class: "input-error-block hidden" },
    params.ErrorText
  );
  let block = Crelt("div", { class: "input-group" }, [
    label,
    input,
    errorBlock,
  ]);

  input.dataset.valid = false;
  const errorClass = params.errorClass || "error";
  createMask(input, { mask: params.mask });

  if (params.placeholder) {
    input.placeholder = params.placeholder;
  }
  input.addEventListener("input", deleteError);
  input.addEventListener("input", validation);
  input.addEventListener("blur", validation);

  if (params.inputCallback) {
    input.addEventListener("input", params.inputCallback);
  }

  return block;

  function validation(e) {
    if (!input.value && e.type === "blur" && e.target === input) {
      showError();
    }

    if (params.validFunc(input.value)) {
      input.dataset.valid = true;
      deleteError();
      return;
    } else {
      input.dataset.valid = false;
      if (e.type === "blur" && e.target === input) {
        showError();
      }
    }
  }

  function deleteError() {
    input.classList.remove(errorClass);
    errorBlock.classList.add("hidden");
  }

  function showError() {
    errorBlock.classList.remove("hidden");
    input.classList.add(errorClass);
  }
}

function createBtn(text = "Кнопка") {
  let btn = Crelt("button", { class: "btn", disabled: true }, text);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
  });
  return btn;
}

export function createForm() {
  const paymentSystemIcon = Crelt(
    "img",
    { class: "payment-system-icon", id: "payment-system-icon", src: stockIcon },
    ["Icon"]
  );

  const cardNumber = createInput("Номер карты", {
    placeholder: "Номер карты",
    validFunc: validationCardNumber,
    mask: "#### #### #### #######",
    ErrorText: "Введите корректный номер карты",
    inputCallback: cardNumberCallback,
  });

  cardNumber.append(paymentSystemIcon);

  const expDate = createInput("Срок действия", {
    placeholder: "ММ / ГГ",
    validFunc: validationExpDate,
    mask: "##/##",
    ErrorText: "Срок действия истек",
    inputCallback: expDateCallback,
  });

  const CVV = createInput("CVV/CVC", {
    placeholder: "CVV / CVC",
    validFunc: validationCardCVV,
    mask: "###",
    ErrorText: "CVV/CVC - три цифры на обороте карты",
  });

  const email = createInput("E-mail", {
    placeholder: "Email",
    validFunc: validationEmail,
    ErrorText: "Введите корректный E-mail",
  });

  const confirmBtn = createBtn("Оплатить");

  const form = Crelt("form", { class: "form" }, [
    cardNumber,
    expDate,
    CVV,
    email,
    confirmBtn,
  ]);

  form.addEventListener("input", checkForm);

  return form;

  function checkForm() {
    const inputs = form.querySelectorAll("input");

    for (const input of inputs) {
      if (input.dataset.valid === "false") {
        confirmBtn.disabled = true;
        return;
      }
    }

    confirmBtn.disabled = false;
  }
}

export function validationCardNumber(value) {
  return CardValidator.number(value).isValid;
}

export function validationExpDate(value = "") {
  return CardValidator.expirationDate(value).isValid;
}

export function validationCardCVV(value) {
  return CardValidator.cvv(value).isValid;
}

export function validationEmail(value) {
  return Validator.isEmail(value);
}

const expDateCallback = (event) => {
  if (Number(event.target.value.slice(0, 2)) > 12) {
    event.target.value = "12" + event.target.value.slice(3);
  }
};

const cardNumberCallback = (event) => {
  const card = CardValidator.number(event.target.value);

  const type = card.card?.type || "icons";

  const icon = document.querySelector("#payment-system-icon");

  switch (type) {
    case "mir":
      icon.src = mirIcon;
      break;
    case "mastercard":
      icon.src = mastercardIcon;
      break;
    case "visa":
      icon.src = visaIcon;
      break;

    default:
      icon.src = stockIcon;

      break;
  }
};
