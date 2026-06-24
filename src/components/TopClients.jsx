import {
  FaRocket,
  FaCode,
  FaRobot,
  FaEllipsisV
} from "react-icons/fa";

export default function TopClients() {
  return (
    <div className="clients-card">

      <div className="clients-top">

        <h2>Top Projects</h2>

        <div className="clients-dots">
          <span></span>
          <span></span>
          <span></span>
          <FaEllipsisV />
        </div>

      </div>

      <div className="client-row">

        <div className="client-icon icon-purple">
          <FaRocket />
        </div>

        <h3>Eternis CRM</h3>

        <span>92%</span>

      </div>

      <div className="client-row">

        <div className="client-icon icon-green">
          <FaCode />
        </div>

        <h3>HR Management</h3>

        <span>78%</span>

      </div>

      <div className="client-row">

        <div className="client-icon icon-mint">
          <FaRobot />
        </div>

        <h3>AI Assistant</h3>

        <span>85%</span>

      </div>

    </div>
  );
}