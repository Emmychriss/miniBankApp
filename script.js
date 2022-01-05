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
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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

const displayTransactions = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const sortMovs = sort
    ? movements.slice().sort((a, b) => {
        return a - b;
      })
    : movements;

  sortMovs.forEach(function (element, index) {
    const actionType = element > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${actionType}">${
      index + 1
    } ${actionType}</div>
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
  displayTransactions(acc.movements);

  // display summary
  displaySummary(acc);
};

// Events handler
let currentAccount;

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
    currentAccount.movements.push(-transferAmount); // debiting current userm movements  array
    receiver.movements.push(transferAmount); // crediting receiver

    // updating the UI with the current account movements
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

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
