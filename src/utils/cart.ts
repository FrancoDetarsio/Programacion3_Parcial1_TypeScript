// Lógica reutilizable: las funciones del carrito (agregar, actualizar cantidad, obtener ítems,
// calcular total) van en src/utils/cart.ts; las vistas solo renderizan y escuchan eventos.

import { PRODUCTS } from "../data/data";
import type { IProduct } from "../types/product";
import type { ICartItem } from "../types/product";

// Recuperación de datos localStorage
const savedCart = localStorage.getItem("cart") || "[]"; // si "cart" esta vacío se retorna un array vacío
let productsSaved: ICartItem[] = JSON.parse(savedCart); // convertimos el string retornado a un objeto ICartItem[]
export let getCartItems = (): ICartItem[] => productsSaved; // constante que utiliza el cart.ts para renderizar la vista



export const addToCart = ((product: IProduct, update: boolean): void => {

    const itemToAdd = productsSaved.find(item => item.id === product.id);

    if (itemToAdd) {
        quantUpdate(itemToAdd, update);
    } else {
        productsSaved.push(createICartItem(product));
        saveCart(productsSaved);
    }

});

/**
 * recibe un IProduct y lo transforma en un ICartItem
 * (por defecto se inicializa en cantidad = 1)
 * @param product 
 * @returns ICartItem
 */
const createICartItem = ((product: IProduct): ICartItem => {
    const cartItem: ICartItem = {
        id: product.id,
        imagen: product.imagen,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1
    }
    return cartItem;
});

/**
 * Recibe un item existente en el carrito
 * - verifica que no sobrepase las unidades disponibles del producto (si lo hace lanza alerta)
 * - Update: true (suma una unidad a la cantidad y guarda la lista en localstorage)
 * - Update: false (resta una unidad a la cantidad, si la cantidad = 0 elimina el producto, luego guarda la lista en LocalStorage)
 * @param cartItem 
 * @param update 
 */
export const quantUpdate = ((cartItem: ICartItem, update: boolean) => {
    if (update) {

        const product = PRODUCTS.find(product => product.id === cartItem.id);
        if (product && cartItem.cantidad >= product.stock) {
            return alert("No se pueden agregar mas unidades de este producto.");
        } else if (product) {
            cartItem.cantidad++
        }
    } else {
        cartItem.cantidad--;
        if (cartItem.cantidad === 0) {
            productsSaved = productsSaved.filter(item => item.cantidad !== 0)
        }
    }
    saveCart(productsSaved);
});

const saveCart = (savedProducts: ICartItem[]): void => {
    localStorage.setItem("cart", JSON.stringify(savedProducts))
}

// To Do
// ● Al agregar un producto, este debe guardarse en localStorage bajo la clave "cart".
// ● Si el producto ya fue agregado previamente, debe actualizarse su cantidad en lugar de duplicarse como ítem separado.
// ● Debe existir algún indicador visual de que la acción se realizó correctamente.
// ● Debe existir una vista o página de carrito accesible desde la navegación.
// ● En ella deben mostrarse, como mínimo: nombre del producto, precio y cantidad.
// ● Si el carrito está vacío, debe mostrarse un mensaje indicándolo.
// ● La información debe recuperarse desde localStorage (clave "cart").
// ● En la vista del carrito debe mostrarse el total general.
// ● El total debe calcularse como la suma de todos los subtotales de los productos agregados.
// ● El valor debe actualizarse correctamente según el contenido almacenado.