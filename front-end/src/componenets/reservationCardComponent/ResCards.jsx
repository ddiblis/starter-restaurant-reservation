import React from "react";
import ResCard from "./ResCard";

export default function ResCards(props) {
  const { reservations, dashboard } = props;

  return reservations.map(res =>
    dashboard === true ? (
      res.status !== "finished" ? (
        <ResCard key={res.reservation_id} res={res} />
      ) : null
    ) : (
      <ResCard key={res.reservation_id} res={res} />
    )
  );
}
