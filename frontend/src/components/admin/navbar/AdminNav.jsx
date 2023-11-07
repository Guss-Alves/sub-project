import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillCloseCircle } from "react-icons/ai";

const AdminNavbar = () => {
  const [toggle, setToggle] = useState(false);

  const close = () => {
    setToggle(false);
  };

  return (
    <div className="navbar__main">
      <div className="navbar__logo">
        <p className="navbar__slogan">Dashboard Admin</p>
      </div>
      <div className="navbar__icons">
        <ul className="navbar__icons__ul">
          <li>
            <Link style={{ textDecoration: "none" }} to={"/admin/history"}>
              <span className="navbar__history color">History</span>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to={"/admin"}>
              <span className="navbar__feed color">Management</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="toggle__nav">
        <GiHamburgerMenu
          onClick={() => setToggle(true)}
          className="close__icon"
        />
        {toggle && (
          <div className="toggle__color">
            <div className="toggle__main">
              <div className="toggle__top">
                <p className="slogan__toggle">Gomes Daycare</p>

                <AiFillCloseCircle onClick={close} className="close__icon " />
              </div>
              <div className="toggle__icons">
                <ul className="toggle__icons__ul">
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to={"/admin/history"}
                    >
                      <span className="navbar__history color" onClick={close}>
                        History
                        <p className="toggle__details">
                          sell all the bussiness data, active users, pending
                          values and much more...
                        </p>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link style={{ textDecoration: "none" }} to={"/admin"}>
                      <span className="navbar__feed color" onClick={close}>
                        Management
                        <p className="toggle__details">
                          daily content about the activities that the kids are
                          doing, gentle parenting and much more...
                        </p>
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
