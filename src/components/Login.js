// Importa los módulos necesarios de react y firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Autenticación de Firebase
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../fireBaseConfig/firebase"; // Configuración de Firebase
import Swal from "sweetalert2"; // SweetAlert para alertas
import { doc, getDoc, getFirestore } from "firebase/firestore"; // Firestore

// Instancias de Firestore y Auth
const firestore = getFirestore(app);
const auth = getAuth(app);

const Login = () => {
  const navigate = useNavigate(); // Hook para la navegación en React Router

  // Función para manejar el envío del formulario de inicio de sesión
  const submithandler = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe

    // Obtiene el correo electrónico y la contraseña del formulario
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    // Inicia sesión con correo electrónico y contraseña
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        // Obtiene el ID de usuario actual
        const userId = auth.currentUser.uid;

        // Obtiene el documento de usuario correspondiente al ID
        const docRef = doc(firestore, `users/${userId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Si el usuario existe, obtiene su información
          const userDoc = docSnap.data();
          const role = userDoc.role;

          // Redirige según el rol del usuario
          role === "admin"
            ? navigate("/users")
            : navigate(`/usersDasboard/${userId}`);

          // Muestra una alerta de inicio de sesión exitoso
          Swal.fire({
            icon: "success",
            title: `¡Bienvenido, ${userDoc.userName}! Redirigiendo a tu sesión`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          // Si el usuario no existe, muestra un mensaje de error
          Swal.fire({
            icon: "error",
            title: "Usuario no encontrado",
            text: "Por favor, verifique sus credenciales",
          });
        }
      })
      .catch((error) => {
        // Maneja errores de inicio de sesión
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: error.message,
        });
      });
  };

  // Renderiza el formulario de inicio de sesión
  return (
    <>
      <div className="container mt-5">
        <div className="card">
          <div className="card-header">
            <h2 className="text-white">Ingresar a sesión</h2>
          </div>
          <div className="mt-5">
            <form onSubmit={submithandler} className="mx-5 px-5">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Ingresa tu Mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Ingresa tu contraseña
                </label>
                <input type="password" className="form-control" id="password" />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Ingresar a sesión
              </button>
            </form>
            <Link className="btn btn-success my-5" to={"/Create"}>
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
