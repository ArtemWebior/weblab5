const savedData = localStorage.getItem('gems');
const data = savedData ? JSON.parse(savedData) : [
    { id: 1, Name: "Diamond", price: 100000 },
    { id: 2, Name: "Topaz", price: 15000 },
    { id: 3, Name: "Emerald", price: 35000 },
    { id: 4, Name: "Rubin", price: 25000 },
    { id: 5, Name: "Onyx", price: 20000 },
];

function saveData() {
    localStorage.setItem('gems', JSON.stringify(data));
}

const form = document.getElementById('addGemForm');
const itemList = document.querySelector('.content-itemList');
const searchField = document.querySelector('.content-menu-search');
const totalPriceField = document.querySelector('.content-totalprice');
const sortButton = document.querySelector('.content-menu-button:nth-child(2)');
const calculateButton = document.querySelector('.content-menu-button:nth-child(3)');

// Рендеринг даних
function renderData(items) {
    itemList.innerHTML = "";
    items.forEach(item => {
        itemList.insertAdjacentHTML(
            "beforeend",
            `<div class="content-item">
                <div>Name: ${item.Name}</div>
                <div>Price: ${item.price} USD</div>
                <button class="edit-button" data-id="${item.id}">Edit</button>
                <button class="remove-button" data-id="${item.id}">Remove</button>
            </div>`
        );
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', handleRemove);
    });
}

// Додавання нового елемента
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('gemName').value.trim();
    const price = parseFloat(document.getElementById('gemPrice').value);

    if (name.length < 4 || name.length > 25) {
        alert('Gem name must be between 4 and 25 characters.');
        return;
    }

    if (price <= 999 || price > 100000) {
        alert('Gem price must be between 1000 and 100000 dollars.');
        return;
    }

    const newGem = {
        id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
        Name: name,
        price: price,
    };

    data.push(newGem);
    saveData();
    alert('Gem added successfully!');
    form.reset();
    renderData(data);
});

// Редагування елемента
function handleEdit(event) {
    const gemId = parseInt(event.target.dataset.id);
    const gem = data.find(item => item.id === gemId);

    if (!gem) {
        alert('Gem not found.');
        return;
    }

    const newName = prompt('Edit Gem Name:', gem.Name);
    const newPrice = prompt('Edit Gem Price (in dollars):', gem.price);

    if (newName && newName.length >= 4 && newName.length <= 25 && newPrice > 999 && newPrice <= 100000) {
        gem.Name = newName;
        gem.price = parseFloat(newPrice);
        saveData();
        renderData(data);
    } else {
        alert('Invalid input. Please enter a valid name and price.');
    }
}

// Видалення елемента
function handleRemove(event) {
    const gemId = parseInt(event.target.dataset.id);
    const gemIndex = data.findIndex(item => item.id === gemId);

    if (gemIndex > -1) {
        data.splice(gemIndex, 1);
        saveData();
        renderData(data);
    } else {
        alert('Gem not found.');
    }
}

// Сортування
let isSorted = false;
sortButton.addEventListener('click', () => {
    if (isSorted) {
        renderData(data);
    } else {
        const sorted = [...data].sort((a, b) => a.Name.localeCompare(b.Name));
        renderData(sorted);
    }
    isSorted = !isSorted;
});

// Підрахунок загальної вартості
calculateButton.addEventListener('click', () => {
    const totalPrice = data.reduce((sum, item) => sum + item.price, 0);
    totalPriceField.textContent = `Total Price: ${totalPrice} USD`;
});

// Пошук
searchField.addEventListener('input', () => {
    const query = searchField.value.toLowerCase();
    const filtered = data.filter(item => item.Name.toLowerCase().includes(query));
    renderData(filtered);
});

// Початковий рендеринг
renderData(data);
