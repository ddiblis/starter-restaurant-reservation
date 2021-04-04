import React from "react";
import { Card } from "react-bootstrap";
import FinishButton from "./FinishButton";

export default function TableCard(props) {
  const { tables } = props;

  const tableTypes = {
    Free: "primary",
    Occupied: "danger",
  };

  const reservationCheck = (table) => {
    return table.reservation_id == null ? "Free" : "Occupied";
  };

  return tables.map((table) => (
    <Card
      key={table.table_id}
      border={tableTypes[reservationCheck(table)]}
      style={{ width: "20rem", height: "13rem" }}
      bg={"dark"}
    >
      <Card.Header data-table-id-status={table.table_id}>
        {" "}
        {reservationCheck(table)}{" "}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          Table: {table.table_name} <br />
          Capacity: {table.capacity} <br />
          Reservation: {table.reservation_id ? table.reservation_id : "None"}
        </Card.Text>
        <FinishButton table={table} />
      </Card.Body>
    </Card>
  ));
}
