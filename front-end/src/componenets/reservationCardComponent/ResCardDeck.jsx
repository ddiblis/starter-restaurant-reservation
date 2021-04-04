import React from "react";
import { CardColumns, CardDeck } from "react-bootstrap";
import ResCards from "./ResCards";

export default function ResCardDeck(props) {
  const { reservations, history, dashboard } = props;

  return (
    <CardDeck>
      <CardColumns>
        <ResCards
          reservations={reservations}
          histroy={history}
          dashboard={dashboard}
        />
      </CardColumns>
    </CardDeck>
  );
}
