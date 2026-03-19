import React from "react";

function Log({ logs }) {
  return (
    <section id="log" className="container">
      <h2>Battle Log</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={`${log.text}-${index}`}>
            <span className={log.isPlayer ? "log--player" : "log--monster"}>
              {log.isPlayer ? "Player" : "Monster"}
            </span>
            <span>
              {" "}
              <span className={log.isDamage ? "log--damage" : "log--heal"}>
                {log.text}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Log;
