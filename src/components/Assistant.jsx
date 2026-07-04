import "./Assistant.css";
import bot from "../assets/bot.png";
import {
  FiFileText,
  FiBriefcase,
  FiBarChart2,
  FiHelpCircle,
  FiSend,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Assistant() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    alert(`Eternis AI: I received "${message}" 🤖`);
    setMessage("");
  };

  return (
    <div className="assistant-card">
      <div className="assistant-header">
        <h3>AI Assistant</h3>
        <span>•••</span>
      </div>

      <div className="assistant-top">
        <img
          src={bot}
          alt="Bot"
          className="bot-img"
        />

        <div className="assistant-text">
          <h2>Hello Youssef! 👋</h2>
          <p>How can I help you today?</p>
        </div>
      </div>

      <div className="assistant-buttons">
        <button
          onClick={() =>
            navigate("/reports")
          }
        >
          <FiFileText />
          <span>Summarize reports</span>
        </button>

        <button
          onClick={() =>
            navigate("/projects")
          }
        >
          <FiBriefcase />
          <span>Check project status</span>
        </button>

        <button
          onClick={() =>
            navigate("/reports")
          }
        >
          <FiBarChart2 />
          <span>Analyze sales data</span>
        </button>

        <button
          onClick={() =>
            navigate("/communication")
          }
        >
          <FiHelpCircle />
          <span>Answer questions</span>
        </button>
      </div>

      <div className="assistant-input">
        <input
          type="text"
          placeholder="Ask Eternis AI anything..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button onClick={handleSend}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}