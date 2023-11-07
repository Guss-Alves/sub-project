import React from "react";
import "./List.css";
import Moment from "react-moment";

const List = ({ history, paid, unpaid }) => {
  return (
    <div > 
      {paid && history.isPaid === true ? (
        <div className="list__main">
          <div className="list__info">
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
          </div>
        </div>
      ) : (
        ""
      )}

      {unpaid && history?.isPaid === false ? (
        <div className="list__main">
          <div className="list__info">
            <div className="list__to">
              <span className="from">
                {history.isLate === true ? <p>late payment!! + $15</p> : ""}
              </span>
            </div>
            <div className="list__to">
              <span className="to">
                {history.isAdmin === true ? (
                  <p>Check-in Done by daycare</p>
                ) : (
                  ""
                )}
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
                {history.end}
              </Moment>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default List;
