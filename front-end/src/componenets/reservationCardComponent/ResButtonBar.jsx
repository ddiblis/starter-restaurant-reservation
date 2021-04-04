import React from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { cancelReservation } from "../../utils/api";
import { useHistory } from "react-router-dom";

export default function ResButtonBar(props) {
  const { res } = props;

  const history = useHistory()

  const handleCancellation = (event) => {
    event.preventDefault()
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      cancelReservation(res.reservation_id).then(() => {
        history.go(0);
      });
    }
  }

  return res.status === "booked" ? (
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
        onClick={handleCancellation}
      >
        Cancel
      </Button>
    </ButtonToolbar>
  ) : null;
}
