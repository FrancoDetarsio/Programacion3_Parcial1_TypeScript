/* == Script de Lógica == */
import { PRODUCTS } from "../data/data";
import type { IProduct } from "../types/product";
import type { ICartItem } from "../types/product";

/* -- Recuperación de datos localStorage -- */
const savedCart = localStorage.getItem("cart") || "[]"; // si "cart" esta vacío se retorna un array vacío
let productsSaved: ICartItem[] = JSON.parse(savedCart); // convertimos el string retornado a un objeto ICartItem[]
export let getCartItems = (): ICartItem[] => productsSaved; // constante que utiliza el cart.ts para renderizar la vista

/**
 * recibe un producto y un booleano cofirmando si se quiere agregar o
 * quitar un elemento al carrito.
 * si se desea agregar se verifica:
 * - si el carro esta vacio se agrega el producto
 * - si el carro ya contiene el producto, se le suma una unidad al mismo
 * @param product 
 * @param update 
 */
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

/**
 * recibe la lista de productos actualizada lista para guardar en memoria
 * @param savedProducts 
 */
const saveCart = (savedProducts: ICartItem[]): void => {
    localStorage.setItem("cart", JSON.stringify(savedProducts))
}
