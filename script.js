async function searchCountry(countryName) {
    const spinner = document.getElementById('loading-spinner');
    const countryInfo = document.getElementById('country-info');
    const borderSection = document.getElementById('bordering-countries');
    const errorMessage = document.getElementById('error-message');

    try {
        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        borderSection.classList.add('hidden');
        borderSection.innerHTML = '';

        if (!countryName) {
            throw new Error("Please enter a country name.");
        }

        // Show loading spinner
        spinner.classList.remove('hidden');

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

        // Update DOM
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        countryInfo.classList.remove('hidden');

        // Fetch bordering countries
        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];
                // Update bordering countries section
                borderSection.innerHTML += `
                    <div class="border-item">
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                    </div>
                `;
            }
            borderSection.classList.remove('hidden');
        }

    } catch (error) {
        // Show error message
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide loading spinner
        spinner.classList.add('hidden');
    }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    searchCountry(country);
});

document.getElementById('country-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const country = document.getElementById('country-input').value.trim();
        searchCountry(country);
    }
});
