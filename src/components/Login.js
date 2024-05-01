import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../fireBaseConfig/firebase";
import Swal from "sweetalert2";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const firestore = getFirestore(app);
const auth = getAuth(app);

const Login = () => {
  const navigate = useNavigate();

  const submithandler = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const userId = auth.currentUser.uid;
        const docRef = doc(firestore, `users/${userId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userDoc = docSnap.data();
          const role = userDoc.role;

          role === "admin" ? navigate("/users") : navigate(`/usersDasboard/${userId}`);

          Swal.fire({
            icon: "success",
            title: `¡Bienvenido, ${userDoc.userName}! Redirigiendo a tu sesión`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Usuario no encontrado",
            text: "Por favor, verifique sus credenciales",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: error.message,
        });
      });
  };

  return (
    <>
      <div className="mt-5">
        <h2 className="m-5">Ingresar a sesión</h2>
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
        <Link className="btn btn-success mt-5" to={"/Create"}>
          Registrarse
        </Link>
      </div>
    </>
  );
};

export default Login;
