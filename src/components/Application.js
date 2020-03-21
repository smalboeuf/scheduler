import React, { useState, useEffect } from "react";
import axios from "axios";

import useApplicationData from "components/hooks/useApplicationData";

import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "components/helpers/selectors";

import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    deleteInterview,
    edit
  } = useApplicationData();

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
              bookInterview={bookInterview}
              deleteInterview={deleteInterview}
              editInterview={edit}
            />
          );
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
