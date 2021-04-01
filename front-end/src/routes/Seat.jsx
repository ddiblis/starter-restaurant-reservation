import React, { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { getReservation, getTable, listTables, putTable } from "../utils/api";

export default function Seat() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [res, setRes] = useState({});
  const [tableId, setTableId] = useState(1);
  const [table, setTable] = useState({});

  useEffect(loadPage, [reservation_id, tableId]);

  function loadPage() {
    const abortController = new AbortController();

    getReservation(reservation_id, abortController.signal).then(setRes);

    listTables(abortController.signal).then(setTables);

    getTable(tableId, abortController.signal).then(setTable);

    return () => abortController.abort();
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (res.people <= table.capacity) {
      putTable(tableId, res.reservation_id).then(() => {
        return history.push("/reservations")
      });
    }
  };

  const handleChange = (event) => {
    setTableId(event.target.value);
  };

  return (
    <Card body>
      <h1> Seat Reservation: {reservation_id}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Table To Seat Resevation</Form.Label>
          <Form.Control as="select" name="table_id" onChange={handleChange}>
            <option key={0} value={"none"}> -- Please Select table to seat -- </option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </Form.Control>
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
