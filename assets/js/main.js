const brandSwiper = new Swiper('.brands-swiper', {
  autoplay: {
    delay: 2000,
  },
  loop: true,
  slidesPerView: 6,
  spaceBetween: 10,
  breakpoints: {
    360: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    480: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    640: {
      slidesPerView: 6,
      spaceBetween: 40
    }
  },
  pagination: {
    el: '.brands-swiper-pagination',
  },
});

var init = false;
let entriesSwiper = Swiper;

function swiperCard() {
  if (window.innerWidth <= 639) {
    if (!init) {
      init = true;
      entriesSwiper = new Swiper('.entries-swiper', {
        autoplay: {
          delay: 2000,
        },
        breakpoints: {
          480: {
            slidesPerView: 3,
            spaceBetween: 30
          },
        },
        pagination: {
          el: '.entries-swiper-pagination',
        },
      });
    }
  } else if (init) {
    entriesSwiper.destroy();
    init = false;
  }
}
swiperCard();
window.addEventListener("resize", swiperCard);

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
  const fullTxt = this.toRotate[this.loopNum % this.toRotate.length];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  const that = this;
  let delta = 200 - Math.random() * 100;

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
  const elements = document.getElementsByClassName('typewrite');
  for (let i = 0; i < elements.length; i++) {
    const currEl = elements[i];
    const toRotate = currEl.getAttribute('data-type');

    if (toRotate) {
      new TxtType(currEl, JSON.parse(toRotate), currEl.getAttribute('data-period'));
    }
  }
  // INJECT CSS
  const css = document.createElement("style");
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css);
};

