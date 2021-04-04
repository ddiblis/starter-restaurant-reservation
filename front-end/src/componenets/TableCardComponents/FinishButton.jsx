import React from "react";
import { useHistory } from "react-router";
import { deleteTableRes } from "../../utils/api";
import { Button } from "react-bootstrap";

export default function FinishButton(props) {
  const { table } = props;

  const history = useHistory()

  const handleFinishButton = (event) => {
    event.preventDefault();
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      deleteTableRes(table.table_id, table.reservation_id).then(() => {
        history.go(0);
      });
    }
  };

  return table.reservation_id == null ? null : (
    <Button
      data-table-id-finish={table.table_id}
      variant="outline-success"
      onClick={handleFinishButton}
    >
      Finish
    </Button>
  );
}
