import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminHistory.css";
import { MdPaid } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";

// earning graph // do it towards the end

const AdminHistory = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const ScheduleData = async () => {
      const res = await axios.get("/api/schedule/payment/history");
      setSchedule(res.data);
    };
    ScheduleData();
  }, []);

  useEffect(() => {
    const UserInfo = async () => {
      const res = await axios.get("/api/schedule/payment/history/user");
      setUserData(res.data);
    };
    UserInfo();
  }, []);

  useEffect(() => {
    if (data.isAdmin === true) {
      setVisible(true);
    }
  }, [data]);

  let arr = Array.from(schedule);

  return (
    <div>
      {visible === true ? (
        <div className="earnings__main">
          <div className="earnings__title__div">
            <p className="earnings__title">Bussiness Data</p>
          </div>
          {arr?.map((item) => (
            <div className="earnings__inside" key={item._id}>
              <div className="earnings__numOf__total">
                <p className="paid__p">Total Schedules</p>
                <div className="paid__items">
                  <p className="paid__num">#{item.allSchedules}</p>
                  <BsCheckAll color="green" size={40} />
                </div>
              </div>
              <div className="earnings__numOf__paid">
                <p className="paid__p">Number of paid Schedules</p>
                <div className="paid__items">
                  <p className="paid__num">#{item.numberOfPaidSchedules}</p>
                  <MdPaid color="white" size={40} />
                </div>
              </div>
              <div className="earnings__numOf__paid">
                <p className="paid__p">Total Revenue</p>
                <div className="paid__items">
                  <p className="paid__num">${item.revenue}</p>
                  <MdPaid color="white" size={40} />
                </div>
              </div>

              <div className="earnings__numOf__unpaid">
                <p className="paid__p">Unpaid Schedules</p>
                <div className="paid__items">
                  <p className="paid__num">#{item.numberOfUnpaidSchedules}</p>
                  <p className="unpaid__p">Pending....</p>
                </div>
              </div>
              <div className="earnings__numOf__unpaid">
                <p className="paid__p">Late Schedules</p>
                <div className="paid__items">
                  <p className="paid__num">#{item.late}...</p>
                </div>
              </div>
              <div className="earnings__numOf__unpaid">
                <p className="paid__p">Pending Value</p>
                <div className="paid__items">
                  <p className="paid__num">${item.valueOfUnpaid}</p>
                </div>
              </div>
              {userData.map((user) => (
                <div className="user__data">
                  <div className="user__left">
                    <p className="user__p">Total Users</p>
                    <div className="user__bottom">
                      <p className="paid__num">#{user.totalUsers}</p>
                      <FaUserAlt size={30} color={"rgb(96, 3, 3)"} />
                    </div>
                  </div>
                  <div className="user__left">
                    <p className="user__p">Active Users</p>
                    <div className="user__bottom">
                      <p className="paid__num">#{user.userScheduleOn}</p>
                      <FaUserAlt size={30} color={"rgb(180, 180, 67"} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminHistory;
