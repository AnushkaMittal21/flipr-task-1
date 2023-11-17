async function fetchPrizes() {
    try {
        const response = await fetch('http://api.nobelprize.org/v1/prize.json');
        const data = await response.json();
        return data.prizes;
    } catch (error) {
        console.error('Error fetching prizes:', error);
        return [];
    }
}

function displayPrizes(prizes) {
    const prizesContainer = document.getElementById('prizes-container');
    prizesContainer.innerHTML = '';

    prizes.forEach(prize => {
        const prizeCard = document.createElement('div');
        prizeCard.classList.add('prize-card');
        prizeCard.innerHTML = `
            <h2>${prize.year} - ${prize.category}</h2>
            <p><strong>Motivation:</strong> ${prize.motivation}</p>
            <p><strong>Winners:</strong></p>
            <ul>
                ${prize.laureates.map(laureate => `<li>${laureate.firstname} ${laureate.surname}</li>`).join('')}
            </ul>
        `;
        prizesContainer.appendChild(prizeCard);
    });
}

function populateYearFilter() {
    const yearSelect = document.getElementById('year-select');

    for (let year = 2018; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

function populateCategoryFilter(prizes) {
    const categorySelect = document.getElementById('category-select');
    const categories = new Set(prizes.map(prize => prize.category));

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

async function filterWinners() {
    const selectedYear = document.getElementById('year-select').value;
    const selectedCategory = document.getElementById('category-select').value;

    const allPrizes = await fetchPrizes();

    let filteredPrizes = allPrizes;

    if (selectedYear !== 'All') {
        filteredPrizes = filteredPrizes.filter(prize => prize.year == selectedYear);
    }

    if (selectedCategory !== 'All') {
        filteredPrizes = filteredPrizes.filter(prize => prize.category === selectedCategory);
    }

    displayPrizes(filteredPrizes);

    displayMultiTimeWinners(allPrizes);
}

function displayMultiTimeWinners(prizes) {
    const multiTimeWinnersSection = document.getElementById('multiTimeWinners');
    multiTimeWinnersSection.innerHTML = '';

    const laureateMap = new Map();

    prizes.forEach(prize => {
        prize.laureates.forEach(laureate => {
            const fullName = `${laureate.firstname} ${laureate.surname}`;
            if (laureateMap.has(fullName)) {
                const count = laureateMap.get(fullName);
                laureateMap.set(fullName, count + 1);
            } else {
                laureateMap.set(fullName, 1);
            }
        });
    });

    const multiTimeWinners = [];
    laureateMap.forEach((count, laureateName) => {
        if (count > 1) {
            multiTimeWinners.push({ name: laureateName, count });
        }
    });

    if (multiTimeWinners.length > 0) {
        const multiTimeWinnersList = document.createElement('ul');
        multiTimeWinnersList.innerHTML = multiTimeWinners.map(winner => `<li>${winner.name} - ${winner.count} times</li>`).join('');
        multiTimeWinnersSection.appendChild(multiTimeWinnersList);
    } else {
        multiTimeWinnersSection.textContent = 'No multi-time winners.';
    }
}

async function initializeApp() {
    const prizes = await fetchPrizes();
    populateYearFilter();
    populateCategoryFilter(prizes);
}

initializeApp();
