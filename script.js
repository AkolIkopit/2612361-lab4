const input = document.getElementById("countryInput");
const button = document.getElementById("searchBtn");
const spinner = document.getElementById("spinner");
const error = document.getElementById("error");

button.addEventListener("click", search);
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") search();
});

async function search() {
    const name = input.value;

    try {
        spinner.style.display = "block";
        error.textContent = "";
        document.getElementById("country-info").innerHTML = "";

        // Fetch main country
        const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
        if (!response.ok) throw new Error("Country not found");

        const data = await response.json();
        const country = data[0];

        // Update DOM
        document.getElementById('country-info').innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital[0]}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
            <div id="borders"></div>
        `;

        // Fetch bordering countries
        if (country.borders) {
            const bordersDiv = document.getElementById("borders");

            for (let code of country.borders) {
                const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await res.json();
                const neighbor = borderData[0];

                bordersDiv.innerHTML += `
                    <p>
                        ${neighbor.name.common}
                        <img src="${neighbor.flags.svg}" width="30">
                    </p>
                `;
            }
        }

    } catch (err) {
        error.textContent = err.message;
    } finally {
        spinner.style.display = "none";
    }
}
