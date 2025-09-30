import React from "react";
import "./InfoCard.scss";

const InfoCard = ({ label, value }) => {
  return (
    <div className="info_card">
      <p className="info_label">{label}</p>
      <p className="info_value">{value || "N/A"}</p>
    </div>
  );
};

export default InfoCard;
