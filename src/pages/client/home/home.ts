import { PRODUCTS, getCategories } from "../../../data/data";
import type { ICategory } from "../../../types/category";
import type { IProduct } from "../../../types/product";


/* -- Elementos del DOM -- */
const nav = document.querySelector<HTMLElement>("#categories")!;
const products_grid = document.querySelector<HTMLDivElement>("#products_grid")!;
const buscador = document.querySelector<HTMLInputElement>("#buscador")!;

/* -- Variables Globales -- */
// constante utilizada para poder filtrar por todas las categorías
const ALL_CATEGORIES: ICategory = { 
    id: -1,
    nombre: "Todas",
    descripcion: "all categories",
    eliminado: false,
    createdAt: ""
};
const categories: ICategory[] = [ALL_CATEGORIES, ...getCategories()];
let activeCategory: number = ALL_CATEGORIES.id;


/**
 * Función encargada de renderizar todas las categorias disponibles,
 * además designa y aplica estilo a una categoria selecionada mediante click
 */
const categoryDrawing = (): void => {
    nav.innerHTML = "";

    // Por cada categoría creamos un botón con eventListener
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.nombre;

        // Se asigna clase dependiendo si es la categoria activa actual o no
        button.className = 
        category.id === activeCategory ? "category-btn--active" : "category-btn--disabled";

        // Agregamos evento
        button.addEventListener("click", () => {
            activeCategory = category.id;
            categoryDrawing();
            productDrawing();
        })

        nav.appendChild(button);
    })
};

const productDrawing = (): void => {
    products_grid.innerHTML = "";

    const filteredProducts: IProduct[] = productFilter(PRODUCTS); 

    filteredProducts.forEach((product) => {
        products_grid.appendChild(cardCreation(product));
    });
};

/**
 * Crea lista de productos filtrando con 3 comprobaciónes:
 * - si hay algún filtro por categoría activado
 * - si el producto no se encuentra con atributo eliminado = true
 * - si concuerda con lo que se tipea en el buscador 
 * @param products 
 * @returns filteredProducts: IProducts[]
 */
const productFilter = ((products: IProduct[]): IProduct[] => {
    const filteredProducts: IProduct[] = products.filter((product) => {

        const categoryMatch: boolean = product.categorias.some((category) => category.id === activeCategory) || activeCategory == ALL_CATEGORIES.id;

        const nameMatch: boolean = product.nombre.toLocaleLowerCase().includes(buscador.value.toLocaleLowerCase());

        return categoryMatch && !product.eliminado && nameMatch
    });
    
    return filteredProducts;
});

const cardCreation = ((product: IProduct): HTMLElement => {
    const productCard = document.createElement("div");
    productCard.className = "productCard";

    productCard.innerHTML = `
            <img class="card-img" src="${product.imagen}" alt="${product.nombre}"/>
            <div class="card-info">
                <h3 class="card-nombre">${product.nombre}</h3>
                <p class="card_despription">${product.descripcion}</p>
                <div class="card-price_btn">
                    <p class="card-price">$${product.precio}</p>
                </div>
            </div>
        `;

        const toAddBtn = productCard.querySelector<HTMLElement>(".card-price_btn")!;
        toAddBtn.appendChild(cardBtnCreate(product));

        return productCard;
});

const cardBtnCreate = ((product: IProduct): HTMLButtonElement => {
    const cardBtn = document.createElement("button");

    if (product.disponible) {
        cardBtn.className = "card-btn--active";
        cardBtn.innerText = "+ Agregar";
        cardBtn.addEventListener("click", () => {
            //addToCart(product);
        })
    } else {
        cardBtn.className = "card-btn--disabled";
        cardBtn.innerText = "No disponible";
        cardBtn.disabled = true;
    }

    return cardBtn
});


buscador.addEventListener("input", () => {
    productDrawing();
});


/* -- Llamado a funciones -- */
categoryDrawing();
productDrawing();