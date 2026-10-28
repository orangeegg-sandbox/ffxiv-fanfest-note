import assert from "node:assert/strict";
import { timetableLayout, renderTimetable } from "../ui/schedule.js";
import { stages } from "../data/stages.js";

const official = timetableLayout(stages);
assert.equal(official.days.flatMap((day) => day.entries).length, 10);
assert.equal(official.unbounded.length, 2);
assert.ok(official.unbounded.every((event) => event.category === "broadcast"));
console.log("PASS timetable: all fixed official programs are plotted; intermittent broadcasts have no invented end");

const personal = [
  { id: "early", date: "2026-11-01", start: "05:15", end: "06:10", personal: true, title: "Early transfer" },
  { id: "overlap-one", date: "2026-11-01", start: "10:45", end: "11:30", personal: true, title: "Meet a friend" },
  { id: "overlap-two", date: "2026-11-01", start: "11:00", end: "12:30", personal: true, title: "Lunch" },
  { id: "late", date: "2026-11-02", start: "23:30", end: "23:59", personal: true, title: "Return trip" },
  { id: "no-end", date: "2026-11-02", start: "22:30", personal: true, title: "Meet at station" },
];
const mixed = timetableLayout([...stages, ...personal]);
assert.ok(mixed.start <= 5 * 60 + 15);
assert.ok(mixed.end >= 23 * 60 + 59);
assert.equal(mixed.days.length, 3);
assert.equal(mixed.days.flatMap((day) => day.entries).length + mixed.unbounded.length, stages.length + personal.length);
assert.ok(mixed.unbounded.some((event) => event.id === "no-end"));
console.log("PASS timetable: early, late, additional-date and unknown-end personal plans remain reachable");

for (const day of mixed.days) {
  for (const a of day.entries) {
    for (const b of day.entries) {
      if (a !== b && a.lane === b.lane) {
        assert.ok(a.end <= b.start || b.end <= a.start, `Overlapping plans share a lane: ${a.event.id}, ${b.event.id}`);
      }
    }
  }
}
assert.equal(official.days[0].lanes, 1, "Adjacent official programs should not create unnecessary lanes");
console.log("PASS timetable: overlapping plans stay separate and adjacent programs reuse the same lane");

for (const language of ["zh", "ja"]) {
  const eventRow = (event) => `<article>${event.id}</article>`;
  const chart = renderTimetable({ events: stages, mode: "chart", language, eventRow });
  assert.equal((chart.match(/data-chart-event=/g) || []).length, 10);
  assert.ok(chart.includes('id="chart-detail"'));
  assert.ok(chart.includes("d1-live-report"));
  assert.ok(chart.includes("d2-live-report"));
  assert.ok(!chart.includes("undefined"));
  const agenda = renderTimetable({ events: stages, mode: "agenda", language, eventRow });
  for (const event of stages) assert.ok(agenda.includes(event.id));
}
console.log("PASS timetable: both languages retain all events and expose chart details and text equivalents");
