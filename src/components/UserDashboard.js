import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../fireBaseConfig/firebase";
import { useParams } from "react-router-dom";

const UserDashboard = () => {
  const [transferRut, setTransferRut] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [user, setUser] = useState(null);
  const { userId } = useParams(); // Obtener el parámetro 'userId' de la URL

  const handleTransferClick = async (e) => {
    e.preventDefault();
  
    // Verificar si el RUT y el monto son válidos
    if (!transferRut || !transferAmount) {
      alert("Por favor ingresa un RUT y un monto válido.");
      return;
    }
  
    try {
      // Obtener el documento del usuario actual (quien realiza la transferencia)
      const currentUserRef = doc(db, "users", userId);
      const currentUserDoc = await getDoc(currentUserRef);
  
      if (!currentUserDoc.exists()) {
        alert("Usuario no encontrado.");
        return;
      }
  
      const currentUserData = currentUserDoc.data();
      const currentBalance = currentUserData.saldo[0]; // Saldo de la cuenta corriente
  
      if (parseInt(transferAmount) > currentBalance) {
        alert("Saldo insuficiente para realizar la transferencia.");
        return;
      }
  
      // Actualizar el saldo del usuario actual (quien realiza la transferencia)
      const updatedCurrentBalance = currentBalance - parseInt(transferAmount);
  
      await updateDoc(currentUserRef, {
        saldo: [updatedCurrentBalance, currentUserData.saldo[0]], // Actualizar solo el saldo de la cuenta corriente
      });
  
      // Buscar al usuario destinatario por su RUT y actualizar su saldo
    const destinatarioQuery = query(collection(db, "users"), where("dni", "==", transferRut));
    const destinatarioSnapshot = await getDocs(destinatarioQuery);

    if (destinatarioSnapshot.size === 0) {
      alert("Destinatario no encontrado con el RUT proporcionado.");
      return;
    }

    // Debería ser solo un documento, actualizar su saldo
    const destinatarioDoc = destinatarioSnapshot.docs[0];
    const destinatarioRef = destinatarioDoc.ref;
    const destinatarioData = destinatarioDoc.data();
    const updatedDestinatarioBalance = destinatarioData.saldo[0] + parseInt(transferAmount);

    await updateDoc(destinatarioRef, {
      saldo: [updatedDestinatarioBalance, destinatarioData.saldo[0]],
    });

    console.log("Saldo actualizado para destinatario:", destinatarioRef.id);
    alert("Transferencia realizada con éxito.");
  } catch (error) {
    console.error("Error al realizar la transferencia:", error);
  }
  };

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
          <div className="card">
            <h2 className="card-title">Perfil de usuario</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Nombre:</strong> {user.userName}
              </li>
              <li className="list-group-item">
                <strong>Apellido:</strong> {user.lastName}
              </li>
              <li className="list-group-item">
                <strong>Correo electrónico:</strong> {user.email}
              </li>
              <li className="list-group-item">
                <strong>RUT:</strong> {user.dni}
              </li>
              <li className="list-group-item">
                <strong>País:</strong> {user.country}
              </li>
              <li className="list-group-item">
                <strong>Teléfono:</strong> {user.phone}
              </li>
            </ul>
            <button className="btn btn-primary btn-block">Editar perfil</button>
          </div>
        </div>
  
        <div className="col-md-4">
          <div className="card">
            <h2 className="card-title">Consulta de Saldo</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Cuenta corriente:</strong> {user.saldo[0]}
              </li>
              <li className="list-group-item">
                <strong>Cuenta de ahorro:</strong> {user.saldo[1]}
              </li>
            </ul>
          </div>
        </div>
  
        <div className="col-md-4">
          <div className="card">
            <h2 className="card-title">Transferencia de Fondos</h2>
            <form>
              <div className="form-group">
                <label>RUT del destinatario:</label>
                <input
                  type="text"
                  value={transferRut}
                  onChange={(e) => setTransferRut(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Monto a transferir:</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="form-control"
                />
              </div>
              <button className="btn btn-primary btn-block" onClick={handleTransferClick}>
                Transferir
              </button>
            </form>
          </div>
        </div>
  
        <div className="col-md-4">
          <div className="card">
            <h2 className="card-title">Pago de Facturas</h2>
            <form>
              <div className="form-group">
                <label>Tipo de factura:</label>
                <select className="form-control">
                  <option value="publicServices">Servicios públicos</option>
                  <option value="creditCard">Tarjeta de crédito</option>
                  <option value="loan">Préstamo</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Número de factura:</label>
                <input type="text" placeholder="Número de factura" className="form-control" />
              </div>
              <div className="form-group">
                <label>Monto a pagar:</label>
                <input type="number" placeholder="Monto a pagar" className="form-control" />
              </div>
              <div className="form-group">
                <label>Fecha de vencimiento:</label>
                <input type="date" placeholder="Fecha de vencimiento" className="form-control" />
              </div>
              <button className="btn btn-primary btn-block" onClick={handlePayBillClick}>
                Pagar factura
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

