const fs = require("fs");
const path = require("path");

const SENTRY_ORG = process.env.SENTRY_ORG || "sebastian-boga";
const SENTRY_PROJECT = process.env.SENTRY_PROJECT || "4509440197263440";
const SENTRY_TOKEN = process.env.SENTRY_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const TEMPLATE_FILE = path.join(
  __dirname,
  "..",
  "..",
  ".github",
  "ISSUE_TEMPLATE",
  "sentry-bug.md"
);
const API_BASE = `https://sentry.io/api/0/organizations/${SENTRY_ORG}`;
const GITHUB_REPO = process.env.GITHUB_REPO || "Theodor Ivascu/sentry";

const CONCURRENCY_LIMIT = parseInt(process.env.CONCURRENCY_LIMIT) || 5;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const GITHUB_BODY_LIMIT = 65536;
const BREADCRUMB_CATEGORIES = (
  process.env.BREADCRUMB_CATEGORIES || "ui.click,fetch,http,navigation,ui.input"
).split(",");

let cachedTemplate = null;
let dryRunMode = false;

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    forceSync: false,
    sentryOrg: SENTRY_ORG,
    sentryProject: SENTRY_PROJECT,
    githubRepo: GITHUB_REPO
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run" || arg === "-d") {
      options.dryRun = true;
    } else if (arg === "--force-sync" || arg === "-f") {
      options.forceSync = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if ((arg === "--org" || arg === "-o") && args[i + 1]) {
      options.sentryOrg = args[++i];
    } else if ((arg === "--project" || arg === "-p") && args[i + 1]) {
      options.sentryProject = args[++i];
    } else if ((arg === "--repo" || arg === "-r") && args[i + 1]) {
      options.githubRepo = args[++i];
    } else if (arg.startsWith("-")) {
      console.warn(`Unknown option: ${arg}`);
    }
  }

  dryRunMode = options.dryRun;
  return options;
}

function validateConfig() {
  const errors = [];

  if (!SENTRY_TOKEN) {
    errors.push("SENTRY_TOKEN is required. Set it via environment variable.");
  }
  if (!GITHUB_TOKEN) {
    errors.push("GITHUB_TOKEN is required. Set it via environment variable.");
  }
  if (!SENTRY_ORG) {
    errors.push(
      "SENTRY_ORG is required. Set it via environment variable or CLI --org."
    );
  }
  if (!SENTRY_PROJECT) {
    errors.push(
      "SENTRY_PROJECT is required. Set it via environment variable or CLI --project."
    );
  }
  if (!GITHUB_REPO) {
    errors.push(
      "GITHUB_REPO is required. Set it via environment variable or CLI --repo."
    );
  }

  if (errors.length > 0) {
    console.error("Configuration errors:");
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  const repoMatch = GITHUB_REPO.match(/^[\w-]+\/[\w-]+$/);
  if (!repoMatch) {
    console.error(
      `Invalid GITHUB_REPO format: "${GITHUB_REPO}". Expected: owner/repo`
    );
    process.exit(1);
  }
}

function printHelp() {
  console.log(
    `
Usage: node sync-sentry.js [options]

Options:
  -d, --dry-run           Preview issues without creating GitHub issues
  -f, --force-sync        Sync all issues ignoring existing ones
  -o, --org <name>        Sentry organization (default: ${SENTRY_ORG})
  -p, --project <id>      Sentry project ID (default: ${SENTRY_PROJECT})
  -r, --repo <owner/repo> GitHub repository (default: ${GITHUB_REPO})
  -h, --help              Show this help message

Environment variables:
  SENTRY_TOKEN            Sentry API token (required)
  GITHUB_TOKEN            GitHub API token (required)
  BREADCRUMB_CATEGORIES   Comma-separated breadcrumb categories
  CONCURRENCY_LIMIT       Max parallel syncs (default: 5)
  FORCE_SYNC              Set to 'true' to force sync all issues
`.trim()
  );
}

function formatDate(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);

      const remaining = res.headers.get("X-RateLimit-Remaining");
      const reset = res.headers.get("X-RateLimit-Reset");

      if (res.status === 403 && remaining === "0" && reset) {
        const waitTime = parseInt(reset) * 1000 - Date.now() + 1000;
        console.log(`Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s...`);
        await sleep(waitTime);
        continue;
      }

      if (!res.ok && res.status >= 500) {
        throw new Error(`Server error: ${res.status}`);
      }

      return res;
    } catch (err) {
      if (attempt < retries) {
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        console.log(
          `Retry ${attempt + 1}/${retries} after ${delay}ms: ${err.message}`
        );
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

async function fetchSentry(endpoint) {
  const res = await fetchWithRetry(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${SENTRY_TOKEN}` }
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Sentry API error: Failed to parse JSON - ${res.status}`);
  }

  if (!res.ok) {
    const msg = data.detail || JSON.stringify(data);
    throw new Error(`Sentry API error: ${res.status} - ${msg}`);
  }
  return data;
}

async function fetchGitHub(endpoint, method = "GET", body = null) {
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    }
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetchWithRetry(`https://api.github.com${endpoint}`, opts);

  if (method === "HEAD") return res;

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`GitHub API error: Failed to parse JSON - ${res.status}`);
  }

  if (!res.ok) {
    const msg = data.message || JSON.stringify(data);
    throw new Error(`GitHub API error: ${res.status} - ${msg}`);
  }
  return data;
}

async function fetchAllGitHubIssues() {
  const issues = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await fetchGitHub(
      `/repos/${GITHUB_REPO}/issues?state=all&per_page=${perPage}&page=${page}`
    );
    if (!data || data.length === 0) break;
    issues.push(...data);

    if (data.length < perPage) break;
    page++;
  }

  return issues;
}

function extractStackTrace(event) {
  const entries = event.entries || [];
  for (const entry of entries) {
    if (entry.type === "exception" && entry.data?.values) {
      const exc = entry.data.values[0];
      const frames = exc.stacktrace?.frames || exc.rawStacktrace?.frames || [];

      if (frames.length > 0) {
        let result = "";
        if (exc.type && exc.value) {
          result += `${exc.type}: ${exc.value}\n\n`;
        }

        result += frames
          .map((f) => {
            const filename = f.filename
              ? f.filename.split("/").pop()
              : f.absPath
                ? f.absPath
                : "?";
            const func = f.function || "anonymous";
            const line = f.lineNo || "?";
            const col = f.colNo ? `:${f.colNo}` : "";
            return `  at ${func} (${filename}:${line}${col})`;
          })
          .join("\n");

        return result;
      }
    }
  }
  return "No stack trace available";
}

function extractTags(event) {
  const tags = event.tags || [];
  if (tags.length === 0) return "_No tags_";
  const tagMap = {};
  for (const t of tags) {
    tagMap[t.key] = t.value;
  }
  const rows = Object.entries(tagMap)
    .map(([k, v]) => `| ${k} | ${v} |`)
    .join("\n");
  return "| Tag | Value |\n|---|---|\n" + rows;
}

function extractRequest(event) {
  const entries = event.entries || [];
  for (const entry of entries) {
    if (entry.type === "request") {
      const req = entry.data;
      let result = "";
      if (req.url) result += `**URL:** ${req.url}\n`;
      if (req.method) result += `**Method:** ${req.method}\n`;
      if (req.headers) {
        const referer = req.headers.find((h) => h[0] === "Referer");
        if (referer) result += `**Referer:** ${referer[1]}\n`;
      }
      return result || "-";
    }
  }
  return "-";
}

function extractUserContext(event) {
  const user = event.user || {};
  if (!user.ip_address && !user.email && !user.id && !user.geo?.city)
    return "_No user context_";

  const rows = [];
  if (user.ip_address) rows.push(`| **IP** | ${user.ip_address} |`);
  if (user.email) rows.push(`| **Email** | ${user.email} |`);
  if (user.id) rows.push(`| **User ID** | ${user.id} |`);
  if (user.geo?.city) rows.push(`| **City** | ${user.geo.city} |`);
  if (user.geo?.country_code)
    rows.push(`| **Country** | ${user.geo.country_code} |`);

  return rows.length > 0
    ? "| Field | Value |\n|---|---|\n" + rows.join("\n")
    : "_No user context_";
}

function extractEnvironment(event) {
  const contexts = event.contexts || {};
  const browser = contexts.browser || {};
  const os = contexts.os || {};

  let result = "";
  if (browser.name) result += `${browser.name} ${browser.version}`;
  else result += "-";
  return result;
}

function extractOS(event) {
  const contexts = event.contexts || {};
  const os = contexts.os || {};
  return os.name && os.version ? `${os.name} ${os.version}` : "-";
}

function extractBreadcrumbs(event) {
  const entries = event.entries || [];
  for (const entry of entries) {
    if (entry.type === "breadcrumbs" && entry.data?.values) {
      const crumbs = entry.data.values
        .filter((c) => c.category && BREADCRUMB_CATEGORIES.includes(c.category))
        .slice(-100)
        .map((c) => {
          const timestamp = c.timestamp?.split("T")[1]?.split(".")[0] || "";

          if (c.category === "fetch" || c.category === "http") {
            const method = c.data?.method || "GET";
            const url = c.data?.url || c.message || "-";
            const status = c.data?.status_code || "-";
            return `- [${timestamp}] [${c.category}] ${method} ${url} [${status}]`;
          }

          const msg = c.message || c.type || "";
          return `- [${timestamp}] [${c.category}] ${msg.substring(0, 150)}`;
        })
        .join("\n");
      return crumbs || "-";
    }
  }
  return "-";
}

function extractRelease(event) {
  return event.release?.version || event.release?.shortVersion || "-";
}

function extractURL(event) {
  const tags = event.tags || [];
  const urlTag = tags.find((t) => t.key === "url");
  return urlTag?.value || "-";
}

function extractIP(event) {
  return event.user?.ip_address || "-";
}

function extractLocation(event) {
  const geo = event.user?.geo || {};
  if (geo.city || geo.region || geo.country_code) {
    return [geo.city, geo.region, geo.country_code].filter(Boolean).join(", ");
  }
  return "-";
}

function getTemplate() {
  if (!cachedTemplate) {
    if (!fs.existsSync(TEMPLATE_FILE)) {
      throw new Error(`Template file not found: ${TEMPLATE_FILE}`);
    }
    cachedTemplate = fs.readFileSync(TEMPLATE_FILE, "utf8");
  }
  return cachedTemplate;
}

function createIssueBody(issue, event) {
  let template = getTemplate();

  const title = issue.title.split("\n")[0];
  const summary =
    issue.metadata?.value || issue.metadata?.type || "No description";

  template = template.replaceAll("{{TITLE}}", title);
  template = template.replaceAll("{{SUMMARY}}", summary);
  template = template.replaceAll(
    "{{STEPS_TO_REPRODUCE}}",
    "See stack trace and Sentry issue for details"
  );
  template = template.replaceAll("{{LEVEL}}", issue.level || "error");
  template = template.replaceAll("{{PRIORITY}}", issue.priority || "-");
  template = template.replaceAll(
    "{{ISSUE_TYPE}}",
    issue.issueType || issue.type || "-"
  );
  template = template.replaceAll(
    "{{ISSUE_CATEGORY}}",
    issue.issueCategory || "-"
  );
  template = template.replaceAll("{{ID}}", issue.id);
  template = template.replaceAll("{{SHORT_ID}}", issue.shortId || "-");
  template = template.replaceAll("{{COUNT}}", issue.count || "1");
  template = template.replaceAll("{{USER_COUNT}}", issue.userCount || "0");
  template = template.replaceAll("{{FIRST_SEEN}}", formatDate(issue.firstSeen));
  template = template.replaceAll("{{LAST_SEEN}}", formatDate(issue.lastSeen));
  template = template.replaceAll("{{CULPRIT}}", issue.culprit || "-");
  template = template.replaceAll("{{STATUS}}", issue.status || "unresolved");
  template = template.replaceAll(
    "{{PROJECT_NAME}}",
    issue.project?.name || "-"
  );
  template = template.replaceAll(
    "{{PROJECT_SLUG}}",
    issue.project?.slug || "-"
  );
  template = template.replaceAll("{{PLATFORM}}", issue.platform || "-");
  template = template.replaceAll(
    "{{SENTRY_URL}}",
    issue.permalink ||
      `https://sentry.io/organizations/${SENTRY_ORG}/issues/${issue.id}/`
  );

  template = template.replaceAll("{{ERROR_TYPE}}", issue.metadata?.type || "-");
  template = template.replaceAll(
    "{{ERROR_VALUE}}",
    issue.metadata?.value || "-"
  );
  template = template.replaceAll(
    "{{FILENAME}}",
    issue.metadata?.filename || "-"
  );
  template = template.replaceAll(
    "{{FUNCTION}}",
    issue.metadata?.function || "-"
  );

  template = template.replaceAll("{{USER_CONTEXT}}", extractUserContext(event));
  template = template.replaceAll("{{BROWSER}}", extractEnvironment(event));
  template = template.replaceAll("{{OS}}", extractOS(event));
  template = template.replaceAll("{{RELEASE}}", extractRelease(event));
  template = template.replaceAll("{{URL}}", extractURL(event));
  template = template.replaceAll("{{IP_ADDRESS}}", extractIP(event));
  template = template.replaceAll("{{LOCATION}}", extractLocation(event));

  const breadcrumbs = extractBreadcrumbs(event);
  const breadcrumbCount =
    event.entries?.find((e) => e.type === "breadcrumbs")?.data?.values
      ?.length || 0;
  template = template.replaceAll("{{TAGS}}", extractTags(event));
  template = template.replaceAll("{{BREADCRUMB_COUNT}}", breadcrumbCount);
  template = template.replaceAll("{{BREADCRUMBS}}", breadcrumbs);
  template = template.replaceAll("{{STACK_TRACE}}", extractStackTrace(event));
  template = template.replaceAll("{{REQUEST}}", extractRequest(event));

  const sentryIdPattern = /<!-- Sentry ID: [a-f0-9]+ -->/;
  template = template.replace(
    sentryIdPattern,
    `<!-- Sentry ID: ${issue.id} -->`
  );
  if (!sentryIdPattern.test(template)) {
    template += `\n\n<!-- Sentry ID: ${issue.id} -->`;
  }

  if (template.length > GITHUB_BODY_LIMIT) {
    console.warn(
      `Warning: Issue body exceeds ${GITHUB_BODY_LIMIT} chars, truncating...`
    );
    template =
      template.substring(0, GITHUB_BODY_LIMIT - 100) + "\n\n... (truncated)";
  }

  return template;
}

async function createGitHubIssue(issue, event) {
  const titleWithoutNewline = issue.title.split("\n")[0];
  const issueTitle = `[Sentry] ${titleWithoutNewline} [ID:${issue.id}]`;
  const body = createIssueBody(issue, event);

  const issueData = {
    title: issueTitle,
    body,
    labels: ["sentry", "bug"]
  };

  const result = await fetchGitHub(
    `/repos/${GITHUB_REPO}/issues`,
    "POST",
    issueData
  );
  return result.number;
}

async function processIssue(issue) {
  try {
    console.log(`Syncing issue ${issue.id}: ${issue.title}`);

    const [event, fullIssue] = await Promise.all([
      fetchSentry(`/issues/${issue.id}/events/latest/`),
      fetchSentry(`/issues/${issue.id}/`)
    ]);

    if (dryRunMode) {
      console.log(`  -> [DRY RUN] Would create issue: ${issue.title}`);
      return { success: true, dryRun: true, issueId: issue.id };
    }

    const issueNumber = await createGitHubIssue(fullIssue, event);

    console.log(`  -> Created GitHub issue #${issueNumber}`);
    return { success: true, issueNumber, issueId: issue.id };
  } catch (err) {
    console.error(`  -> Error: ${err.message}`);
    return { success: false, error: err.message, issueId: issue.id };
  }
}

async function processWithConcurrency(items, processor, limit) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const promise = processor(item).then((result) => {
      executing.splice(executing.indexOf(promise), 1);
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

async function syncIssues() {
  const options = parseArgs();
  validateConfig();

  if (dryRunMode) {
    console.log("=== DRY RUN MODE - No issues will be created ===\n");
  }

  console.log("Fetching unresolved Sentry issues...");
  const issues = await fetchSentry(
    `/issues/?project=${SENTRY_PROJECT}&query=is:unresolved`
  );

  console.log(`Found ${issues.length} unresolved issues`);

  const FORCE_SYNC = process.env.FORCE_SYNC === "true" || options.forceSync;

  let newIssues = issues;

  if (!FORCE_SYNC) {
    console.log("Fetching existing GitHub issues (with pagination)...");
    const existingIssues = await fetchAllGitHubIssues();
    const existingSentryIds = new Set();

    for (const issue of existingIssues) {
      const titleMatch = issue.title.match(/\[Sentry\]\s*.*\[ID:(\d+)\]/);
      if (titleMatch) {
        existingSentryIds.add(titleMatch[1]);
      }

      if (issue.body) {
        const bodyMatch = issue.body.match(/<!-- Sentry ID: ([a-f0-9]+) -->/);
        if (bodyMatch) {
          existingSentryIds.add(bodyMatch[1]);
        }
      }
    }

    console.log(`Found ${existingSentryIds.size} existing synced issues`);
    newIssues = issues.filter((issue) => !existingSentryIds.has(issue.id));
  } else {
    console.log("FORCE_SYNC enabled - syncing all issues");
  }

  console.log(`New issues to sync: ${newIssues.length}`);

  if (newIssues.length === 0) {
    console.log("No new issues to sync.");
    return;
  }

  console.log(`Processing with concurrency limit: ${CONCURRENCY_LIMIT}`);

  const results = await processWithConcurrency(
    newIssues,
    processIssue,
    CONCURRENCY_LIMIT
  );

  const created = results.filter((r) => r.success && !r.dryRun).length;
  const dryRunCount = results.filter((r) => r.dryRun).length;
  const errors = results.filter((r) => !r.success).length;

  console.log(`\nSync complete:`);
  if (dryRunMode) {
    console.log(`- Would create: ${dryRunCount}`);
  } else {
    console.log(`- Created: ${created}`);
  }
  console.log(`- Errors: ${errors}`);
}

syncIssues().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
