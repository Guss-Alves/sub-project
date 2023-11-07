import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./Calendar.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";


const Calendar = ({ data }) => {
  const [popUp, setPopUp] = useState(false);
  const [popUpDebt, setPopUpDebt] = useState(true);

  const [conf, setConf] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [available, setUnavailable] = useState([]);

  const navigate = useNavigate();

  console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)

  useEffect(() => {
    if (data.isAdmin === true) {
      navigate("/admin/history");
    }
  }, [data, user]);

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const formik = useFormik({
    initialValues: {
      kids: 1,
    },
    validationSchema: Yup.object({
      kids: Yup.string().required("number of kids is required"),
    }),
  });

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2?.getTime() - date1?.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(date[0].endDate, date[0].startDate) + 1;

  const takenScheduleMessage = "Request failed with status code 400";

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/api/schedule/admin/dates/available");

      setUnavailable(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchUser();
  }, [user._id]);

  const dueDate = new Date(date[0].endDate);
  dueDate.setDate(dueDate.getDate() + 15);

  const CreateSchedule = async () => {
    try {
      if (date[0].startDate === date[0].endDate) {
        await axios.post("/api/schedule", {
          userId: user._id,
          start: date[0].startDate,
          end: date[0].startDate,
          days: 1,
          price: 35 * formik.values.kids,
          kids: formik.values.kids,
          dueDate: dueDate,
        });
      } else {
        await axios.post("/api/schedule", {
          userId: user._id,
          start: date[0].startDate,
          end: date[0].endDate,
          days: days,
          price: 35 * days * formik.values.kids,
          kids: formik.values.kids,
          dueDate: dueDate,
        });
      }
      await axios.get(`/api/schedule/payment/user/balance/${user._id}`);
      toast.success("Schedule Created", {
        duration: 3000,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.message === takenScheduleMessage) {
        toast.error("Schedule is Taken by You", {
          duration: 3000,
        });
        setPopUp(false);
      }
    }
  };

  const confirm = () => {
    setConf(true);
    if (conf === true) {
      CreateSchedule();
    }
  };

  useEffect(() => {
    setConf(!false);
  }, [conf]);

  const dates = [];

  available.map((p) => {
    let left = 0;
    while (left < p.dates.length) {
      const bs = new Date(p.dates[left]);
      dates.push(bs);
      left++;
    }
  });

  return (
    <div className="calendar__color">
      {data.isAdmin === false && popUp === true ? (
        <div className="calendar__popup__color">
          <div className="calendar__popup__main">
            <p className="calendar__p">are you sure about the schedule?</p>
            <p className="calendar__p greyish">
              <span className="calendar__disclaimer"> Disclaimer: </span> you
              can't change your schedule after being checked-in, the payment for
              the day will be required after so. You get charged $35 per day
              that you get checked-in by one of our employees.
            </p>
            <p className="calendar__p greyish">$35 per kid</p>
            <input
              type="number"
              id="kids"
              name="kids"
              placeholder="kids"
              onBlur={formik.handleBlur}
              value={formik.values.kids}
              onChange={formik.handleChange}
            />
            <div className="calendar__btns">
              <button className="confirm__btn" onClick={confirm}>
                yes
              </button>
              <button className="refuse__btn" onClick={() => setPopUp(false)}>
                no
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {data.isAdmin === false ? (
        <div className="calendar__main">
          {data.isBlocked === false &&
          (data.isPhoneVerified === true && data.isEmailVerified === true) ? (
            <div className="calendar__move">
              <span className="calendar__range">{`${format(
                date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={date}
                className="calendar__date"
                minDate={new Date()}
                disabledDates={dates}
              />
              <button
                className="register__schedule__btn"
                onClick={() => setPopUp(true)}
              >
                Create Schedule
              </button>
            </div>
          ) : (
            <div className="register__blocked">
              {popUpDebt === true && (
                <div className="calendar__popup__color move">
                  <div className="calendar__popup__main">
                    {data.isEmailVerified === false ||
                    data.isPhoneVerified === false ? (
                      <p className="calendar__p greyish">
                        <span className="calendar__disclaimer">
                          {" "}
                          Disclaimer:{" "}
                        </span>{" "}
                        please verify your email and phone number to active your
                        account!!
                      </p>
                    ) : (
                      <p className="calendar__p greyish">
                        <span className="calendar__disclaimer">
                          {" "}
                          Disclaimer:{" "}
                        </span>{" "}
                        One of your schedules wasn't paid for at least 15 days,
                        you're not allowed to make schedules until you pay your
                        pending balance.
                      </p>
                    )}

                    <div className="calendar__btns">
                      <Link
                        to={
                          data.isEmailVerified === false &&
                          data.isPhoneVerified === false
                            ? "/profile"
                            : "/checkout"
                        }
                      >
                        <button
                          className="refuse__btn__checkout"
                          onClick={() => setPopUpDebt(false)}
                        >
                          {data.isEmailVerified === false &&
                          data.isPhoneVerified === false
                            ? "Profile"
                            : "Checkout"}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Calendar;
