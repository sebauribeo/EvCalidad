// IMPORTA LOS MÓDULOS NECESARIOS DE REACT Y FIREBASE
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../fireBaseConfig/firebase";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const MySwal = withReactContent(Swal);
const Edit = () => {
  // ESTADOS PARA LOS CAMPOS DEL FORMULARIO
  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [updated_at, setUpdated] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const updateUser = async (e) => {
    e.preventDefault(); // EVITAR QUE EL FORMULARIO SE ENVÍE
    const user = doc(db, "users", id);
    const data = {
      userName: userName,
      lastName: lastName,
      address: address,
      email: email,
      dni: dni,
      country: country,
      phone: phone,
      updated_at: new Date(),
    };
    await updateDoc(user, data);

    // ALERTA DE EDICION DE USUARIO EXITOSO
    MySwal.fire({
      icon: "success",
      title: "Usuario Actualizado exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });

    // UNA VEZ ACTUALIZA EL USUARIO REDIRIGE A VISTA USUARIOS
    navigate("/users");
  };

  const getUserById = async (id) => {
    const user = await getDoc(doc(db, "users", id));
    if (user.exists()) {
      setNameUser(user.data().userName);
      setLastName(user.data().lastName);
      setAddress(user.data().address);
      setEmail(user.data().email);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
