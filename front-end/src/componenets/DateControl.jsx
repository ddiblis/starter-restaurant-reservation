import React from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { today, next, previous } from "../utils/date-time";
import { useHistory } from "react-router-dom";

export default function DateControl(props) {
  const { date } = props;

  const history = useHistory();

  const handleClick = (type) => {
    const url = `/dashboard?date=`;
    let toUse = date ? date : today();
    let day;
    if (type === "previous") day = previous(toUse);
    if (type === "today") day = today();
    if (type === "next") day = next(toUse);
    return history.push(url + day);
  };

  return (
    <ButtonToolbar className="justify-content-between">
      <Button
        variant={"outline-secondary"}
        onClick={() => handleClick("previous")}
      >
        Previous Day
      </Button>
      <Button variant={"outline-primary"} onClick={() => handleClick("today")}>
        Today
      </Button>
      <Button variant={"outline-secondary"} onClick={() => handleClick("next")}>
        Next Day
      </Button>
    </ButtonToolbar>
  );
}
