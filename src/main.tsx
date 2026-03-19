import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { EduQuestProvider } from "./context/EduQuestProvider";
import "./styles/tokens.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <EduQuestProvider>
      <App />
    </EduQuestProvider>
  </BrowserRouter>
);