import React, { useState, useEffect } from "react";
import { Client, CheckIn, Schedule, Code } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../../features/auth/authSlice";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./dash.css";

const Dash = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [toggleClient, setToggleClient] = useState(true);
  const [toggleHistory, setToggleHistory] = useState(false);
  const [toggleSchedule, setToggleSchedule] = useState(false);
  const [toggleCode, setToggleCode] = useState(false);

  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");

  const [checkin, setCheckin] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.isAdmin === true) {
      setVisible(true);
    }
  }, [data]);


  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/api/user/info/all`);
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCheckin = async () => {
      const res = await axios.get(`/api/schedule/checkin/data`);
      setCheckin(res.data);
    };
    fetchCheckin();
  }, []);

  const handleClient = () => {
    setToggleClient(true);
    setToggleHistory(false);
    setToggleSchedule(false);
    setToggleCode(false);
  };

  const handleHistory = () => {
    setToggleHistory(true);
    setToggleClient(false);
    setToggleSchedule(false);
    setToggleCode(false);
  };

  const handleSchedule = () => {
    setToggleSchedule(true);
    setToggleClient(false);
    setToggleHistory(false);
    setToggleCode(false);
  };

  const handleCode = () => {
    setToggleCode(true);
    setToggleSchedule(false);
    setToggleClient(false);
    setToggleHistory(false);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/auth/login");
  };

  return (
    <div>
      {visible === true ? (
        <div className="dash__main">
          <div className="dash__nav__main">
            <ul className="dash__nav__ul">
              <li
                className={toggleClient === true ? "toggle__active" : ""}
                onClick={handleClient}
              >
                Check-in
              </li>
              <li
                className={toggleHistory === true ? "toggle__active" : ""}
                onClick={handleHistory}
              >
                Check-out
              </li>
              <li
                className={toggleSchedule === true ? "toggle__active" : ""}
                onClick={handleSchedule}
              >
                Schedule
              </li>
              <li
                className={toggleCode === true ? "toggle__active" : ""}
                onClick={handleCode}
              >
                Codes
              </li>
            </ul>
          </div>

          <div className="dash__toggle__main">
            {toggleClient === true ? (
              <>
                <div className="input__mv">
                <button onClick={onLogout} className="profile__logout">
                  Log out
                </button>
                  <input
                    type="text"
                    className="dash__search"
                    placeholder="Search By Name"
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className="toggle">
                  {users
                    ?.filter((val) => {
                      if (search == "") {
                        return val;
                      } else if (
                        val.name
                          .toLowerCase()
                          .includes(search.toLocaleLowerCase())
                      ) {
                        return val;
                      }
                    })
                    .map((user) => (
                      <Client data={user} key={user._id} />
                    ))}
                </div>
              </>
            ) : (
              ""
            )}
            {toggleHistory === true ? (
              <>
                <div className="input__mv">
                  <input
                    type="text"
                    className="dash__search"
                    placeholder="Search By Name"
                    onChange={(event) => setSearch2(event.target.value)}
                  />
                </div>
                <div className="toggle">
                  {users
                    ?.filter((val) => {
                      if (search2 == "") {
                        return val;
                      } else if (
                        val.name
                          .toLowerCase()
                          .includes(search.toLocaleLowerCase())
                      ) {
                        return val;
                      }
                    })
                    .map((user) => (
                      <CheckIn data={user} key={user._id} />
                    ))}
                </div>
              </>
            ) : (
              ""
            )}
            {toggleSchedule === true ? (
              <div className="toggle">
                <Schedule />
              </div>
            ) : (
              ""
            )}

            {toggleCode === true ? (
              <div className="">
                <Code data={data} />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Dash;
