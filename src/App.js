import "./App.css";
import { Link } from 'react-router-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Users from "./components/Users";
import CreateUser from "./components/CreateUser";
import Edit from "./components/Edit";
import Home from './components/Home'

const App = () => {
  return (
    <div className="App">
    <BrowserRouter>
      <nav
        className="navbar bg-dark navbar-expand-lg bg-body-tertiary"
        data-bs-theme="dark"
      >
        <div className="container">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item m-1">
                <Link to={'/'}>Home</Link>
              </li>
              <li className="nav-item m-1">
                <Link to={'/create'}>Crear Usuario</Link>
              </li>
              <li className="nav-item m-1">
                <Link to={'/users'}>Usuarios</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Transaciones
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>
      </div>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/users' element={<Users />}/>
            <Route path='/create' element={<CreateUser />}/>
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
