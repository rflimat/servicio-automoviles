import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";
import { format } from 'date-fns'

function DateTimeInput({ name, value = null, onDateTimeChange }) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedDateTime  = new Date();
      setCurrentDateTime(updatedDateTime);
      onDateTimeChange(name, updatedDateTime); // Pasar la fecha actualizada al componente padre
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onDateTimeChange]);

  const formattedDateTime = format(currentDateTime, "yyyy-MM-dd hh:mm:ss");

  // Formatear la fecha y hora actual
  return (
    <Input
      name={name}
      value={formattedDateTime}
      type="datetime-local"
      readOnly
    />
  );
}

export default DateTimeInput