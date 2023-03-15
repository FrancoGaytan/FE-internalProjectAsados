import { useContext } from "react";
import AlertContext from "../stores/AlertContext";

const useAlert = () => useContext(AlertContext);

export default useAlert;