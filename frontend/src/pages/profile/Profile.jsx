import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

import "./Profile.css";

//don't allow user to change email
//after sending code show the input to type it
const Profile = ({ data }) => {
  const [wasCodeSent, setWasCodeSent] = useState(false);
  const [wasPhoneCodeSent, setWasPhoneCodeSent] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const wrongCode = "Request failed with status code 392";
  const wrongPhoneCode = "Request failed with status code 430";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.isAdmin === true) {
      navigate("/admin/history");
    }
  }, [data, user]);

  const formik = useFormik({
    initialValues: {
      code: "",
      phoneCode: "",
    },
    validationSchema: Yup.object({
      code: Yup.string().required("code is required"),
      phoneCode: Yup.string().required("code is required"),
    }),
  });

  const sendCode = async () => {
    try {
      await axios.post(`/api/user/email/code/${data._id}`);
      toast.success("code sent to your email", {
        duration: 2000,
      });
      setWasCodeSent(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const confirmCode = async () => {
    try {
      await axios.post(`/api/user/email/code/confirm/${data._id}`, {
        code: formik.values.code,
      });
      toast.success("email verified", {
        duration: 2000,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.message === wrongCode) {
        toast.error("wrong code, please try again", {
          duration: 2000,
        });
        setWasCodeSent(false);
      }
    }
  };

  const sendPhoneCode = async () => {
    try {
      await axios.post(`/api/user/phone/code/${data._id}`);
      toast.success("code sent to your phone number", {
        duration: 2000,
      });
      setWasPhoneCodeSent(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const confirmPhoneCode = async () => {
    try {
      await axios.post(`/api/user/phone/code/confirm/${data._id}`, {
        code: formik.values.phoneCode,
      });
      toast.success("phone number verified", {
        duration: 2000,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.message === wrongPhoneCode) {
        toast.error("wrong code, please try again", {
          duration: 2000,
        });
        formik.values.phoneCode = "";
        setWasPhoneCodeSent(false);
      }
    }
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/auth/login");
  };
  return (
    <div className="profile__main">
      {data.isAdmin === false ? (
        //give a color to this div
        <div>
          <div className="profile__top">
            <p className="top__text">Welcome to your profile</p>
          </div>

          <div className="profile__info__main">
            <div className="profile__user__balance">
              <div className="profile__top__info">
                <p className="profile__name">{data.name}</p>
                <button onClick={onLogout} className="profile__logout">
                  Log out
                </button>
                <div className="profile__email__main">
                  <p>{data.email}</p>
                  <div className="profile__email">
                    {data.isEmailVerified === false ? (
                      <div>
                        <p>verify email: </p>
                        {wasCodeSent === true ? (
                          <div>
                            <form
                              className="inputs"
                              onSubmit={formik.handleSubmit}
                            >
                              <input
                                className="input inputs__profile"
                                type="number"
                                id="code"
                                name="code"
                                placeholder="code: 1234"
                                onBlur={formik.handleBlur}
                                value={formik.values.code}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.code && formik.errors.code ? (
                                <p className="error__profile">
                                  {formik.errors.code}
                                </p>
                              ) : (
                                ""
                              )}
                              <button
                                className="confirm__code"
                                onClick={confirmCode}
                              >
                                confirm
                              </button>
                            </form>
                          </div>
                        ) : (
                          <button className="code__btn" onClick={sendCode}>
                            send code
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="verified">email verified</p>
                    )}
                  </div>
                </div>

                <div className="profile__email__main">
                  <p>{data.phoneNumber}</p>
                  <div className="profile__email">
                    {data.isPhoneVerified === false ? (
                      <div>
                        <p>verify phone: </p>
                        {wasPhoneCodeSent === true ? (
                          <div>
                            <form
                              className="inputs"
                              onSubmit={formik.handleSubmit}
                            >
                              <input
                                className="input inputs__profile"
                                type="number"
                                id="phoneCode"
                                name="phoneCode"
                                placeholder="code: 1234"
                                onBlur={formik.handleBlur}
                                value={formik.values.phoneCode}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.phoneCode &&
                              formik.errors.phoneCode ? (
                                <p className="error__profile">
                                  {formik.errors.phoneCode}
                                </p>
                              ) : (
                                ""
                              )}
                              <button
                                className="confirm__code"
                                onClick={confirmPhoneCode}
                              >
                                confirm
                              </button>
                            </form>
                          </div>
                        ) : (
                          <button className="code__btn" onClick={sendPhoneCode}>
                            send code
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="verified">phone number verified</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="profile__balance__p">
                <p className="balance__p">Total Balance</p>
              </div>
              <div className="profile__balance">
                <p>paid: </p>
                <p className="balance__paid">
                  ${data.paidBalance > 0 ? data.paidBalance : 0}
                </p>
                <p>unpaid: </p>
                <p className="balance__unpaid">
                  ${data.unpaidBalance > 0 ? data.unpaidBalance : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
