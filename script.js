document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const locationSelect = document.getElementById('location');
    const providerSelect = document.getElementById('provider');
    const ipTypeSelect = document.getElementById('ipType');
    const form = document.getElementById('urlForm');
    const generatedUrl = document.getElementById('generatedUrl');
    const copyMessage = document.getElementById('copyMessage');
    const resetButton = document.getElementById('resetButton');
    let data = null;

    fetch('data.json')
        .then(response => response.json())
        .then(json => {
            data = json;
            populateCountries(data.countries);
        });

    function populateCountries(countries) {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });

        countrySelect.addEventListener('change', () => {
            locationSelect.disabled = false;
            populateLocations(data.countries.find(country => country.code === countrySelect.value).locations);
            checkAllFieldsSelected();
        });
    }

    function populateLocations(locations) {
        locationSelect.innerHTML = '<option value="" disabled selected>Select location</option>';
        providerSelect.innerHTML = '<option value="" disabled selected>Select provider</option>';
        ipTypeSelect.innerHTML = '<option value="" disabled selected>Select IP type</option>';
        ipTypeSelect.disabled = true;
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.code;
            option.textContent = location.name;
            locationSelect.appendChild(option);
        });

        locationSelect.addEventListener('change', () => {
            providerSelect.disabled = false;
            populateProviders(data.countries.find(country => country.code === countrySelect.value).locations.find(location => location.code === locationSelect.value).providers);
            checkAllFieldsSelected();
        });
    }

    function populateProviders(providers) {
        providerSelect.innerHTML = '<option value="" disabled selected>Select provider</option>';
        ipTypeSelect.innerHTML = '<option value="" disabled selected>Select IP type</option>';
        ipTypeSelect.disabled = true;
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.code;
            option.textContent = provider.name;
            option.dataset.ipv4 = provider.ipv4;
            option.dataset.ipv6 = provider.ipv6;
            providerSelect.appendChild(option);
        });

        providerSelect.addEventListener('change', () => {
            ipTypeSelect.disabled = false;
            populateIpTypes(providerSelect.options[providerSelect.selectedIndex].dataset);
            checkAllFieldsSelected();
        });
    }

    function populateIpTypes(providerData) {
        const ipv4 = providerData.ipv4 === 'true';
        const ipv6 = providerData.ipv6 === 'true';
        ipTypeSelect.innerHTML = '<option value="" disabled selected>Select IP type</option>';
        if (ipv4) {
            const optionV4 = document.createElement('option');
            optionV4.value = 'v4';
            optionV4.textContent = 'IPv4';
            ipTypeSelect.appendChild(optionV4);
        }
        if (ipv6) {
            const optionV6 = document.createElement('option');
            optionV6.value = 'v6';
            optionV6.textContent = 'IPv6';
            ipTypeSelect.appendChild(optionV6);
        }
        if (ipv4 && ipv6) {
            const optionBoth = document.createElement('option');
            optionBoth.value = 'both';
            optionBoth.textContent = 'Both';
            ipTypeSelect.appendChild(optionBoth);
        }

        ipTypeSelect.addEventListener('change', checkAllFieldsSelected);
    }

    function checkAllFieldsSelected() {
        if (countrySelect.value && locationSelect.value && providerSelect.value && ipTypeSelect.value) {
            // All fields are selected
        } else {
            generatedUrl.classList.add('disabled');
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        generateURL();
    });

    generatedUrl.addEventListener('click', () => {
        if (!generatedUrl.classList.contains('disabled')) {
            const url = generatedUrl.textContent;
            navigator.clipboard.writeText(url).then(() => {
                copyMessage.textContent = 'URL copied to clipboard!';
                setTimeout(() => {
                    copyMessage.textContent = 'Click to copy';
                }, 2000);
            });
        }
    });

    resetButton.addEventListener('click', () => {
        form.reset();
        locationSelect.disabled = true;
        providerSelect.disabled = true;
        ipTypeSelect.disabled = true;
        generatedUrl.textContent = 'Generated URL will appear here';
        generatedUrl.classList.add('disabled');
        copyMessage.textContent = 'Click to copy';
    });

    function generateURL() {
        const country = countrySelect.value;
        const location = locationSelect.value;
        const provider = providerSelect.value;
        const ipType = ipTypeSelect.value;

        let url;
        if (ipType === 'both') {
            url = `${location}-${provider}.${country}.tcpping.top`.toLowerCase();
        } else {
            url = `${ipType}.${location}-${provider}.${country}.tcpping.top`.toLowerCase();
        }
        generatedUrl.textContent = url;
        generatedUrl.classList.remove('disabled');
    }
});
