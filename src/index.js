import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('input#search-box')
console.log(inputField);
const countryList = document.querySelector('.country-list');
console.log(countryList);
const countryInfo = document.querySelector('.country-info')
inputField.addEventListener('input', debounce(formInput,2000))
function formInput(e) {
    e.preventDefault();
    const searchQuery = e.target.value.trim().toLowerCase();
    console.log(searchQuery);

    fetchCountry(searchQuery).then(response => {
        if (response.length > 10) {
            Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
        }
        if (response.length > 1) {
            renderFullMarkup(response)
        }
        renderSmallMarkup(response)
    }).catch(console.log('Error 404!'))
}

function renderSmallMarkup(array) {
    const showCountry = array.map(item => { return  `<li> <img src = "${item.flags.svg}" alt = "${item.name.official} "> <p> ${item.name.official}</p> </li>`}).join('')
    console.log(showCountry);
    countryInfo.innerHTML = showCountry;


}
function renderFullMarkup(array) {
    const showManyCountry = array.map(item => { return `<img src = "${item.flags.svg}" alt = "${item.name.official} "> <p> ${item.name.official}</p> </br> <p> Capital:${item.capital}</p> </br> <p> Population:${item.population}</p> </br> <p> Languages:${item.languagues}</p> </br>` }).join('');
    console.log(showManyCountry);
    countryInfo.innerHTML = showManyCountry;
}
function fetchCountry(query) {
    return fetch(`https://restcountries.com/v3.1/name/${query}?fields=name,capital,population,flags,languages`).
        then(response => {
            if (!response.ok) { throw new Error(Notiflix.Notify.failure("Oops, there is no country with that name"))}
            else { return response.json }
        
        }).catch(console.log('Opps!'))
}
