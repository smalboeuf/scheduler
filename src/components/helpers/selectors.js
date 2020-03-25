export function getAppointmentsForDay(state, day) {
  let filteredDay = state.days.filter(
    uncertainDay => uncertainDay.name === day
  )[0];

  if (!filteredDay) {
    return [];
  } else {
    const appointmentArray = filteredDay.appointments;
    const appointmentObjects = [];

    for (let id = 0; id < appointmentArray.length; id++) {
      if (state.appointments[appointmentArray[id].toString()]) {
        appointmentObjects.push(
          state.appointments[appointmentArray[id].toString()]
        );
      }
    }
    return appointmentObjects;
  }
}

export function getInterview(state, interview) {
  const fullInterview = {};
  let interviewerData = {};

  if (!interview) {
    return null;
  }

  for (const interviewer in state.interviewers) {
    if (interview.interviewer) {
      if (interview.interviewer.toString() === interviewer) {
        interviewerData = state.interviewers[`${interviewer}`];
      }
    }
  }

  fullInterview["student"] = interview.student;
  fullInterview["interviewer"] = interviewerData;

  return fullInterview;
}

export function getInterviewersForDay(state, day) {
  let res = [];
  if (state.days) {
    const found = state.days.find(stateDay => stateDay.name === day);

    if (found && found.interviewers) {
      found.interviewers.forEach(id => {
        res.push(state.interviewers[id]);
      });
    }
  }

  return res;
}
