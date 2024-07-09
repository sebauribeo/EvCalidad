// test/units/Users.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Users from "../../src/components/Users";
import { MemoryRouter } from "react-router-dom";
import { getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../src/fireBaseConfig/firebase";
import Swal from "sweetalert2";

// Mock de las funciones de Firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(), // Mock para la función collection de Firestore
  getDocs: jest.fn(), // Mock para la función getDocs de Firestore
  deleteDoc: jest.fn(), // Mock para la función deleteDoc de Firestore
  doc: jest.fn(), // Mock para la función doc de Firestore
}));

// Mock de SweetAlert
jest.mock("sweetalert2", () => ({
  fire: jest.fn(), // Mock para la función fire de SweetAlert2
}));

// Configuración y pruebas del componente Users
describe("Users Component", () => {
  const usersData = [
    {
      id: "1",
      userName: "John",
      lastName: "Doe",
      email: "john@example.com",
      dni: "123456789",
      country: "USA",
      phone: "123-456-7890",
    },
    {
      id: "2",
      userName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      dni: "987654321",
      country: "USA",
      phone: "098-765-4321",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    getDocs.mockResolvedValue({
      // Simula resolver correctamente la obtención de documentos
      docs: usersData.map((user) => ({
        id: user.id,
        data: () => user,
      })),
    });
  });

  // Prueba para renderizar correctamente el componente Users
  test("should render the Users component correctly", async () => {
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    // Espera a que se rendericen los elementos en la pantalla
    await waitFor(() => {
      expect(screen.getByText("Nombre"));
      expect(screen.getByText("Apellido"));
    });

    // Verifica que los nombres de usuario se encuentren en la pantalla
    expect(screen.getByText(usersData[0].userName));
    expect(screen.getByText(usersData[1].userName));
  });

  // Prueba para llamar a deleteDoc y mostrar una alerta de éxito al eliminar un usuario
  test("should call deleteDoc and show success alert on user delete", async () => {
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    );

    // Espera a que se renderice al menos un usuario en la pantalla
    await waitFor(() => {
      expect(screen.getByText(usersData[0].userName));
    });

    // Simula la resolución de la alerta de confirmación y el clic en el botón de eliminar usuario
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    fireEvent.click(screen.getByTestId(`delete-button-${usersData[0].id}`));

    // Espera a que se llame a Swal.fire con los parámetros adecuados para la confirmación de eliminación
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "¿Estas seguro?",
        text: "Precaución, esta acción borrara el registro",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
      });
    });

    // Espera a que se llame a deleteDoc con los parámetros adecuados y luego a Swal.fire con la alerta de éxito
    await waitFor(() =>
      expect(deleteDoc).toHaveBeenCalledWith(doc(db, "users", "1"))
    );
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "¡Borrado!",
        text: "El usuario ha sido eliminado",
        icon: "success",
      })
    );
  });
});
