import React from "react"
import { Form, Card, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"

export default function NewReservation(){
  const history = useHistory()

  return (
    <Card body>
      <Form>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>First Name</Form.Label>
          <Form.Control required name="first_name" type="string" placeholder="First Name" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Last Name</Form.Label>
          <Form.Control required name="last_name" type="string" placeholder="Last Name" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control required name="mobile_number" type="string" placeholder="XXX-XXX-XXXX" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Reservation Date</Form.Label>
          <Form.Control required name="reservation_date" type="date" placeholder="XXXXXXXXXX" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Reservation Time</Form.Label>
          <Form.Control required name="reservation_time" type="time" placeholder="XX:XX" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Number of people</Form.Label>
          <Form.Control required name="people" type="number" placeholder="XX" />
        </Form.Group>

        <Button variant="primary" type="submit">Submit</Button>{' '}
        <Button variant="secondary" onClick={() => history.goBack(1)}>Cancel</Button>{' '}
      </Form>
    </Card>
  )
}