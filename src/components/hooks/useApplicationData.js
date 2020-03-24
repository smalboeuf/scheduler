import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAppointmentsForDay } from 'components/helpers/selectors';

export default function useApplicationData() {
	const [ state, setState ] = useState({
		day: 'Monday',
		days: [],
		appointments: {},
		interviewers: {}
	});

	const setDay = (day) => setState({ ...state, day });

	const URL = ``;

	useEffect(() => {
		Promise.all([
			axios.get(`http://localhost:8001/api/days`).catch((error) => console.log(error)),
			axios.get(`http://localhost:8001/api/appointments`).catch((error) => console.log(error)),
			axios.get(`http://localhost:8001/api/interviewers`).catch((error) => console.log(error))
		]).then((result) => {
			setState({
				day: state.day,
				days: result[0].data,
				appointments: result[1].data,
				interviewers: result[2].data
			});
		});
	}, []);

	function bookInterview(id, interview) {
		const appointment = {
			...state.appointments[id],
			interview
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};

		increaseSpots(state.day);

		return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment).then(
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

		decreaseSpots(state.day);

		setState({
			...state,
			appointments
		});

		return axios.delete(`http://localhost:8001/api/appointments/${id}`);
	}

	function edit(id, interview) {
		const appointment = {
			...state.appointments[id],
			interview: { ...interview }
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};

		setState({
			...state,
			appointments
		});

		axios.put(`http://localhost:8001/api/appointments/${id}`, appointment);
	}

	function increaseSpots(day) {
		const dayAppointments = getAppointmentsForDay(state, day);
		let newDays = state.days;

		for (let i = 0; i < newDays.length; i++) {
			if (newDays[i].name === day) {
				let newDay = newDays[i];
				let amountOfAppointments = 1;
				for (let y = 0; y < dayAppointments.length; y++) {
					if (dayAppointments[y].interview) {
						amountOfAppointments++;
					}
				}
				newDay.spots = newDay.appointments.length - amountOfAppointments;
				setDay(newDay);
				break;
			}
		}
	}

	function decreaseSpots(day) {
		const dayAppointments = getAppointmentsForDay(state, day);
		let newDays = state.days;

		for (let i = 0; i < newDays.length; i++) {
			if (newDays[i].name === day) {
				let newDay = newDays[i];
				let amountOfAppointments = -1;
				for (let y = 0; y < dayAppointments.length; y++) {
					if (dayAppointments[y].interview) {
						amountOfAppointments++;
					}
				}
				newDay.spots = newDay.appointments.length - amountOfAppointments;
				setDay(newDay);
				break;
			}
		}
	}

	return { state, setDay, bookInterview, deleteInterview, edit };
}
