import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../../features/auth/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Login.css";

const Login = () => {
  const [wrongEmail, setWrongEmail] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);

  // holding the error messages
  const emailError = "Request failed with status code 400";
  const passError = "Request failed with status code 402";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //getting state from redux
  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  //using formik to set the state and display errors
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("invalid email").required("Email Required"),
      password: Yup.string()
        .min(8, "password must be 8 characters or longer")
        .required("Password Required"),
    }),
    onSubmit: (values) => {
      const userData = {
        email: values.email,
        password: values.password,
      };
      dispatch(login(userData));
    },
  });

  useEffect(() => {
    if (formik.errors.password) {
      setWrongPass(false);
    }
    if (formik.errors.email) {
      setWrongEmail(false);
    }
    if (isError && message === passError) {
      setWrongPass(true);
    }

    if (isError && message === emailError) {
      setWrongEmail(true);
    }
    if (isSuccess || user) {
      navigate("/calendar");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, formik]);

  return (
    <div className="register__color">
      <div className="register__main">
        <div className="register__form__color">
          <div className="register__form__main">
            <div className="register__title">
              <p>Gomes Daycare</p>
            </div>

            <form className="inputs" onSubmit={formik.handleSubmit}>
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                placeholder="example@test.com"
                onBlur={formik.handleBlur}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {wrongEmail === true ? (
                <p className="error">wrong email</p>
              ) : (
                ""
              )}
              {formik.touched.email && formik.errors.email ? (
                <p className="error">{formik.errors.email}</p>
              ) : (
                ""
              )}

              <input
                className="input"
                id="password"
                name="password"
                type="password"
                placeholder="password min 8 charaters long"
                onBlur={formik.handleBlur}
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {wrongPass === true ? (
                <p className="error">Wrong Password</p>
              ) : (
                ""
              )}
              {formik.touched.password && formik.errors.password ? (
                <p className="error">{formik.errors.password}</p>
              ) : (
                ""
              )}

              <button className="register__btn" type="submit">
                LOGIN
              </button>
            </form>

            <div className="register__link">
              <p>
                Don't have an account ?{" "}
                <a className="register__a" href="/auth/register">
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
