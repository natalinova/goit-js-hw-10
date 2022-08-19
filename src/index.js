import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 1000;

const inputField = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
inputField.addEventListener('input', debounce(formInput, DEBOUNCE_DELAY))

function formInput(e) {
    e.preventDefault();
    if (e.target.value.trim().toLowerCase() === '') {
        return
    }
    const searchQuery = e.target.value.trim().toLowerCase();


    fetchCountry(searchQuery).then(response => {
        if (response.length > 10) {
            Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
            cleanMarkup()
        }
        if (response.length > 1 && response.length < 10) {
            renderSmallMarkup(response)
        }
        if(response.length === 1 )
        renderFullMarkup(response)
    })
}

function renderSmallMarkup(array) {
    cleanMarkup()
    const showManyCountry = array.map(item => {
        return `
    <li class="country_item">
        <img src = "${item.flags.svg}" alt = "${item.name.official} width = "40px" height = "40px">
         <p class = "country_title"> ${item.name.official}</p>
     </li>`
    }).join('')
    console.log(showManyCountry);
    countryInfo.innerHTML = showManyCountry;


}
function renderFullMarkup(array) {
    cleanMarkup();
    const showOneCountry = array.map(item => {
        return `
         <img src = "${item.flags.svg}" alt = "${item.name.official} width = "120px" height = "80px""> 
         <p class = "country_title"> ${item.name.official}</p>
        <p > Capital:${item.capital}</p>
        <p> Population:${item.population}</p> 
        <p> Languages: ${Object.values(item.languages)}</p>`
    }).join('');
    console.log(showOneCountry);
    countryInfo.innerHTML = showOneCountry;
}

function fetchCountry(query) {
    const fields = 'name,capital,population,flags,languages'
    return fetch(`https://restcountries.com/v3.1/name/${query}?fields=${fields}`).
        then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error(Notiflix.Notify.failure("Oops, there is no country with that name"));
                
            }
            else {
                return response.json()
            }
        })
}

function cleanMarkup() {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
}
