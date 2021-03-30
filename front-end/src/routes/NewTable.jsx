import { Form, Button, Card } from "react-bootstrap";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { newTable } from "../utils/api"

export default function NewTable() {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    form.capacity = Number(form.capacity);

    newTable(form)
      .then(history.push(`/dashboard`))
  };

  return (
    <Card body>
      <h1> New Table </h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Table Name</Form.Label>
          <Form.Control
            required
            name="table_name"
            type="string"
            placeholder="XX"
            minLength="2"
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
            min="1"
            placeholder="0"
            value={form.capacity}
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
