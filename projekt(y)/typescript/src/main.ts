/*
Zakres funkcjonalny aplikacji Magazyn Elektro-Bud:
1. Wyświetlanie listy produktów wraz ze stanem magazynowym i lokalizacją (sektor, regał, półka).
2. Wyszukiwanie produktu oraz jego lokalizacji po kodzie EAN lub nazwie.
3. Dodawanie nowego produktu do magazynu.
4. Edycja danych, lokalizacji i stanu magazynowego produktu.
5. Usuwanie produktu z magazynu.
*/

interface StorageLocation {
    sector: string;
    rack: string;
    shelf: string;
}

interface Product {
    id: number;
    ean: string;
    name: string;
    category: string;
    quantity: number;
    location: StorageLocation;
}

let products: Product[] = [
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

let nextId: number = 4;
let editedProductId: number | null = null;
let searchQuery: string = "";

const productForm = document.getElementById("product-form") as HTMLFormElement;
const formTitle = document.getElementById("form-title") as HTMLHeadingElement;
const eanInput = document.getElementById("product-ean") as HTMLInputElement;
const nameInput = document.getElementById("product-name") as HTMLInputElement;
const categoryInput = document.getElementById("product-category") as HTMLSelectElement;
const quantityInput = document.getElementById("product-quantity") as HTMLInputElement;
const sectorInput = document.getElementById("product-sector") as HTMLInputElement;
const rackInput = document.getElementById("product-rack") as HTMLInputElement;
const shelfInput = document.getElementById("product-shelf") as HTMLInputElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
const cancelBtn = document.getElementById("cancel-btn") as HTMLButtonElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const productList = document.getElementById("product-list") as HTMLTableSectionElement;

function getFilteredProducts(): Product[] {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
        return products;
    }

    return products.filter((product: Product) => {
        return (
            product.ean.toLowerCase().includes(query) ||
            product.name.toLowerCase().includes(query)
        );
    });
}

function renderProducts(): void {
    productList.innerHTML = "";
    const filtered = getFilteredProducts();

    filtered.forEach((product: Product) => {
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

function attachRowEvents(): void {
    const editButtons = document.querySelectorAll(".btn-edit");
    const deleteButtons = document.querySelectorAll(".btn-delete");

    editButtons.forEach((btn: Element) => {
        btn.addEventListener("click", () => {
            const id = Number((btn as HTMLButtonElement).dataset.id);
            startEditProduct(id);
        });
    });

    deleteButtons.forEach((btn: Element) => {
        btn.addEventListener("click", () => {
            const id = Number((btn as HTMLButtonElement).dataset.id);
            deleteProduct(id);
        });
    });
}

function addProduct(
    ean: string,
    name: string,
    category: string,
    quantity: number,
    location: StorageLocation
): void {
    const newProduct: Product = {
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

function updateProduct(
    id: number,
    ean: string,
    name: string,
    category: string,
    quantity: number,
    location: StorageLocation
): void {
    const product = products.find((p: Product) => p.id === id);
    if (!product) return;

    product.ean = ean;
    product.name = name;
    product.category = category;
    product.quantity = quantity;
    product.location = location;

    resetForm();
    renderProducts();
}

function deleteProduct(id: number): void {
    products = products.filter((p: Product) => p.id !== id);
    if (editedProductId === id) {
        resetForm();
    }
    renderProducts();
}

function startEditProduct(id: number): void {
    const product = products.find((p: Product) => p.id === id);
    if (!product) return;

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

function resetForm(): void {
    editedProductId = null;
    productForm.reset();
    formTitle.textContent = "Dodaj nowy produkt";
    submitBtn.textContent = "Dodaj produkt";
    cancelBtn.classList.add("hidden");
}

productForm.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const ean = eanInput.value.trim();
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const quantity = Number(quantityInput.value);
    const location: StorageLocation = {
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
    } else {
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