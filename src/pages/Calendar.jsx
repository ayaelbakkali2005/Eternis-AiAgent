import { useState, useEffect, useMemo, useRef } from "react";
import "./Calendar.css";
import Sidebar from "../components/Sidebar";
import {
  FaSearch,
  FaBell,
  FaPlus,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Map Open-Meteo weather codes to emoji + label
const WEATHER_CODES = {
  0: { icon: "☀️", label: "Sunny Day" },
  1: { icon: "🌤️", label: "Mostly Clear" },
  2: { icon: "⛅", label: "Partly Cloudy" },
  3: { icon: "☁️", label: "Cloudy" },
  45: { icon: "🌫️", label: "Foggy" },
  48: { icon: "🌫️", label: "Foggy" },
  51: { icon: "🌦️", label: "Light Drizzle" },
  53: { icon: "🌦️", label: "Drizzle" },
  55: { icon: "🌧️", label: "Heavy Drizzle" },
  61: { icon: "🌧️", label: "Light Rain" },
  63: { icon: "🌧️", label: "Rain" },
  65: { icon: "🌧️", label: "Heavy Rain" },
  71: { icon: "🌨️", label: "Light Snow" },
  73: { icon: "🌨️", label: "Snow" },
  75: { icon: "❄️", label: "Heavy Snow" },
  80: { icon: "🌦️", label: "Rain Showers" },
  81: { icon: "🌧️", label: "Rain Showers" },
  82: { icon: "⛈️", label: "Violent Showers" },
  95: { icon: "⛈️", label: "Thunderstorm" },
  96: { icon: "⛈️", label: "Thunderstorm" },
  99: { icon: "⛈️", label: "Severe Thunderstorm" },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { icon: "🌡️", label: "Unknown" };
}

function formatDateLong(date) {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function Calendar() {
  // ---------- Events ----------
  const [events, setEvents] = useState([
    { id: 1, title: "Product Demo", date: "2026-06-15", time: "02:00 PM" },
    { id: 2, title: "UI/UX Workshop", date: "2026-06-18", time: "10:00 AM" },
    { id: 3, title: "Team Meeting", date: "2026-06-22", time: "10:00 AM" },
    { id: 4, title: "Project Deadline", date: "2026-06-27", time: "05:00 PM" },
  ]);

  // ---------- Search ----------
  const [searchTerm, setSearchTerm] = useState("");

  // ---------- Add Event modal ----------
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // ---------- Notifications ----------
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // ---------- Weather ----------
  const [weather, setWeather] = useState(null); // { temp, code, cityName }
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  const today = useMemo(() => new Date(), []);
  const todayStr = today.toISOString().split("T")[0];

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch weather based on user's real location + current date
  useEffect(() => {
    async function loadWeather(lat, lon, cityName) {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
          cityName,
        });
      } catch (err) {
        setWeatherError("Could not load weather");
      } finally {
        setWeatherLoading(false);
      }
    }

    async function reverseGeocode(lat, lon) {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`
        );
        const data = await res.json();
        const place = data?.results?.[0];
        return place ? `${place.name}, ${place.country}` : "Your Location";
      } catch {
        return "Your Location";
      }
    }

    if (!navigator.geolocation) {
      // Fallback: Tetouan, Morocco
      loadWeather(35.5785, -5.3684, "Tetouan, Morocco");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const cityName = await reverseGeocode(latitude, longitude);
        loadWeather(latitude, longitude, cityName);
      },
      () => {
        // Permission denied or error -> fallback
        loadWeather(35.5785, -5.3684, "Tetouan, Morocco");
      },
      { timeout: 8000 }
    );
  }, []);

  // ---------- Derived data ----------
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    return events.filter((e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [filteredEvents, todayStr]);

  const todaysEvents = useMemo(() => {
    return events
      .filter((e) => e.date === todayStr)
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }, [events, todayStr]);

  const notifications = useMemo(() => {
    const list = [];
    todaysEvents.forEach((e) =>
      list.push(`"${e.title}" is today${e.time ? ` at ${e.time}` : ""}`)
    );
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    events
      .filter((e) => e.date === tomorrowStr)
      .forEach((e) => list.push(`"${e.title}" is coming up tomorrow`));
    return list;
  }, [todaysEvents, events, today]);

  const calendarEvents = useMemo(
    () => filteredEvents.map((e) => ({ id: String(e.id), title: e.title, date: e.date })),
    [filteredEvents]
  );

  // ---------- Handlers ----------
  function handleAddEvent(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;
    const id = events.length ? Math.max(...events.map((ev) => ev.id)) + 1 : 1;
    setEvents((prev) => [
      ...prev,
      { id, title: newTitle.trim(), date: newDate, time: newTime || null },
    ]);
    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setShowAddModal(false);
  }

  function handleDateClick(info) {
    setNewDate(info.dateStr);
    setShowAddModal(true);
  }

  const wInfo = weather ? getWeatherInfo(weather.code) : null;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="calendar-page">
          {/* Header */}
          <div className="calendar-header">
            <div>
              <h1>Calendar</h1>
              <p>Manage your schedule and never miss an important event.</p>
            </div>

            <div className="header-actions">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <FaTimes
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                  />
                )}
              </div>

              <div className="notif-wrapper" ref={notifRef}>
                <button
                  className="notif-btn"
                  onClick={() => setShowNotifications((v) => !v)}
                >
                  <FaBell />
                  {notifications.length > 0 && (
                    <span>{notifications.length}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notif-dropdown">
                    <h4>Notifications</h4>
                    {notifications.length === 0 ? (
                      <p className="notif-empty">You're all caught up 🎉</p>
                    ) : (
                      notifications.map((n, i) => (
                        <div className="notif-item" key={i}>
                          {n}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                className="add-btn"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus />
                Add Event
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="calendar-content">
            {/* Calendar */}
            <div className="calendar-card">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                height="auto"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={calendarEvents}
                dateClick={handleDateClick}
              />
            </div>

            {/* Right Sidebar */}
            <div className="calendar-sidebar">
              {/* Weather */}
              <div className="mini-card">
                <div className="card-title">
                  <h3>Weather</h3>
                </div>

                <div className="weather-card">
                  {weatherLoading ? (
                    <p>Loading weather...</p>
                  ) : weatherError ? (
                    <p>{weatherError}</p>
                  ) : (
                    <>
                      <h2>
                        {wInfo.icon} {weather.temp}°C
                      </h2>
                      <p>
                        <FaMapMarkerAlt style={{ marginRight: 6 }} />
                        {weather.cityName}
                      </p>
                      <span>{wInfo.label}</span>
                      <p className="weather-date">{formatDateLong(today)}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="mini-card">
                <div className="card-title">
                  <h3>Upcoming Events</h3>
                  <span onClick={() => setSearchTerm("")}>View all</span>
                </div>

                {upcomingEvents.length === 0 ? (
                  <p className="empty-msg">No matching events.</p>
                ) : (
                  upcomingEvents.map((e) => (
                    <div className="event" key={e.id}>
                      <h4>{e.title}</h4>
                      <p>{formatDateLong(new Date(e.date + "T00:00:00"))}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Today's Events */}
              <div className="mini-card">
                <div className="card-title">
                  <h3>Today's Events</h3>
                </div>

                {todaysEvents.length === 0 ? (
                  <p className="empty-msg">Nothing scheduled today.</p>
                ) : (
                  todaysEvents.map((e) => (
                    <div className="event" key={e.id}>
                      <h4>{e.title}</h4>
                      <p>{e.time || "All day"}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Tasks */}
              <div className="mini-card">
                <div className="card-title">
                  <h3>Tasks & Deadlines</h3>
                  <span>View all</span>
                </div>

                <div className="task">Prepare monthly report</div>
                <div className="task">Review design system</div>
                <div className="task">Update project roadmap</div>
                <div className="task">Finish dashboard UI</div>
              </div>

              {/* AI Assistant */}
              <div className="mini-card ai-card">
                <h3>🤖 Eternis AI</h3>

                <p>
                  You have {todaysEvents.length} meeting
                  {todaysEvents.length !== 1 ? "s" : ""} today
                  {notifications.length > todaysEvents.length
                    ? " and 1 deadline tomorrow."
                    : "."}
                </p>

                <button className="ai-btn">Open Assistant</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Event</h3>
              <FaTimes onClick={() => setShowAddModal(false)} />
            </div>
            <form onSubmit={handleAddEvent}>
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Client Call"
                required
              />

              <label>Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />

              <label>Time (optional)</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />

              <button type="submit" className="add-btn modal-submit">
                Save Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
