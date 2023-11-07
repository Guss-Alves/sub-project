import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./Register.css";

const Register = () => {
  const [takenEmail, setTakenEmail] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [wrongPhoneCode, setWrongPhoneCode] = useState(false);

  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailTaken = "Request failed with status code 400";
  const wrongCodeError = "Request failed with status code 420";
  const wrongPhoneCodes = "Request failed with status code 433";

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      email: "",
      password: "",
      password2: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("name is required")
        .min(3, "name must be 2 characters or longer"),
      email: Yup.string().email("invalid email").required("Email Required"),
      password: Yup.string()
        .min(8, "password must be 8 characters or longer")
        .required("Password Required"),
      password2: Yup.string()
        .min(8, "password must be 8 characters or longer")
        .required("Password Required")
        .oneOf([Yup.ref("password"), null], "Passwords don't match"),
      code: Yup.string().required("district code is required"),
      phone: Yup.string().required("phone number is required"),
    }),
    onSubmit: (values) => {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        code: values.code,
        phoneNumber: values.phone,
      };
      dispatch(register(userData));
    },
  });

  useEffect(() => {
    if (formik.errors.email) {
      setTakenEmail(false);
    }
    if (formik.errors.code) {
      setWrongCode(false);
    }

    if (isError && message === emailTaken) {
      setTakenEmail(true);
    }
    if (isError && message === wrongPhoneCodes) {
      setWrongPhoneCode(true);
    }

    if (isError && message === wrongCodeError) {
      setWrongCode(true);
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
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                onBlur={formik.handleBlur}
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="error">{formik.errors.name}</p>
              ) : (
                ""
              )}

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
              {takenEmail === true ? (
                <p className="error">Email is Taken</p>
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
              {formik.touched.password && formik.errors.password ? (
                <p className="error">{formik.errors.password}</p>
              ) : (
                ""
              )}

              <input
                className="input"
                id="password2"
                name="password2"
                type="password"
                placeholder="password min 8 charaters long"
                onBlur={formik.handleBlur}
                value={formik.values.password2}
                onChange={formik.handleChange}
              />

              {formik.touched.password2 && formik.errors.password2 ? (
                <p className="error">{formik.errors.password2}</p>
              ) : (
                ""
              )}

              <input
                className="input"
                id="code"
                name="code"
                type="text"
                placeholder="registration code"
                onBlur={formik.handleBlur}
                value={formik.values.code}
                onChange={formik.handleChange}
              />
              {wrongCode === true ? <p className="error">Wrong code</p> : ""}
              {formik.touched.code && formik.errors.code ? (
                <p className="error">{formik.errors.code}</p>
              ) : (
                ""
              )}

              <input
                className="input"
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 510 640 3402"
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
              {wrongPhoneCode === true ? (
                <p className="error">phone number is Taken</p>
              ) : (
                ""
              )}

              {formik.touched.phone && formik.errors.phone ? (
                <p className="error">{formik.errors.phone}</p>
              ) : (
                ""
              )}

              <button className="register__btn" type="submit">
                REGISTER
              </button>
            </form>

            <div className="register__link">
              <p>
                Already have an account ?{" "}
                <a className="register__a" href="/auth/login">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
