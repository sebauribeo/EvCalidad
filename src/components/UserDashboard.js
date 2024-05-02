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

  const handleTransferClick = async (e) => {
    e.preventDefault();
    // Add your transfer logic here
  };

  const handlePayBillClick = async (e) => {
    e.preventDefault();
    // Add your payment logic here
    // You can use the values from the form to make a payment request to your payment gateway
    // For example:
    const paymentData = {
      type: document.querySelector('select[name="type"]').value,
      billNumber: document.querySelector('input[name="billNumber"]').value,
      amount: document.querySelector('input[name="amount"]').value,
      dueDate: document.querySelector('input[name="dueDate"]').value,
    };
    // Make a payment request to your payment gateway
    //...
  };


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
              <strong>Cuenta corriente:</strong> {user.saldo[0]}
            </li>
            <li>
              <strong>Cuenta de ahorro:</strong> {user.saldo[1]}
            </li>
          </ul>
          <button className="btn btn-primary">Ver saldo</button>
        </div>

        <div className="col-md-4">
          <h2>Transferencias de Fondos</h2>
          <form>
            <label>Desde:</label>
            <select>
              <option value="currentAccount">Cuenta corriente</option>
              <option value="savingsAccount">Cuenta de ahorro</option>
              <option value="creditCard">Tarjeta de crédito</option>
            </select>
            <br />
            <label>Hasta:</label>
            <input type="text" placeholder="Cuenta destino" />
            <br />
            <label>Monto:</label>
            <input type="number" placeholder="Monto a transferir" />
            <br />
          </form>
          <button className="btn btn-primary" onClick={handleTransferClick}>Transferir</button>
        </div>

        <div className="col-md-4">
          <h2>Pago de Facturas</h2>
          <form>
            <label>Tipo de factura:</label>
            <select>
              <option value="publicServices">Servicios públicos</option>
              <option value="creditCard">Tarjeta de crédito</option>
              <option value="loan">Préstamo</option>
              <option value="other">Otro</option>
            </select>
            <br />
            <label>Número de factura:</label>
            <input type="text" placeholder="Número de factura" />
            <br />
            <label>Monto a pagar:</label>
            <input type="number" placeholder="Monto a pagar" />
            <br />
            <label>Fecha de vencimiento:</label>
            <input type="date" placeholder="Fecha de vencimiento" />
            <br />
          </form>
          <button className="btn btn-primary" onClick={handlePayBillClick}>Pagar factura</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

