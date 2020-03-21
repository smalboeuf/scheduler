import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

import useVisualMode from "components/hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETE = "DELETE";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    setTimeout(() => {
      if (props.id && interview.student && interview.interviewer) {
        props
          .bookInterview(props.id, interview)
          .then(() => {
            //Decrease from spots

            transition(SHOW);
          })
          .catch(error => transition(ERROR_SAVE, true));
      } else {
        transition(ERROR_SAVE, true);
      }
    }, 800);
  }

  function deleteAppointment() {
    transition(DELETE, true);
    setTimeout(() => {
      props
        .deleteInterview(props.id)
        .then(() => transition(EMPTY))
        .catch(() => transition(ERROR_DELETE, true));
    }, 800);
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interview={props.interview}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={Object.values(props.interviewers)}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message={"Saving..."} />}
      {mode === CONFIRM && (
        <Confirm
          onConfirm={() => deleteAppointment()}
          onCancel={() => back()}
          message={"Delete this appointment?"}
        />
      )}
      {mode === DELETE && <Status message={"Deleting..."} />}
      {mode === EDIT && (
        <Form
          interviewers={Object.values(props.interviewers)}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message={"Could not save the appointment."}
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message={"Could not delete the appointment"}
          onClose={() => back()}
        />
      )}
    </article>
  );
}
