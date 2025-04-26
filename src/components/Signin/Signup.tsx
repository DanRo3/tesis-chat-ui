import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { toast } from "react-toastify";
import { createUser } from "../../redux/auth/slice";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState("");

 const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return "La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo.";
    }
    return "";
  };


  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    setPasswordError(passwordError);

    if (passwordError) {
      return;
    }

    if (password !== rePassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await dispatch(createUser({ email, username, password, re_password: rePassword })).unwrap();
      toast.success("Usuario creado exitosamente");
      navigate("/signin");
    } catch (err: any) {
      // // Traducciones conocidas
      // const translations: Record<string, string> = {
      //   "A user with that username already exists.": "El nombre de usuario ya está en uso.",
      //   "User with this Email already exists.": "El correo electrónico ya está registrado",
      //   "User with this User Name already exists.": "El nombre de usuario ya existe",
      //   "the password is too similar to the username.": "La contraseña es demasiado similar al nombre de usuario.",
      //   "the password is too similar to the email address.": "La contraseña es demasiado similar a la dirección de correo electrónico.",
      //   "This password is too common.": "Esta contraseña es demasiado común.",
      //   "This password is entirely numeric.": "Esta contraseña es completamente numérica.",
      //   "Password must be a minimum of 8 characters.": "La contraseña debe tener al menos 8 caracteres.",
      // // Traducciones de errores backend
      // };
      // // Traducción para el error: {email: ["user with this email address already exists."]}
      // translations["user with this email address already exists."] = "El correo electrónico ya está registrado";

      // let errorMsg = "Error desconocido";

      // // Si es un Error lanzado por fetchFromApi
      // if (err instanceof Error && err.message) {
      //   errorMsg = translations[err.message] || err.message;
      // } else if (err.payload) {
      //   try {
      //     const errorObj = typeof err.payload === "string" ? JSON.parse(err.payload) : err.payload;
      //     const messages: string[] = [];
      //     if (errorObj.username && Array.isArray(errorObj.username)) {
      //       messages.push(...errorObj.username.map((msg: string) => translations[msg] || msg));
      //     }
      //     if (errorObj.email && Array.isArray(errorObj.email)) {
      //       messages.push(...errorObj.email.map((msg: string) => translations[msg] || msg));
      //     }
      //     if (errorObj.password && Array.isArray(errorObj.password)) {
      //       messages.push(...errorObj.password.map((msg: string) => translations[msg] || msg));
      //     }
      //     if (errorObj.non_field_errors && Array.isArray(errorObj.non_field_errors)) {
      //       messages.push(...errorObj.non_field_errors);
      //     }
      //     if (messages.length > 0) {
      //       errorMsg = messages.join('\n');
      //     }
      //   } catch {
      //     errorMsg = "Error desconocido";
      //   }
      // }
      if(err.message==="Error en la solicitud"){
        toast.error("El email ya está en uso o la contraseña es demasiado similar al nombre del usuario");
      }else{
        toast.error(err.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 animate-gradient-shift p-4 select-none overflow-auto">
      <div className="w-full max-w-md flex flex-col bg-white bg-opacity-20 backdrop-filter backdrop-blur-xl rounded-lg shadow-2xl border border-gray-100 border-opacity-30 animate-fade-in overflow-hidden">
        <div className="p-8 space-y-6 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-extrabold text-center text-amber-900 drop-shadow-lg">
            Crea una cuenta
          </h2>
          <form onSubmit={handleSignup} className="space-y-4 w-full">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-amber-900/70 drop-shadow-md"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 bg-white bg-opacity-30 border border-gray-200 border-opacity-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder-gray-700 transition duration-300 ease-in-out"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaRegUser className="absolute right-4 w-5 h-5 text-gray-700" />
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-amber-900/70 drop-shadow-md"
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
                className="block text-sm font-medium text-amber-900/70 drop-shadow-md"
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
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div>
              <label
                htmlFor="rePassword"
                className="block text-sm font-medium text-amber-900/70 drop-shadow-md"
              >
                Repetir Contraseña
              </label>
              <div className="relative flex items-center">
                <input
                  id="rePassword"
                  name="rePassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 mt-1 text-gray-800 bg-white bg-opacity-30 border border-gray-200 border-opacity-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder-gray-700 transition duration-300 ease-in-out pr-10"
                  placeholder="Repite tu contraseña"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
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
                {loading ? "Cargando " : "Crear cuenta"}
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-xl ml-2" />
                ) : null}
              </button>
            </div>
          </form>
          <div className="text-center text-amber-900/70 text-sm mt-4 drop-shadow-md">
            ¿Ya tienes una cuenta?{" "}
            <button onClick={() => navigate("/signin")} className="text-amber-900 hover:underline font-bold">
              Inicia sesión aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
