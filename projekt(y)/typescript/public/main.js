"use strict";
/*
Zakres funkcjonalny aplikacji Magazyn Elektro-Bud:
1. Wyświetlanie listy produktów wraz ze stanem magazynowym i lokalizacją (sektor, regał, półka).
2. Wyszukiwanie produktu oraz jego lokalizacji po kodzie EAN lub nazwie.
3. Dodawanie nowego produktu do magazynu.
4. Edycja danych, lokalizacji i stanu magazynowego produktu.
5. Usuwanie produktu z magazynu.
*/
let products = [
    {
        id: 1,
        ean: "5901234567890",
        name: "Przewód instalacyjny YDYp 3x1,5 100m",
        category: "Kable i przewody",
        quantity: 32,
        location: { sector: "A", rack: "R01", shelf: "P2" }
    },
    {
        id: 2,
        ean: "5909876543210",
        name: "Wyłącznik nadprądowy B16 1P",
        category: "Aparatura modułowa",
        quantity: 120,
        location: { sector: "B", rack: "R04", shelf: "P1" }
    },
    {
        id: 3,
        ean: "5901122334455",
        name: "Zaprawa klejowa elastyczna 25kg",
        category: "Materiały budowlane",
        quantity: 48,
        location: { sector: "C", rack: "R10", shelf: "P0" }
    }
];
let nextId = 4;
let editedProductId = null;
let searchQuery = "";
const productForm = document.getElementById("product-form");
const formTitle = document.getElementById("form-title");
const eanInput = document.getElementById("product-ean");
const nameInput = document.getElementById("product-name");
const categoryInput = document.getElementById("product-category");
const quantityInput = document.getElementById("product-quantity");
const sectorInput = document.getElementById("product-sector");
const rackInput = document.getElementById("product-rack");
const shelfInput = document.getElementById("product-shelf");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search-input");
const productList = document.getElementById("product-list");
function getFilteredProducts() {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
        return products;
    }
    return products.filter((product) => {
        return (product.ean.toLowerCase().includes(query) ||
            product.name.toLowerCase().includes(query));
    });
}
function renderProducts() {
    productList.innerHTML = "";
    const filtered = getFilteredProducts();
    filtered.forEach((product) => {
        const row = document.createElement("tr");
        const loc = `${product.location.sector} / ${product.location.rack} / ${product.location.shelf}`;
        row.innerHTML = `
            <td>${product.ean}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td><span class="badge-location">${loc}</span></td>
            <td>${product.quantity} szt.</td>
            <td>
                <button type="button" class="btn-edit" data-id="${product.id}">Edytuj</button>
                <button type="button" class="btn-delete" data-id="${product.id}">Usuń</button>
            </td>
        `;
        productList.appendChild(row);
    });
    attachRowEvents();
}
function attachRowEvents() {
    const editButtons = document.querySelectorAll(".btn-edit");
    const deleteButtons = document.querySelectorAll(".btn-delete");
    editButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            startEditProduct(id);
        });
    });
    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            deleteProduct(id);
        });
    });
}
function addProduct(ean, name, category, quantity, location) {
    const newProduct = {
        id: nextId++,
        ean,
        name,
        category,
        quantity,
        location
    };
    products.push(newProduct);
    renderProducts();
}
function updateProduct(id, ean, name, category, quantity, location) {
    const product = products.find((p) => p.id === id);
    if (!product)
        return;
    product.ean = ean;
    product.name = name;
    product.category = category;
    product.quantity = quantity;
    product.location = location;
    resetForm();
    renderProducts();
}
function deleteProduct(id) {
    products = products.filter((p) => p.id !== id);
    if (editedProductId === id) {
        resetForm();
    }
    renderProducts();
}
function startEditProduct(id) {
    const product = products.find((p) => p.id === id);
    if (!product)
        return;
    editedProductId = product.id;
    eanInput.value = product.ean;
    nameInput.value = product.name;
    categoryInput.value = product.category;
    quantityInput.value = String(product.quantity);
    sectorInput.value = product.location.sector;
    rackInput.value = product.location.rack;
    shelfInput.value = product.location.shelf;
    formTitle.textContent = `Edycja produktu (EAN: ${product.ean})`;
    submitBtn.textContent = "Zapisz zmiany";
    cancelBtn.classList.remove("hidden");
}
function resetForm() {
    editedProductId = null;
    productForm.reset();
    formTitle.textContent = "Dodaj nowy produkt";
    submitBtn.textContent = "Dodaj produkt";
    cancelBtn.classList.add("hidden");
}
productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const ean = eanInput.value.trim();
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const quantity = Number(quantityInput.value);
    const location = {
        sector: sectorInput.value.trim().toUpperCase(),
        rack: rackInput.value.trim().toUpperCase(),
        shelf: shelfInput.value.trim().toUpperCase()
    };
    if (!ean || !name || quantity < 0 || !location.sector || !location.rack || !location.shelf) {
        return;
    }
    if (editedProductId === null) {
        addProduct(ean, name, category, quantity, location);
        productForm.reset();
    }
    else {
        updateProduct(editedProductId, ean, name, category, quantity, location);
    }
});
cancelBtn.addEventListener("click", () => {
    resetForm();
});
searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderProducts();
});
renderProducts();
