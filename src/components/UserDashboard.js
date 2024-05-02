import React, { useEffect, useState } from "react";
import { db } from "../fireBaseConfig/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";

function UserDashboard(args) {
  const [debitModal, setDebitModal] = useState(false);
  const [creditModal, setCreditModal] = useState(false);
  const [paymentModal, setPymentModal] = useState(false);
  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [debitId, setDebitId] = useState("");
  const [creditId, setCreditId] = useState("");
  const [debit, setDebit] = useState(false);
  const [credit, setCredit] = useState(false);
  const [debitDebt, setDebitDebt] = useState(0);
  const [creditDebt, setCreditDebt] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [debitAmount, setDebitAmount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const { id } = useParams();
  const uuid = uuidv4();
  const navigate = useNavigate();
  const debitUpModal = () => setDebitModal(!debitModal);
  const creditUpModal = () => setCreditModal(!creditModal);
  const paymentUpModal = () => setPymentModal(!paymentModal);

  const getProductByUserId = async (id) => {
    const userProducts = await getDoc(doc(db, "userProducts", id));
    if (userProducts.exists()) {
      setDebitId(userProducts.data().debitId);
      setCreditId(userProducts.data().creditId);
      setDebit(userProducts.data().debit);
      setCredit(userProducts.data().credit);
      setDebitDebt(userProducts.data().debitDebt);
      setCreditDebt(userProducts.data().creditDebt);
      setCreditAmount(userProducts.data().creditAmount);
      setDebitAmount(userProducts.data().debitAmount);
      setTotalPayment(userProducts.data().totalPayment);
    } else {
      console.log("Prodcutos no encontrado");
    }
  };

  const getUserById = async (id) => {
    const user = await getDoc(doc(db, "users", id));
    if (user.exists()) {
      setNameUser(user.data().userName);
      setLastName(user.data().lastName);
      setEmail(user.data().email);
      setDni(user.data().dni);
      setCountry(user.data().country);
    } else {
      console.log("Usuario no encontrado");
    }
  };

  const addDebitUserProducts = async (e) => {
    e.preventDefault(); // EVITAR QUE EL FORMULARIO SE ENVÍE
    const addDebitProductUser = doc(db, "userProducts", id);
    const data = {
      debitId: uuid,
      debit: true,
      updated_at: new Date(),
    };
    console.log("ID", id);
    await updateDoc(addDebitProductUser, data);

    // ALERTA DE EDICION DE USUARIO EXITOSO
    Swal.fire({
      icon: "success",
      title: "Producto agregado exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const addCreditUserProducts = async (e) => {
    e.preventDefault(); // EVITAR QUE EL FORMULARIO SE ENVÍE
    const addCreditProductUser = doc(db, "userProducts", id);
    const data = {
      creditId: uuid,
      creditAmount: 500000,
      credit: true,
      updated_at: new Date(),
    };
    await updateDoc(addCreditProductUser, data);

    // ALERTA DE EDICION DE USUARIO EXITOSO
    Swal.fire({
      icon: "success",
      title: "Producto agregado exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });
    navigate(`/usersDasboard/${id}`);
  };

  const addDebitAccount = async (e) => {
    e.preventDefault(); // EVITAR QUE EL FORMULARIO SE ENVÍE
    const addDebitAmount = doc(db, "userProducts", id);
    const docSnapshot = await getDoc(addDebitAmount);
    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();
      const currentDebitAmount = currentData.debitAmount || 0;
      // Calcular el nuevo saldo sumando el saldo actual y el monto a agregar
      const updatedDebitAmount =
        parseFloat(currentDebitAmount) + parseFloat(debitAmount);
      // Actualizar el documento con el nuevo saldo
      await updateDoc(addDebitAmount, {
        debitAmount: updatedDebitAmount,
        updated_at: new Date(),
      });
      // ALERTA ADICION A SALDO DE USUARIO EXITOSO
      Swal.fire({
        icon: "success",
        title: "Saldo agregado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
    } else {
      console.error("No se encontró el documento.");
    }
  };

  const addCreditAccount = async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe

    // Obtener referencia al documento del usuario
    const userDocRef = doc(db, "userProducts", id);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      // Obtener datos actuales del usuario
      const userData = docSnapshot.data();
      const currentCreditAmount = userData.creditAmount || 0;
      const currentDebt = userData.creditDebt || 0;

      // Validar la cantidad de crédito a añadir (creditAmount debe ser positivo)
      const updateCreditAccount = parseFloat(creditAmount);
      if (isNaN(creditAmount) || creditAmount <= 0) {
        console.error("La cantidad de crédito no es válida.");
        return;
      }

      // Calcular nuevos valores de crédito y deuda
      const updatedCreditAmount =
        parseFloat(currentCreditAmount) - parseFloat(updateCreditAccount);
      const updatedDebt = parseFloat(currentDebt) + parseFloat(creditAmount);

      // Actualizar el documento del usuario con los nuevos valores
      await updateDoc(userDocRef, {
        creditAmount: updatedCreditAmount,
        creditDebt: updatedDebt,
        updated_at: new Date(),
      });

      // Mostrar alerta de éxito y recargar la página
      Swal.fire({
        icon: "success",
        title: "Crédito descontado de tu cupo",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
    } else {
      console.error("No se encontró el documento del usuario.");
    }
  };

  useEffect(() => {
    getUserById(id);
    getProductByUserId(id);
    // eslint-disable-next-LINE
  }, []);

  return (
    <>
      <div>
        <h1 className="mt-3">Sesion de Usuario</h1>
        <div className="container">
          <div>
            <div className="card mt-5">
              <div className="card-header">
                <h3>
                  {userName} {lastName}
                </h3>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item h5">
                  <strong>Mail: </strong>
                  {email}
                </li>
                <li className="list-group-item h5">
                  <strong>RUT: </strong>
                  {dni}
                </li>
                <li className="list-group-item h5">
                  <strong>Pais: </strong>
                  {country}
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="mt-3 col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h3>Debito</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5">
                    <strong>Estado producto : </strong>
                    {debit === true ? "Activado" : "Desactivado"}
                  </li>
                  <li className="list-group-item h5">
                    <strong>N° Cuenta: </strong>
                    {debitId === "" ? "Aun sin contratar" : debitId}
                  </li>
                  <li className="list-group-item h5">
                    <strong>Saldo : $</strong>
                    {debitAmount}
                  </li>
                  {debit === false ? (
                    <li className="list-group-item h5">
                      <form onSubmit={addDebitUserProducts} className="">
                        <div className="col-6 mx-auto">
                          <button type="submit" className="btn btn-success">
                            Activar producto
                          </button>
                        </div>
                      </form>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
            <div className="mt-3 col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h3>Credito</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5">
                    <strong>Estado producto : </strong>
                    {credit === true ? "Activado" : "Desactivado"}
                  </li>
                  <li className="list-group-item h5">
                    <strong>N° Cuenta: </strong>
                    {creditId === "" ? "Aun sin contratar" : creditId}
                  </li>
                  <li className="list-group-item h5">
                    <strong>Cupo Actual: $</strong>
                    {creditAmount}
                  </li>
                  <li className="list-group-item h5">
                    <strong>Deuda: $</strong>
                    {creditDebt}
                  </li>
                  {credit === false ? (
                    <li className="list-group-item h5">
                      <form onSubmit={addCreditUserProducts} className="">
                        <div className="col-6 mx-auto">
                          <button type="submit" className="btn btn-success">
                            Activar producto
                          </button>
                        </div>
                      </form>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-header">
              <h3>Estado de cuentas</h3>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item h5">
                <strong>Deuda total: $</strong>
                {creditDebt}
              </li>
            </ul>
          </div>
          <div className="row mt-4">
            <div className="mt-3 col-4">
              <Button color="success" onClick={debitUpModal}>
                Depositar a debito
              </Button>
            </div>
            <div className="mt-3 col-4">
              <Button color="success" onClick={creditUpModal}>
                Solicitar credito
              </Button>
            </div>
            <div className="mt-3 col-4">
              <Button color="success" onClick={paymentUpModal}>
                Pagar cuenta
              </Button>
            </div>
            <div>
              <div className="container mt-5">
                <Modal
                  size={"xl"}
                  centered={true}
                  isOpen={debitModal}
                  toggle={debitUpModal}
                  {...args}
                >
                  <ModalHeader toggle={debitUpModal}>
                    Deposito a cuenta debito
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={addDebitAccount} className="mt-5">
                      <div className="input-group mb-3">
                        <span
                          className="input-group-text"
                          id="inputGroup-sizing-default"
                        >
                          Ingresa el valor
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          aria-label="Sizing example input"
                          aria-describedby="inputGroup-sizing-default"
                          // value={}
                          onChange={(e) => setDebitAmount(e.target.value)}
                        />
                      </div>
                      <div className="d-grid gap-2 col-6 mx-auto">
                        <button
                          type="submit"
                          className="btn btn-success mt-5"
                          onClick={debitUpModal}
                        >
                          Agregar a saldo
                        </button>
                        <Button color="danger" onClick={debitUpModal}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                </Modal>
              </div>
              <div>
                <Modal
                  size={"xl"}
                  centered={true}
                  isOpen={creditModal}
                  toggle={creditUpModal}
                  {...args}
                >
                  <ModalHeader toggle={creditUpModal}>
                    Solicitud de credito
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={addCreditAccount} className="mt-5">
                      <div className="input-group mb-3">
                        <span
                          className="input-group-text"
                          id="inputGroup-sizing-default"
                        >
                          Ingresa el valor
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          aria-label="Sizing example input"
                          aria-describedby="inputGroup-sizing-default"
                          // value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                        />
                      </div>
                      <div className="d-grid gap-2 col-6 mx-auto">
                        <button
                          type="submit"
                          className="btn btn-success mt-5"
                          onClick={creditUpModal}
                        >
                          Aceptar transacción
                        </button>
                        <Button color="danger" onClick={creditUpModal}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
