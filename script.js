const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
const data = await response.json();

const input = document.getElementById("countryInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("result");
const spinner = document.getElementById("spinner");
const error = document.getElementById("error");

input.addEventListener("keydown", function (e) {
    if (e.key === "Enter")
        search();
});

async function search() {
    const name = input.value;

    spinner.style.display = "block";
    result.innerHTML = "";
    error.textContent = "";

    fetch(`https://restcountries.com/v3.1/name/${name}`)
        .then(response => {
            if (!response.ok) throw new Error("Country not found");
            return response.json();
        })
        .then(data => {
            const country = data[0];

            // Example DOM updates
            document.getElementById('country-info').innerHTML = `
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital[0]}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <img src="${country.flags.svg}" alt="${country.name.common} flag">
            `;

            // Display bordering countries
            if (country.borders) {
                const bordersDiv = document.getElementById("borders");

                country.borders.forEach(code => {
                    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                        .then(res => res.json())
                        .then(borderData => {
                            const neighbor = borderData[0];
                            bordersDiv.innerHTML += `
                                <p>
                                    ${neighbor.name.common}
                                    <img src="${neighbor.flags.png}" width="30">
                                </p>
                            `;
                        });
                });
            }
        })
        .catch(err => {
            error.textContent = err.message;
        })
        .finally(() => {
            spinner.style.display = "none";
        });
}
