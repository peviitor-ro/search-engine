import * as Sentry from "@sentry/react";
import packageJson from "../package.json";

Sentry.init({
  dsn: "https://8c2dc5026cd29be9a3ba8247acdf0fe2@o4509076922499072.ingest.de.sentry.io/4509440197263440",
  // Disable Sentry in development and on localhost
  enabled:
    process.env.NODE_ENV === "production" &&
    typeof window !== "undefined" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname),
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  release: packageJson.version,
  environment:
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "development"
      : process.env.NODE_ENV || "production",

  integrations: [
    Sentry.httpClientIntegration({
      // Track 400-403 and 405-599 (ignore 404 Not Found noise)
      failedRequestStatusCodes: [
        [400, 403],
        [405, 599]
      ]
    })
  ],

  // Fingerprint HTTP Client errors by status code so Sentry stacks them into 1 issue per status code
  beforeSend(event) {
    if (event.exception?.values) {
      for (const exc of event.exception.values) {
        if (
          exc.type === "HTTPClientError" ||
          exc.value?.includes("HTTP Client Error")
        ) {
          const match = exc.value?.match(/status code: (\d+)/);
          const statusCode = match ? match[1] : "http-error";
          event.fingerprint = ["http-client-error", statusCode];
        }
      }
    }
    return event;
  }
});
