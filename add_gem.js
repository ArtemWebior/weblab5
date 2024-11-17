const form = document.getElementById('addGemForm');
const itemList = document.querySelector('.content-itemList');
const searchField = document.querySelector('.content-menu-search');
const totalPriceField = document.querySelector('.content-totalprice');
const sortButton = document.querySelector('.content-menu-button:nth-child(2)');
const calculateButton = document.querySelector('.content-menu-button:nth-child(3)');

// Завантаження даних з API
async function fetchData() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        renderData(items);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Рендеринг отриманих даних
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

    // Додавання обробників для кнопок "Edit" і "Remove"
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', handleRemove);
    });
}

// Додавання нового елемента
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('gemName').value.trim();
    const price = document.getElementById('gemPrice').value;

    if (name.length < 4 || name.length > 25) {
        alert('Gem name must be between 4 and 25 characters.');
        return;
    }

    if (price <= 999 || price > 100000) {
        alert('Gem price must be between 1000 and 100000 dollars.');
        return;
    }

    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name: name, price: parseFloat(price) }),
        });

        if (response.ok) {
            alert('Gem added successfully!');
            form.reset();
            fetchData(); // Оновлення списку після додавання
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error adding gem:', error);
    }
});

// Редагування елемента
async function handleEdit(event) {
    const itemId = event.target.dataset.id;

    const newName = prompt('Edit Item Name:');
    const newPrice = prompt('Edit Item Price (in USD):');

    if (newName && newPrice) {
        try {
            await fetch(`/api/items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Name: newName, price: parseFloat(newPrice) }),
            });
            fetchData();
        } catch (error) {
            console.error('Error editing item:', error);
        }
    }
}

// Видалення елемента
async function handleRemove(event) {
    const itemId = event.target.dataset.id;

    try {
        await fetch(`/api/items/${itemId}`, {
            method: 'DELETE',
        });
        fetchData();
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

// Сортування
sortButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/items?sort=Name');
        const sortedItems = await response.json();
        renderData(sortedItems);
    } catch (error) {
        console.error('Error sorting items:', error);
    }
});

// Підрахунок загальної вартості
calculateButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
        totalPriceField.textContent = `Total Price: ${totalPrice} USD`;
    } catch (error) {
        console.error('Error calculating total price:', error);
    }
});

// Пошук
searchField.addEventListener('input', async () => {
    const query = searchField.value.toLowerCase();
    try {
        const response = await fetch(`/api/items?search=${query}`);
        const filteredItems = await response.json();
        renderData(filteredItems);
    } catch (error) {
        console.error('Error searching items:', error);
    }
});

// Ініціалізація
fetchData();
