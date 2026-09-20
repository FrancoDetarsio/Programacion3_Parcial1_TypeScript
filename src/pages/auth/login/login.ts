import { navigate } from "../../../utils/navigate";
import { saveUser } from "../../../utils/localStorage";
import { verifyUserLogin } from "../../../utils/auth";
import { testUsers } from "../registro/registro"; // Solo para pruebas con ususarios creados

const form = document.querySelector<HTMLElement>("#form-login");
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form?.addEventListener("submit", (e: SubmitEvent) => {
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

testUsers(); // funcion con ususarios precargados para pruebas