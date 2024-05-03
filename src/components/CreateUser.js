// Importa los módulos necesarios de React y Firebase
import React, { useState } from "react";
import { setDoc, doc, getFirestore } from "firebase/firestore"; // Firestore
import { app } from "../fireBaseConfig/firebase"; // Configuración de Firebase
import { useNavigate } from 'react-router-dom'; // Navegación en React Router
import Swal from 'sweetalert2'; // SweetAlert para alertas
import withReactContent from 'sweetalert2-react-content'; // Integración de SweetAlert con React
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; // Autenticación de Firebase

// Configura SweetAlert con React
const MySwal = withReactContent(Swal);

// Define el componente CreateUser
const CreateUser = () => {
  // Estados para los campos del formulario y otras variables necesarias
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
  const navigate = useNavigate(); // Hook para la navegación en React Router
  const fireStore = getFirestore(app); // Instancia de Firestore
  const auth = getAuth(app); // Instancia de Firebase Auth

  // Función para manejar el envío del formulario
  const createUser = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe

    // Función para crear un usuario en Firebase Authentication y guardar datos adicionales en Firestore
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
      // Crea el usuario en Firebase Authentication
      const infoUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((fireBaseUser) => {
        return fireBaseUser;
      });
      
      // Crea un documento de usuario en Firestore con datos adicionales
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

      // Crea un documento para los productos del usuario en Firestore
      const newUserProducts = doc(fireStore, `userProducts/${infoUser.user.uid}`);
      setDoc(newUserProducts, {
        debitId: '',
        debit: false,
        debitAmount: 0,
        creditId: '',
        credit: false,
        creditDebt: 0,
        creditAmount: 0,
        savingAccountId: '',
        savingAccount: false,
        savingAccountAmount: 0,
        totalSavingAccountMovements: 0,
        created_at: new Date(),
        updated_at: updated_at,
      });
    }

    // Limpiar el formulario después de agregar
    setNameUser('');
    setLastName('');
    setAddress('');
    setEmail('');
    setRole('');
    setDni('');
    setCountry('');
    setPhone('');
    setCreated('');
    setUpdated('');

    // Llama a la función para crear el usuario en Firebase y Firestore
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
    );

    // Una vez crea el usuario redirige a vista usuarios
    navigate(`/usersDasboard/${auth.currentUser.uid}`);

    // Alerta de creacion de usuario exitoso
    MySwal.fire({
      icon: "success",
      title: "Usuario creado exitosamente",
      showConfirmButton: false,
      timer: 1500
    });
  };

  // Renderiza el formulario
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
