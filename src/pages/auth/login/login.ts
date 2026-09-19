import { navigate } from "../../../utils/navigate";
import { saveUser } from "../../../utils/localStorage";
import { verifyUserLogin } from "../../../utils/auth";
import { users } from "../registro/registro"; // Solo para pruebas con ususarios creados

const form = document.getElementById("form-login") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;

  const verifiedUser = verifyUserLogin(valueEmail, valuePassword);
  
  if (verifiedUser) {
    saveUser(verifiedUser);
    if (verifiedUser.role === "admin") {
      navigate("/src/pages/admin/home/home.html");
    } else if (verifiedUser.role === "client") {
      navigate("/src/pages/client/home/home.html");
    }
  } else {
    alert("email o contraseña inválidos.")
  }
});

/* -- Usuarios de Prueba -- */
/**
 * función para facilitar pruebas de testeo.
 * inicializa automaticamente 2 usuarios:
 * - uno con rol "client"
 * - uno con rol "admin"
 */
const testUsers = (): void => {

    if (users.length === 0) {
                const newUser1: IUser = {
        email: "client@gmail.com",
        password: "client",
        role: "client",
        loggedIn: false
    }

        const newUser2: IUser = {
        email: "admin@gmail.com",
        password: "admin",
        role: "admin",
        loggedIn: false
    }

    users.push(newUser1);
    users.push(newUser2);

    localStorage.setItem("users", JSON.stringify(users));
    }
}
testUsers();