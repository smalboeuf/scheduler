export function getAppointmentsForDay(state, day) {
  let filteredDay = state.days.filter(
    uncertainDay => uncertainDay.name === day
  )[0];

  if (!filteredDay) {
    return [];
  } else {
    const appointmentArray = filteredDay.appointments;
    const appointmentObjects = [];
    for (const id of appointmentArray) {
      if (state.appointments[id]) {
        appointmentObjects.push(state.appointments[id]);
      }
    }

    return appointmentObjects;
  }
}
