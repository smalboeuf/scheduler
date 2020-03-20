import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";

import useVisualMode from "components/hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETE = "DELETE";
  const EDIT = "EDIT";

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
      props.bookInterview(props.id, interview);
      transition(SHOW);
    }, 800);
  }

  function deleteAppointment() {
    transition(DELETE);
    setTimeout(() => {
      props.deleteInterview(props.id);
      transition(EMPTY);
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
    </article>
  );
}
