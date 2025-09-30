
import "./StatusCard.scss";

const StatusCard = ({ label, count, icon }) => {
  return (
    <div className="status-card">
      <div className="status-card-content">
        <div className="status-card-label">{label}</div>
        <div className="status-card-count">{count}</div>
      </div>
      <div className="status-card-icon">{icon}</div>
    </div>
  );
};

export default StatusCard;
