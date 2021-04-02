import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { newReservation } from "../utils/api";
import ReservationForm from "../componenets/ReservationForm";

export default function NewReservation() {
  const [errors, setErrors] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });

  const handleChange = (event) => {
    const value = event.target.value;
    setForm({
      ...form,
      [event.target.name]: value,
    });
  };

  const history = useHistory();

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
    const resURL = `/dashboard?date=${form.reservation_date}`;
    event.preventDefault();

    const listOfErrors = validate(form);

    if (listOfErrors.length) {
      return setErrors(listOfErrors);
    }

    newReservation(form)
      .then(() => history.push(resURL))
      .catch(setErrors);
  };

  return (
    <ReservationForm
      submitHandler={submitHandler}
      form={form}
      handleChange={handleChange}
      history={history}
      errors={errors}
      formType={"New Reservation"}
    />
  );
}
