import React from "react";
import { deleteTableRes } from "../utils/api";
import { CardColumns, Card, Button, CardDeck } from "react-bootstrap";

export default function TableCardDeck(props) {
  const { tables, history } = props;

  const tableTypes = {
    free: "primary",
    occupied: "danger",
  };

  return (
    <CardDeck>
      <CardColumns>
        {tables.map((table) => (
          <Card
            key={table.table_id}
            border={
              tableTypes[table.reservation_id == null ? "free" : "occupied"]
            }
            style={{ width: "20rem", height: "13rem" }}
          >
            <Card.Header data-table-id-status={table.table_id}>
              {" "}
              {table.reservation_id == null ? "Free" : "Occupied"}{" "}
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Table: {table.table_name} <br />
                Capacity: {table.capacity} <br />
                Reservation:{" "}
                {table.reservation_id ? table.reservation_id : "None"}
              </Card.Text>
              {table.reservation_id == null ? null : (
                <Button
                  data-table-id-finish={table.table_id}
                  variant="outline-success"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Is this table ready to seat new guests? This cannot be undone."
                      )
                    ) {
                      deleteTableRes(table.table_id, table.reservation_id).then(
                        () => {
                          history.go(0);
                        }
                      );
                    }
                  }}
                >
                  Finish
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </CardColumns>
    </CardDeck>
  );
}
