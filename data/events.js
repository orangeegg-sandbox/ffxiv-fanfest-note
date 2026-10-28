import { summaryImages, summaryPhotoSessions } from "./summary.js";
import { stages, eventMeta, stageGuidance } from "./stages.js";
import { activities, maps, reservationInfo, practical } from "./activities.js";
// Official content verified 2026-10-28. See docs/SOURCES-*.md for provenance.
// All event times must be Japan Standard Time (Asia/Tokyo).
export const eventData = {
  edition: "2026",
  region: "Japan",
  timezone: "Asia/Tokyo",
  verifiedAt: eventMeta.verifiedAt,
  sourceStatus: "verified",
  dates: eventMeta.dates,
  venue: eventMeta.venue,
  eventMeta,
  stageGuidance,
  reservationInfo,
  summaryImages,
  summaryPhotoSessions,
  sources: [
    {
      id: "stages",
      title: { zh: "舞台節目", ja: "ステージ" },
      url: "https://fanfest.finalfantasyxiv.com/2026/jp/stages/",
    },
    {
      id: "reservation",
      title: { zh: "活動預約", ja: "アクティビティの予約" },
      url: "https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/",
    },
    {
      id: "floors",
      title: { zh: "會場活動", ja: "フロアアクティビティ" },
      url: "https://fanfest.finalfantasyxiv.com/2026/jp/floors/",
    },
    {
      id: "maps",
      title: { zh: "會場地圖", ja: "会場マップ" },
      url: "https://fanfest.finalfantasyxiv.com/2026/jp/maps/",
    },
  ],
  stages,
  activities,
  maps,
  practical,
};
