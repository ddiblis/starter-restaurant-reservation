import React from "react";
import { cancelReservation } from "../utils/api";
import {
  CardColumns,
  Card,
  Button,
  ButtonToolbar,
  CardDeck,
} from "react-bootstrap";

export default function ResCardDeck(props) {
  const { reservations, history, dashboard } = props;

  const resTypes = {
    booked: "primary",
    seated: "success",
    finished: "light",
    cancelled: "danger",
  };

  return (
    <CardDeck>
      <CardColumns>
        {reservations.map((res) =>
          dashboard === true ? (
            res.status !== "finished" ? (
              <Card
                key={res.reservation_id}
                border={resTypes[res.status]}
                style={{ width: "20rem", height: "17.5rem" }}
              >
                <Card.Header data-reservation-id-status={res.reservation_id}>
                  {res.status}
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
                  {res.status === "booked" ? (
                    <ButtonToolbar className="justify-content-between">
                      <Button
                        variant="outline-success"
                        href={`/reservations/${res.reservation_id}/seat`}
                      >
                        Seat
                      </Button>
                      <Button
                        variant="outline-secondary"
                        href={`/reservations/${res.reservation_id}/edit`}
                      >
                        Edit
                      </Button>
                      <Button
                        data-reservation-id-cancel={res.reservation_id}
                        variant="outline-danger"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Do you want to cancel this reservation? This cannot be undone."
                            )
                          ) {
                            cancelReservation(res.reservation_id).then(() => {
                              history.go(0);
                            });
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </ButtonToolbar>
                  ) : null}
                </Card.Body>
              </Card>
            ) : null
          ) : (
            <Card
              key={res.reservation_id}
              border={resTypes[res.status]}
              style={{ width: "20rem", height: "17.5rem" }}
            >
              <Card.Header data-reservation-id-status={res.reservation_id}>
                {res.status}
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
                {res.status === "booked" ? (
                  <ButtonToolbar className="justify-content-between">
                    <Button
                      variant="outline-success"
                      href={`/reservations/${res.reservation_id}/seat`}
                    >
                      Seat
                    </Button>
                    <Button
                      variant="outline-secondary"
                      href={`/reservations/${res.reservation_id}/edit`}
                    >
                      Edit
                    </Button>
                    <Button
                      data-reservation-id-cancel={res.reservation_id}
                      variant="outline-danger"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Do you want to cancel this reservation? This cannot be undone."
                          )
                        ) {
                          cancelReservation(res.reservation_id).then(() => {
                            history.go(0);
                          });
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </ButtonToolbar>
                ) : null}
              </Card.Body>
            </Card>
          )
        )}
      </CardColumns>
    </CardDeck>
  );
}
