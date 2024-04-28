// Importa los módulos necesarios de React y Firebase
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../fireBaseConfig/firebase";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  // Estados para los campos del formulario
  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [mail, setMail] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [updated_at, setUpdated] = useState("");

  const navigate = useNavigate();
  const {id} = useParams();

  const updateUser = async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe
    const user = doc(db, "users", id);
    const data = {
      userName: userName,
      lastName: lastName,
      address: address,
      mail: mail,
      dni: dni,
      country: country,
      phone: phone,
      updated_at: new Date(),
    };
    await updateDoc(user, data);
    navigate("/users");
  };

  const getUserById = async (id) => {
    const user = await getDoc(doc(db, "users", id));
    if (user.exists()) {
      setNameUser(user.data().userName);
      setLastName(user.data().lastName);
      setAddress(user.data().address);
      setMail(user.data().mail);
      setDni(user.data().dni);
      setCountry(user.data().country);
      setPhone(user.data().phone);
      setUpdated(user.data().updated_at);
    } else {
      console.log("Usuario no encontrado");
    }
  };

  useEffect(() => {
    getUserById(id);
    // eslint-disable-next-LINE
  }, []);

  return (
    <>
      <div>
        <h1 className="text-center mt-5">Editar Usuario</h1>
      </div>
      <form onSubmit={updateUser} className="container mt-5">
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
            Actualizar Usuario
          </button>
        </div>
      </form>
    </>
  );
};
export default Edit;
