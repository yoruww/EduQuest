import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Auth</h1>
      <button onClick={() => navigate("/home")}>
        Начать
      </button>
    </div>
  );
};

export default AuthPage;