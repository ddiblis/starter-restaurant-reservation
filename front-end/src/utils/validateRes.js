export function validate(form) {
  const err = [];

  function dateInFuture({ reservation_date, reservation_time }) {
    const today = Date.now();
    const date = Date.parse(
      new Date(`${reservation_date}T${reservation_time}:00`)
    );

    if (date < today) {
      err.push(new Error("Date cannot be in the past."));
    }
  }

  function notTuesday({ reservation_date }) {
    const date = new Date(reservation_date).getUTCDay();

    if (date === 2) {
      err.push(new Error("Reservation cannot be on a Tuesday."));
    }
  }

  function timeIsValid({ reservation_time }) {
    const [hour, minute] = reservation_time.split(":");
    console.log(Number(hour) > 21);

    if (Number(hour) < 10 || (Number(hour) <= 10 && Number(minute) <= 30)) {
      err.push(
        new Error("Reservation time cannot be before the restuarant opens.")
      );
    }

    if (Number(hour) > 21 || (Number(hour) >= 21 && Number(minute) >= 30)) {
      err.push(new Error("Reservation time cannot be after 9:30PM."));
    }
  }

  dateInFuture(form);
  notTuesday(form);
  timeIsValid(form);

  return err;
}
