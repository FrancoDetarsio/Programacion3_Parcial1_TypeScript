import { PRODUCTS, getCategories } from "../../../data/data";
import type { ICategory } from "../../../types/category";
import type { IProduct } from "../../../types/product";
import { addToCart } from "../../../utils/cart";
import { getCartItems } from "../../../utils/cart";


/* -- Elementos del DOM -- */
const nav = document.querySelector<HTMLElement>("#categories")!;
const products_grid = document.querySelector<HTMLDivElement>("#products_grid")!;
const buscador = document.querySelector<HTMLInputElement>("#buscador")!;
const cartLink = document.querySelector<HTMLElement>("#cartLink")!;

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


/* -- Declaración de Funciónes -- */
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

/**
 * Método encargado de renderizar las tarjetas de cada producto,
 * delega funcionalidades de creacion y filtrado
 * si no hay productos se notifica al usuario
 */
const productDrawing = (): void => {
    products_grid.innerHTML = "";

    const filteredProducts: IProduct[] = productFilter(PRODUCTS); 

    if (filteredProducts.length !== 0) {
        filteredProducts.forEach((product) => {
        products_grid.appendChild(cardCreation(product));
        });
    } else {
        products_grid.innerHTML = `<p class="no-products-found">No se encontrarón artículos</p>`;
    }

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

/**
 * Recibe un producto como parámetro y lo convierte en un div para renderizar
 * @param product 
 * @returns div = productCard 
 */
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

/**
 * Se crea un botón para agregar producto al carrito
 * si el producto.disponible = false desactiva el botón y lo notifica
 * @param product 
 * @returns card-btn--active | card-btn--disabled
 */
const cardBtnCreate = ((product: IProduct): HTMLButtonElement => {
    const cardBtn = document.createElement("button");

    if (product.disponible) {
        cardBtn.className = "card-btn--active";
        cardBtn.innerText = "+ Agregar";
        cardBtn.addEventListener("click", () => {
            addToCart(product, true);
            cartLinkUpdate();
        })
    } else {
        cardBtn.className = "card-btn--disabled";
        cardBtn.innerText = "No disponible";
        cardBtn.disabled = true;
    }

    return cardBtn
});

/**
 * por cada valor ingresado en el buscador se renderizara los productos
 * ofreciendo filtrado en tiempo real
 */
buscador.addEventListener("input", () => {
    productDrawing();
});

/**
 * Se encarga agregar/modificar un contador mostrando la cantidad actual
 * de items en el carrito
 */
const cartLinkUpdate = (): void => {
    cartLink.innerHTML = ``;

    if (getCartItems().length !== 0) {
        let totalItems: number = 0;
        getCartItems().forEach(item => {
            totalItems += item.cantidad;
        })
        cartLink.innerHTML = `Carrito <p class="cartLink-counter">${totalItems}</p>`
    } else {
        cartLink.innerHTML = `Carrito`;
    }
};


/* -- Llamado a funciones -- */
categoryDrawing();
productDrawing();
cartLinkUpdate();
