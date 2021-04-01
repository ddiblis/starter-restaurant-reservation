import React, { useEffect, useState } from "react";
import { listReservations, listTables, deleteTableRes, cancelReservation } from "../utils/api";
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

  const resTypes = {
    booked: "primary",
    seated: "success",
    finished: "light",
    cancelled: "danger",
  }
  
  const tableTypes= {
    free: "primary",
    occupied: "danger",
  }

  useEffect(loadDashboard, [date, setTables, setReservations]);
  
  function loadDashboard() {
    let isMounted = true; // note this flag denote mount status
    const abortController = new AbortController();
    setReservationsError(null);
    
    if(date){
        listReservations({ date }, abortController.signal)
          .then(data => {
            if(isMounted) setReservations(data)})
          .catch(setReservationsError);

        listTables(abortController.signal)
          .then(data => {
            if (isMounted) setTables(data)
          })
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
              <Card key={res.reservation_id} border={resTypes[res.status]} style={{ width: '20rem', height: "17.5rem" }}>
                <Card.Header data-reservation-id-status={res.reservation_id}>{res.status}</Card.Header>
                <Card.Body>
                  <Card.Text >
                    First Name: {res.first_name} <br />
                    Last Name: {res.last_name} <br />
                    Phone Number: {res.mobile_number} <br />
                    Reservation Date: {res.reservation_date} <br />
                    Reservation Time: {res.reservation_time} <br />
                    People: {res.people} <br />
                  </Card.Text>
                  {res.status === "booked" ? 
                  <ButtonToolbar className="justify-content-between">
                    <Button variant="outline-success" href={`/reservations/${res.reservation_id}/seat`}>
                      Seat
                    </Button> 
                    <Button variant="outline-secondary" href={`/reservations/${res.reservation_id}/edit`}>
                      Edit
                    </Button>
                    <Button data-reservation-id-cancel={res.reservation_id} variant="outline-danger" onClick={() => {
                      if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
                        cancelReservation(res.reservation_id).then(() => {
                          history.go(0)
                        })
                      }
                    }}>
                      Cancel
                    </Button>
                  </ButtonToolbar>
                  : null
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
              <Card key={table.table_id} border={tableTypes[table.reservation_id == null ? "free" : "occupied"]} style={{ width: '20rem', height: "13rem" }}>
                <Card.Header data-table-id-status={table.table_id}> {table.reservation_id == null ? "Free" : "Occupied"} </Card.Header>
                <Card.Body>
                  <Card.Text>
                    Table: {table.table_name} <br />
                    Capacity: {table.capacity} <br />
                    Reservation: {table.reservation_id ? table.reservation_id : "None"}
                  </Card.Text>
                  {table.reservation_id == null ? null : (
                  <Button data-table-id-finish={table.table_id} variant="outline-success" onClick={() => {
                    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
                      deleteTableRes(table.table_id, table.reservation_id).then(() => {
                        history.go(0)
                      })
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