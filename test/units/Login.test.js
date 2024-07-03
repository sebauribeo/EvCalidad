import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Login from '../../src/components/Login';

// Mock de Firebase, React Router y SweetAlert
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
  }));

jest.mock('firebase/firestore');

// jest.mock('../../src/fireBaseConfig/firebase', () => ({
//   app: jest.fn(),
// }));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));


  
describe('Login Component', () => {
    // let mockAuth;

    beforeEach(() => {
        mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: jest.fn(),
        }));
        setDoc.mockResolvedValue({}); 
        doc.mockResolvedValue({}); 
        getDoc.mockResolvedValue({})
        const mockAuth = {
            currentUser: { uid: '12345', user: 'admin@admin.cl' },
          };
        
        getAuth.mockReturnValue(mockAuth);
        signInWithEmailAndPassword.mockResolvedValue({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render login form', () => {
        render(
            <MemoryRouter>
            <Login />
            </MemoryRouter>
        );
        expect(screen.getByLabelText('Ingresa tu Mail'));
        expect(screen.getByLabelText('Ingresa tu contraseña'));
    });

    test('should handle successful login and navigation to admin', async () => {
        // signInWithEmailAndPassword.mockResolvedValue({});
        const { getByTestId } = render(
            <MemoryRouter>
            <Login />
            </MemoryRouter>
        );
        // useNavigate.mockReturnValue(mockNavigate);
        doc.mockResolvedValue({
            exists: () => true,
            data: () => ({ role: 'admin', userName: 'Admin' }),
        });

        fireEvent.change(getByTestId('email-input'), { target: { value: 'admin@admin.cl' } });
        fireEvent.change(getByTestId('password-input'), { target: { value: '1234567890' } });
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Ingresar a sesión' }));
        });

        
        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalled();
            // expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), 'admin@admin.cl', '1234567890');
            // expect(Swal.fire).toHaveBeenCalledWith({
            //     icon: 'success',
            //     title: '¡Bienvenido, Admin! Redirigiendo a tu sesión',
            //     showConfirmButton: false,
            //     timer: 1500,
            // });
        });
    });

// test('should handle successful login and navigation to user dashboard', async () => {
//     mockSignInWithEmailAndPassword.mockResolvedValue({});
//     mockGetDoc.mockResolvedValue({
//       exists: () => true,
//       data: () => ({ role: 'user', userName: 'Seba' }),
//     });

//     render(
//         <MemoryRouter>
//           <Login />
//         </MemoryRouter>
//       );
  
//       fireEvent.change(screen.getByLabelText('Ingresa tu Mail'), { target: { value: 'test@test.com' } });
//       fireEvent.change(screen.getByLabelText('Ingresa tu contraseña'), { target: { value: '1234567890' } });
//       fireEvent.click(screen.getByRole('button', { name: 'Ingresar a sesión' }));

//       expect(mockSignInWithEmailAndPassword).toHaveBeenCalledTimes(1);

//     // Espera a que el signInWithEmailAndPassword sea llamado
//     //await waitFor(() => expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@test.com', '1234567890'));
//     //await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/usersDashboard/USER-UID')); 

//     // await waitFor(() => {
//     //     expect(Swal.fire).toHaveBeenCalledWith({
//     //         icon: 'success',
//     //         title: '¡Bienvenido, Seba! Redirigiendo a tu sesión',
//     //         showConfirmButton: false,
//     //         timer: 1500,
//     //     });
//     // });
// });


test('should handle login error', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Login error'));

    render(
        <MemoryRouter>
        <Login />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Ingresa tu Mail'), { target: { value: 'test@test.cl' } });
    fireEvent.change(screen.getByLabelText('Ingresa tu contraseña'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar a sesión'})); 

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Login error',
      });
    });
});

//   test('should handle user document not found error', async () => {
//     mockSignInWithEmailAndPassword.mockResolvedValue({});
//     mockGetDoc.mockResolvedValue({
//       exists: () => false,
//     });

//     render();

//     fireEvent.change(screen.getByLabelText(/Ingresa tu Mail/i), { target: { value: 'user@example.com' } });
//     fireEvent.change(screen.getByLabelText(/Ingresa tu contraseña/i), { target: { value: 'password' } });
//     fireEvent.submit(screen.getByRole('button', { name: /Ingresar a sesión/i }));

//     await waitFor(() => expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'user@example.com', 'password'));

//     await waitFor(() => {
//       expect(Swal.fire).toHaveBeenCalledWith({
//         icon: 'error',
//         title: 'Usuario no encontrado',
//         text: 'Por favor, verifique sus credenciales',
//       });
//     });
//   });

});
