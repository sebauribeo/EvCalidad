import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import CreateUser from "../../src/components/CreateUser";

// Mockeo de Firebase, React Router y SweetAlert
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(), // Mock para la función getAuth de Firebase Authentication
  createUserWithEmailAndPassword: jest.fn(), // Mock para la función createUserWithEmailAndPassword de Firebase Authentication
}));
jest.mock("firebase/firestore"); // Mock para Firestore de Firebase

jest.mock("sweetalert2", () => ({
  fire: jest.fn(), // Mock para la función fire de SweetAlert2
}));

describe("Create User Component", () => {
  beforeEach(() => {
    // Configuración inicial antes de cada prueba
    const mockAuth = {
      currentUser: { uid: "123" }, // Usuario simulado con UID para getAuth
    };

    getAuth.mockReturnValue(mockAuth); // Simula la función getAuth para devolver mockAuth

    createUserWithEmailAndPassword.mockResolvedValue({
      // Simula la función createUserWithEmailAndPassword para devolver un objeto con UID
      user: { uid: "123" },
    });

    setDoc.mockResolvedValue({}); // Simula la función setDoc de Firestore para resolver una promesa vacía
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks después de cada prueba
  });

  // Prueba para renderizar el formulario correctamente
  test("Renderizar formulario correctamente", () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    // Verifica la presencia de elementos de texto esperados en el formulario
    expect(screen.getByText("Crear Usuario"));
    expect(screen.getByText("Nombre"));
    expect(screen.getByText("Apellido"));
    expect(screen.getByText("Direccion"));
    expect(screen.getByText("Mail"));
    expect(screen.getByText("Contraseña"));
    expect(screen.getByText("Rut"));
    expect(screen.getByText("Pais"));
    expect(screen.getByText("Telefono"));
  });

  // Prueba para crear un nuevo usuario y mostrar alerta de éxito
  test("Crear un nuevo usuario y mostrar alerta de exito", async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    // Simula el cambio de valores en los inputs del formulario
    fireEvent.change(getByTestId("userName-input"), {
      target: { value: "John" },
    });
    fireEvent.change(getByTestId("lastName-input"), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByTestId("address-input"), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(getByTestId("email-input"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(getByTestId("password-input"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(getByTestId("dni-input"), {
      target: { value: "12345678" },
    });
    fireEvent.change(getByTestId("country-input"), {
      target: { value: "USA" },
    });
    fireEvent.change(getByTestId("phone-input"), {
      target: { value: "555-5555" },
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: "Agregar Usuario" })); // Simula el clic en el botón de agregar usuario
    });

    // Espera a que se resuelvan las promesas y verifica las llamadas a las funciones y la alerta de éxito
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        getAuth(),
        "john@example.com",
        "1234567890"
      );
      expect(setDoc).toHaveBeenCalledTimes(2); // Verifica que setDoc se haya llamado dos veces
      expect(doc).toHaveBeenCalledTimes(2); // Verifica que doc se haya llamado dos veces
      expect(Swal.fire).toHaveBeenCalledWith({
        // Verifica que Swal.fire se haya llamado con los parámetros esperados para la alerta de éxito
        icon: "success",
        title: "Usuario creado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  });
});
