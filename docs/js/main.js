let form = document.forms.myForm;
let firstDate = form.elements.firstDate;
let secondDate = form.elements.secondDate;
let error1 = document.getElementById("error1");

let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;
console.log(today);

let dateMin = document.getElementById("dateMin");
let dateMax = document.getElementById("dateMax");
let text = document.getElementById("text");
let result = document.getElementById("result");
const date = [];
Promise.all([
  fetch(
    `https://www.nbrb.by/api/exrates/rates/dynamics/145?&startDate=2016-06-01&endDate=2017-05-31`
  ),
  fetch(
    `https://www.nbrb.by/api/exrates/rates/dynamics/145?&startDate=2017-06-01&endDate=2018-05-31`
  ),
  fetch(
    `https://www.nbrb.by/api/exrates/rates/dynamics/145?&startDate=2018-06-01&endDate=2019-05-31`
  ),
  fetch(
    `https://www.nbrb.by/api/exrates/rates/dynamics/145?&startDate=2019-06-01&endDate=2020-05-30`
  ),
  fetch(
    `https://www.nbrb.by/api/exrates/rates/dynamics/145?&startDate=2020-05-31&endDate=2021-05-29`
  ),
  fetch(
    `https://www.nbrb.by/api/exrates/rates/dynamics/145?&startDate=2021-05-30&endDate=2022-05-29`
  ),
  fetch(
    `https://www.nbrb.by/api/exrates/rates/dynamics/145?&startDate=2022-05-30&endDate=2023-05-29`
  ),
])
  .then((results) =>
    Promise.all([
      results[0].json(),
      results[1].json(),
      results[2].json(),
      results[3].json(),
      results[4].json(),
      results[5].json(),
      results[6].json(),
    ])
  )
  .then((Date) => {
    localStorage.setItem("arr", JSON.stringify(Date));
  });
arrayUsd = JSON.parse(localStorage.getItem("arr"));
arrayInfo = arrayUsd.flat();

console.log(arrayInfo);
start = Date.parse("2016-06-01");
end = Date.parse(today);
console.log(start);
console.log(end);
for (let i = start; i <= end; i = i + 24 * 60 * 60 * 1000) {
  date.push(new Date(i).toISOString().substr(0, 10));
}
console.log(date);

console.log(arrayInfo.length);
for (let i = 0; i < arrayInfo.length; i++) {
  arrayInfo[i].date = date[i];

  arrayInfo[i].usd = arrayInfo[i].Cur_OfficialRate;
  delete arrayInfo[i].Cur_ID;
  delete arrayInfo[i].Cur_OfficialRate;
  delete arrayInfo[i].Date;
}
localStorage.clear();
myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (firstDate.value < secondDate.value === false) {
    error1.innerHTML =
      "Пожалуйста, введите корректную дату. Левая дата должна быть меньше правой.";
  } else if (firstDate.value < secondDate.value === true) {
    error1.innerHTML = "";
  }

  if (firstDate.value < secondDate.value === false) {
    error1.innerHTML =
      "Пожалуйста, введите корректную дату. Левая дата должна быть меньше правой.";
  } else if (firstDate.value < secondDate.value === true) {
    // удаляем индикатор ошибки, т.к. пользователь хочет ввести данные заново
    error1.innerHTML = "";
  }

  if (
    firstDate.value &&
    secondDate.value &&
    firstDate.value < secondDate.value === true
  ) {
    console.log(firstDate.value);
    console.log(secondDate.value);
    let dateValue = [];
    start = Date.parse(firstDate.value);
    end = Date.parse(secondDate.value);

    for (let i = start; i <= end; i = i + 24 * 60 * 60 * 1000) {
      dateValue.push(new Date(i).toISOString().substr(0, 10));
    }
    console.log(dateValue);
    let someUsers = [];
    for (let i = 0; i < dateValue.length; i++) {
      someUsers[i] = arrayInfo.filter(function (elem) {
        return elem.date === dateValue[i];
      });
    }
    let money = someUsers.flat();
    console.log(money[0].usd);
    let moneyUSD = [];
    for (let i = 0; i < money.length; i++) {
      moneyUSD.push(money[i].usd);
    }
    moneyUSD.sort(function (a, b) {
      return b - a;
    });
    console.log(moneyUSD);
    let max = [];
    for (let i = 0; i < money.length; i++) {
      max = money.filter(function (elem) {
        return elem.usd === moneyUSD[0];
      });
    }
    console.log(max[0].date);
    let min = [];
    for (let i = 0; i < money.length; i++) {
      min = money.filter(function (elem) {
        return elem.usd === moneyUSD[moneyUSD.length - 1];
      });
    }
    dateMax.innerHTML = `${max[0].date}`;
    dateMin.innerHTML = `${min[0].date}`;
    result.innerHTML = `${moneyUSD[0]}`;
    text.innerHTML = `${moneyUSD[moneyUSD.length - 1]}`;
  }
});
secondDate.oninput = function () {
  if (firstDate.value < secondDate.value === false) {
    document.getElementById("error1").innerHTML =
      "Пожалуйста, введите корректную дату. Левая дата должна быть меньше правой.";
  } else {
    document.getElementById("error1").innerHTML = "";
  }
};
firstDate.oninput = function () {
  if (firstDate.value < secondDate.value === false) {
    document.getElementById("error1").innerHTML =
      "Пожалуйста, введите корректную дату. Левая дата должна быть меньше правой.";
  } else {
    document.getElementById("error1").innerHTML = "";
  }
};
