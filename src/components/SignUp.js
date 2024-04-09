import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { user } = useAuthContext();
  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    console.log(email.value, password.value);
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // ユーザーのサインアップが成功した場合の処理
        const user = userCredential.user;
        console.log("User signed up:", user);
      })
      .catch((error) => {
        // サインアップに失敗した場合の処理
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign up error:", errorCode, errorMessage);
      });
  };

  return (
    <div>
      <h1>ユーザ登録{user.email}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス</label>
          <input name="email" type="email" placeholder="email" />
        </div>
        <div>
          <label>パスワード</label>
          <input name="password" type="password" placeholder="password" />
        </div>
        <div>
          <button>登録</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
