// import { type RouteConfig, index, route } from "@react-router/dev/routes";

// export default [
//   index("routes/home.tsx"),
//   route("members", "routes/members.tsx"),
//   route("events", "routes/events.tsx", [
//     route("create-event", "routes/createEvent.tsx"),
//   ]),
//   route("report", "routes/report.tsx"),

//   // Nested route example (optional)
//   //   route("routes/settings.tsx", {
//   //     children: [
//   //       route("routes/settings/profile.tsx"),
//   //       route("routes/settings/security.tsx"),
//   //     ],
//   //   }),
// ] satisfies RouteConfig;

import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// Ignore editor/atomic-write temp files so a temp file flashing into app/routes/
// (e.g. "*.tsx.tmp.1234") is never indexed as a route by the dev watcher.
export default flatRoutes({
  ignoredRouteFiles: ["**/*.tmp.*", "**/*~", "**/.*"],
}) satisfies RouteConfig;
