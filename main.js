function run(appElement) {
  const $ = (selector, parent = appElement) => parent.querySelector(selector);
  const $$ = (selector, parent = appElement) => parent.querySelectorAll(selector);

  const formElement = $('.form');
  const formButton = $('.button');
  const formCheckbox = $('.form__checkbox');
  const formWrapperElement = $('.form__wrapper');
  const formContainerElement = $('.form__container');
  const formInnerElement = $('.form__inner');
  const formStepElements = $$('.form__step');
  const formBannerElement = $('.form__banner');
  const formResetElement = $('.form__reset');
  const formSubmitElement = $('.form__submit');
  const formSubmitLockElement = $('.form__submit-lock');
  //Добавил две новых переменных для кнопки Back и для инпута, который я использую вместо рекапчи
  //В html документе закрыл все теги инпут
	let state = {
  	ready: false,
    recaptcha: false,
    success: false,
  	step: 0
  };

  function render() {
  	appElement.classList.toggle('app--ready', state.ready);
  	const formWrapperRect = formWrapperElement.getBoundingClientRect();

    formContainerElement.style.width = `${formWrapperRect.width}px`;
    formContainerElement.style.display = `flex`; // добавил родительскому контейнеру display: flex
    Array.from(formStepElements).forEach((stepElement) => {
    	stepElement.classList.remove('form__step--active');
      stepElement.style.width = `${formWrapperRect.width}px`;
    });

    formInnerElement.style.transform = `translate(${formWrapperRect.width * -state.step}px, 0)`;
 //Добавил минус для width т.к. второй элемент находится справа

    const currentFormStepElement = formStepElements[state.step];
    const currentFormStepRect = currentFormStepElement.getBoundingClientRect();

    currentFormStepElement.classList.add('form__step--active');
    formInnerElement.style.height = `${currentFormStepRect.height}px`;

    formSubmitElement.classList.toggle('form__submit--unlocked', state.recaptcha);
    formSubmitLockElement.classList.toggle('form__submit-lock--unlocked', state.recaptcha);
  }

  function update(change = {}) {
      state = {...state, ...change};
    render();
  }

  function handleChangeStepElementClick(event) {
      const step = parseInt(event.target.dataset.changeStep, 10);
    update({ step });
  }

  function handleInputInvalid(event) {
  	const firstInvalidElement = $(':invalid', formElement);
  	firstInvalidElement.focus();

    const step = Array.from(formStepElements).findIndex((formStepElement) => {
    	return formStepElement.contains(firstInvalidElement);
    });

    update({ step });
  }

    async function handleFormSubmit(event) {
        // if (!state.recapcha) {
        // 	return;
        // }
        //т.к. я у меня нет сервера с ключем рекапчи, я временно заменил его инпутом с чек боксом
        //и пока на этот инпут не нажмут, рекапча считается как false
        const data = Object.fromEntries(new FormData(formElement));
        bannerVisible()
        //Добавил появление баннера после удачной отправки формы
        console.log('The following data will be sent:');
        console.log(data);

      }

    function bannerVisible(params) {
        formBannerElement.classList.add('form__banner--visible')
    }
//добавил класс банеру для его появления после удачной отправки
    function reserBanner(params) {
        formBannerElement.classList.remove('form__banner--visible')
    }
//удалил класс баннеру после нажатия кнопки ок
  function handleFormResetClick() {
    update({
    	success: false,
    	step: 0
    });
  }

  function listen() {
    window.addEventListener('resize', render);

    Array.from($$('[data-change-step]')).forEach((changeStepElement) => {
    	changeStepElement.addEventListener('click', handleChangeStepElementClick);
    });

    Array.from($$('input')).forEach((inputElement) => {
    	inputElement.addEventListener('invalid', handleInputInvalid);
    });

    formSubmitElement.addEventListener('click', handleFormSubmit);
    formButton.addEventListener('click', handleFormResetClick);
    formCheckbox.addEventListener('click', () => update({ recaptcha: true }, formCheckbox.style.opacity="0"))
    formResetElement.addEventListener('click', reserBanner)
    //добавил инпут с чекбоксом вместо рекапчи т.к. неудобно в JSFiddle работать

    window.__handleRecaptchaCallback = () => update({ recaptcha: state.recaptcha }); //вывел актуальные значения рекапчи
    window.__handleRecaptchaExpireCallback = () => update({ recaptcha: state.recaptcha }); //вывел актуальные значения рекапчи
  }

  listen();
  update({ ready: true });
}

run(document.querySelector('.app'));