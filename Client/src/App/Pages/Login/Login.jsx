import React, { useEffect, useState } from "react";
import "./Login.scss";
import MainLogo from "../../Assets/Images/MainLogo.png";
import SmallLogo from "../../Assets/Images/EmergentLogo.png";
import Loader from "../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { SERVER_STATUS_CHECK, USER_LOGIN } from "../../Utils/apiPath";
import { postApi } from "../../Utils/apiService";
import { errorToast, successToast } from "../../Services/ToastHelper";
import FormInputs from "../../Components/UI/FormInputs/FormInputs";
import Buttons from "../../Components/UI/Buttons/Buttons";

const initialValues = {
  userName: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
    fetchServerStatusCheck();
  }, []);

  const fetchServerStatusCheck = async () => {
    const { statusCode, message } = await postApi(SERVER_STATUS_CHECK);
    if (statusCode === 200 && message === true) {
      return;
    } else {
      navigate("/maintenance");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin({
      ...login,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateFields = () => {
    let errObj = { ...initialValues };

    if (!login.userName) {
      errObj.userName = "This field is required";
    } else if (/\s/.test(login.userName)) {
      errObj.userName = "Username should not contain spaces";
    } else {
      errObj.userName = "";
    }

    if (!login.password) {
      errObj.password = "This field is required";
    } else if (/\s/.test(login.password)) {
      errObj.password = "Password should not contain spaces";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(login.password)
    ) {
      errObj.password =
        "Password must be 8+ characters, with uppercase, lowercase, number, and special character.";
    } else {
      errObj.password = "";
    }

    setErrors((prev) => ({ ...prev, ...errObj }));
    const data = Object.values(errObj).every((x) => x === "" || x === null);
    return data;
  };

  const handleLogin = async () => {
    if (validateFields()) {
      setIsLoading(true);
      const payload = {
        userName: login.userName,
        password: login.password,
        loginType: 2,
      };
      const { statusCode, data, message } = await postApi(USER_LOGIN, payload);
      if (statusCode === 200) {
        sessionStorage.setItem("accessToken", data?.accessToken);
        sessionStorage.setItem("refreshToken", data?.refreshToken);
        setIsLoading(false);
        successToast(message);
        navigate("/dashboard");
      } else {
        setIsLoading(false);
        errorToast(message);
      }
    }
  };

  return (
    <div className="login">
      {isLoading && <Loader />}
      <div className="login_cont">
        <div className="login_sec">
          <div className="login_sec_header">
            <img src={MainLogo} alt="Company Logo" />
          </div>
          <div className="login_sec_content">
            <div className="login_sec_content_box">
              <div className="login_sec_content_box_logo">
                <img src={SmallLogo} alt="Small Logo" />
              </div>
              <div className="login_sec_content_box_title">
                <h2>Sign In</h2>
                <p>Welcome to Emergent</p>
              </div>
              <div className="login_sec_content_box_data">
                <div className="login_sec_content_box_data_inputs">
                  <FormInputs
                    type={"text"}
                    placeholder={"User Name"}
                    name="userName"
                    value={login.userName}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />
                  {errors.userName && (
                    <span className="error">{errors.userName}</span>
                  )}
                </div>
                <div className="login_sec_content_box_data_inputs">
                  <FormInputs
                    type={"password"}
                    placeholder={"Password"}
                    name="password"
                    value={login.password}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />
                  {errors.password && (
                    <span className="error">{errors.password}</span>
                  )}
                </div>
              </div>
              <div className="login_sec_content_box_buttons">
                <Buttons
                  style={{ width: "100%" }}
                  variant="secondary"
                  onClick={handleLogin}
                  className="btn"
                >
                  Login
                </Buttons>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
