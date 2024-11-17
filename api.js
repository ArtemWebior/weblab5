const itemList = document.querySelector('.content-itemList');
const searchField = document.querySelector('.content-menu-search');
const totalPriceField = document.querySelector('.content-totalprice');
const sortButton = document.querySelector('.content-menu-button:nth-child(2)');
const calculateButton = document.querySelector('.content-menu-button:nth-child(3)');

async function fetchData() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        renderData(items);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

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

sortButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/items?sort=Name');
        const sortedItems = await response.json();
        renderData(sortedItems);
    } catch (error) {
        console.error('Error sorting items:', error);
    }
});

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

// Initial data load
fetchData();
