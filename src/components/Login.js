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
    const res = signInWithEmailAndPassword(auth, email, password);
    let role
    res
    .then(async () => {
        const getUserId = auth.currentUser.uid;
        const getRol = async () => {
          const docRef = doc(firestore, `users/${getUserId}`);
          const getDocUser = await getDoc(docRef);
          const uidUser = getDocUser.data().role;
          return uidUser;
        };
        role = await getRol(getUserId)
        role === 'admin' ? navigate('/users') : navigate('/usersDasboard');
        Swal.fire({
          icon: "success",
          title: `Redirigiendo a tu sesion`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: `Credenciales incorrectas`,
          showConfirmButton: false,
          timer: 2500,
        });
      });
  };

  return (
    <>
      <div className="mt-5">
        <h2 className="m-5">Ingresar a sesion</h2>
        <form onSubmit={submithandler} className="mx-5 px-5">
          <div className="mb-3">
            <label for="email" className="form-label">
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
            <label for="password" className="form-label">
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
