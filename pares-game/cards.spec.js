/// <reference types="cypress" />

describe("Тест карточек", () => {
  const x = 4,
    y = 4;
  const path = "http://localhost:8080/";

  beforeEach(() => {
    cy.visit(path);
    cy.get('[name="x"]').type(x);
    cy.get('[name="y"]').type(y);
    cy.contains("Начать игру").click();
  });

  it(`Проверка поля, должно быть ${x * y} карточек`, () => {
    cy.get("#cards li").should("have.length", x * y);
  });

  it("Все карточки пустые", () => {
    cy.get("#cards li").each((el) => {
      cy.get(el)
        .should("have.class", "close")
        .invoke("text")
        .should("be.empty");
    });
  });

  it("Проверка одной карточки", () => {
    const number = getRandomIntInclusive(0, x * y);

    cy.get(`#cards li`)
      .eq(number)
      .click()
      .clock(200)
      .should("have.class", "open")
      .then(($el) => {
        const number = Number($el.text());
        cy.wrap(number)
          .should("be.greaterThan", 0)
          .should("be.lessThan", (x * y) / 2 + 1);
      });
  });

  it("Карточки нажимаются и остаются открытыми при совпадении пар", () => {
    // Нажать на левую верхнюю карточку, затем на следующую. Если это не пара,
    // то повторять со следующей карточкой, пока не будет найдена пара.
    // Проверить, что найденная пара карточек осталась видимой.
    checkCardOpening(1, 15);
  });

  it("Карточки нажимаются и скрываются при несовпадении пар", () => {
    // Нажать на левую верхнюю карточку, затем на следующую.
    // Если это пара, то повторять со следующими двумя карточками,
    // пока не найдутся непарные карточки.
    // Проверить, что после нажатия на вторую карточку обе становятся невидимыми.

    checkCardClosing(0, 16);
  });

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function checkCardClosing(cardIndex, length) {
    if (cardIndex > length) return;

    cy.get(`#cards li`)
      .eq(cardIndex)
      .click()
      .invoke("text")
      .as("myElement2text");
    cy.get(`#cards li`)
      .eq(cardIndex + 1)
      .click()
      .invoke("text")
      .as("myElement2text");

    cy.then(function () {
      // если номера разные то клик на следующую, и  проверка классов
      if (this.myElement2text !== this.myElement1text) {
        cy.get(`#cards li`)
          .eq(cardIndex + 2)
          .click();
        // проверка классов
        cy.clock(200);
        cy.get(`#cards li`).eq(cardIndex).should("have.class", "close");
        cy.get(`#cards li`).eq(0).should("have.class", "close");
        return;
      } else {
        checkCardClosing(cardIndex + 2, length);
      }
    });
  }

  function checkCardOpening(cardIndex, length) {
    if (cardIndex > length) return;

    cy.get(`#cards li`)
      .eq(cardIndex)
      .click()
      .invoke("text")
      .as("myElement2text");
    cy.get(`#cards li`).eq(0).click().invoke("text").as("myElement1text");
    cy.then(function () {
      if (this.myElement2text === this.myElement1text) {
        cy.clock(200);
        cy.get(`#cards li`).eq(cardIndex).should("have.class", "open");
        cy.get(`#cards li`).eq(0).should("have.class", "open");
        return;
      } else {
        checkCardOpening(cardIndex + 1, length);
      }
    });
  }
});
