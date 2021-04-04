import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { newReservation } from "../utils/api";
import ReservationForm from "../componenets/ReservationForm";
import { validate } from "../utils/validateRes"

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
