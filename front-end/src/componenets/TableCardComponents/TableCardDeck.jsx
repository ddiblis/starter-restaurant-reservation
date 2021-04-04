import React from "react";
import { CardColumns, CardDeck } from "react-bootstrap";
import TableCard from "./TableCard";

export default function TableCardDeck(props) {
  const { tables } = props;


  return (
    <CardDeck>
      <CardColumns>
        <TableCard tables={tables}/>
      </CardColumns>
    </CardDeck>
  );
}
