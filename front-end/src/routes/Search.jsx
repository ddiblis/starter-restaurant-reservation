import React, { Fragment, useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import ResCardDeck from "../componenets/reservationCardComponent/ResCardDeck";
import { resByNumber } from "../utils/api";

export default function Search() {
  const [number, setNumber] = useState("");
  const [ress, setRess] = useState([]);
  const history = useHistory();

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
          <Button variant={"outline-primary"} type="submit">
            Search
          </Button>
        </Form.Row>
      </Form>

      <br />

      {ress.length ? (
        <ResCardDeck reservations={ress} history={history} dashboard={"no"} />
      ) : (
        <h1> No reservations found </h1>
      )}
    </Fragment>
  );
}
