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
let activeCategory: ICategory = ALL_CATEGORIES;


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
        category === activeCategory ? "category-btn--active" : "category-btn--disabled";

        // Agregamos evento
        button.addEventListener("click", () => {
            activeCategory = category;
            categoryDrawing();
            productDrawing();
        })

        nav.appendChild(button);
    })
};

const productDrawing = (): void => {
    products_grid.innerHTML = "";

    /*
    Antes de renderizar realizamos un filtrado de productos con 3 comprobaciónes:
    - si hay algún filtro por categoría activado
    - si el producto no se encuentra con atributo eliminado = true
    - si concuerda con lo que se tipea en el buscador 
    */
    const filteredProducts: IProduct[] = PRODUCTS.filter((product) => {

        const categoryMatch: boolean = product.categorias.includes(activeCategory) || activeCategory == ALL_CATEGORIES;

        const nameMatch: boolean = product.nombre.toLocaleLowerCase().includes(buscador.value.toLocaleLowerCase());

        return categoryMatch && !product.eliminado && nameMatch
    });

    filteredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "productCard";

        productCard.innerHTML = `
            <img class="card-img" src="${product.imagen}" alt="${product.nombre}"/>
            <div class="card-info">
                <h3 class="card-nombre">${product.nombre}</h3>
                <p class="card_despription">${product.descripcion}</p>
                <div class="card-price_btn">
                    <p class="card-price">$${product.precio}</p>
                    <button class="card-btn" id="card-btn">+ Agregar</button>
                </div>
            </div>
        `;

        products_grid.appendChild(productCard);
    });
};

buscador.addEventListener("input", () => {
    productDrawing();
});

/* -- Llamado a funciones -- */
categoryDrawing();
productDrawing();