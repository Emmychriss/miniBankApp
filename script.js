'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Nduka Emmanuel',
  movements: [5200, 270, -490, -1000, 650, 830, -70, 1800],
  interestRate: 1.8, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-12-31T23:00:00.000Z',
    '2022-01-05T23:00:00.000Z',
    '2022-01-06T23:00:00.000Z',
    // '2022-01-07T11:57:20.420Z',
    new Date(Date.now()).toISOString(),
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jerimiah Samuel',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Pelumi James',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,
};

const account4 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 4444,
};

const account5 = {
  owner: 'Sarah opeyemi',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

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

// Displays
const createUserInitials = function (accts) {
  accts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(names => names[0])
      .join('');
  });
};
createUserInitials(accounts);

const displayTransactions = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const sortMovs = sort
    ? acc.movements.slice().sort((a, b) => {
        return a - b;
      })
    : acc.movements;

  sortMovs.forEach(function (element, index) {
    const actionType = element > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[index]);

    const movementDates = function (date) {
      const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

      const daysPassed = calcDaysPassed(new Date(), date);
      console.log(daysPassed);

      if (daysPassed === 0) return 'Today';
      if (daysPassed === 1) return 'Yesterday';
      if (daysPassed <= 7) return `${daysPassed} days ago`;
      else {
        return [
          `${date.getDate()}`.padStart(2, 0),
          `${date.getMonth() + 1}`.padStart(2, 0),
          date.getFullYear(),
        ].join('/');
        // displayDates(date);
      }
    };

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${actionType}">${
      index + 1
    } ${actionType}</div>
          <div class="movements__date">${movementDates(date)}</div>
          <div class="movements__value">${element.toFixed(2)}💲</div>
          </div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displaySummary = function (account) {
  const incoming = account.movements
    .filter(element => element > 0)
    .reduce((accumulator, element, index, arr) => accumulator + element, 0);
  labelSumIn.textContent = `${incoming.toFixed(2)}💲`;

  const outgoing = account.movements
    .filter(element => element < 0)
    .reduce((accumulator, element) => accumulator + element, 0);
  labelSumOut.textContent = `${Math.abs(outgoing).toFixed(2)}💲`;

  const interest = account.movements
    .filter(element => element > 0)
    .map(element => (element * account.interestRate) / 100)
    .filter((element, index, arr) => {
      // console.log(arr);
      return element >= 1;
    })
    .reduce((accumulator, element) => accumulator + element, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}💲`;
};

const displayBalance = function (account) {
  account.balance = account.movements.reduce(function (accumulator, element) {
    return accumulator + element;
  }, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}💲`;
};

const updateUI = function (acc) {
  // display balance
  displayBalance(acc);

  // display transaction movements
  displayTransactions(acc);

  // display summary
  displaySummary(acc);
};

// Events handler
let currentAccount;

// // FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = 1;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acct => acct.username === inputLoginUsername.value // find account object that match user input
  );
  console.log(currentAccount);

  if (currentAccount?.pin === parseInt(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // current date and time display
    const today = new Date();
    // console.log(today)
    const welcomeDate = function (today) {
      const dateArr = [
        `${today.getDate()}`.padStart(2, 0),
        `${today.getMonth() + 1}`.padStart(2, 0),
        today.getFullYear(),
      ];
      const todayDate = dateArr.join('/');
      labelDate.textContent =
        `${todayDate},` +
        `${today.getHours()}:`.padStart(3, 0) +
        `${today.getMinutes()}`.padStart(2, 0);
    };
    welcomeDate(today);

    // clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // updating the UI with the current account movements
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAmount = parseInt(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  console.log(transferAmount);
  console.log(receiver);

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    receiver &&
    currentAccount.username !== receiver?.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-transferAmount); // debiting current userm movements  array
    receiver.movements.push(transferAmount); // crediting receiver

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());

    // updating the UI with the current account movements and movement dates
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

    // add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // update the UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount?.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
});

let sortState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransactions(currentAccount.movements, !sortState);
  sortState = !sortState;
});

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES ON ARRAYS

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

// // let arr = ['a', 'b', 'c', 'd', 'e'];
// // console.log(arr.slice(2));
// // console.log(arr.slice(2, arr.length - 1));
// // console.log(arr.slice(-2));
// // console.log(arr.slice(1, -2));
// // console.log(arr.slice());
// // console.log([...arr]);

// // // splice method
// // // console.log(arr.splice(2));
// // arr.splice(-1);
// // console.log(arr);

// // arr = ['a', 'b', 'c', 'd', 'e'];
// // const arr2 = ['j', 'i', 'h', 'g', 'f'];
// // console.log(arr2.reverse());
// // console.log(arr2);

// // const letters = arr.concat(arr2);
// // console.log(letters);

// // // join method
// // console.log(letters.join('-'));

// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const [index, movement] of movements.entries()) {
// //   if (movement > 0) {
// //     console.log(`${index + 1}: You deposited ${movement}`);
// //   } else {
// //     console.log(`${index + 1}: You withdrew ${Math.abs(movement)}`);
// //   }
// // }

// // // for each loop on array
// // console.log('--- FOR EACH method ---');

// // movements.forEach(function (element, index, arr) {
// //   if (element > 0) {
// //     console.log(
// //       `Detail ${
// //         index + 1
// //       }: You deposited the the sum of #${element} to the bank`
// //     );
// //   } else if (element < 0) {
// //     console.log(
// //       `Detail ${index + 1}: You withdrew the sum of #${Math.abs(
// //         element
// //       )} from the ATM stand just now`
// //     );
// //   } else console.log(`Unknown processing`);
// // });

// // // using the for each loop on maps
// // const currencies = new Map([
// //   ['USD', 'United States dollar'],
// //   ['EUR', 'Euro'],
// //   ['GBP', 'Pound sterling'],
// // ]);

// // console.log(`--- Testing map instance ---`);
// // currencies.forEach(function (value, key, map) {
// //   console.log(`${key}: ${value}`);
// // });

// // const currenciesUnique = new Set([
// //   'naira',
// //   'naira',
// //   'dollar',
// //   'cedi',
// //   'pounds',
// //   'pounds sterling',
// //   'pounds sterling',
// //   'canadian dollar',
// //   'canadian dollar',
// // ]);

// // console.log('-- Testing set instance --');
// // currenciesUnique.forEach(function (element, key, set) {
// //   console.log(`${key}: ${element}`);
// // });

// // coding challenge 1
// // const juliaDogAges1 = [3, 5, 2, 5, 7];
// // const KateDogAges1 = [4, 1, 15, 8, 3];

// // const juliaDogAges2 = [9, 16, 6, 8, 3];
// // const kateDogAges2 = [10, 5, 6, 1, 4];

// // const checkDogs = function (juliaDogs, KateDogs) {
// //   const copyJuliaDOgs = [...juliaDogs];
// //   const dogsCombined = [...copyJuliaDOgs.slice(1, -2), ...KateDogs];

// //   dogsCombined.forEach(function (dogAge, index, dogsArr) {
// //     const isAdult_OrPuppy = dogAge >= 3 ? 'an adult' : 'a puppy';
// //     console.log(
// //       `Dog number ${index + 1} is ${isAdult_OrPuppy} and is ${dogAge} years old`
// //     );
// //   });
// // };
// // checkDogs(juliaDogAges1, KateDogAges1);
// // console.log('---TEST DATA 2---');
// // checkDogs(juliaDogAges2, kateDogAges2);

// // using the map method on arrays
// // const euroToDollar = 1.1;

// // const movementUSD = movements.map(function (movement) {
// //   return movement * euroToDollar;
// // });

// const euroToDollar = 1.1;

// const movementUSD = movements.map(movement => movement * euroToDollar);

// console.log(movements);
// console.log(movementUSD);

// let newArr = [];
// for (const movement of movements) {
//   newArr.push(movement * euroToDollar);
// }
// console.log(newArr);

// const newMovements = movements.map((movement, index) => {
//   const state = movement > 0 ? `deposited` : 'withdrew';
//   return `${index + 1}: Hello user, you ${state} ${Math.abs(movement)}`;
// });
// console.log(newMovements);

// // using the filter method on arrays
// const deposits = movements.filter(function (movement) {
//   return movement > 0;
// });
// console.log(movements);
// console.log(deposits);

// console.log('-- Testing withdrawals --');
// const withdrawals = movements.filter(movement => movement < 0);
// console.log(movements);
// console.log(withdrawals);

// // The reduce method on arrays
// const totalMovementBalance = movements.reduce(
//   (accumulator, element, index, array) => accumulator + element,
//   0 // initializing the accumulator variable to start from 0
// );
// console.log(`The total sum of transaction amounts is ${totalMovementBalance}`);

// // Getting max array element value with the reduce method
// const maxValue = movements.reduce((accumulator, element) => {
//   if (accumulator > element) {
//     return accumulator;
//   } else return element;
// }, movements[0]);

// console.log(
//   `The highest element from the list of array elements you entered is ${maxValue}`
// );

// // coding challenge 2
// const TestData1 = [5, 2, 4, 1, 15, 8, 3];
// const TestData2 = [16, 6, 10, 5, 6, 1, 4];

// // const calcAvgHumanAge = function (ages) {
// //   const agesConverted = ages.map(function (age, index) {
// //     if (age <= 2) {
// //       return (age = 2 * age); // satisfying the given challenge logic
// //     } else if (age > 2) {
// //       return (age = 16 + age * 4);
// //     }
// //   });
// //   console.log(agesConverted);

// //   const above18 = agesConverted.filter(function (element, index, arr) {
// //     return element >= 18;
// //   });
// //   console.log(above18);

// //   const averageAgeAdult = above18.reduce(function (
// //     accumulator,
// //     element,
// //     index,
// //     arr
// //   ) {
// //     // return accumulator + element / arr.length
// //     return accumulator + element / above18.length;
// //   },
// //   0);

// //   console.log(averageAgeAdult);
// // };

// // calcAvgHumanAge(TestData1);

// console.log('--- For test data 2 !---');
// // calcAvgHumanAge(TestData2);

// // const euroToDollar = 1.1;
// const totalDepositUSD = movements
//   .filter(element => element > 0)
//   .map(element => element * euroToDollar)
//   .reduce((accumulator, element) => accumulator + element, 0);
// console.log(totalDepositUSD);

// // coding challenge 3
// const calcAvgHumanAge2 = function (dogAges) {
//   const dogoOutput = dogAges
//     .map(age => {
//       age = age <= 2 ? 2 * age : 16 + age * 4;
//       return age;
//     })
//     .filter((ages, index, arr) => {
//       return ages >= 18;
//     })
//     .reduce(
//       (accumulator, element, index, arr) => accumulator + element / arr.length,
//       0
//     );
//   console.log(dogoOutput);
// };
// calcAvgHumanAge2(TestData1);
// calcAvgHumanAge2(TestData2);

// // The find method
// const firstWithdrawal = movements.find(movement => movement < 0);
// console.log(firstWithdrawal);

// // const account = accounts.find(acc => acc.owner.includes('Jonas Schmedtmann'));
// // console.log(account);

// const arr = [[1, 2, 3, 4], [5, 4, 3, 2], 8, 9, 10];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3, 4], [5, 4, [3, 2]], 8, 9, 10];
// console.log(arrDeep.flat());

// // flat method
// const allAccountMovements = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(allAccountMovements);

// // flat map method
// const allAccountMovements2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(allAccountMovements2);

// // sorting strings
// const owners = ['emmanuel', 'jonas', 'martha', 'adam'];
// console.log(owners.sort());
// console.log(owners);

// // sorting numbers
// console.log('sorting numbers in an array');
// console.log(movements);

// // return < 0  --- a before b
// // return > 0  --- b before a

// // sorting in ascending order ie from smallest biggest
// // movements.sort((a, b) => {
// //   if (a > b)   return 1
// //   if (b > a)  return -1
// // })

// movements.sort((a, b) => {
//   return a - b;
// });
// console.log(movements);

// // sorting array elements in descending order from biggest to smallest
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (b > a) return 1;
// // });

// movements.sort((a, b) => {
//   return b - a;
// });
// console.log(movements);

// // filling arrays
// // empty arrays + fill method
// console.log('lectures on filling arrays');
// const ar = [1, 2, 3, 4, 5, 6, 7];
// console.log([2, 3, 4, 5, 6, 7, 8]);
// console.log(new Array(2, 3, 4, 1, 1, 1, 1, 1, 1));

// const x = new Array(7);
// console.log(x);
// console.log(x.fill(1));
// console.log(x.fill(2.5, 2, 6));

// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// console.log(Array.from({ length: 7 }, (cur, i) => i + 1));

// const randomRolls = Array.from(
//   { length: 100 },
//   (curr = Math.trunc(Math.random() * 6 + 1), _) => {
//     return curr;
//   }
// ); // Array.from method to generate 100 random dice rolls
// console.log(randomRolls);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     (ele, index) => {
//       return Number(ele.textContent.replace('💲', ''));
//     }
//   );
//   console.log(movementsUI);

//   // console.log(movementsUI.map());
// });

// CODING CHALLENGE 4
// 1.
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['matilda'] },
  { weight: 13, curFood: 275, owners: ['sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
  // { weight: 32, curFood: 376, owners: ['Sam'] },
];
console.log(dogs);

dogs.forEach((ele, i) => {
  ele.recommendedFood = Math.trunc(ele.weight ** 0.75 * 28);
});

//2.

const dogSarah = dogs.find(ele => ele.owners.includes('sarah'));
console.log(dogSarah);
if (dogSarah.curFood > dogSarah.recommendedFood) {
  console.log(
    `${dogSarah.owners[0]}'s dog eats too much because the current food is more than the recommended food`
  );
}

//3.

// const ownersEatTooMuch = Array.from(dogs, dogs => {
//   if (dogs.curFood > dogs.recommendedFood) {
//     return dogs.owners;
//   }
// });

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(ele => ele.owners);
console.log(ownersEatTooMuch);

// const ownersEatTooLittle = Array.from(dogs, dogs => {
//   if (dogs.curFood < dogs.recommendedFood) {
//     return dogs.owners;
//   }
// });

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(ele => ele.owners);
console.log(ownersEatTooLittle);

//4.
const arrState = undefined;
const reportEatTooLittle = function (arr) {
  const arrFlat = arr.flat();
  const [a, b, , , c] = arrFlat;

  console.log(`${a}, ${b} and ${c}'s dogs eats too little`);
};

const reportEatTooMuch = function (arr) {
  const arrFlat = arr.flat();
  console.log(arrFlat);
  const [, a, b, c] = arrFlat;
  console.log(`${a}, ${b} and ${c}'s dogs eats too much`);
};

reportEatTooLittle(ownersEatTooLittle);
reportEatTooMuch(ownersEatTooMuch);

//5.
// const dogEatExact = dogs.find(ele => ele.curFood === ele.recommendedFood);

// const dogEatExact = dogs.forEach(ele => {
//   if (Number(ele.curFood) === Number(ele.recommendedFood)) {
//     return;
//   }
// });
// console.log(dogs);
// console.log(dogEatExact);

// const eatExact = function (bigArr) {
//   bigArr.forEach(ele => {
//     if (ele.curFood === ele.recommendedFood) {
//       return true;
//     } else return false;
//   });
// };
// eatExact(dogs);

// const eatExact = dogs.filter( (dog)=> Number(dogs.curFood) === Number(dogs.recommendedFood) ).map( (ele)=> ele.owners )
// console.log(eatExact)

// const isExact = eatExact.length > 0
// const notExact = !isExact

// if (isExact){
//   console.log(`${eatExact}'s dog eats exactly the same amount of food as recommended`)
// }  else if (notExact) {
//   console.log(`No dog eats exactly the same amount of food as recommended`)
// }

const eatExact = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(eatExact);

// 6.
const okayAmount = dogs =>
  dogs.curFood > 0.9 * dogs.recommendedFood &&
  dogs.curFood < 1.1 * dogs.recommendedFood;

console.log(dogs.some(okayAmount));

//7.
// const arrOkay = Array.from(dogs, ele => {
//   return (
//     ele.curFood > 0.9 * ele.recommendedFood &&
//     ele.curFood < 1.1 * ele.recommendedFood
//   );
// });
// console.log(arrOkay);

const arrOkay = dogs.filter(okayAmount);
console.log(arrOkay);

//8.
// const shallowDogs = dogs.slice(0); // shallow copy of array
const shallowDogs = [...dogs]; // shallow copy of array
console.log(shallowDogs);

console.log(
  shallowDogs.sort(
    (a, b) => a.recommendedFood - b.recommendedFood // condition to sort array in ascending order
  )
);

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES ON DATES AND TIMERS

console.log(23 === 23.0);
// parsing and converting strings to numbers
console.log(Number.parseFloat('2.333fex '));
console.log(Number.parseInt('24ggg'));

// checking if a number is finite or not
console.log(Number.isFinite(+'45'));
console.log(Number.isFinite('23'));
console.log(Number.isFinite(67 / 0));

console.log(Math.sqrt(49));
console.log(25 ** (1 / 2)); // using  ** as exponential to get square root of n
console.log(8 ** (1 / 3)); // get cube root of n with expo. **

console.log(Math.max(23, 34, 45, 56));
console.log(Math.max(23, '74', 45, 56));
console.log(Math.max(23, '74px', 45, 56));

console.log(Math.min(34, 55));
// const radius = prompt ("Enter the radius of the circle: ")
console.log(Math.PI * Number.parseFloat(12) ** 2);

// random integers between 2 specified numbers
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1 + min);
console.log(randomInt(12, 15));

// rounding integers
console.log(Math.round(28.9));
console.log(Math.round(28.3));

console.log(Math.ceil(22.3));
console.log(Math.ceil(22.6));

console.log(Math.floor(28.3));
console.log(Math.floor(28.6));

console.log(Math.trunc(50.8));

console.log(Math.trunc(-28.3));
console.log(Math.floor(-28.3));

// rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log(+(2.00395).toFixed(4));

// The remainder operator (modulus)
console.log(5 % 2);
console.log(+(5 / 2).toFixed());

console.log(6 % 2);

const isEven = num => {
  const state = num % 2 === 0 ? 'is an even' : 'is an odd';
  console.log(`${num} ${state} number`);
};
isEven(25569);

labelBalance.addEventListener('click', function () {
  Array.from(document.querySelectorAll('.movements__row')).forEach(
    (row, index) => {
      if (index % 2 === 0) {
        row.style.backgroundColor = 'brown';
      }
      if (index % 3 === 0) {
        row.style.backgroundColor = 'grey';
      }
    }
  );
});

// integers in JS is rep. in 64 bits, where only 53 bits are used for storing the numbers
console.log(2 ** 53 - 1); // biggest javascript number
console.log(Number.MAX_SAFE_INTEGER);

console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(37463267445582575926559020n);
console.log(BigInt(4674888));

console.log(5000n + 6000n);
console.log(57503047892817446464663295632527374375n * 35755n);

// using BigInt and norrmal numbers together
const num = 50;
const large = 48447347602465235659536597450n;
console.log(large / BigInt(num)); // converting num to BigInt

// Dates and time
/*
const now = new Date()
console.log(now)

console.log(new Date ("2021 april 11 :01:07:50"))
console.log(new Date("2021-4-11"))
console.log(new Date("11, April, 2021 "))
console.log(new Date (account1.movementsDates[0]))

console.log(new Date(2021, 9, 16, 3, 59, 59) ) 
console.log(new Date(2021, 11, 31))

console.log(new Date(0))
console.log(new Date (5 *24*60*60*1000))
*/

// working with dates
const future = new Date(2029, 8, 1, 2, 1, 5);
console.log(future);
const anotherYear = new Date('28, december 2042');
const myBirthDay2023 = new Date('2023-12-28');

console.log(anotherYear);
console.log(anotherYear.getFullYear());
console.log(anotherYear.getMonth());
console.log(myBirthDay2023.getDate()); // date in the month
console.log(myBirthDay2023.getDay()); // day of the week
console.log(myBirthDay2023.getHours());
console.log(myBirthDay2023.getMinutes());
console.log(future.getSeconds());

console.log(future.toISOString());
console.log(anotherYear.toISOString());
console.log(myBirthDay2023.toISOString());

console.log(future.getTime()); // get exact number of milliseconds since 1-1-1970
console.log(new Date(1882918865000));

console.log(Date.now());
console.log(new Date(1641470511831));

anotherYear.setFullYear(2099);
console.log(anotherYear);

const future2 = new Date(2025, 4, 30);
console.log(future2.getTime());
// console.log(+future2)

// const days1 = calcDaysPassed(Date.now(), new Date(2021, 11, 28));
// console.log(days1);
// const days2 = calcDaysPassed(new Date(2022, 0, 3), new Date(2022, 0, 7));
// console.log(days2);
