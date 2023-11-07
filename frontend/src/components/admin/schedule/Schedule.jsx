import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Schedule.css";

//create schedule
// change backend to indicate the schedule was created by an admin

const Schedule = () => {
  const [popUp, setPopUp] = useState(false);
  const [conf, setConf] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [dates, setDates] = useState([]);
  const [available, setUnavailable] = useState([]);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    const daysBetween =
      (date[0].endDate.getTime() - date[0].startDate.getTime()) /
      (1000 * 3600 * 24);
    const arr = [];

    for (let i = 0; i <= daysBetween; i++) {
      const temp = new Date();
      temp.setDate(date[0].startDate.getDate() + i);
      arr.push(temp);
    }

    setDates(arr);
  }, [date]);

  const CreateSchedule = async () => {
    try {
      if (date[0].startDate === date[0].endDate) {
        await axios.post("/api/schedule/admin", {
          userId: user._id,
          dates: dates,
        });
      } else {
        await axios.post("/api/schedule/admin", {
          userId: user._id,
          dates: dates,
        });
      }
      toast.success("Schedule Created", {
        duration: 3000,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error.message);
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


  useEffect(() => {
    const availableDates = async () => {
      const res = await axios.get("/api/schedule/admin/dates/available");

      setUnavailable(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    availableDates();
  }, [user._id]);

  
  //EXP--putting date on the proper format and passing it to the calendar
  const schedule = [];
  available.map((p) => {
    let left = 0;
    while (left < p.dates.length) {
      const bs = new Date(p.dates[left]);
      schedule.push(bs);
      left++;
    }
  });
  


  //EXP--when there was not unavailable schedule it would just block the current one that is selected, the default value, this function return the Data propertly
  const Data = () => {
    if (available === []) {
      return []
    } else {
      return schedule
    }
  };

  return (
    <div className="calendar__color">
      {popUp === true ? (
        <div className="calendar__popup__sch">
          <div className="calendar__popup__main">
            <p className="calendar__p">are you sure about the schedule?</p>
            <p className="calendar__p greyish">
              <span className="calendar__disclaimer"> Disclaimer: </span> Clients won't be able to create schedules on these selected days, are you sure ?
            </p>
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

      <div className="calendar__main">
        <div className="calendar__move">
          <span className="calendar__range">{`${format(
            date[0].startDate,
            "MM/dd/yyyy"
          )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
        <p className="unavailable__dates">Set the dates that the daycare won't be open.</p>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={date}
            className="calendar__date"
            minDate={new Date()}
            disabledDates={Data()}
          />
          <button
            className="register__schedule__btn"
            onClick={() => setPopUp(true)}
          >
            Create Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
