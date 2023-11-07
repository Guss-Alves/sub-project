import React from "react";
import { motion } from "framer-motion";
import "./welcome.css";
import Kids from "../../assets/kids.png";

const Welcome = () => {
  return (
    <div className="welcome__color">
      <div className="welcome__main">
        <div className="welcome__text">
          <motion.div
            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
            transition={{ duration: 1.0 }}
          >
            <h1 className="welcome__h1">
              welcome to <span className="welcome__span">gomes daycare</span>,
              the place where your children are well taken care of.
            </h1>
            <p className="welcome__p">
              Here we treat your kids with love and respect, we treat them like
              they are part of our family, this is more than just bussiness.
            </p>
            <div className="welcome__links">
              <a className="link" href="/auth/login">
                Login
              </a>
              <a className="link" href="/auth/register">
                Register
              </a>
            </div>
          </motion.div>
        </div>
        <div className="welcome__img">
          <motion.div
            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
            transition={{ duration: 2 }}
          >
            <img className="welcome__mainImg" src={Kids} alt="kids" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
