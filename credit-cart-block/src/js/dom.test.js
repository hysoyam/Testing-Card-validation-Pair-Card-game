import { validationCardNumber, validationCardCVV, createForm } from "./dom";

const invalidCardNumbers = [
  "220066666666666a",
  "2200666a66666666",
  "2200666a66666666",
  "22я00666a66я6666",
  "22я0_066@6a66я66",
  "20>666a66яю.6666",
  "200666a66яю.6666",
  "200666a66яю.6666,",
];
const tooShortCardNumbers = [
  "262626226",
  "454544",
  "1",
  "",
  "9782598634561",
  "68924575786",
  "3",
  "0",
];

test("Валидация номера карты пропускает корректный номер карты.", () => {
  expect(validationCardNumber("2200666666666666")).toBe(true);
});

test("Валидация номера карты не пропускает произвольную строку. (Кириллица, Латинница, Знаки препинания)", () => {
  for (const cardNumber of invalidCardNumbers) {
    expect(validationCardNumber(cardNumber)).toBe(false);
  }
});

test("Валидация номера карты не пропускает строку с недостаточным количеством цифр.", () => {
  for (const cardNumber of tooShortCardNumbers) {
    expect(validationCardNumber(cardNumber)).toBe(false);
  }
});

test("Валидация номера карты не пропускает строку со слишком большим количеством цифр.", () => {
  expect(validationCardNumber("2200666666666666666666666666")).toBe(false);
});

const validCVVs = ["111", "548", "567", "853", "344", "344"];

const shortCVVs = ["1", "0", "12", "55"];

const longCVVs = ["11111", "02323", "5533"];
const wrongCVVs = [" //", "///", "sss", "hgf", "d  ", "f%6", "   "];

test("Валидация CVV / CVC пропускает строку с тремя цифровыми символами.", () => {
  for (const cvv of validCVVs) {
    expect(validationCardCVV(cvv)).toBe(true);
  }
});

test("Валидация CVV / CVC не пропускает строки с 1 - 2 цифровыми символами.", () => {
  for (const cvv of shortCVVs) {
    expect(validationCardCVV(cvv)).toBe(false);
  }
});

test("Валидация CVV / CVC не пропускает строки с 4 + цифровыми символами.", () => {
  for (const cvv of longCVVs) {
    expect(validationCardCVV(cvv)).toBe(false);
  }
});
test("Валидация CVV / CVC не пропускает строки с тремя нецифровыми символами", () => {
  for (const cvv of wrongCVVs) {
    expect(validationCardCVV(cvv)).toBe(false);
  }
});

test("Функция создания DOM - дерева должна вернуть DOM - элемент, в котором содержится строго четыре поля для ввода с плейсхолдерами «Номер карты», «ММ / ГГ», CVV / CVC, Email.", () => {
  const form = createForm();

  // Функция создания DOM - дерева должна вернуть DOM - элемент,
  expect(form instanceof HTMLElement).toBe(true);

  const inputs = form.querySelectorAll("input");

  // в котором содержится строго четыре поля для ввода
  expect(inputs.length === 4).toBe(true);

  // с плейсхолдерами «Номер карты», «ММ / ГГ», CVV / CVC, Email.
  expect(inputs[0].placeholder === "Номер карты").toBe(true);
  expect(inputs[1].placeholder === "ММ / ГГ").toBe(true);
  expect(inputs[2].placeholder === "CVV / CVC").toBe(true);
  expect(inputs[3].placeholder === "Email").toBe(true);
});
