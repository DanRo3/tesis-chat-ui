import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Logo from "../../../public/logo.png";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { toast } from "react-toastify";
import { authenticateUser } from "../../redux/auth/slice";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear(); // Get current year

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(authenticateUser({ username, password })).unwrap();
      navigate("/");
    } catch (err) {
      if (err === "No active account found with the given credentials") {
        toast.error(`Usuario o contraseña incorrectos`); // Translated error message
      } else {
        console.log(err);
        toast.error(`Verifica tu conexión a internet`); // Translated error message
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-purple-300 animate-gradient-shift p-4 select-none overflow-auto"> {/* Changed to flex-col */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white bg-opacity-20 backdrop-filter backdrop-blur-xl rounded-lg shadow-2xl border border-gray-100 border-opacity-30 animate-fade-in overflow-hidden"> {/* Added margin-bottom */}
        {/* Left Section (Image/Logo and Description) */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white bg-opacity-10 text-center text-gray-800"> {/* Changed text color */}
          <img src={Logo} alt="Logo" className="w-48 h-48 object-contain animate-bounce-slow mb-4" />
          <p className="text-lg font-semibold drop-shadow-md mb-2 text-amber-900"> {/* Adjusted drop-shadow */}
            HChat: Tu guía en la historia marítima del Caribe.
          </p>
          <p className="text-sm drop-shadow-md text-amber-900/60"> {/* Adjusted drop-shadow */}
            Explora información desde 1844 hasta 1960. Contenido generado por IA, úsalo como referencia.
          </p>
        </div>

        {/* Right Section (Login Form) */}
        <div className="w-full md:w-1/2 p-8 space-y-6 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-extrabold text-center text-amber-900 drop-shadow-lg">
            Bienvenido a HChat.
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-amber-900/70 drop-shadow-md" // Added drop-shadow
              >
                Usuario
              </label>
              <div className="relative flex items-center">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 bg-white bg-opacity-30 border border-gray-200 border-opacity-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder-gray-700 transition duration-300 ease-in-out"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FaRegUser className="absolute right-4 w-5 h-5 text-gray-700" />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-amber-900/70 drop-shadow-md" // Added drop-shadow
              >
                Contraseña
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 bg-white bg-opacity-30 border border-gray-200 border-opacity-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder-gray-700 transition duration-300 ease-in-out pr-10"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <RiEyeOffLine
                    className="absolute right-4 w-5 h-5 text-gray-700 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <RiEyeLine
                    className="absolute right-4 w-5 h-5 text-gray-700 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 text-lg font-semibold tracking-wide rounded-md text-white focus:outline-none flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-amber-800/60 hover:bg-amber-600/60"
                }`}
              >
                {loading ? "Cargando " : "Iniciar sesión"}
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-xl ml-2" />
                ) : null}
              </button>
            </div>
          </form>
          {/* Account creation link */}
          <div className="text-center text-amber-900/70  text-sm mt-4 drop-shadow-md"> {/* Added drop-shadow */}
            ¿No tienes una cuenta?{" "}
            <Link to="/signup" className="text-amber-900 hover:underline font-bold">
              Crea una aquí
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-1 text-center text-amber-900 text-sm drop-shadow-lg"> {/* Added mt-auto for positioning */}
        &copy; HChat {currentYear}
      </footer>
    </div>
  );
};

export default Login;
