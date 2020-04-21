import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
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
  }, [state.day]);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    updateSpots(state.day, 1);

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment).then(() => {
      setState({
        ...state,
        appointments,
        days: updateSpots(state.day, -1),
      });
    });
  }

  function edit(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(
        setState({
          ...state,
          appointments
        })
      );
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    updateSpots(state.day, -1);

    return axios.delete(`http://localhost:8001/api/appointments/${id}`).then(() => {
      setState({
        ...state,
        appointments,
        days: updateSpots(state.day, 1),
      });
    });
  }

  function updateSpots(day, howMuch) {
    const foundDay = state.days.find((d) => d.name === day);
    const updatedDay = { ...foundDay, spots: foundDay.spots + howMuch };
    const updatedDays = state.days.map((d) => (d.name === day ? updatedDay : d));
    return updatedDays;
  }

  return { state, setDay, bookInterview, deleteInterview, edit };
}
