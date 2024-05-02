import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../fireBaseConfig/firebase";
import { useParams } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams(); // Obtener el parámetro 'userId' de la URL

  const getUserById = async (id) => {
    try {
      if (!id) {
        console.error("ID de usuario no válido.");
        return;
      }
      const userRef = doc(db, "users", id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        console.log("Datos del usuario:", userData);
      } else {
        console.log("Usuario no encontrado para el ID:", id);
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  useEffect(() => {
    getUserById(userId); // Llama a la función para obtener los datos del usuario
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Dependencia 'userId' para ejecutar useEffect cuando cambie

  if (!user) {
    return <div>Cargando...</div>; // Muestra "Cargando..." mientras se obtienen los datos del usuario
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <h2>Perfil de usuario</h2>
          <ul>
            <li>
              <strong>Nombre:</strong> {user.userName}
            </li>
            <li>
              <strong>Apellido:</strong> {user.lastName}
            </li>
            <li>
              <strong>Correo electrónico:</strong> {user.email}
            </li>
            <li>
              <strong>RUT:</strong> {user.dni}
            </li>
            <li>
              <strong>País:</strong> {user.country}
            </li>
            <li>
              <strong>Teléfono:</strong> {user.phone}
            </li>
          </ul>
          <button className="btn btn-primary">Editar perfil</button>
        </div>

        <div className="col-md-4">
          <h2>Consulta de Saldo</h2>
          <ul>
            <li>
              <strong>Cuenta corriente:</strong> 
            </li>
            <li>
              <strong>Cuenta de ahorro:</strong> 
            </li>
            <li>
              <strong>Tarjeta de crédito:</strong> 
            </li>
          </ul>
          <button className="btn btn-primary">Ver saldo</button>
        </div>

        {/* Otros elementos del dashboard... */}
      </div>
    </div>
  );
};

export default UserDashboard;

