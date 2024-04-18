'use strict';

// Data
const account1 = {
  owner: 'Salma Yasser',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 6232,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-02-01T10:17:24.185Z',
    '2024-02-08T14:11:59.604Z',
    '2024-04-14T17:01:17.194Z',
    '2024-04-16T21:55:17.929Z',
    '2024-04-17T00:00:17.929Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Mohamed Afifi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 6232,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-01-05T16:33:06.386Z',
    '2024-02-10T14:43:26.374Z',
    '2024-04-10T11:49:59.371Z',
    '2024-04-16T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // displaying timestamps
  const daysPassed = calcDaysPassed(new Date(), date);
  const hour = `${date.getHours()}`.padStart(2, 0);
  const mins = `${date.getMinutes()}`.padStart(2, 0);
  if (new Date().getDate() === date.getDate())
    return `today at ${hour}:${mins}`;
  if (new Date().getDate() - date.getDate() === 1)
    return `yesterday at ${hour}:${mins}`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = `${date.getFullYear()}`.padStart(2, 0);

    // return `${day}/${month}/${year}`;
    return Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  //using INTL api to format currency
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const startLogoutTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // in each call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // when 0 logout
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    //decrease time by 1
    time--;
  };
  //set time to 5 mins
  let time = 120;

  //call tme every sec
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

////displaying movements cards //not sorted by default
// function displayMovements(acc, sort = false) {
//   //empty HTML
//   containerMovements.innerHTML = '';

//   //sorting if sort = true ,,,default sort if sort=false
//   const movs = sort
//     ? acc.movements.slice().sort((a, b) => a - b)
//     : acc.movements;

//   //looping function to add values of an array as an HTML
//   movs.forEach((mov, i) => {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';
//     const date = new Date(acc.movementsDates[i]);

//     const displayDate = formatMovementDate(date);

//     const html = `
//     <div class="movements__row">
//           <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//           <div class="movements__date">${displayDate}</div>
//           <div class="movements__value">${mov.toFixed(2)} E£</div>
//     </div>
//     `;

//     //inserting HTML txt (beforestart,afterstart,beforeend,afterend)
//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// }
//////////////////////

// display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //creating an array of arrays [[valueMov1, dateMov1], [valueMov2, dateMov2]...]
  const movementsAndDates = [];
  acc.movements.forEach(function (mov, i) {
    movementsAndDates.push([mov, acc.movementsDates[i]]);
  });

  //sorting and array of arrays by index[0] - mov amount
  const sortMovementsAndDates = sort
    ? movementsAndDates.slice().sort((a, b) => a[0] - b[0])
    : movementsAndDates;

  sortMovementsAndDates.forEach(function (mov, i) {
    //mov is now an array of [value, date], so value is mov[0]
    const movType = mov[0] > 0 ? 'deposit' : 'withdrawal';
    //date is mov[1] of each line
    const movDate = new Date(mov[1]);

    const displayDate = formatMovementDate(movDate, acc.locale);

    const formattedMov = formatCur(mov[0], acc.locale, acc.currency);

    //movements__value is now mov[0] (see above)
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${movType}">${
      i + 1
    }: ${movType}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
////////////////////
//display summary
function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

//displaying balance
function calcDisplayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}

//getting a username for each account
function createUsernames(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
createUsernames(accounts);

//implementing login form
let currentAccount, timer;

//fake always logged in
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = 1;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    //display ui and wlc msg
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Wrong Credentials';
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
  //create current date
  const now = new Date();
  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const minute = `${now.getMinutes()}`.padStart(2, 0);
  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };
  // const locale = navigator.language;

  labelDate.textContent = `${new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now)} `;

  if (timer) clearInterval(timer);
  timer = startLogoutTimer();

  //update UI
  updateUI(currentAccount);

  //clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

//update display
function updateUI(currentAccount) {
  //display movements
  displayMovements(currentAccount);

  //display balance
  calcDisplayBalance(currentAccount);

  //display summary
  calcDisplaySummary(currentAccount);
}

//implementing transfer money form
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    // sets dates for sender and receiver
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());

    //update UI
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    startLogoutTimer();
  }
  //clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

//request a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);

  //if any movement >= 10% of the loan amount
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      //add movement
      currentAccount.movements.push(amount);
      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString()); //set loan date

      updateUI(currentAccount);
    }, 5000);
    //reset timer
    clearInterval(timer);
    startLogoutTimer();
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//////////////////// sorting/////////////////////////////////// watch again
let sorted = false;
//sorting on click
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  btnSort.textContent = `${sorted ? 'sorted' : '↓ SORT'}`;
});

////////////////////////////////////////////////////////////////////

//close an account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  //check for credentials
  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount &&
    +inputClosePin.value === currentAccount.pin
  ) {
    //get the index of the current account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //delete current account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';

    //reset timer
    clearInterval(timer);
  }
  //clear input fields

  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

// logout timer

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

// const juliaDogs = [3, 5, 2, 12, 7];
// const kateDogs = [4, 1, 15, 8, 3];

// function checkDogs(dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice(1, -2);

//   console.log('julia');
//   dogsJuliaCorrected.forEach((dog, i) => {
//     const type = dog >= 3 ? 'adult' : 'puppy';
//     console.log(`dog + ${i + 1} is an ${type} and is ${dog} years old`);
//   });
//   console.log('kate');
//   dogsKate.forEach((dog, i) => {
//     const type = dog >= 3 ? 'adult' : 'puppy';
//     console.log(`dog + ${i + 1} is an ${type} and is ${dog} years old`);
//   });
// }

// checkDogs(juliaDogs, kateDogs);
///////////////

// const eurToUsd = 1.1;

// const movementsUsd = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUsd);

// const movementsUsd2 = [];
// for (const mov of movements) {
//   movementsUsd2.push(mov * eurToUsd);
// }
// console.log(movementsUsd2);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(deposits);

// const movs = [];
// for (const mov of movements) {
//   mov > 0 ? movs.push(mov) : '';
// }
// console.log(movs);

// const balance = movements.reduce((acc, mov) => acc + mov);
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) {
//   balance2 = balance2 += mov;
// }
// console.log(balance2);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// let max = movements.reduce(function (acu, mov) {
//   if (acu > mov) {
//     return acu;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);
/////////////////////////////////
// const juliaDogs = [3, 5, 2, 12, 7];
// const kateDogs = [4, 1, 15, 8, 3];

// function checkDogs(dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice(1, -2);
//   const dogs = [...dogsJuliaCorrected, ...dogsKate];
//   dogs.forEach((dog, i) => {
//     const type = dog >= 3 ? 'adult' : 'puppy';
//     console.log(`dog + ${i + 1} is an ${type} and is ${dog} years old`);
//   });
// }
// checkDogs(juliaDogs, kateDogs);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// const toUsd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(toUsd);

// const calcAverageHumanAge = dogs => {
//   const avg = dogs
//     .map(dog => (dog <= 2 ? dog * 2 : 16 + dog * 4))
//     .filter(age => age >= 18)
//     .reduce((acu, age, i, arr) => acu + age / arr.length, 0);
//   console.log(avg);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const find = movements.find(mov => mov < 0);
// console.log(find);

// const account = accounts.find(acc => (acc.owner = 'jessica Davis'));

// console.log(account);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

// console.log(movements.includes(-130)); //check for equality

// const some = movements.some(mov => mov >= 3000); //check for some values with conditions
// console.log(some);

// const every = movements.every(mov => mov > -2000); //check for all values with conditions
// console.log(every);

// const neww = movements.filter(mov => mov > 0); //check for all values with conditions into a new array
// console.log(neww);
///////////////////////////////////

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountsMovements = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov);

// const accountsMovements2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov);

// console.log(accountsMovements);
// console.log(accountsMovements2);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements.sort((a, b) => a - b)); //ascending
// console.log(movements.sort((a, b) => b - a)); //descending

// const names = ['mohamed', 'ahmed', 'mostafa', 'abbas', 'sayed'];
// names.sort((a, b) => (a > b ? -1 : 1)); //descending
// console.log(names);
// names.sort((a, b) => (a > b ? 1 : -1)); //ascending
// console.log(names);

// const x = new Array(7).fill(1).fill(23, 3, 5);
// console.log(x);

// const randomArr = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.trunc(Math.random() * 6) + 1)
// );
// console.log(randomArr.join('').split('1'));

// labelBalance.addEventListener('click', function () {

//   //new array using array.from
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => +(el.textContent.replace('E£', ''))
//   );
//   console.log(movementsUI);

//   // new array using spread+map
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')].map(
//     el => +(el.textContent.replace('E£', ''))
//   );
//   console.log(movementsUI2);
// });
////////////////////////////////////

// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acu, cur) => acu + cur, 0);
// console.log(bankDepositSum);

// //using reduce NOTE (count++ returns the old value before increasing but ++count returns new value after increasing)
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);
// //using length
// const num2Deposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// console.log(numDeposits1000);
// console.log(num2Deposits1000);

// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// function convertTitleCase(title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');

//   return capitalize(titleCase);
// }

// console.log(convertTitleCase('tHis is a nice title'));
// console.log(convertTitleCase('and tHis is a nice title'));

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// //1
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);

// //2
// function findEatingPattern(arr, owner) {
//   const targeted = arr.find(dog => dog.owners.includes(owner));
//   console.log(
//     `${targeted.owners[targeted.owners.indexOf(owner)]}'s dog is eating too ${
//       targeted.curFood < targeted.recFood ? 'little' : 'much'
//     }`
//   );
// }

// findEatingPattern(dogs, 'Sarah');

// //3
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);

// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);

// console.log(ownersEatTooLittle);

// //4
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs are eating too much`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs are eating too little`);

// //5
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// //6
// console.log(
//   dogs.some(
//     dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
//   )
// );

// //7
// const eatingOkay = dogs.filter(
//   dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
// );
// console.log(eatingOkay);

// //8
// const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(dogsSorted);

// console.log(23 === 23.0);
// console.log(0.1 + 0.2);

// //conversion
// console.log(Number('23'));
// console.log(+'23');

// //parsing
// console.log(Number.parseInt('30px'));
// console.log(Number.parseInt('e23'));
// console.log(Number.parseInt('2.5rem'));
// console.log(Number.parseFloat('2.5rem'));

// //checking if a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20'));
// console.log(Number.isFinite(+'20xs'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(5));
// console.log(Number.isInteger(5.0));
// console.log(Number.isInteger(23 / 0));

// console.log(Math.sqrt(25)); //square root
// console.log(25 ** (1 / 2)); //square root
// console.log(8 ** (1 / 3)); //cubic root

// console.log(Math.max(5, '18', 10, 14, 1)); //find max number
// console.log(Math.max(5, '18px', 10, 14, 1)); //not working
// console.log(Math.min(5, '18', 10, 14, 1)); //find min number

// console.log(Math.PI); //PI value
// console.log(Math.PI * Number.parseFloat('10px') ** 2); //getting a radius of a 10px circle

// //random number function
// const randomNumber = (min, max) =>
//   Math.trunc(Math.random() * (max - min + 1)) + min;

// console.log(randomNumber(10, 12));

// console.log(Math.trunc(23.3)); //ignoring everything after the decimal point
// console.log(Math.round(23.3)); //rounding integers moderately
// console.log(Math.round(23.8)); //rounding integers moderately
// console.log(Math.floor(23.3)); //rounding integers to the floor
// console.log(Math.floor(23.8)); //rounding integers to the floor
// console.log(Math.ceil(23.3)); //rounding integers to the ceiling
// console.log(Math.ceil(23.8)); //rounding integers to the ceiling

// console.log((2.7).toFixed(0));
// console.log((2.76121).toFixed(1)); //rounding decimals
// console.log((2.76121).toFixed(2)); //rounding decimals
// console.log((2.76181).toFixed(3)); //rounding decimals
// console.log(+(2.76181).toFixed(3)); //rounding decimals and converting into number by using (+)

// console.log(54654546541354867313246876454n);
// console.log(BigInt(54654546541354867313246876454));
// console.log(+'76');
// console.log(87);
// console.log('khkh');

// console.log(Date());
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.getMilliseconds());
// console.log(future.getTime());
// console.log(new Date('2019-11-18T21:31:17.178Z').getTime);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(+future);

// const num = 3552121.23;

// const options = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'EGP',
//   useGrouping: true,
// };

// console.log('US:     ', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
// console.log('Serya:  ', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('Egypt:  ', new Intl.NumberFormat('ar-EG', options).format(num));
// console.log(
//   'browser:',
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

// const ingredients = [
//   'olives',
//   'tomato',
//   'olives',
//   'tomato',
//   'tomato',
//   'olives',
//   'tomato',
// ];

// const pizzaTimer = setTimeout(
//   (...arr) =>
//     console.log(
//       `Here is your pizza containing ${
//         arr.slice(0, arr.length - 1).join(', ') + ' and ' + arr.slice(-1)
//       }`
//     ),
//   3000,
//   ...ingredients
// );
// console.log('waiting...');

// if (ingredients.includes('spinach')) {
//   clearTimeout(pizzaTimer);
//   console.log('order is canceled because of the olives');
// }

// setInterval(() => {
//   const now = new Date();
//   const options = {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   };
//   const time = new Intl.DateTimeFormat('ar-EG', options).format(now);
//   console.log(time);
// }, 1000);
