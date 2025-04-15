import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Logo from "../../../public/logo.png";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { toast } from "react-toastify";
import { authenticateUser } from "../../redux/auth/slice";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(authenticateUser({ username, password })).unwrap();
      navigate("/");
    } catch (err) {
      if (err === "No active account found with the given credentials") {
        toast.error(`Incorrect username or password`);
      } else {
        console.log(err);
        toast.error(`Check your internet connection`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-700">
      <div className="w-full max-w-md p-8 space-y-8 mx-2 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <img src={Logo} alt="Logo" className="w-24 h-24" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Bienvenido a HCHat.
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative flex items-center">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FaRegUser className="absolute right-4 w-[18px] h-[18px]" />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <RiLockPasswordLine className="absolute right-4 w-[18px] h-[18px] cursor-pointer" />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 text-sm tracking-wide rounded-md text-white focus:outline-none flex items-center justify-center ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Loading " : "Signin"}
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-xl ml-2" />
              ) : null}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
