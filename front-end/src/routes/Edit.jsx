import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ReservationForm from "../componenets/ReservationForm";
import { editReservation, getReservation } from "../utils/api";
import { validate } from "../utils/validateRes";

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
