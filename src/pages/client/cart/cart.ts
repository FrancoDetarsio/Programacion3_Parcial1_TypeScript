// -- Script de Renderizado --

import type { ICartItem } from "../../../types/product";
import { getCartItems, quantUpdate } from "../../../utils/cart";

// Elementos del DOM
const itemsConteiner = document.querySelector<HTMLElement>("#cart-items")!;
const checkoutContainer = document.querySelector<HTMLElement>("#cart-checkout_items")!;


const cartItemsDrawing = () => {
    itemsConteiner.innerHTML = "";

    getCartItems().forEach(item => {
        const card: HTMLElement = createItemCard(item);
        card.className = "card-item";

        itemsConteiner.appendChild(card);
    })

    if (getCartItems().length === 0) {
        itemsConteiner.innerHTML = `<p class="empty-cart">No hay productos agregados.</p>`;
    }

    checkoutDrawing();
}

const createItemCard = (item: ICartItem): HTMLElement => {
    const itemCard = document.createElement("div");
    itemCard.innerHTML = `
        <img class="cart-img" src="${item.imagen}" alt="${item.nombre}"/>
        <div class="cart-info">
            <h3 class="cart-nombre">${item.nombre}</h3>
            <p class="cart-price">Precio: $${item.precio}</p>
        </div>
    `;

    const btnsPriceContainer = document.createElement("div");
    btnsPriceContainer.className = "cart-price_btn";

    btnsPriceContainer.appendChild(cartBtnsCreate(item));
    btnsPriceContainer.appendChild(itemSubTotal(item));

    itemCard.appendChild(btnsPriceContainer)

    return itemCard;
};

const cartBtnsCreate = (item: ICartItem): HTMLElement => {
    const cartBtnsContainer = document.createElement("div");
    cartBtnsContainer.className = "cartBtnsContainer";

    const minusBtn = document.createElement("button");
    const plusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.className = "cart-minusBtn";
    plusBtn.textContent = "+";
    plusBtn.className = "cart-plusBtn";
    
    minusBtn.addEventListener("click", () => {
        quantUpdate(item, false);
        cartItemsDrawing();
    })
    plusBtn.addEventListener("click", () => {
        quantUpdate(item, true);
        cartItemsDrawing();
    })

    const counter = document.createElement("div");
    counter.innerText = `${item.cantidad}`;
    counter.className = "cart-counter";


    cartBtnsContainer.appendChild(minusBtn);
    cartBtnsContainer.appendChild(counter);
    cartBtnsContainer.appendChild(plusBtn);

    return cartBtnsContainer;
};

const itemSubTotal = (item: ICartItem): HTMLElement => {
    const subTotal = document.createElement("p");
    subTotal.innerText = `Subtotal: $${item.cantidad * item.precio}`;
    subTotal.className = "cart-subtotal"
    return subTotal;
};

const checkoutDrawing = (): void => {
    checkoutContainer.innerHTML = `
        <p class="cart-checkout_items-total">$${cartTotal()}</p>
        <button class="cart-checkout_items-btn" disabled title="Funcion no disponible">Finalizar Compra</>
    `
}

const cartTotal = (): number => {
    let cartTotal = 0;
    getCartItems().forEach(item => 
        cartTotal += (item.cantidad * item.precio))
    return cartTotal;
};


cartItemsDrawing();