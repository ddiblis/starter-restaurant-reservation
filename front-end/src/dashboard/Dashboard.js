import React, { useEffect, useState } from "react";
import { listReservations, listTables, deleteTableRes } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { CardColumns, Card, Button, ButtonToolbar, CardDeck } from "react-bootstrap"
import { today, next, previous } from "../utils/date-time"
import { useHistory } from "react-router-dom"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({ date }) {
  const history = useHistory()
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([])

  
  useEffect(loadDashboard, [tables, date]);
  
  function loadDashboard() {
    let isMounted = true; // note this flag denote mount status
    const abortController = new AbortController();
    setReservationsError(null);
    if(date){
      listTables(abortController.signal)
        .then(data => {
          if (isMounted) setTables(data)
        })

      listReservations({ date }, abortController.signal)
        .then(data => {
          if(isMounted) setReservations(data)})
        .catch(setReservationsError);
    } else {
      listReservations(abortController.signal)
        .then(data => {
          if(isMounted) setReservations(data)})
        .catch(setReservationsError)
  
      listTables(abortController.signal)
        .then(data => {
          if(isMounted) setTables(data)
        })
      
      return () => {
        isMounted = false
        abortController.abort()
      }
    }
  }
    
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
      {date ? <h4 className="mb-0">Reservations for {date}</h4> : null}
      </div> 
      <ErrorAlert error={reservationsError} />

      <h1> Reservations </h1>
      <CardDeck>
        <CardColumns>
            {reservations.map((res) => ( 
              res.status !== "finished" ? (
              <Card key={res.reservation_id}>
                <Card.Body>
                  <Card.Title data-reservation-id-status={res.reservation_id}>{res.status}</Card.Title>
                  <Card.Text >
                    First Name: {res.first_name} <br />
                    Last Name: {res.last_name} <br />
                    Phone Number: {res.mobile_number} <br />
                    Reservation Date: {res.reservation_date} <br />
                    Reservation Time: {res.reservation_time} <br />
                    People: {res.people} <br />
                  </Card.Text>
                  {res.status === "booked" ? 
                  <Button href={`/reservations/${res.reservation_id}/seat`}>
                    Seat
                  </Button> : null
                  }
                </Card.Body>
              </Card>
              ) : null
            ))}
        </CardColumns>
      </CardDeck>

      <h1> Tables </h1>
      <CardDeck>
        <CardColumns>
            {tables.map((table) => (
              <Card key={table.table_id}>
                <Card.Body>
                  <Card.Title data-table-id-status={table.table_id}> {table.reservation_id == null ? "Free" : "Occupied"} </Card.Title>
                  <Card.Text>
                    Table: {table.table_name} <br />
                    Capacity: {table.capacity} <br />
                    Reservation: {table.reservation_id ? table.reservation_id : "None"}
                  </Card.Text>
                  {table.reservation_id == null ? null : (
                  <Button data-table-id-finish={table.table_id} onClick={() => {
                    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
                      deleteTableRes(table.table_id, table.reservation_id)
                    }
                  }}>
                    Finish
                  </Button>
                    )}
                </Card.Body>
              </Card>
            ))}
        </CardColumns>
      </CardDeck>

      <ButtonToolbar className="justify-content-between">
        <Button onClick={() => history.push(`/dashboard?date=${previous(date ? date : today())}`)}>
          Previous Day
        </Button>
        <Button onClick={() => history.push(`/dashboard?date=${today()}`)}>
          Today
        </Button>
        <Button onClick={() => history.push(`/dashboard?date=${next(date ? date : today())}`)}>
          Next Day
        </Button>
      </ButtonToolbar>
    </main>
  );
}