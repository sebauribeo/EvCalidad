import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "../../src/components/Login"; // Ajustar la ruta según sea necesario
import { auth, firestore } from "../../src/fireBaseConfig/firebase"; 

// Mock de Firebase y SweetAlert
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: { uid: "test-uid" } })),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));


describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Ingresa tu Mail"));
    expect(screen.getByLabelText("Ingresa tu contraseña"));
  });

  test("handles successful login and user redirection based on role", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({});
    getDoc.mockResolvedValueOnce({
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ role: "admin", userName: "Test User" })),
    });

      render( 
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        );    

        fireEvent.change(screen.getByLabelText('Ingresa tu Mail'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('Ingresa tu contraseña'), { target: { value: '1234567890' } });
        fireEvent.click(screen.getByRole('button', { name: 'Ingresar a sesión' }));

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

  test("handles login error", async () => {
    const errorMessage = "Login error";
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage));

    render( 
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );    

      fireEvent.change(screen.getByLabelText('Ingresa tu Mail'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText('Ingresa tu contraseña'), { target: { value: '1234567890' } });
      fireEvent.click(screen.getByRole('button', { name: 'Ingresar a sesión' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Error al iniciar sesión",
        text: errorMessage,
      });
    });
  });

  test("handles user not found error", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({});
    getDoc.mockResolvedValueOnce({ exists: jest.fn(() => false) });

    render( 
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );    

      fireEvent.change(screen.getByLabelText('Ingresa tu Mail'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText('Ingresa tu contraseña'), { target: { value: '1234567890' } });
      fireEvent.click(screen.getByRole('button', { name: 'Ingresar a sesión' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Usuario no encontrado",
        text: "Por favor, verifique sus credenciales",
      });
    });
  });

  test("handles user data retrieval error", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({});
    const errorMessage = "User data retrieval error";
    getDoc.mockRejectedValueOnce(new Error(errorMessage));

    render( 
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );    

      fireEvent.change(screen.getByLabelText('Ingresa tu Mail'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText('Ingresa tu contraseña'), { target: { value: '1234567890' } });
      fireEvent.click(screen.getByRole('button', { name: 'Ingresar a sesión' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Error al obtener los datos del usuario",
        text: errorMessage,
      });
    });
  });
});