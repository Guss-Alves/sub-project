import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillCloseCircle } from "react-icons/ai";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const close = () => {
    setToggle(false);
  };

  return (
    <div className="navbar__main">
      <div className="navbar__logo">
        <p className="navbar__slogan">Gomes Daycare</p>
      </div>
      <div className="navbar__icons">
        <ul className="navbar__icons__ul">
          <li>
            <a style={{ textDecoration: "none" }} href={"/calendar"}>
              <span className="navbar__schedule color">Calendar</span>
            </a>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to={"/schedules"}>
              <span className="navbar__history color">History</span>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to={"/checkout"}>
              <span className="navbar__pay color">Checkout</span>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to={"/profile"}>
              <span className="navbar__pay color">Profile</span>
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
                    <Link style={{ textDecoration: "none" }} to={"/calendar"}>
                      <span onClick={close} className="navbar__schedule color">
                        Calendar
                        <p className="toggle__details">
                          create your own schedules without getting charged, you
                          only get charged after the everyday check-in....{" "}
                        </p>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link style={{ textDecoration: "none" }} to={"/schedules"}>
                      <span className="navbar__history color" onClick={close}>
                        History
                        <p className="toggle__details">
                          see all your schedules, the one's that are paid for,
                          and the ones that are due
                        </p>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link style={{ textDecoration: "none" }} to={"/profile"}>
                      <span className="navbar__history color" onClick={close}>
                        Profile
                        <p className="toggle__details">
                          see all your personal information, confirm your email
                          and phone number...
                        </p>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link style={{ textDecoration: "none" }} to={"/checkout"}>
                      <span className="navbar__pay color" onClick={close}>
                        Checkout
                        <p className="toggle__details">payment...</p>
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

export default Navbar;
