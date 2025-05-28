import { ArrowUp, ArrowDown } from "react-feather";
import { useState } from "react";

function Event({ event, timestamp }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isClient = event.event_id && !event.event_id.startsWith("event_");

  return (
    <div className="flex flex-col gap-2 p-2 rounded-md bg-black border border-red-700">
      <div
        className="flex items-center gap-2 cursor-pointer text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isClient ? (
          <ArrowDown className="text-red-600" />
        ) : (
          <ArrowUp className="text-red-600" />
        )}
        <div className="text-sm text-white">
          {isClient ? "client:" : "server:"}
          &nbsp;{event.type} | {timestamp}
        </div>
      </div>
      <div
        className={`text-white bg-black p-2 rounded-md overflow-x-auto border border-red-700 ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <pre className="text-xs text-white">{JSON.stringify(event, null, 2)}</pre>
      </div>
    </div>
  );
}

export default function EventLog({ events }) {
  const eventsToDisplay = [];
  let deltaEvents = {};

  events.forEach((event) => {
    if (event.type.endsWith("delta")) {
      if (deltaEvents[event.type]) {
        return;
      } else {
        deltaEvents[event.type] = event;
      }
    }

    eventsToDisplay.push(
      <Event key={event.event_id} event={event} timestamp={event.timestamp} />,
    );
  });

  return (
    <div className="flex flex-col gap-2 overflow-x-auto bg-black text-white border border-red-700">
      {events.length === 0 ? (
        <div className="text-white">Awaiting events...</div>
      ) : (
        eventsToDisplay
      )}
    </div>
  );
}
