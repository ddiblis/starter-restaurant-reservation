import React from "react";
import { Form, Card, Button } from "react-bootstrap";
import Errors from "../componenets/Errors";

export default function ReservationForm(props) {
  const {
    submitHandler,
    form,
    handleChange,
    history,
    errors,
    formType,
  } = props;

  return (
    <Card body bg={"dark"}>
      <Errors errors={errors} />
      <h1> {formType} </h1>
      <Form onSubmit={submitHandler}>
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
            placeholder="Last Name"
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
            placeholder="XXX-XXX-XXXX"
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
            placeholder="YYYY-MM-DD"
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
            placeholder="HH:MM"
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
            placeholder="XX"
            value={form.people}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="outline-primary" type="submit">
          Submit
        </Button>{" "}
        <Button variant="outline-secondary" onClick={() => history.goBack(1)}>
          Cancel
        </Button>{" "}
      </Form>
    </Card>
  );
}
