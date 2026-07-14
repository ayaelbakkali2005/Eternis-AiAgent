import "./UpcomingEvents.css";
import {
  FiCalendar,
  FiClock,
} from "react-icons/fi";

const events = [
  {
    title: "Team Meeting",
    date: "June 28, 2026",
    time: "09:00 AM",
  },
  {
    title: "Project Review",
    date: "June 30, 2026",
    time: "02:00 PM",
  },
  {
    title: "Client Presentation",
    date: "July 02, 2026",
    time: "11:00 AM",
  },
];

export default function UpcomingEvents() {
  return (
    <div className="events-card">
      <div className="events-header">
        <h3>Upcoming Events</h3>
        <button>View All</button>
      </div>

      <div className="events-list">
        {events.map((event, index) => (
          <div className="event-item" key={index}>
            <div className="event-title">
              {event.title}
            </div>

            <div className="event-info">
              <span>
                <FiCalendar />
                {event.date}
              </span>

              <span>
                <FiClock />
                {event.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}