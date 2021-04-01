import React, { Fragment, useState } from "react";
import {
  Form,
  Col,
  Button,
  CardDeck,
  Card,
  CardColumns,
} from "react-bootstrap";
import { resByNumber } from "../utils/api";

export default function Search() {
  const [number, setNumber] = useState("");
  const [ress, setRess] = useState([]);

  const handleSubmit = (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    resByNumber(number, abortController.signal).then(setRess);
  };

  const handleChange = (event) => {
    setNumber(event.target.value);
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <h1>Search For Reservation</h1>
        <Form.Row>
          <Col>
            <Form.Control
              required
              name="mobile_number"
              placeholder="Enter a customer's phone number"
              type="string"
              value={number}
              onChange={handleChange}
            />
          </Col>
          <Button type="submit">Search</Button>
        </Form.Row>
      </Form>

      <br />

      {ress.length ? (
        <CardDeck>
          <CardColumns>
            {ress.map((res) => (
              <Card key={res.reservation_id}>
                <Card.Body>
                  <Card.Title data-reservation-id-status={res.reservation_id}>
                    {res.status}
                  </Card.Title>
                  <Card.Text>
                    First Name: {res.first_name} <br />
                    Last Name: {res.last_name} <br />
                    Phone Number: {res.mobile_number} <br />
                    Reservation Date: {res.reservation_date} <br />
                    Reservation Time: {res.reservation_time} <br />
                    People: {res.people} <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </CardColumns>
        </CardDeck>
      ) : (
        <h1> No reservations found </h1>
      )}
    </Fragment>
  );
}
