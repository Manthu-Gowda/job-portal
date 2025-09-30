import { ToastContainer } from "react-toastify";
import "./App.scss";
import RouterComponent from "./App/RouterComponent/RouterComponent";
import "react-toastify/dist/ReactToastify.css";
import NetworkStatusModal from "./App/Components/NetworkStatusModal/NetworkStatusModal";

function App() {
  return (
    <div className="App">
      <NetworkStatusModal />
      <RouterComponent />
      <ToastContainer theme="colored" position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;
