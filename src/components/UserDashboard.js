import React, { useEffect, useState } from 'react'
import { db } from '../fireBaseConfig/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

function UserDashboard() {

  const [userName, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [debitId, setDebitId] = useState('');
  const [creditId, setCreditId] = useState('');
  const [debit, setDebit] = useState(false);
  const [credit, setCredit] = useState(false);
  const [debitDebt, setDebitDebt] = useState(0);
  const [creditDebt, setCreditDebt] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [debitAmount, setDebitAmount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const { id } = useParams();


  const getProductByUserId = async (id) => {
    const userProducts = await getDoc(doc(db, "userProducts", id));
    if (userProducts.exists()) {
      setDebitId(userProducts.data().debitId)
      setCreditId(userProducts.data().creditId)
      setDebit(userProducts.data().debit)
      setCredit(userProducts.data().credit)
      setDebitDebt(userProducts.data().debitDebt)
      setCreditDebt(userProducts.data().creditDebt)
      setCreditAmount(userProducts.data().creditAmount)
      setDebitAmount(userProducts.data().debitAmount)
      setTotalPayment(userProducts.data().totalPayment)
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

  useEffect(() => {
    getUserById(id);
    getProductByUserId(id);
    // eslint-disable-next-LINE
  }, []);
  return (
    <>
      <div>
        <h1 className='mt-3'>Sesion de Usuario</h1>
        <div className='container'>
          <div>
          <div className="card mt-5">
                <div className="card-header">
                  <h3>{userName} {lastName}</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5"><strong>Mail : </strong>{email}</li>
                  <li className="list-group-item h5"><strong>RUT Cuenta: </strong>{dni}</li>
                  <li className="list-group-item h5"><strong>Pais : </strong>{country}</li>
                  <li className="list-group-item h5"><strong>Total pagos : </strong>{totalPayment}</li>
                </ul>
              </div>
          </div>
          <div className='row'>
            <div className="mt-3 col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h3>Debito</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5"><strong>Estado producto : </strong>{debit === true ? 'Activado' : 'Desactivado'}</li>
                  <li className="list-group-item h5"><strong>N° Cuenta: </strong>{debitId === '' ? 'Aun sin contratar' : debit}</li>
                  <li className="list-group-item h5"><strong>Deuda: $</strong>{debitAmount}</li>
                  <li className="list-group-item h5"><strong>Saldo : $</strong>{debitAmount}</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="card">
                <div className="card-header">
                  <h3>Credito</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5"><strong>Estado producto: </strong>{credit === true ? 'Activado' : 'Desactivado'}</li>
                  <li className="list-group-item h5"><strong>N° Cuenta: </strong>{creditId === '' ? 'Aun sin contratar' : creditId}</li>
                  <li className="list-group-item h5"><strong>Deuda: $</strong>{creditDebt}</li>
                  <li className="list-group-item h5"><strong>Saldo: $</strong>{creditAmount}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card mt-3">
                <div className="card-header">
                  <h3>Estado de cuentas</h3>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item h5"><strong>Deuda credito: $</strong>{creditDebt}</li>
                  <li className="list-group-item h5"><strong>Deuda debito: $</strong>{debitDebt}</li>
                  <li className="list-group-item h5"><strong>Deuda total : $</strong>{creditDebt + creditDebt}</li>
                </ul>
              </div>
          <div className='mt-4'>
            <button type="button" className="btn btn-success btn-lg mx-2 mb-5 rounded-pill">Contratar Credito</button>
            <button type="button" className="btn btn-success btn-lg mx-2 mb-5 rounded-pill">Contratar debito</button>
            <button type="button" className="btn btn-success btn-lg mx-2 mb-5 rounded-pill">Pagar</button>
          </div>
        </div>
      </div>
    </>
    
  )
}

export default UserDashboard