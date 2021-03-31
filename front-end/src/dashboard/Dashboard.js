import React, { useEffect, useState } from "react";
import { listReservations, listTables, deleteTableRes } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { CardColumns, Card, Button, ButtonToolbar } from "react-bootstrap"
import { today, next, previous } from "../utils/date-time"
import { useHistory } from "react-router-dom"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory()
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([])

  
  useEffect(loadDashboard, [date, tables]);
  
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    if(date){
      listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    } 
    listReservations(abortController.signal)
    .then(setReservations)
    .catch(setReservationsError)

    listTables(abortController.signal)
    .then(setTables)
      
      return () => abortController.abort();
    }
    
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
      {date ? <h4 className="mb-0">Reservations for {date}</h4> : null}
      </div> 
      <ErrorAlert error={reservationsError} />

      <h1> Reservations </h1>
      <cardDeck>
        <CardColumns>
            {reservations.map((res) => (
              <Card key={res.reservation_id}>
                <Card.Body>
                  <Card.Text>
                    First Name: {res.first_name} <br />
                    Last Name: {res.last_name} <br />
                    Phone Number: {res.mobile_number} <br />
                    Reservation Date: {res.reservation_date} <br />
                    Reservation Time: {res.reservation_time} <br />
                    People: {res.people} <br />
                    Status: {res.status}
                  </Card.Text>
                  <Button href={`/reservations/${res.reservation_id}/seat`}>
                    Seat
                  </Button>
                </Card.Body>
              </Card>
            ))}
        </CardColumns>
      </cardDeck>

      <h1> Tables </h1>
      <cardDeck>
        <CardColumns>
            {tables.map((table) => (
              <Card key={table.table_id}>
                <Card.Body>
                  <Card.Title data-table-id-status={table.table_id}> {table.reservation == null ? "Free" : "Occupied"} </Card.Title>
                  <Card.Text>
                    Table: {table.table_name} <br />
                    Capacity: {table.capacity} <br />
                    Reservation: {table.reservation ? table.reservation : "None"}
                  </Card.Text>
                  {table.reservation == null ? null : (
                  <Button data-table-id-finish={table.table_id} onClick={() => {
                    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
                      deleteTableRes(table.table_id, table.reservation)
                    }
                  }}>
                    Finish
                  </Button>
                    )}
                </Card.Body>
              </Card>
            ))}
        </CardColumns>
      </cardDeck>
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

export default Dashboard;
