
import "./SummaryCard.scss";

const SummaryCard = ({ title, value }) => {
  return (
    <div className="summary-card">
      <div className="summary-card-value">{value}</div>
      <div className="summary-card-title">{title}</div>
    </div>
  );
};


export default SummaryCard;
