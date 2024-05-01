import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../fireBaseConfig/firebase";

const UserDashboard = ({ userId }) => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  // Define setUsers

  // REFERENCIA A LA DB DE FIRESTORE
  const usersCollections = collection(db, "users");

  // FUNCION PARA MOSTAR TODOS LOS PRODUCTOS
  const getUsersCollection = async (usersCollections) => {
    const data = await getDocs(usersCollections);
    setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
  };
  console.log(getUsersCollection);
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef); // Use getDoc from firebase/firestore
        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          console.log("No such user!");
        }
      };
      fetchUser();
    }
  }, [userId]);

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
              <strong>Cuenta corriente:</strong> {user.currentAccountBalance}
            </li>
            <li>
              <strong>Cuenta de ahorro:</strong> {user.savingsAccountBalance}
            </li>
            <li>
              <strong>Tarjeta de crédito:</strong> {user.creditCardBalance}
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
