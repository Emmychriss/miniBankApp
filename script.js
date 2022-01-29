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
  currency: 'USD',
  locale: 'en-US',
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
  currency: 'EUR',
  locale: 'pt-PT',
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

const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

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
    // const options = {
    //   day: "numeric",
    //   month: "numeric",
    //   year: "numeric",
    // }

    const movementDates = function (date, locale) {
      const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

      const daysPassed = calcDaysPassed(new Date(), date);
      console.log(daysPassed);

      if (daysPassed === 0) return 'Today';
      if (daysPassed === 1) return 'Yesterday';
      if (daysPassed <= 7) return `${daysPassed} days ago`;
      else {
        return new Intl.DateTimeFormat(locale).format(date);

        // return [
        //   `${date.getDate()}`.padStart(2, 0),
        //   `${date.getMonth() + 1}`.padStart(2, 0),
        //   date.getFullYear(),
        // ].join('/');
      }
    };

    // const options = {
    //   style: 'currency',
    //   currency: acc.currency,
    // };
    // const formattedEle = new Intl.NumberFormat(acc.locale, options).format(
    //   element
    // );

    const formattedEle = formatCurrency(element, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${actionType}">${
      index + 1
    } ${actionType}</div>
          <div class="movements__date">${movementDates(date, acc.locale)}</div>
          <div class="movements__value">${formattedEle}</div>
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
  labelSumIn.textContent = formatCurrency(
    incoming,
    account.locale,
    account.currency
  );
  // `${incoming.toFixed(2)}💲`;

  const outgoing = account.movements
    .filter(element => element < 0)
    .reduce((accumulator, element) => accumulator + element, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(outgoing),
    account.locale,
    account.currency
  );
  // `${Math.abs(outgoing).toFixed(2)}💲`;

  const interest = account.movements
    .filter(element => element > 0)
    .map(element => (element * account.interestRate) / 100)
    .filter((element, index, arr) => {
      // console.log(arr);
      return element >= 1;
    })
    .reduce((accumulator, element) => accumulator + element, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
  // `${interest.toFixed(2)}💲`;
};

const displayBalance = function (account) {
  // console.log(account)
  account.balance = account.movements.reduce(function (accumulator, element) {
    return accumulator + element;
  }, 0);
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );

  // `${account.balance.toFixed(2)}💲`
};

const updateUI = function (acc) {
  // display balance
  displayBalance(acc);

  // display transaction movements
  displayTransactions(acc);

  // display summary
  displaySummary(acc);
};

const startLogoutTimer = function () {
  const tickTime = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, display remaining time in the UI
    labelTimer.textContent = `${min}:${sec}`;

    // stop timer at 00:00 and logout the user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
    }

    // decrease time
    time--;
  };
  // set the time to some number of minutes
  let time = 120;
  tickTime();

  // call the timer every second
  const timer = setInterval(tickTime, 1000);

  return timer;
};

// Events listeners/ handler
let currentAccount, timer;

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
    swal('Good job!', 'You are now logged in!', 'success');
    
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // current date and time display
    const today = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(today);

    // const welcomeDate = function (today) {
    //   const dateArr = [
    //     `${today.getDate()}`.padStart(2, 0),
    //     `${today.getMonth() + 1}`.padStart(2, 0),
    //     today.getFullYear(),
    //   ];
    //   const todayDate = dateArr.join('/');
    //   labelDate.textContent =
    //     `${todayDate},` +
    //     `${today.getHours()}:`.padStart(3, 0) +
    //     `${today.getMinutes()}`.padStart(2, 0);
    // };
    // welcomeDate(today);

    // clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timers
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // updating the UI with the current account transaction values
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
    // confirm for transfer to another account
    if (
      confirm(
        `${
          currentAccount.owner.split(' ')[0]
        }, do you confirm this transfer to ${receiver.owner.split(' ')[0]}?`
      )
    ) {
      // doing the transfer
      setTimeout(function () {
        currentAccount.movements.push(-transferAmount); // debiting current user movements  array
        receiver.movements.push(transferAmount); // crediting receiver

        // add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiver.movementsDates.push(new Date().toISOString());

        // updating the UI with the current account movements and movement dates
        updateUI(currentAccount);
      }, 5000); // transfer only after 5 seconds delay
    }

    // reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  } else if (transferAmount > currentAccount.balance) {
    alert(`Cannot transfer funds more than your account balance`);

    // reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  } else if (transferAmount < 0) {
    alert(`Cannot transfer funds less than 0`);

    // reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  } else if (!receiver) {
    alert(`Cannot place transfer. Enter a valid user with transfer amount`);

    // reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // add movement
      currentAccount.movements.push(amount);

      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update the UI
      updateUI(currentAccount);

      inputLoanAmount.value = '';
    }, 3000);

    // reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  } else if (!amount) {
    alert(`Enter loan amount to proceed`);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount?.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    if (confirm(`Are you sure to close this account?`)) {
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      console.log(index);
      accounts.splice(index, 1);

      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Login to get started`;
    }
  } else if (inputCloseUsername.value !== currentAccount.username) {
    alert(`Account dosen't exist`);
  }
});

let sortState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayTransactions(currentAccount.movements, !sortState);
  sortState = !sortState;
});

// ADDITIONAL APP FEATURES
// adding trasition effect 5seconds on app page load to container app opacity
