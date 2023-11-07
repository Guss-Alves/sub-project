import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";

import "./Code.css";

const Code = ({ data }) => {
  const [code, setCode] = useState([]);
  const [adminCode, setAdminCode] = useState([]);

  const [popUp, setPopup] = useState(false);

  const generateCode = async () => {
    try {
      axios
        .post(`/api/user/code`, {
          userId: data._id,
        })
        .then((response) => {
          setCode(response.data.code);
        });
      setPopup(true);
      toast.success("Code Created!!", {
        duration: 3000,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const close = () => {
    setPopup(false);
    setTimeout(function () {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="code__main">
      {popUp === true ? (
        <div className="calendar__popup__color">
          <div className="calendar__popup__main">
            <p>Registration Code</p>
            <p className="calendar__p greyish">{code}</p>
            <div className="calendar__btns">
              <button className="confirm__btn" onClick={close}>
                close
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <p className="code__p">generate registration code.</p>
      <div className="code__info">
        <div>
          <p className="code__title">Normal User</p>
          <button className="code__btn text" onClick={generateCode}>
            generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Code;
