let storage = {
  pare: [],
  matches: 0,
  push: function (card) {
    if (this.pare.length < 2) {
      this.pare.push(card);

      // Если пара совпала
      if (this.checkPare(this.pare[0], this.pare[1])) {
        this.clear();
        this.pare = [];

        // Создание кнопки перезапуска и остановка таймера при открытии всех пар
        if (++this.matches >= this.matchesLimit) {
          timer.stop();
          createRestartBtn();
          this.matches = 0;
          this.pare = [];
        }
      }
      return;
    }

    // Если пара не совпала
    closeCard(this.pare[0]);
    closeCard(this.pare[1]);
    this.clear();
    this.push(card);
  },

  clear: function () {
    this.pare = [];
    return;
  },

  checkPare: function (cardFirst, cardSecond) {
    if (cardFirst === undefined || cardSecond === undefined) {
      return false;
    }
    return cardFirst.value === cardSecond.value;
  },
};

let timer = {
  settime: 60,

  start: function () {
    this.intervalID = setInterval(this.clock, 1000);
    this.time = this.settime;
  },

  clock: function () {
    timer.time--;
    document.getElementById("seconds").innerHTML = timer.time + " c";
    if (timer.time <= 0) {
      timer.stop();
    }
  },

  stop: function () {
    clearInterval(this.intervalID);
    if (this.time <= 0) {
      setTimeout(() => {
        if (confirm("Вы не успели. Начать заново?")) {
          document.getElementById("seconds").innerHTML = "Время вышло";
          restartGame();
        }
      }, 100);
    }
    this.time = this.settime;
  },
};

function restartGame() {
  //Удаление игрового поля и добавление формы создания поля
  let field = document.getElementById("field");
  let form = createForm();
  let gamefield = document.getElementById("gamefield");
  gamefield.append(form);
  field.remove();
}

function createRestartBtn() {
  let restartBtn = document.createElement("button");
  restartBtn.innerHTML = "Играть еще раз";
  restartBtn.type = "button";
  restartBtn.id = "restart";
  function restarBtnAction() {
    let restartBtn = document.getElementById("restart");
    restartBtn.remove();
    restartGame();
  }
  restartBtn.addEventListener("click", restarBtnAction);
  document.getElementById("gamefield").append(restartBtn);
}

function createGame(x, y) {
  // создание элементов
  let field = document.createElement("ul");

  let timeRemain = document.createElement("div");
  timeRemain.id = "timeRemain";

  let remain = document.createElement("h3");
  remain.innerHTML = "Оставшееся время:";
  remain.id = "remain";

  let seconds = document.createElement("h3");
  seconds.id = "seconds";
  seconds.innerHTML = "60 c";

  let cards = document.createElement("div");

  // установка разной ширины блока при разных значениях Х
  cards.style = "max-width: " + (x * 100 + 40) + "px !important";

  cards.id = "cards";

  timeRemain.append(remain);
  timeRemain.append(seconds);

  field.append(timeRemain);
  field.append(cards);

  field.classList.add("field");

  field.id = "field";
  // создание набора кард
  (function () {
    let set = [];

    for (let index = 0; index < (x * y) / 2; index++) {
      set.push(index + 1, index + 1);
    }
    storage.matchesLimit = set.length / 2;
    // перемешивание набора кард
    set = (function () {
      let temp = [];
      while (set.length > 0) {
        const rand = Math.floor((Math.random() * 100) % set.length);
        temp.push(set[rand]);
        set.splice(rand, 1);
      }
      set = temp;
      return set;
    })();

    for (const i of set) {
      let card = document.createElement("li");
      card.value = i;
      card.classList.add("card");
      card.classList.add("close");

      card.textContainer = document.createElement("p");

      card.addEventListener("click", openCard);
      card.append(card.textContainer);
      cards.append(card);
    }
  })();

  document.getElementById("gamefield").append(field);
  timer.start();
}

function openCard() {
  this.classList.remove("close");
  this.classList.add("open");
  this.textContainer.innerHTML = this.value;
  this.removeEventListener("click", openCard);
  storage.push(this);
}

function closeCard(card) {
  card.classList.remove("open");
  card.classList.add("close");
  card.textContainer.innerHTML = "";
  card.addEventListener("click", openCard);
}

function createGamePage() {
  const gamefield = document.createElement("div");
  gamefield.id = "gamefield";

  const header = document.createElement("h1");
  header.id = "header";
  header.innerHTML = "Игра в пары";
  gamefield.append(header);

  const form = createForm();
  gamefield.append(form);

  document.body.append(gamefield);
}

function createForm() {
  // создание элементов
  let fieldForm = document.createElement("form");
  let xAxisForm = document.createElement("input");
  let yAxisForm = document.createElement("input");
  let confirmBtn = document.createElement("button");

  // настройка элементов
  // Форма
  fieldForm.addEventListener("submit", (e) => {
    e.preventDefault();
    confirmForm();
  });
  fieldForm.id = "form";

  // Кнопка Принять
  confirmBtn.innerHTML = "Начать игру";
  confirmBtn.type = "submit";
  confirmBtn.id = "btn";
  // Х-ось
  xAxisForm.type = "number";
  xAxisForm.name = "x";
  xAxisForm.placeholder = "Карт по горизонтали";
  xAxisForm.required = "true";
  xAxisForm.classList.add("input");
  // У-ось
  yAxisForm.type = "number";
  yAxisForm.name = "y";
  yAxisForm.placeholder = "Карт по вертикали";
  yAxisForm.required = "true";
  yAxisForm.classList.add("input");

  fieldForm.append(xAxisForm);
  fieldForm.append(yAxisForm);
  fieldForm.append(confirmBtn);

  function confirmForm() {
    let x;
    let y;

    xAxisForm.value <= 10 && isEval(xAxisForm.value)
      ? (x = xAxisForm.value)
      : (x = 4);
    yAxisForm.value <= 10 && isEval(yAxisForm.value)
      ? (y = yAxisForm.value)
      : (y = 4);

    function isEval(number) {
      return number % 2 === 0;
    }

    createGame(x, y);
    let form = document.getElementById("form");
    form.remove();
  }
  return fieldForm;
}

document.addEventListener("DOMContentLoaded", createGamePage());
