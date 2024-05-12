import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../design/Button.css";

export const Button = ({ icon, label, addStyle, onClick = () => {} }) => {
  return (
    <button
      className="button-component"
      style={addStyle ?? {}}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </button>
  );
};
