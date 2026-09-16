import type { ICategory } from "./category" 

export interface IProduct {
    id: number,
    eliminado: boolean,
    createdAt: string,
    nombre: string,
    precio: number,
    descripcion: string,
    stock: number,
    imagen: string,
    disponible: boolean,
    categorias: ICategory[]
}

export interface ICartItem {
    id: number,
    nombre: string,
    precio: number,
    categorias: ICategory,
    cantidad: number
}
