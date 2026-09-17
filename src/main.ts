import './style.css';
import { logout, checkAuhtUser } from './utils/auth';


// Estructura botón logout, si no existe se contempla por el "?"
const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
    logout();
});

const getCurrentPage = (): string => {
    return window.location.pathname;  // Devuelve un string con la ruta actual del navegador
}

/**
 * Se encarga de verificar mediante el CurrentPage de invocar el script adecuado
 * ademas valida por rol denegando acceso a paginas privadas
 * @param currentPage 
 */
const scriptValidation = async (currentPage: string): Promise<void> => {
    
    switch (true) {                                             // Evalúa condición verdadera
        case currentPage.includes("login"):                     // Si el path actual contiene login
            await import("./pages/auth/login/login");           // se importa el script correspondiente
            break;

        case currentPage.includes("registro"):
            await import("./pages/auth/registro/registro");
            break;

        case currentPage.includes("admin"):
            console.log("inicio de pagina");
            checkAuhtUser(
                "/src/pages/auth/login/login.html",
                "/src/pages/client/home/home.html",
                "admin"
            );
            break;

        case currentPage.includes("client"):
            console.log("inicio de pagina");
            checkAuhtUser(
                "/src/pages/auth/login/login.html",
                "/src/pages/admin/home/home.html",
                "client"
            );

            // Luego de la autentificación derivamos al script correspondiente
            if (currentPage.includes("home")) {
                await import("./pages/client/home/home");
            } else if (currentPage.includes("cart")) {
                await import("./pages/client/cart/cart");
            }
            
            break;
    }
}

scriptValidation(getCurrentPage());