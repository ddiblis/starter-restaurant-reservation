import { Form, Button, Card } from "react-bootstrap";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { newTable } from "../utils/api";
import Errors from "../componenets/Errors";

export default function NewTable() {
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const [form, setForm] = useState({
    table_name: "",
    capacity: "",
  });

  const handleChange = (event) => {
    const value = event.target.value;
    setForm({
      ...form,
      [event.target.name]: value,
    });
  };

  function validate(form) {
    const err = [];

    function validName({ table_name }) {
      if (table_name.length < 2) {
        err.push(new Error("Table name has to be at least 2 characters long."));
      }
    }

    function validCapacity({ capacity }) {
      if (Number(capacity) < 1) {
        err.push(new Error("Table must have capacity of at least 1."));
      }
    }

    validName(form);
    validCapacity(form);

    return err;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    form.capacity = Number(form.capacity);

    const listOfErrors = validate(form);

    if (listOfErrors.length) {
      return setErrors(listOfErrors);
    }

    newTable(form).then(() => {
      return history.push(`/reservations`);
    });
  };

  return (
    <Card body bg={"dark"}>
      <Errors errors={errors} />
      <h1> New Table </h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Table Name</Form.Label>
          <Form.Control
            required
            name="table_name"
            type="string"
            placeholder="XX"
            value={form.table_name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Capacity</Form.Label>
          <Form.Control
            required
            name="capacity"
            type="string"
            placeholder="0"
            value={form.capacity}
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
