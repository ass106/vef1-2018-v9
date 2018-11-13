// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;

  function isNullOrEmpty(str) {
    return !str || !str.trim();
  }

  function createlist(name, data) {
    if (data !== '') {
      const div = document.querySelector('.results');
      const dl = document.createElement('dl');
      div.appendChild(dl);

      const dt = document.createElement('dt');
      dl.appendChild(dt);
      dt.innerHTML = name;

      const dd = document.createElement('dd');
      dl.appendChild(dd);
      dd.innerHTML = data;
    }
  }

  function removelist() {
    const div = document.querySelector('.results');
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }

  function loading() {
    const p = document.createElement('p');
    p.innerHTML = 'Leita af léni...';
    const gif = document.createElement('img');
    gif.setAttribute('src', 'loading.gif');

    const results = document.querySelector('.results');
    const div = document.createElement('div');
    div.classList.add('loading');
    div.appendChild(gif);
    div.appendChild(p);
    results.appendChild(div);
  }

  function dataDisplay(data) {
    removelist();
    if (data !== undefined) {
      const domain = 'Lén: ';
      createlist(domain, data.domain);

      let dateISO = new Date(data.registered);
      dateISO = dateISO.toISOString();
      const splitdate = dateISO.split('T');
      const registered = 'Skráð: ';
      createlist(registered, splitdate[0]);

      let changeISO = new Date(data.lastChange);
      changeISO = changeISO.toISOString();
      const splitchange = changeISO.split('T');
      const lastChange = 'Seinast breytt: ';
      createlist(lastChange, splitchange[0]);

      const registrantname = 'Skráningaraðili: ';
      createlist(registrantname, data.registrantname);
      const email = 'Netfang: ';
      createlist(email, data.email);
      const address = 'Heimilsfang: ';
      createlist(address, data.address);
      const country = 'Land: ';
      createlist(country, data.country);
      const city = 'Borg: ';
      createlist(city, data.city);
      input.value = '';
    } else {
      const errorMsg = document.createElement('p');
      document.querySelector('.results').appendChild(errorMsg);
      errorMsg.innerHTML = 'Lén er ekki skrá.';
      input.value = '';
    }
  }

  function getData(userInput) {
    const url = `${API_URL}${userInput}`;
    removelist();
    loading();
    fetch(url)
      .then(response => response.json())
      .then((myJson) => {
        dataDisplay(myJson.results[0]);
      })
      .catch((error) => {
        removelist();
        const div = document.querySelector('.results');
        const text = document.createElement('p');
        text.innerHTML = error;
        div.appendChild(text);
      });
  }
  function formHandler(e) {
    e.preventDefault();
    if (!isNullOrEmpty(input.value)) {
      getData(input.value);
    } else if (isNullOrEmpty(input.value)) {
      removelist();
      const div = document.querySelector('.results');
      const errorMess = document.createElement('p');
      errorMess.innerHTML = 'Lén verður að vera strengur.';
      div.appendChild(errorMess);
      input.value = '';
    }
  }
  function init() {
    const form = document.querySelector('form');
    input = form.querySelector('input');

    form.addEventListener('submit', formHandler);
  }
  return {
    init,
  };
})();
document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
