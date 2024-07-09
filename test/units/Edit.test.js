import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Edit from "../../src/components/Edit";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

// Mock de Firebase Firestore y SweetAlert
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(), // Mock para la función doc de Firestore
  getDoc: jest.fn(), // Mock para la función getDoc de Firestore
  updateDoc: jest.fn(), // Mock para la función updateDoc de Firestore
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockResolvedValue(true), // Mock para la función fire de SweetAlert2
}));

global.console = {
  ...global.console,
  log: jest.fn(), // Mock para la función log de console
};

// Datos simulados de usuario para las pruebas
const mockUserData = {
  userName: "John",
  lastName: "Doe",
  address: "123 Street",
  email: "john.doe@example.com",
  dni: "12345678",
  country: "Country",
  phone: "1234567890",
  updated_at: new Date(),
};

describe("Edit Component", () => {
  beforeEach(() => {
    // Implementación de mocks para las funciones de Firestore
    doc.mockImplementation((db, collection, id) => ({
      id,
      path: `${collection}/${id}`,
    }));

    getDoc.mockImplementation((docRef) => {
      // Simula retornar datos simulados si el documento existe
      if (docRef.path === "users/1") {
        return Promise.resolve({
          exists: () => true,
          data: () => mockUserData,
        });
      }
      // Simula retornar falso si el documento no existe
      return Promise.resolve({ exists: () => false });
    });

    updateDoc.mockResolvedValue(true); // Simula resolver correctamente la actualización del documento
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks después de cada prueba
  });

  // Prueba para renderizar el formulario con los datos del usuario
  test("Renderiza el formulario para editar Usuario", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/users" element={<div>Users Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Verifica la presencia de elementos de texto esperados en el formulario
    await waitFor(() => {
      expect(screen.getByText("Nombre"));
      expect(screen.getByText("Apellido"));
      expect(screen.getByText("Direccion"));
      expect(screen.getByText("Mail"));
      expect(screen.getByText("Rut"));
      expect(screen.getByText("Pais"));
      expect(screen.getByText("Telefono"));
    });
  });

  // Prueba para actualizar el usuario al enviar el formulario
  test("Actualiza el usuario al cambiar los datos y hacer click, genera alerta exitosa", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/users" element={<div>Users Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Espera a que se renderice correctamente el formulario
    await waitFor(() => {
      expect(screen.getByText("Nombre"));
    });

    // Simula el cambio de valor en el input del nombre y el clic en el botón de actualizar usuario
    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "Jane" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Actualizar Usuario" }));

    // Espera a que se resuelva la actualización del documento y verifica los argumentos del llamado
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ userName: "Jane" })
      );
    });

    // Espera a que se resuelva la llamada a SweetAlert y verifica los parámetros de la alerta de éxito
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "success",
        title: "Usuario Actualizado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  });

  // Prueba para mostrar un mensaje de error si el usuario no se encuentra
  test("Genera alerta de Usuario no encontrado", async () => {
    // Simula retornar falso al buscar el documento del usuario
    getDoc.mockImplementationOnce(() =>
      Promise.resolve({ exists: () => false })
    );

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </MemoryRouter>
    );

    // Espera a que se logue el mensaje de error en la consola
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("Usuario no encontrado");
    });
  });
});
