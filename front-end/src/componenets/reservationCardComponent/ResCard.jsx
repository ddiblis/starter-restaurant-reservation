import React from "react";
import { Card } from "react-bootstrap";
import ResButtonBar from "./ResButtonBar";
import _ from "lodash";

export default function ResCard(props) {
  const { res } = props;

  const resTypes = {
    booked: "primary",
    seated: "success",
    finished: "light",
    cancelled: "danger",
  };

  return (
    <Card
      key={res.reservation_id}
      border={resTypes[res.status]}
      style={{ width: "20rem", height: "17.5rem" }}
      bg={"dark"}
    >
      <Card.Header data-reservation-id-status={res.reservation_id}>
        {_.capitalize(res.status)}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          First Name: {res.first_name} <br />
          Last Name: {res.last_name} <br />
          Phone Number: {res.mobile_number} <br />
          Reservation Date: {res.reservation_date} <br />
          Reservation Time: {res.reservation_time} <br />
          People: {res.people} <br />
        </Card.Text>
        <ResButtonBar res={res} />
      </Card.Body>
    </Card>
  );
}
