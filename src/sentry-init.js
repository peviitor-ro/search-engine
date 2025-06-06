import * as Sentry from "@sentry/react";
import packageJson from "../package.json";

Sentry.init({
  dsn: "https://8c2dc5026cd29be9a3ba8247acdf0fe2@o4509076922499072.ingest.de.sentry.io/4509440197263440",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  release: packageJson.version,
  environment: process.env.NODE_ENV // group errors by env
});
