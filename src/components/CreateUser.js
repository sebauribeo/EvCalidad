// Importa los módulos necesarios de React y Firebase
import React, { useState } from "react";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import { app, auth } from "../fireBaseConfig/firebase";
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { createUserWithEmailAndPassword } from "firebase/auth";


const MySwal = withReactContent(Swal)
const CreateUser = () => {
  // Estados para los campos del formulario
  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [created_at, setCreated] = useState("");
  const [updated_at, setUpdated] = useState("");
  const navigate = useNavigate();
  const fireStore = getFirestore(app)


  // Función para manejar el envío del formulario
  const createUser = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe

    const createFBUser = async (
      email,
      password,
      userName,
      lastName,
      address,
      role,
      dni,
      country,
      phone,
      created_at,
    ) => {
      const infoUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((fireBaseUser) => {
        return fireBaseUser;
      });
        
      const newUser = doc(fireStore, `users/${infoUser.user.uid}`);
      setDoc(newUser, {
        userName: userName,
        lastName: lastName,
        address: address,
        email: email,
        password: password,
        role: 'user',
        dni: dni,
        country: country,
        phone: phone,
        created_at: new Date(),
        updated_at: updated_at,
      });

      const newUserProducts = doc(fireStore, `userProducts/${infoUser.user.uid}`);
      setDoc(newUserProducts, {
        debitId: '',
        creditId: '',
        debit: false,
        credit: false,
        debitDebt: 0,
        creditDebt: 0,
        creditAmount: 0,
        debitAmount: 0,
        totalPayment: 0,
        created_at: new Date(),
        updated_at: updated_at,
      });
    }

      // Limpiar el formulario después de agregar
      setNameUser('');
      setLastName('');
      setAddress('');
      setEmail('');
      setRole('',)
      setDni('');
      setCountry('');
      setPhone('');
      setCreated('');
      setUpdated('');

      createFBUser(
        email,
        password,
        userName,
        lastName,
        address,
        role,
        dni,
        country,
        phone,
        created_at,
      )
      // UNA VEZ CREA EL USUARIO REDIRIGE A VISTA USUARIOS
      navigate("/");

      // ALERTA DE CREACION DE USUARIO EXITOSO
      MySwal.fire({
        icon: "success",
        title: "Usuario creado exitosamente",
        showConfirmButton: false,
        timer: 1500
      });
  };

  return (
    <>
      <div>
        <h1 className="text-center mt-5">Crear Usuario</h1>
      </div>
      <form onSubmit={createUser} className="container mt-5">
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Nombre
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={userName}
            onChange={(e) => setNameUser(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Apellido
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Direccion
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Mail
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Contraseña
          </span>
          <input
            type="password"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Rut
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Pais
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Telefono
          </span>
          <input
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="d-grid gap-2 col-6 mx-auto">
          <button type="submit" className="btn btn-primary">
            Agregar Usuario
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateUser;
