//Selecting html elements
const form = document.querySelector("form");
const searchInput = document.getElementById('search');
const countryInput = document.getElementById('country');
//api key
const apiKey = 'a2778a07e9d9a3c87823acbb0ec3a7d3';

//event listeners
form.addEventListener('submit', weatherForm);

//function to handle form submission
function weatherForm(e) {
    e.preventDefault();
    const city = searchInput.value;
    const country = countryInput.value;

    if (city) {
        //get coordinates funciton (city, country)

    } else {
        alert("Enter location to proceed");
    }

    searchInput.value = '';
    countryInput.value = '';
}