import "./Assistant.css";
import bot from "../assets/bot.png";
import {
  FiFileText,
  FiBriefcase,
  FiBarChart2,
  FiHelpCircle,
  FiSend,
} from "react-icons/fi";

export default function Assistant() {
  return (
    <div className="assistant-card">
      <div className="assistant-header">
        <h3>AI Assistant</h3>
        <span>•••</span>
      </div>

      <div className="assistant-top">
        <img src={bot} alt="Bot" className="bot-img" />

        <div className="assistant-text">
          <h2>Hello Youssef! 👋</h2>
          <p>How can I help you today?</p>
        </div>
      </div>

      <div className="assistant-buttons">
        <button>
          <FiFileText />
          <span>Summarize reports</span>
        </button>

        <button>
          <FiBriefcase />
          <span>Check project status</span>
        </button>

        <button>
          <FiBarChart2 />
          <span>Analyze sales data</span>
        </button>

        <button>
          <FiHelpCircle />
          <span>Answer questions</span>
        </button>
      </div>

      <div className="assistant-input">
        <input
          type="text"
          placeholder="Ask Eternis AI anything..."
        />

        <button>
          <FiSend />
        </button>
      </div>
    </div>
  );
}