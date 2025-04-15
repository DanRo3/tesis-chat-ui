import { Provider } from "react-redux"
import { store } from "./redux/store/store"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RouterApp } from "./router/RouterApp";


function App() {


  return (
    <Provider store={store}>
      <RouterApp />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  )
}

export default App
