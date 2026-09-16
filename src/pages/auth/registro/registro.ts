import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";

// Obtención de elementos del DOM
const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

// Recuperación de datos localStorage
const savedUsers = localStorage.getItem("users") || "[]"; // si "users" esta vacío se retorna un array vacío
const users: IUser[] = JSON.parse(savedUsers); // convertimos el string retornado a un objeto IUser[]

form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault(); // El formulario no se recarga
    
    const valueEmail: string = inputEmail.value;
    const valuePassword: string = inputPassword.value;

    // verificamos si el email ya existe en la base de datos para evitar duplicados
    if (users.some(user => user.email === valueEmail)) {
        alert("El email ingresado ya esta en uso");
        return;
    };

    const newUser: IUser = {     // Guardamos los datos del nuevo ususario
        email: valueEmail,
        password: valuePassword,
        role: "client",          // por defecto se guarda en cliente
        loggedIn: false
    }

    // añadimos los datos del nuevo ususario al array de ususarios del almacenamiento
    users.push(newUser);

    // Guardamos los ususarios nuevamente en el localStorage pasando a string
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Usuario creado, redireccionando a login.")
    navigate("/src/pages/auth/login/login.html"); // volvemos al login
})