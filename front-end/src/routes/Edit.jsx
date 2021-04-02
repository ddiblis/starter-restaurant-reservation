import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ReservationForm from "../componenets/ReservationForm";
import { editReservation, getReservation } from "../utils/api";

export default function Edit() {
  const [errors, setErrors] = useState(null);
  const { reservation_id } = useParams();
  const [form, setForm] = useState({
    reservation_id: 0,
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });

  const handleChange = (event) => {
    const value = event.target.value;
    setForm({
      ...form,
      [event.target.name]: value,
    });
  };

  const history = useHistory();

  useEffect(renderForm, [reservation_id]);

  function renderForm() {
    const abortController = new AbortController();
    getReservation(reservation_id, abortController.signal).then(setForm);

    return () => {
      abortController.abort();
    };
  }

  function validate(form) {
    const err = [];

    function dateInFuture({ reservation_date, reservation_time }) {
      const today = Date.now();
      const date = Date.parse(
        new Date(`${reservation_date}T${reservation_time}:00`)
      );

      if (date < today) {
        err.push(new Error("Date cannot be in the past."));
      }
    }

    function notTuesday({ reservation_date }) {
      const date = new Date(reservation_date).getUTCDay();

      if (date === 2) {
        err.push(new Error("Reservation cannot be on a Tuesday."));
      }
    }

    function timeIsValid({ reservation_time }) {
      const [hour, minute] = reservation_time.split(":");
      console.log(Number(hour) > 21);

      if (Number(hour) < 10 || (Number(hour) <= 10 && Number(minute) <= 30)) {
        err.push(
          new Error("Reservation time cannot be before the restuarant opens.")
        );
      }

      if (Number(hour) > 21 || (Number(hour) >= 21 && Number(minute) >= 30)) {
        err.push(new Error("Reservation time cannot be after 9:30PM."));
      }
    }

    dateInFuture(form);
    notTuesday(form);
    timeIsValid(form);

    return err;
  }

  const submitHandler = (event) => {
    form.people = Number(form.people);
    form.reservation_time = form.reservation_time.slice(0, 5);
    event.preventDefault();

    const listOfErrors = validate(form);

    if (listOfErrors.length) {
      return setErrors(listOfErrors);
    }

    editReservation(reservation_id, form).then(() => {
      return history.goBack(1);
    });
  };

  return (
    <ReservationForm
      submitHandler={submitHandler}
      form={form}
      handleChange={handleChange}
      history={history}
      errors={errors}
      formType={"Edit Reservation"}
    />
  );
}
