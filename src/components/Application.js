import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "components/helpers/selectors";

import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";

export default function Application(props) {
  // const [day, setDay] = useState("Monday");
  // const [days, setDays] = useState([]);
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios
        .get(`http://localhost:8001/api/days`)
        .catch(error => console.log(error)),
      axios
        .get(`http://localhost:8001/api/appointments`)
        .catch(error => console.log(error)),
      axios
        .get(`http://localhost:8001/api/interviewers`)
        .catch(error => console.log(error))
    ]).then(result => {
      setState({
        day: state.day,
        days: result[0].data,
        appointments: result[1].data,
        interviewers: result[2].data
      });
    });
  }, []);

  function bookInterview() {}

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {getAppointmentsForDay(state, state.day).map(appointment => {
          const interview = getInterview(state, appointment.interview);

          return (
            <Appointment
              key={appointment.id}
              id={appointment.id}
              time={appointment.time}
              interview={interview}
              interviewers={getInterviewersForDay(state, state.day)}
            />
          );
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
