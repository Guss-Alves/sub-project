import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Checkout.css";
import Moment from "react-moment";
import PaymentBtn from "../../components/PaymentBtn";
import found from "../../assets/found.gif";

const Checkout = () => {
  const [schedule, setSchedule] = useState({});

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/schedule/${user._id}`);
      setSchedule(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchUser();
  }, [user._id]);

  let dataArr = Array.from(schedule);
  let result = [];
  let price;
  let data = [];

  // pushing total price
  dataArr?.map((p) => {
    if (p.isPaid === false) {
      result.push(p.price);
    }
  });

  //setting price for the "Total price: $" totally apart
  price = result.reduce((a, b) => a + b, 0);

  //pushing the entire object
  dataArr?.map((p) => {
    if (p.isPaid === false) {
      data.push(p);
    }
  });

  //TODO- create a pop up to update the schedule info before actually paying it

  return (
    <div className="check__main">
      <div className="check__schedules">
        <p className="check__total">Total price: $ {price ? price : 0}</p>

        {!data.length > 0 ? (
          <div className="check__schedules">
            <p className="no__schedule">No Schedule is due</p>
            <img className="history__img" src={found} alt="" />
          </div>
        ) : (
          <div className="check__schedules">
            <p className="check__p">All unpaid schedules</p>
            <PaymentBtn data={data} />
          </div>
        )}
      </div>
      <div className="history__list">
        {dataArr?.map((history) =>
          history?.isPaid === false ? (
            <div className="list__main" key={history._id}>
              <div className="list__info">
                <div className="list__to">
                  <span className="from">
                    {history.isLate === true ? <p>late payment!! + $15</p> : ""}
                  </span>
                </div>
                <div className="list__to">
                  <span className="to">
                    {history.isAdmin === true ? <p>Check-in Done</p> : ""}
                  </span>
                </div>
                <div className="list__from">
                  <span className="from">From: </span>
                  <Moment format="DD/MM/YYYY" className="list__dates">
                    {history.start}
                  </Moment>
                </div>
                <div className="list__to">
                  <span className="to">To: </span>
                  <Moment format="DD/MM/YYYY" className="list__dates">
                    {history.end}
                  </Moment>
                </div>
                <div className="list__to">
                  <span className="to">Days: {history.days}</span>
                </div>
                <div className="list__to">
                  <span className="to">Price: ${history?.price} </span>
                </div>
                <div className="list__to">
                  <span className="to">
                    kids: {history?.kids ? history.kids : 0}{" "}
                  </span>
                </div>
                <div className="list__to">
                  <span className="from">Due date: </span>
                  <Moment format="DD/MM/YYYY" className="list__dates">
                    {history.dueDate}
                  </Moment>
                </div>
              </div>
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
};

export default Checkout;
