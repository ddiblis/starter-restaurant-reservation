import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { Button, ButtonToolbar } from "react-bootstrap";
import { today, next, previous } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import Errors from "../componenets/Errors";
import ResCardDeck from "../componenets/ResCardDeck";
import TableCardDeck from "../componenets/TableCardDeck";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date, setTables, setReservations]);

  function loadDashboard() {
    let isMounted = true; // note this flag denote mount status
    const abortController = new AbortController();
    setReservationsError(null);

    if (date) {
      listReservations({ date }, abortController.signal)
        .then((data) => {
          if (isMounted) setReservations(data);
        })
        .catch(setReservationsError);

      listTables(abortController.signal).then((data) => {
        if (isMounted) setTables(data);
      });
    } else {
      listReservations(abortController.signal)
        .then((data) => {
          if (isMounted) setReservations(data);
        })
        .catch(setReservationsError);

      listTables(abortController.signal).then((data) => {
        if (isMounted) setTables(data);
      });

      return () => {
        isMounted = false;
        abortController.abort();
      };
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        {date ? <h4 className="mb-0">Reservations for {date}</h4> : null}
      </div>
      <Errors error={reservationsError} />

      <h1> Reservations </h1>
      <ResCardDeck
        reservations={reservations}
        history={history}
        dashboard={true}
      />

      <h1> Tables </h1>
      <TableCardDeck tables={tables} history={history} />

      <ButtonToolbar className="justify-content-between">
        <Button
          onClick={() =>
            history.push(`/dashboard?date=${previous(date ? date : today())}`)
          }
        >
          Previous Day
        </Button>
        <Button onClick={() => history.push(`/dashboard?date=${today()}`)}>
          Today
        </Button>
        <Button
          onClick={() =>
            history.push(`/dashboard?date=${next(date ? date : today())}`)
          }
        >
          Next Day
        </Button>
      </ButtonToolbar>
    </main>
  );
}
