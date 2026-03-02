const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
const data = await response.json();

const input = document.getElementById("country-input");
const button = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const error = document.getElementById("error-message");
const countryInfo = document.getElementById("country-info");
const bordersSection = document.getElementById("bordering-countries");

button.addEventListener("click", search);
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") search();
});

async function search() {
    const name = input.value;

    try {
        spinner.style.display = "block";
        error.textContent = "";
        countryInfo.innerHTML = "";
        bordersSection.innerHTML = "";

        // Fetch main country
        const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
        if (!response.ok) throw new Error("Country not found");

        const data = await response.json();
        const country = data[0];

        // Update main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital[0]}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        // Fetch bordering countries
        if (country.borders) {
            for (let code of country.borders) {
                const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await res.json();
                const neighbor = borderData[0];

                bordersSection.innerHTML += `
                    <div>
                        <p>${neighbor.name.common}</p>
                        <img src="${neighbor.flags.svg}" width="50">
                    </div>
                `;
            }
        }

    } catch (err) {
        error.textContent = err.message;
    } finally {
        spinner.style.display = "none";
    }
}
