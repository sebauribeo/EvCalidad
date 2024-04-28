// Importa los módulos necesarios de React y Firebase
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../fireBaseConfig/firebase";

const CreateUser = () => {
  // Estados para los campos del formulario
  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [mail, setMail] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [created_at, setCreated] = useState("");
  const [updated_at, setUpdated] = useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe

    try {
      // Agregar datos a Firestore
      const docRef = await addDoc(collection(db, "users"), {
        userName: userName,
        lastName: lastName,
        address: address,
        mail: mail,
        dni: dni,
        country: country,
        phone: phone,
        created_at: new Date(),
        updated_at: updated_at,
      });
      console.log("Documento agregado con ID: ", docRef.id);

      // Limpiar el formulario después de agregar
      setNameUser("");
      setLastName("");
      setAddress("");
      setMail("");
      setDni("");
      setCountry("");
      setPhone("");
      setCreated("");
      setUpdated("");
      // Limpia más estados aquí si es necesario para otros campos
    } catch (e) {
      console.error("Error al agregar documento: ", e);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-center mt-5">Agregar Usuario</h1>
      </div>
      <form onSubmit={handleSubmit} className="container mt-5">
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
            value={mail}
            onChange={(e) => setMail(e.target.value)}
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
