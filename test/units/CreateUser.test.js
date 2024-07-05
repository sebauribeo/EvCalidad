import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import CreateUser from "../../src/components/CreateUser";

// Mock de Firebase, React Router y SweetAlert
jest.mock("firebase/auth");

jest.mock("firebase/firestore");

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("Create User Component", () => {
  beforeEach(() => {
    mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: jest.fn(),
    }));

    const mockAuth = {
      currentUser: { uid: "123" },
    };

    getAuth.mockReturnValue(mockAuth);

    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "123" },
    });

    setDoc.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Renderizar formulario correctamente", () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

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

  test("creates a new user and shows success alert", async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

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
      fireEvent.click(screen.getByRole("button", { name: "Agregar Usuario" }));
    });
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        getAuth(),
        "john@example.com",
        "1234567890"
      );
      expect(setDoc).toHaveBeenCalledTimes(2);
      expect(doc).toHaveBeenCalledTimes(2);
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "success",
        title: "Usuario creado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
      // expect(mockNavigate).toHaveBeenCalledWith('/usersDasboard/123');
    });
  });

  //   test('shows an error alert if user creation fails', async () => {
  //     const { getByTestId } = render(
  //         <MemoryRouter>
  //           <CreateUser />
  //         </MemoryRouter>
  //       );

  //     fireEvent.change(getByTestId('userName-input'), { target: { value: 'John' } });
  //     fireEvent.change(getByTestId('lastName-input'), { target: { value: 'Doe' } });
  //     fireEvent.change(getByTestId('address-input'), { target: { value: '123 Main St' } });
  //     fireEvent.change(getByTestId('email-input'), { target: { value: 'john@example.com' } });
  //     fireEvent.change(getByTestId('password-input'), { target: { value: '1234567890' } });
  //     fireEvent.change(getByTestId('dni-input'), { target: { value: '12345678' } });
  //     fireEvent.change(getByTestId('country-input'), { target: { value: 'USA' } });
  //     fireEvent.change(getByTestId('phone-input'), { target: { value: '555-5555' } });
  //     await waitFor(() => {
  //         fireEvent.click(screen.getByRole('button', { name: 'Agregar Usuario' }));
  //     });

  //     await waitFor(() => {
  //         expect(Swal.fire).toHaveBeenCalledWith({
  //             icon: 'error',
  //             title: 'Error al crear el usuario',
  //             text: 'Failed to create user',
  //         });
  //     });
  //   });
});
