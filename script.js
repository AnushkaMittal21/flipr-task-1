const url = 'http://api.nobelprize.org/v1/prize.json';

function fetchWinners() {
    const selectedYear = document.getElementById('year').value;
    const selectedCategory = document.getElementById('category').value;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const prizes = data.prizes.filter(prize => {
                return (
                    prize.year.toString() === selectedYear &&
                    prize.category === selectedCategory
                );
            });

            displayWinners(prizes);
        })
        .catch(error => {
            console.log(error);
        });
}

function displayWinners(prizes) {
    const prizesContainer = document.getElementById('prizes');
    prizesContainer.innerHTML = '';

    prizes.forEach(prize => {
        const prizeCard = document.createElement('div');
        prizeCard.classList.add('prize-card');

        const year = document.createElement('h2');
        year.textContent = `Year: ${prize.year}`;
        prizeCard.appendChild(year);

        const category = document.createElement('h2');
        category.textContent = `Category: ${prize.category}`;
        prizeCard.appendChild(category);

        prize.laureates.forEach(laureate => {
            const laureateInfo = document.createElement('p');
            laureateInfo.textContent = `${laureate.firstname} ${laureate.surname}`;
            prizeCard.appendChild(laureateInfo);
        });

        prizesContainer.appendChild(prizeCard);
    });
}

fetch(url)
    .then(res => res.json())
    .then(data => {
        const yearsDropdown = document.getElementById('year');
        const categoriesDropdown = document.getElementById('category');

        const prizes = data.prizes;

        const years = new Set(prizes.map(prize => prize.year.toString()));
        const categories = new Set(prizes.map(prize => prize.category));

        years.forEach(year => {
            if (parseInt(year) >= 1900 && parseInt(year) <= 2018) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearsDropdown.appendChild(option);
            }
        });

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoriesDropdown.appendChild(option);
        });
    })
    .catch(error => {
        console.log(error);
    });
