import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import Errors from "../componenets/Errors";
import ResCardDeck from "../componenets/reservationCardComponent/ResCardDeck";
import TableCardDeck from "../componenets/TableCardComponents/TableCardDeck";
import DateControl from "../componenets/DateControl";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({ date }) {
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
      <ResCardDeck reservations={reservations} dashboard={true} />

      <h1> Tables </h1>
      <TableCardDeck tables={tables} />

      <DateControl date={date} />
    </main>
  );
}
