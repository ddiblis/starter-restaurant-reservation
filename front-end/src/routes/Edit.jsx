import React, { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import { editReservation, getReservation } from "../utils/api";

function Errors({ errors = [] }) {
  if (errors !== null) {
    if (errors.length) {
      return (
        <div className="alert alert-danger">
          Error:
          {errors.map((error) => (
            <p key={error.message}>{error.message}</p>
          ))}
        </div>
      );
    }
  }
  return null;
}

export default function Edit() {
  const [errors, setErrors] = useState(null);
  const { reservation_id } = useParams();
  // const [selectedRes, setSelectedRes] = useState([])
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
    <Card body>
      <h1> Edit Reservation: {reservation_id} </h1>
      <Form onSubmit={submitHandler}>
        <Errors errors={errors} />
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            required
            name="first_name"
            type="string"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput2">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            required
            name="last_name"
            type="string"
            value={form.last_name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            required
            name="mobile_number"
            type="string"
            value={form.mobile_number}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput4">
          <Form.Label>Reservation Date</Form.Label>
          <Form.Control
            required
            name="reservation_date"
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            value={form.reservation_date}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput5">
          <Form.Label>Reservation Time</Form.Label>
          <Form.Control
            required
            name="reservation_time"
            type="time"
            pattern="[0-9]{2}:[0-9]{2}"
            value={form.reservation_time}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput6">
          <Form.Label>Number of people</Form.Label>
          <Form.Control
            required
            name="people"
            type="number"
            min={1}
            value={form.people}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>{" "}
        <Button variant="secondary" onClick={() => history.goBack(1)}>
          Cancel
        </Button>{" "}
      </Form>
    </Card>
  );
}
