
const EMAIL_API = 'https://mailthis.to/positronicshell@gmail.com';
const TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

const form = document.querySelector('#form');
const formSubmitted = document.querySelector('#form-submitted');
const formSuccessCopy = document.querySelector('#form-submitted-success');
const formButton = document.querySelector('#submit-form');

const hideForm = () => {
  form.classList.add('hidden');
  formSubmitted.classList.remove('hidden');
}

const showSubmittedCopy = () => {
  hideForm();
  formSuccessCopy.classList.remove('hidden');
}

const resetForm = (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  form.reset();
  form.classList.remove('hidden');
  hideSubmittedCopy();
}

const hideSubmittedCopy = () => {
  formSuccessCopy.classList.add('hidden');
  formSubmitted.classList.add('hidden');
  formButton.disabled = false;
}

const submitForm = (e) => {
  e.preventDefault();
  const form = document.querySelector('#form');
  const formData = new FormData(form);

  formButton.disabled = true;

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString()
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Not 2xx response", { cause: res });
    } else {
      showSubmittedCopy();
    }
  }).catch((err) => {
    console.log(err)
    const formErrorCopy = document.querySelector('#form-submitted-error');
    hideForm();
    formErrorCopy.classList.remove('hidden');
  });
}

document
  .querySelector('form')
  .addEventListener('submit', submitForm);
document
  .getElementById('reset-form')
  .addEventListener('click', resetForm);

window.onload = function () {
  var elements = document.getElementsByClassName('typewrite');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-type');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css);
};

