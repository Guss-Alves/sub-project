import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import "./CheckIn.css";

//TODO-- mark client as late, add it to the user schema

const CheckIn = ({ data }) => {
  const [users, setUsers] = useState([]);

  let currentDate = new Date();
  const time = currentDate
    .toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    .slice(0, 8);

  const { user } = useSelector((state) => state.auth);

  const checkOut = async () => {
    try {
      await axios.get(`/api/schedule/payment/user/balance/${data._id}`)
      await axios.put("/api/schedule/checkout", {
        userId: user._id,
        clientId: data._id,
        end: time,
      });
      toast.success("Check-out done", {
        duration: 1500,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="client__main">
      {data.isCheckIn === true && data.isAdmin === false ? (
        <div className="client__color">
          <p className="client__name">{data.name}</p>
          <button className="check__btn" onClick={checkOut}>
            Check-out
          </button>
          <p className="client__email">{data.email}</p>
          <div className="client__balance">
            <p className="client__paid">
              Paid Balance: ${data.paidBalance > 0 ? data.paidBalance : 0}
            </p>
            <p className="client__unpaid">
              Pending Balance: $
              {data.unpaidBalance > 0 ? data.unpaidBalance : 0}
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CheckIn;
