// Importa los módulos necesarios de react y firebase
import React, { useEffect, useState } from "react";
import { db } from "../fireBaseConfig/firebase"; // Importar la configuración de Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Importar funciones de Firestore
import { useParams } from "react-router-dom"; // Importar useParams para obtener parámetros de la URL
import { v4 as uuidv4 } from "uuid"; // Importar uuid para generar IDs únicos
import Swal from "sweetalert2"; // Importar SweetAlert2 para mostrar alertas
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap"; // Importar Modal de Reactstrap
import withReactContent from "sweetalert2-react-content"; // Importar SweetAlert2 con soporte para React

// Configurar SweetAlert2 para React
const MySwal = withReactContent(Swal);

const UserDashboard = (args) => {
  // Definir estados locales para gestionar la información del usuario y sus productos financieros
  const [debitModal, setDebitModal] = useState(false);
  const [creditModal, setCreditModal] = useState(false);
  const [retSavingAccountModal, setRetSavingAccountModal] = useState(false);
  const [savingAccountModal, setSavingAccountModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [debitId, setDebitId] = useState("");
  const [debit, setDebit] = useState(false);
  const [debitAmount, setDebitAmount] = useState(0);
  const [creditId, setCreditId] = useState("");
  const [credit, setCredit] = useState(false);
  const [creditDebt, setCreditDebt] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [savingAccountId, setSavingAccountId] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingAccountAmount, setSavingAccountAmount] = useState(0);

  // Obtener el ID del usuario de los parámetros de la URL
  const { id } = useParams();
  // Generar un ID único para las transacciones
  const uuid = uuidv4();

  // Funciones para mostrar u ocultar los modales
  const debitUpModal = () => setDebitModal(!debitModal);
  const creditUpModal = () => setCreditModal(!creditModal);
  const retSavingUpModal = () =>
    setRetSavingAccountModal(!retSavingAccountModal);
  const savingUpModal = () => setSavingAccountModal(!savingAccountModal);
  const paymentUpModal = () => setPaymentModal(!paymentModal);
  // Referencia al documento de los productos del usuario en Firestore
  const getUserproducts = doc(db, "userProducts", id);

  // Función para obtener los productos del usuario por su ID
  const getProductByUserId = async (id) => {
    const userProducts = await getDoc(doc(db, "userProducts", id));
    if (userProducts.exists()) {
      // Actualizar estados locales con la información de los productos del usuario
      setDebitId(userProducts.data().debitId);
      setDebit(userProducts.data().debit);
      setDebitAmount(userProducts.data().debitAmount);
      setCreditId(userProducts.data().creditId);
      setCredit(userProducts.data().credit);
      setCreditDebt(userProducts.data().creditDebt);
      setCreditAmount(userProducts.data().creditAmount);
      setSavingAccountId(userProducts.data().savingAccountId);
      setSavingAccount(userProducts.data().savingAccount);
      setSavingAccountAmount(userProducts.data().savingAccountAmount);
    } else {
      console.log("Productos no encontrados");
    }
  };

  // Función para obtener los datos del usuario por su ID
  const getUserById = async (id) => {
    const user = await getDoc(doc(db, "users", id));
    if (user.exists()) {
      // Actualizar estados locales con la información del usuario
      setNameUser(user.data().userName);
      setLastName(user.data().lastName);
      setEmail(user.data().email);
      setDni(user.data().dni);
      setCountry(user.data().country);
    } else {
      console.log("Usuario no encontrado");
    }
  };

  // Funciones para agregar productos financieros al usuario
  const addDebitUserProducts = async (e) => {
    e.preventDefault();
    const data = {
      debitId: uuid,
      debit: true,
      updated_at: new Date(),
    };
    await updateDoc(getUserproducts, data);

    // Mostrar alerta de éxito y recargar la página
    MySwal.fire({
      icon: "success",
      title: "Producto agregado exitosamente",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      window.location.reload();
    });
  };

  // Función para obtener los datos del usuario por su ID
  const addCreditUserProducts = async (e) => {
    e.preventDefault();
    const data = {
      creditId: uuid,
      creditAmount: 500000,
      credit: true,
      updated_at: new Date(),
    };
    await updateDoc(getUserproducts, data);

    // Mostrar alerta de éxito y recargar la página
    MySwal.fire({
      icon: "success",
      title: "Producto agregado exitosamente",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      window.location.reload();
    });
  };

  // Función para obtener los datos del usuario por su ID
  const addSavingAccountUserProducts = async (e) => {
    e.preventDefault();
    const data = {
      savingAccountId: uuid,
      savingAccount: true,
      updated_at: new Date(),
    };
    await updateDoc(getUserproducts, data);

    // Mostrar alerta de éxito y recargar la página
    MySwal.fire({
      icon: "success",
      title: "Producto agregado exitosamente",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      window.location.reload();
    });
  };

  // Funciones para agregar saldo a los productos financieros del usuario
  const addDebitAccount = async (e) => {
    e.preventDefault();
    const docSnapshot = await getDoc(getUserproducts);
    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();
      const currentDebitAmount = currentData.debitAmount || 0;
      const updatedDebitAmount =
        parseFloat(currentDebitAmount) + parseFloat(debitAmount);
      await updateDoc(getUserproducts, {
        debitAmount: updatedDebitAmount,
        updated_at: new Date(),
      });
      MySwal.fire({
        icon: "success",
        title: "Saldo agregado exitosamente",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.reload();
      });
    } else {
      console.error("No se encontró el documento.");
    }
  };

  // Función para agregar crédito al usuario
  const addCreditAccount = async (e) => {
    e.preventDefault();
    const docSnapshot = await getDoc(getUserproducts);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const currentCreditAmount = userData.creditAmount || 0;
      const currentDebt = userData.creditDebt || 0;
      const updateCreditAccount = parseFloat(creditAmount);
      if (isNaN(creditAmount) || creditAmount <= 0) {
        console.error("La cantidad de crédito no es válida.");
        return;
      }
      const updatedCreditAmount =
        parseFloat(currentCreditAmount) - parseFloat(updateCreditAccount);
      const updatedDebt = parseFloat(currentDebt) + parseFloat(creditAmount);
      await updateDoc(getUserproducts, {
        creditAmount: updatedCreditAmount,
        creditDebt: updatedDebt,
        updated_at: new Date(),
      });
      MySwal.fire({
        icon: "success",
        title: "Crédito descontado de tu cupo",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.reload();
      });
    } else {
      console.error("No se encontró el documento del usuario.");
    }
  };

  // Función para agregar saldo a la cuenta de ahorro del usuario
  const addSavingAccount = async (e) => {
    e.preventDefault();
    const docSnapshot = await getDoc(getUserproducts);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const currentSavingAmount = userData.savingAccountAmount || 0;
      const currentDebitAmount = userData.debitAmount || 0;
      const updatesavingAccount = parseFloat(savingAccountAmount);
      if (isNaN(savingAccountAmount) || savingAccountAmount <= 0) {
        console.error("La cantidad de crédito no es válida.");
        return;
      }
      const updatedDebitAmount =
        parseFloat(currentDebitAmount) - parseFloat(updatesavingAccount);
      const updatedSavingAcc =
        parseFloat(currentSavingAmount) + parseFloat(savingAccountAmount);
      await updateDoc(getUserproducts, {
        debitAmount: updatedDebitAmount,
        savingAccountAmount: updatedSavingAcc,
        updated_at: new Date(),
      });
      MySwal.fire({
        icon: "success",
        title: "Depósito a tu cuenta exitoso",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.reload();
      });
    } else {
      console.error("No se encontró el documento del usuario.");
    }
  };

  // Función para transferir saldo de la cuenta de ahorro al débito
  const savingAccountToDebit = async (e) => {
    e.preventDefault();
    const docSnapshot = await getDoc(getUserproducts);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const currentSavingAmount = userData.savingAccountAmount || 0;
      const currentDebitAmount = userData.debitAmount || 0;
      const updatesavingAccount = parseFloat(savingAccountAmount);
      if (isNaN(savingAccountAmount) || savingAccountAmount <= 0) {
        console.error("La cantidad de crédito no es válida.");
        return;
      }
      const updatedDebitAmount =
        parseFloat(currentDebitAmount) + parseFloat(updatesavingAccount);
      const updatedSavingAcc =
        parseFloat(currentSavingAmount) - parseFloat(savingAccountAmount);
      await updateDoc(getUserproducts, {
        debitAmount: updatedDebitAmount,
        savingAccountAmount: updatedSavingAcc,
        updated_at: new Date(),
      });
      MySwal.fire({
        icon: "success",
        title: "Transferencia exitosa",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.reload();
      });
    } else {
      console.error("No se encontró el documento del usuario.");
    }
  };

  // Función para pagar la deuda del usuario
  const debtPayment = async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe

    // Obtener referencia al documento del usuario
    const docSnapshot = await getDoc(getUserproducts);

    if (docSnapshot.exists()) {
      // Obtener datos actuales del usuario
      const userData = docSnapshot.data();
      const currentCreditAmount = userData.creditAmount || 0;
      const currentDebitAmount = userData.debitAmount || 0;
      const currentCreditDebt = userData.creditDebt || 0;

      // Validar la cantidad de crédito a añadir (creditAmount debe ser positivo)
      const paymentCreditAccount = parseFloat(creditAmount);
      if (isNaN(creditAmount) || creditAmount <= 0) {
        console.error("La cantidad de crédito no es válida.");
        return;
      }

      // Calcular nuevos valores de crédito y deuda
      const updatedDebitAmount =
        parseFloat(currentDebitAmount) - parseFloat(paymentCreditAccount);
      const updatedcreditAmount =
        parseFloat(currentCreditAmount) + parseFloat(paymentCreditAccount);
      const updateCreditdebt =
        parseFloat(currentCreditDebt) - parseFloat(paymentCreditAccount);

      // Actualizar el documento del usuario con los nuevos valores
      await updateDoc(getUserproducts, {
        debitAmount: updatedDebitAmount,
        creditAmount: updatedcreditAmount,
        creditDebt: updateCreditdebt,
        updated_at: new Date(),
      });

      // Mostrar alerta de éxito y recargar la página
      MySwal.fire({
        icon: "success",
        title: "Transferencia exitosa",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.reload();
      });
    } else {
      console.error("No se encontró el documento del usuario.");
    }
  };

  //Uso de useeffect
  useEffect(() => {
    getUserById(id);
    getProductByUserId(id);
    // eslint-disable-next-LINE
  }, []);

  // Renderiza dashboard de los usuarios y opciones entre cuentas
  return (
    <>
      <div>
        <div className="container mt-3">
          <div>
            <div className="card mt-5">
              <div className="card-header">
                <h3 className="text-white">
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
            <div className="mt-3 col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-white">Debito</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5">
                    <strong>Estado producto: </strong>
                    {debit === true ? "Activado" : "Desactivado"}
                  </li>
                  <li className="list-group-item h5">
                    <strong>N° Cuenta: </strong>
                    {debitId === "" ? "Aun sin contratar" : debitId}
                  </li>
                  <li className="list-group-item h5">
                    <strong>Saldo: $</strong>
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
            <div className="mt-3 col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-white">Credito</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5">
                    <strong>Estado producto: </strong>
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
            <div className="mt-3 col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-white">Cuenta de ahorro</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5">
                    <strong>Estado producto: </strong>
                    {savingAccount === true ? "Activado" : "Desactivado"}
                  </li>
                  <li className="list-group-item h5">
                    <strong>N° Cuenta: </strong>
                    {savingAccountId === ""
                      ? "Aun sin contratar"
                      : savingAccountId}
                  </li>
                  <li className="list-group-item h5">
                    <strong>Saldo: $</strong>
                    {savingAccountAmount}
                  </li>
                  {savingAccount === false ? (
                    <li className="list-group-item h5">
                      <form
                        onSubmit={addSavingAccountUserProducts}
                        className=""
                      >
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
          <div className="row my-3 ">
            {debit === true ? (
              <div className="mt-3 col-3">
                <Button color="success" onClick={debitUpModal}>
                  Depositar a debito
                </Button>
              </div>
            ) : null}
            {savingAccount === true ? (
              <div className="mt-3 col-3">
                <Button color="success" onClick={savingUpModal}>
                  Deposito cuenta ahorro
                </Button>
              </div>
            ) : null}
            {savingAccount === true ? (
              <div className="mt-3 col-3">
                <Button color="success" onClick={retSavingUpModal}>
                  Retiro cuenta de ahorro
                </Button>
              </div>
            ) : null}
            {credit === true ? (
              <div className="mt-3 col-3">
                <Button color="success" onClick={creditUpModal}>
                  Solicitar credito
                </Button>
              </div>
            ) : null}

            <div>
              <div>
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
                        <button type="submit" className="btn btn-success mt-5">
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
                  isOpen={savingAccountModal}
                  toggle={savingUpModal}
                  {...args}
                >
                  <ModalHeader toggle={savingUpModal}>
                    Deposito a cuenta debito
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={addSavingAccount} className="mt-5">
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
                          onChange={(e) =>
                            setSavingAccountAmount(e.target.value)
                          }
                        />
                      </div>
                      <div className="d-grid gap-2 col-6 mx-auto">
                        <button type="submit" className="btn btn-success mt-5">
                          Agregar deposito
                        </button>
                        <Button color="danger" onClick={savingUpModal}>
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
                  isOpen={retSavingAccountModal}
                  toggle={retSavingUpModal}
                  {...args}
                >
                  <ModalHeader toggle={retSavingUpModal}>
                    Retiro cuenta de ahorro
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={savingAccountToDebit} className="mt-5">
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
                          onChange={(e) =>
                            setSavingAccountAmount(e.target.value)
                          }
                        />
                      </div>
                      <div className="d-grid gap-2 col-6 mx-auto">
                        <button type="submit" className="btn btn-success mt-5">
                          Agregar deposito
                        </button>
                        <Button color="danger" onClick={retSavingUpModal}>
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
                          onChange={(e) => setCreditAmount(e.target.value)}
                        />
                      </div>
                      <div className="d-grid gap-2 col-6 mx-auto">
                        <button type="submit" className="btn btn-success mt-5">
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
          <div className="card m-5">
            <div className="card-header">
              <h3 className="text-white">Estado de cuentas</h3>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item h5">
                <div className="row">
                  <div className="col-6 mt-2">
                    <strong>Deuda total: $</strong>
                    {creditDebt}
                  </div>
                  <div className="col-6">
                    <Button color="danger" onClick={paymentUpModal}>
                      Pagar deuda
                    </Button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <Modal
              size={"xl"}
              centered={true}
              isOpen={paymentModal}
              toggle={paymentUpModal}
              {...args}
            >
              <ModalHeader toggle={paymentUpModal}>Pago de deuda</ModalHeader>
              <ModalBody>
                <form onSubmit={debtPayment} className="mt-5">
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
                      onChange={(e) => setCreditAmount(e.target.value)}
                    />
                  </div>
                  <div className="d-grid gap-2 col-6 mx-auto">
                    <button type="submit" className="btn btn-success mt-5">
                      Aceptar transacción
                    </button>
                    <Button color="danger" onClick={paymentUpModal}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
