import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "../../src/components/Login";
import { auth, firestore } from "../../src/fireBaseConfig/firebase";

// Mockeo de Firebase y SweetAlert
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: { uid: "test-uid" } })), // Mock para la función getAuth de Firebase Authentication
  signInWithEmailAndPassword: jest.fn(), // Mock para la función signInWithEmailAndPassword de Firebase Authentication
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(), // Mock para la función getFirestore de Firestore
  doc: jest.fn(), // Mock para la función doc de Firestore
  getDoc: jest.fn(), // Mock para la función getDoc de Firestore
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(), // Mock para la función fire de SweetAlert2
}));

// Configuración y pruebas del componente Login
describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
  });

  // Prueba para renderizar el formulario de inicio de sesión
  test("Renderiza fmulario para iniciar sesion", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Ingresa tu Mail")); // Verifica la presencia del campo de correo electrónico
    expect(screen.getByLabelText("Ingresa tu contraseña")); // Verifica la presencia del campo de contraseña
  });

  // Prueba para manejar un inicio de sesión exitoso y redirección basada en el rol del usuario
  test("Ingreso de datos exitoso y generacion de alera exitosa", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({}); // Simula resolver correctamente el inicio de sesión
    getDoc.mockResolvedValueOnce({
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ role: "admin", userName: "Test User" })),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula cambios en los campos de correo electrónico y contraseña, y clic en el botón de inicio de sesión
    fireEvent.change(screen.getByLabelText("Ingresa tu Mail"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Ingresa tu contraseña"), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar a sesión" }));

    // Espera a que se resuelvan las promesas y verifica las llamadas a las funciones y la alerta de éxito
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@test.com",
        "1234567890"
      );
      expect(doc).toHaveBeenCalledWith(firestore, `users/test-uid`);
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "success",
        title: `¡Bienvenido, Test User! Redirigiendo a tu sesión`,
        showConfirmButton: false,
        timer: 1500,
      });
    });
  });

  // Prueba para manejar un error de inicio de sesión
  test("Inicio de sesion con error", async () => {
    const errorMessage = "Login error";
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage)); // Simula rechazar el inicio de sesión con un error específico

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula cambios en los campos de correo electrónico y contraseña, y clic en el botón de inicio de sesión
    fireEvent.change(screen.getByLabelText("Ingresa tu Mail"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Ingresa tu contraseña"), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar a sesión" }));

    // Espera a que se resuelva la llamada a SweetAlert y verifica los parámetros de la alerta de error
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Error al iniciar sesión",
        text: errorMessage,
      });
    });
  });

  // Prueba para manejar un error cuando el usuario no se encuentra
  test("Inicio de sesion con alerta de credenciales no encontradas", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({}); // Simula resolver correctamente el inicio de sesión
    getDoc.mockResolvedValueOnce({ exists: jest.fn(() => false) }); // Simula que el usuario no se encuentra en la base de datos

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula cambios en los campos de correo electrónico y contraseña, y clic en el botón de inicio de sesión
    fireEvent.change(screen.getByLabelText("Ingresa tu Mail"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Ingresa tu contraseña"), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar a sesión" }));

    // Espera a que se resuelva la llamada a SweetAlert y verifica los parámetros de la alerta de error
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Usuario no encontrado",
        text: "Por favor, verifique sus credenciales",
      });
    });
  });

  // Prueba para manejar un error al obtener los datos del usuario
  test("Inicio de sesion con error en los datos de usuario", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({}); // Simula resolver correctamente el inicio de sesión
    const errorMessage = "User data retrieval error";
    getDoc.mockRejectedValueOnce(new Error(errorMessage)); // Simula rechazar la obtención de datos del usuario con un error específico

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula cambios en los campos de correo electrónico y contraseña, y clic en el botón de inicio de sesión
    fireEvent.change(screen.getByLabelText("Ingresa tu Mail"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Ingresa tu contraseña"), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar a sesión" }));

    // Espera a que se resuelva la llamada a SweetAlert y verifica los parámetros de la alerta de error
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Error al obtener los datos del usuario",
        text: errorMessage,
      });
    });
  });
});
