import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../fireBaseConfig/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const MySwal = withReactContent(Swal);
const Users = () => {
  // CONFIGURACION DE HOOKS
  const [users, setUsers] = useState([]);

  // REFERENCIA A LA DB DE FIRESTORE
  const usersCollections = collection(db, "users");

  // FUNCION PARA MOSTAR TODOS LOS PRODUCTOS
  const getUsersCollection = async () => {
    const data = await getDocs(usersCollections);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  
  // FUNCION PARA ELIMINAR UN PRODUCTO
  const deleteUser = async (id) => {
    const userDeleteDoc = doc(db, "users", id);
    await deleteDoc(userDeleteDoc);
    getUsersCollection();
  };

  // ALERTA DE BORRADO EXITOSO
  const confirmDelete = (id) => {
    MySwal.fire({
      title: "¿Estas seguro?",
      text: "Precaución, esta acción borrara el registro",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
        Swal.fire({
          title: "¡Borrado!",
          text: "El usuario ha sido eliminado",
          icon: "success",
        });
      }
    });
  };

  //USO DE USEEFFECT
  useEffect(() => {
    getUsersCollection();
    // eslint-disable-next-LINE
  }, []);
  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <div className="d-grid gap-2"></div>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Mail</th>
                  <th scope="col">Rut</th>
                  <th scope="col">Pais</th>
                  <th scope="col">Telefono</th>
                  <th scope="col">Editar</th>
                  <th scope="col">Borrar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.userName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.dni}</td>
                    <td>{user.country}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Link to={`/edit/${user.id}`} className="btn btn-success">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          confirmDelete(user.id);
                        }}
                        className="btn btn-danger"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
