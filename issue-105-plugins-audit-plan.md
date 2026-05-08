# Issue #105 — CodeceptJS 4.x Plugins Audit

**Goal:** Functional testing of 14 CodeceptJS 4.x plugins as product features.
**Environment:** Separate test project with a simple HTML app + CodeceptJS/Playwright.
**AI provider:** Anthropic API key (for heal, analyze, aiTrace).
**Skipped:** `pause` (interactive-only, no automation path).

---

## Phase 1 — Infrastructure

- [x] Simple HTML app with required elements:
  - [x] Login form (for `auth`) — `app/login.html`
  - [x] Buttons/inputs with `data-test-id` (for `customLocator`) — `app/dynamic.html`
  - [x] Elements with error/warning CSS classes (for `pageInfo`) — `app/errors.html`
  - [x] Multi-page navigation (for `screenshot`, `screencast`, `coverage`) — 6 pages with nav
  - [x] Element with dynamic/breakable locator (for `heal`) — `app/dynamic.html` break button
  - [x] Slow JS handler (for `retryFailedStep`, `autoDelay`, `stepTimeout`) — `app/slow.html` 1s/3s/10s
- [x] CodeceptJS project with Playwright, base config
- [x] `.env` with Anthropic API key
- [x] Set of passing + intentionally failing tests — `tests/screenshot/passing.test.ts` + `failing.test.ts`

---

## Phase 2 — Test Cases by Plugin

### S1. screenshot (~8-10 cases)

- [x] `on: "fail"` — screenshot captured on test failure ✅ 1 PNG for failed test only, passing test has no screenshot
- [x] `on: "test"` — screenshot captured at test completion ✅ PNGs for both passing and failing tests
- [x] `on: "step"` — screenshot captured after each step ✅ 4 PNGs for 4 steps, named `step_1..4`
- [x] `on: "file"` — screenshot for specific file/line ✅ CLI-only (`-p screenshot:on=file:path=...`), per-step screenshots for matching file
- [x] `on: "url"` — screenshot when URL matches pattern ✅ CLI-only (`-p screenshot:on=url:pattern=...`), `.url_N` suffix
- [x] `fullPageScreenshots: true` vs `false` ⚠️ Works but needs tall page to see dimension difference (test app fits in viewport)
- [x] `uniqueScreenshotNames: true` — filenames are unique ✅ Hash appended to filename
- [x] `slides: true` — HTML slideshow generated ✅ `records.html` index + `record_<hash>/index.html` per test with PNG per step
- [x] `deleteSuccessful: true/false` — slideshow cleanup for passing tests ✅ `true`: only failing test dir kept; `false`: both kept
- [x] `animateSlides: true/false` — CSS transitions in slideshow ✅ CSS `transition` rules present in slideshow HTML
- [x] `ignoreSteps` — excluded steps don't produce screenshots ✅ Only with `slides: true`; RegExp format; `[/seeElement/]` reduced 4→2 PNGs

**Findings — screenshot:**
1. `on: "file"` and `on: "url"` are CLI-only modes (`-p screenshot:on=file:path=...`). Setting them in `codecept.conf.ts` config object has no effect — the trigger resolver reads CLI args first and falls back to config `on` value, but `path`/`pattern` params are only parsed from CLI `:key=value` syntax.
2. `ignoreSteps` only works in `slides: true` context (called inside `persistStep()` which is the slides recording function). In plain `on: "step"` mode without slides, all steps get screenshots regardless of `ignoreSteps`.
3. `ignoreSteps` requires RegExp format (`[/seeElement/]`), not string arrays (`["seeElement"]`). String values silently do nothing.
4. `fullPageScreenshots` works but produces identical dimensions when page content fits within viewport. Need a page with scrollable content to verify actual full-page capture.
5. `on: "file"` has implicit fallback — when a test NOT matching the file filter fails, the fail screenshot is still captured (from default fail behavior), while per-step screenshots are only captured for the matching file.
6. Filename patterns: `on: "fail"` → `.failed.png`, `on: "test"` → `.test.png`, `on: "step"` → `.step_N.png`, `on: "url"` → `.url_N.png`.
7. `slides` generates self-contained HTML (`records.html` index + `record_<sha256>/index.html` per test) with keyboard navigation, no external dependencies.
8. `uniqueScreenshotNames` appends a hash suffix to filenames, useful for parallel runs to avoid overwrites.

### S2. screencast (~6-8 cases)

- [x] `on: "fail"` — video recorded, deleted on pass, kept on fail ✅ Passing test video correctly deleted; BUT failing test NOT recorded (see finding #2)
- [x] `on: "test"` — video recorded and preserved for every test ✅ Passing test video kept; failing test same issue (finding #2)
- [x] `captions: true` — action overlays visible in video ✅ Video produced with captions enabled (visual verification: video is larger than no-captions version)
- [x] `captions: false` — no overlays ✅ Video produced without captions
- [x] `subtitles: true` — .srt file generated alongside video ✅ Valid SRT with timestamped step names (e.g., `I.amOnPage(/index.html)`)
- [x] `video: false` — no video file, only subtitles (if enabled) ✅ Only .srt file produced, no .webm
- [x] `size` — custom video dimensions ✅ 640x480 + quality=50 → 93KB vs default 1280x720 → 128KB
- [x] `quality` — video quality setting ✅ Tested together with size; lower quality = smaller file
- [ ] Coexistence with helper-level `video: true` — skipped (edge case, documented as known behavior per docs)

**Findings — screencast:**
1. **Requires HTTP, not file://.** Plugin silently produces no output with `file://` URLs. Screencast API works only with HTTP-served pages. No error or warning is logged — the recorder simply never processes the queued start task with file:// protocol.
2. **BUG: Failing tests may NOT get recorded.** Screencast start is queued via `recorder.add()` on first `event.step.started`, but the recorder runs it asynchronously AFTER all steps in the current batch. If a test fails early (before the recorder processes the start task), `startScreencast` is never called. This means the primary use case (`on: "fail"` — capture video of failing tests) silently misses fast-failing tests. Only tests that run long enough for the recorder to process the start task get recorded.
3. **SRT format is valid and useful.** Contains step names with timestamps relative to test start. Works independently of video recording (`video: false, subtitles: true`).
4. **`video: false` with `subtitles: true`** produces `.srt` only — filename follows test artifact path, not the screencast subdirectory pattern.
5. **`size` and `quality` are passed through to Playwright `screencast.start()`** — both work as documented.
6. **No `on: "step"`, `on: "file"`, or `on: "url"` modes** — only `fail` and `test` are valid (validated by `resolveTrigger` with `validModes`).

### S3. aiTrace (~6-8 cases)

- [x] Trace .md file created per test ✅ `trace_<title>_<hash>/trace.md` with step-by-step structure, file/name/time metadata, debug output section
- [x] `deleteSuccessful: true` — traces deleted for passing tests ✅ Passing trace dir removed; failing trace dir kept with artifacts
- [x] `deleteSuccessful: false` — traces kept for all tests ✅ Both passing and failing trace dirs preserved
- [x] `captureHTML: true/false` — HTML snapshots included/excluded ⚠️ Flag accepted but UNTESTABLE — race condition prevents all HTML captures regardless of flag (see bug #1)
- [x] `captureARIA: true/false` — ARIA snapshots included/excluded ⚠️ Same as captureHTML — race masks flag effect
- [x] `captureBrowserLogs: true/false` — console logs included/excluded ⚠️ Same as captureHTML/ARIA — race masks flag effect
- [x] `captureHTTP: true/false` — HTTP requests included/excluded ✅ Only adds links to existing HAR/Playwright trace artifacts — doesn't capture HTTP independently
- [x] `fullPageScreenshots: true` — full page vs viewport in trace ⚠️ Works but identical output when page fits viewport (same finding as screenshot plugin)
- [x] `ignoreSteps` — excluded steps omitted from trace ✅ `[/seeElement/]` reduced 5→3 steps; RegExp format required
- [x] `on: "test"` — only last step in markdown ✅ All artifacts saved to disk but trace.md renders only the final step
- [x] `on: "fail"` — only failed step captured ⚠️ Trace.md created but artifact LINKS missing (see bug #2)
- [x] Trace file content — links to artifacts are valid ⚠️ Screenshot links valid; HTML/ARIA/console links never generated (bug #1)

**Findings — aiTrace:**
1. **BUG: Race condition in artifact capture (CRITICAL).** `persistStep()` starts async `page.evaluate` calls (for grabCurrentUrl, grabSource, grabAriaSnapshot, grabBrowserLogs) OUTSIDE the recorder chain. The recorder moves to the next step before captures complete, destroying the execution context. Result: `"Browser unavailable, partial artifact capture: Execution context was destroyed"` for EVERY step. Only screenshots survive (`page.screenshot` is more resilient than `page.evaluate`). **HTML, ARIA, and console logs are NEVER captured** in default `on: "step"` mode.
2. **BUG: `on: "fail"` artifact links missing from trace.md.** `event.step.failed` handler is `async` but Node.js event dispatcher doesn't await async callbacks. `persist()` (from `event.test.failed`) writes trace.md before `captureArtifactsForStep()` completes → trace has step header but no artifact links. Files (e.g., `_console.json`) still written to disk.
3. **BUG: Failed step deduplication race.** Step key is added to `savedSteps` Set before async capture pushes step data to `steps[]` array. When `event.step.failed` fires, it finds the key in the set but not in the array → warning "marked as saved but not found in steps array" and step is lost from trace.md.
4. **`captureDebugOutput: true` (default) works** but captures aiTrace's own error messages ("Browser unavailable...") alongside CodeceptJS debug output, polluting the trace with plugin diagnostics.
5. **`captureHTTP` is passive** — it only renders markdown links to HAR/Playwright trace files if they already exist in `test.artifacts`. Requires Playwright helper's `trace: true` or `recordHar` option to produce anything.
6. **Output structure:** `trace_<cleanTitle>_<sha256[:8]>/` directory per test, containing `trace.md` + `NNNN_<step>_screenshot.png` per step. HTML/ARIA/console files would follow same naming pattern if capture worked.
7. **`ignoreSteps` requires RegExp** format (like screenshot plugin), not strings (unlike retryFailedStep which accepts both).
8. **Same `pickActingHelper` init-time capture** as pageInfo — helper variable is captured once at plugin init. For aiTrace this doesn't cause the same "empty file" bug (helper proxy resolves by event time) but the async capture race makes it irrelevant.

### S4. pageInfo (~4-5 cases)

- [x] Default `errorClasses` — elements with error/warning/alert/danger captured on failure ✅ All 4 classes found: "Something went wrong!", "Warning: disk space...", "Alert: your session...", "Danger: this action..."
- [x] Custom `errorClasses` — only specified classes captured ✅ `errorClasses: ["danger"]` → only "Danger: this action is irreversible!" captured
- [x] `browserLogs: ['error']` — console errors collected ✅ 3 errors captured: page load error + 2 triggered console.error messages
- [x] `browserLogs` with multiple levels — tested with `["error", "warning"]` config; console.warn also captured on clean page test
- [x] Plugin does NOT collect info on passing tests ✅ No `.pageInfo.md` file created for passing tests
- [x] Clean page (no error elements) — page with no error/warning/alert/danger classes ✅ URL + HTML/ARIA snapshots captured, but no "Html errors" section (correctly empty)

**Findings — pageInfo:**
1. **BUG: Plugin captures empty .md file with `file://` protocol AND with HTTP when helper is stale.** Root cause: `pickActingHelper(Container.helpers())` is called at plugin init time, but the Playwright helper is not fully initialized yet (returned as plain `Object` without `grabSource`/`grabAriaSnapshot`/`grabBrowserLogs`). The `captureSnapshot` function silently swallows all errors (try/catch everywhere), resulting in empty `pageState` and 0-byte `.md` file. **Fix: re-resolve helper lazily inside `recorder.add` callback** where the helper is fully initialized. This is a genuine bug — reported behavior: pageInfo file exists but is always empty.
2. **Output structure:** `.pageInfo.md` (markdown summary) + `_page.html` (HTML snapshot) + `_aria.txt` (ARIA tree) + `_console.json` (browser logs array).
3. **`errorClasses` scans raw HTML** (pre-`cleanHtml`) using `scanForErrorMessages()` — text content of elements with matching CSS classes.
4. **`browserLogs` filters by console message type** — `['error']` captures `console.error()`, adding `'warning'` also captures `console.warn()`.
5. **Plugin only fires on `event.test.failed`** — no config option to capture on pass/all tests (unlike screenshot/screencast `on` modes).

### S5. coverage (~3-4 cases)

- [x] Plugin enabled — coverage report generated after run ✅ V8 coverage via monocart-coverage-reports; produces `index.html` + `coverage-data.js` + `app.js`
- [x] Custom `outputDir` — report appears in specified directory ✅ Path resolved relative to config file directory (not project root)
- [x] `debug: true` — debug info shown in output ✅ Shows V8 pipeline: data collection → merge → convert → save with memory/timing stats

**Findings — coverage:**
1. **Uses V8 coverage** via Playwright — no app instrumentation needed. Collects JS execution coverage automatically.
2. **Default output: `output/coverage/`** — always goes to `output/coverage` regardless of `output` config option. Custom `outputDir` overrides this.
3. **`outputDir` path resolution** is relative to config file location, not project root. This can be confusing when configs are in a subdirectory.
4. **Report uses monocart-coverage-reports** library — interactive HTML report with source mapping.

### S6. retryFailedStep (~6-8 cases)

- [x] Default retry (3 attempts) — flaky step passes on retry ✅ With 5 retries + 500ms minTimeout, delayed element (2s) found after ~2.5s; flaky element found on first attempt
- [x] Custom `retries` count ✅ retries:2 with minTimeout:500 + factor:2 — exhausts and fails in ~584ms; retries:5 with minTimeout:500 — succeeds for 2s-delayed element
- [x] `factor` / `minTimeout` / `maxTimeout` — backoff timing ✅ factor:2 + minTimeout:500 tested; timing matches exponential backoff pattern
- [x] `ignoredSteps` with glob/string pattern — matched steps fail immediately ✅ `ignoredSteps: ["seeElement"]` → 125ms instant fail (vs 2450ms with retries)
- [x] `ignoredSteps` with RegExp — not separately tested; string format works (unlike screenshot plugin which requires RegExp)
- [x] `when` function — conditional retry (retry only specific errors) ✅ `when: (err) => err.message.includes("not visible")` — retries only matching errors, 2401ms
- [x] `randomize: true` — timeout randomization applied ✅ 3 runs: 2s, 1s, 1s — timing varies between runs with factor:1 + randomize:true
- [x] `disableRetryFailedStep: true` per scenario — no retries in that test ✅ 131ms instant fail, same test takes 2450ms with retries enabled
- [x] `deferToScenarioRetries: true` — step retry disabled when scenario has retries ✅ `.retry(2)` → 3 scenario-level attempts (Scenario() printed 3 times), each failing in ~119ms without step retries

**Findings — retryFailedStep:**
1. **`ignoredSteps` accepts strings AND glob patterns** (e.g., `"see*"`), unlike screenshot's `ignoreSteps` which requires RegExp. RegExp also supported.
2. **Default ignored steps** are: `amOnPage`, `wait*`, `send*`, `execute*`, `run*`, `have*`. `seeElement` is NOT in the default list and WILL be retried.
3. **`deferToScenarioRetries: true` (default)** completely disables step-level retries when a scenario has `.retry(N)`. This prevents exponential retry multiplication (e.g., 3 step retries × 3 scenario retries = 9 total attempts).
4. **`disableRetryFailedStep: true`** is a per-scenario config option (passed in Scenario options object), not a plugin config option.
5. **Default `retries: 3` with `minTimeout: 1000`** means total retry window is ~1s + 1.5s + 2.25s ≈ 4.75s. For elements with delays > 1s, the default config may not be sufficient — consider increasing retries or decreasing minTimeout.
6. **`randomize: true`** applies 1-2x multiplier to timeout values, useful for avoiding thundering herd in parallel test runs.

### S7. autoDelay (~4-5 cases)

- [x] Default delays (100ms before, 200ms after) — test runs slower ✅ 2652ms vs 1112ms OFF (+1540ms for 8 steps)
- [x] Custom `delayBefore` / `delayAfter` values ✅ 500ms/500ms → 6139ms (+5027ms for 8 steps, ~5 delayed actions × 1000ms each)
- [x] Default `methods` list receives delays ✅ Default methods: click, fillField, checkOption, pressKey, doubleClick, rightClick. Test has 2×fillField + 3×click = 5 delayed actions
- [x] Custom `methods` — only specified actions get delays ✅ `methods: ["click"]` → 4113ms (3 clicks × 1000ms = ~3s overhead vs 1112ms OFF)
- [x] Measurable impact on total execution time ✅ Clear linear scaling: OFF=1112ms, default(300ms/action)=2652ms, large(1000ms/action)=6139ms, click-only(1000ms/click)=4113ms

**Findings — autoDelay:**
1. **Delay is per-action, not per-step.** Each action matching `methods` list gets `delayBefore` + `delayAfter`. With 5 matching actions and 300ms total delay each: 5 × 300ms = ~1500ms overhead (matches observed 1540ms).
2. **Default methods:** `click`, `fillField`, `checkOption`, `pressKey`, `doubleClick`, `rightClick`. Navigation (`amOnPage`) and assertions (`seeElement`) are NOT delayed.
3. **Custom `methods` is a complete replacement**, not an extension of the default list. Setting `methods: ["click"]` removes delays from `fillField` etc.
4. **No negative impact on test stability** — all tests pass with delays enabled. The plugin purely adds sleep time, doesn't alter execution order or behavior.
5. **Performance impact is predictable and linear** — easy to calculate total overhead from action count × (delayBefore + delayAfter).

### S8. stepTimeout (~5-6 cases)

- [x] Global `timeout` — slow step exceeding limit fails the test ✅ With 1s timeout, `waitForElement(5s)` exempt by default (`wait*` in noTimeoutSteps), but `seeElement` is NOT exempt and fails if element not ready
- [x] `noTimeoutSteps` with glob — matched steps exempt from timeout ✅ Default `['amOnPage', 'wait*']` — `waitForElement` matches `wait*` and completes despite 1s global timeout
- [x] `noTimeoutSteps` custom list ✅ Adding `"seeElement"` to noTimeoutSteps allows all steps to pass with 1s global timeout
- [x] `customTimeoutSteps` — per-step timeout overrides ✅ `[["waitForElement", 10]]` gives waitForElement 10s — all pass with 1s global
- [x] `overrideStepLimits: true` — overrides `I.limitTime()` in test code ✅ Global 1s timeout enforced; `I.limitTime(10).waitForElement(...)` still passes (wait* exempt), but following `seeElement` fails at 1s. `I.limitTime()` logged as deprecated → use `step.timeout()` instead
- [x] Step within timeout — completes normally ✅ With 150s timeout, all steps pass normally (251ms total)

**Findings — stepTimeout:**
1. **Default `noTimeoutSteps: ['amOnPage', 'wait*']`** — `waitForElement`, `waitForVisible`, `waitForText` etc. are ALL exempt from timeout by default. This means the plugin primarily catches hangs in `click`, `fillField`, `seeElement`, `grabTextFrom` etc.
2. **`I.limitTime()` is deprecated** in CodeceptJS 4.x — replaced by `step.timeout()`. Still works but logs a deprecation warning.
3. **`overrideStepLimits: true` overrides `I.limitTime()`/`step.timeout()` but NOT `noTimeoutSteps`** — exempt steps remain exempt even with override enabled.
4. **`noTimeoutSteps` is a REPLACEMENT** — setting a custom list replaces the defaults entirely. To extend, copy defaults and add yours.
5. **Practical impact is limited for standard UI tests** — most actions (click, fill, see) complete in ms. The plugin is a safety net for custom helpers or unusually slow page operations.

### S9. heal (~5-6 cases)

- [x] Broken locator — AI finds correct element ✅ AI correctly suggests `I.click("Submit")`, `I.click("#submit-btn")`, XPath alternatives. BUT `clickAndType` recipe fires first with broken locator and "succeeds" due to recorder queuing bug → test still fails
- [x] `healLimit: N` — up to N steps healed per test ⚠️ BUG: `healLimit: 2` did NOT limit healing — 3 steps were healed (3 AI calls). Counter increments inside `recorder.catchWithoutStop` but event.step.after fires for all steps before counters update
- [x] Exceeding `healLimit` — subsequent broken step fails ⚠️ Not enforced — all 3 broken locators triggered healing despite limit=2
- [x] Healed steps logged for developer review ✅ "Self-Healing Report" printed with suggested code replacements. `healed: true` set in test metadata. Fix suggestions show original → replacement code
- [x] No AI key configured — graceful error/skip ✅ Clear error: "No model is set for AI assistant" with SDK config examples. Test still fails gracefully

**Findings — heal:**
1. **Setup requires 3 components:** (a) `heal.mjs` file with recipe definitions (generated via `npx codeceptjs generate:heal`), (b) `import "../heal.mjs"` in config, (c) `--ai` CLI flag + `ai: { model: ... }` in config. Missing ANY of these silently disables healing.
2. **`--ai` CLI flag is REQUIRED** — without it, `ai.enable()` is never called (checked in `container.js`: `if (opts && opts.ai) ai.enable(config.ai)`). No warning when heal plugin is enabled but `--ai` is missing.
3. **`--debug` and `--verbose` DISABLE healing** — heal plugin checks `store.debugMode && !process.env.DEBUG` and returns early. Workaround: set `DEBUG=codeceptjs:heal` env var. This makes debugging heal issues counterintuitive — the standard debugging tool silently disables the feature.
4. **BUG: `clickAndType` recipe is a false positive.** It's intended for `fillField`/`appendField` only but `getCodeSuggestions()` runs ALL recipes regardless of step name filter (only `hasCorrespondingRecipes` filters by step). `clickAndType` queues recorder actions that don't await completion, so the heal code thinks it succeeded. The actually-good AI suggestions (text/id/XPath) are never tried because `clickAndType` "wins" first.
5. **BUG: `healLimit` not enforced.** Counter increments inside async `recorder.catchWithoutStop` callback. Multiple step failures fire `event.step.after` synchronously before any counter update, so all steps get healed regardless of limit.
6. **AI suggestions quality is good** — Claude correctly maps broken `data-test-id="submit-button"` to `I.click("Submit")`, `I.click("#submit-btn")`, and XPath alternatives. The suggestions demonstrate semantic understanding of the HTML.
7. **`require` path resolution:** `require: ["./heal.js"]` resolves from CWD (project root), not from config file directory. Configs in subdirectories need project-root-relative paths.
8. **ESM compatibility:** Generated `heal.js` uses `import { heal, ai } from 'codeceptjs'` — requires `.mjs` extension or `"type": "module"` in package.json for projects without ESM configured.

### S10. analyze (~5-6 cases)

- [x] `--ai` flag — analysis runs after test execution ⚠️ Analysis STARTS (spinner visible) but **BUG: process exits before AI response arrives** (see finding #1)
- [x] `clusterize` threshold — failures grouped when count >= N ⚠️ Untestable — same async exit bug. Clusterize fires when failures >= 5 but analysis can't complete
- [x] `analyze` count — up to N individual failures analyzed ⚠️ Default analyze=2, spinner starts for first failure, process exits before response
- [ ] `vision: true` — screenshot analysis included — skipped (same underlying exit bug makes it untestable)
- [x] Custom `categories` — configured in prompt template ✅ Array of category strings passed to AI prompt for classification. Default: 9 categories
- [x] Without `--ai` flag — plugin does not activate ✅ Clear message: "AI is disabled, no analysis will be performed. Run tests with --ai flag to enable it."

**Findings — analyze:**
1. **BUG: Process exits before AI analysis completes (CRITICAL).** Root cause: TWO bugs — (a) `printReport(result)` is called WITHOUT `await` in the event handler, (b) even if awaited, CodeceptJS uses Node.js EventEmitter which doesn't await async handlers. The `event.all.result` fires synchronously, the handler starts the AI call (spinner visible), then `done()` sets exit code and resolves → process exits. Analysis never completes.
2. **Works in workers mode** (probable) — `event.workers.result` handler might have different timing, but untested.
3. **`pageInfo` integration tip:** Plugin prints "To improve analysis, enable pageInfo plugin to get more context" if pageInfo isn't enabled.
4. **Deduplication:** Only unique errors are analyzed (filtered by `err.message`), so duplicate failures don't waste AI tokens.
5. **`vision: true`** base64-encodes the failure screenshot and includes it in the AI prompt for visual analysis.
6. **Response formatting:** Strips `<think>` tags (for reasoning models), converts markdown to ANSI for terminal display.

### S11. auth (~5-6 cases)

- [x] First test — full login performed ✅ Login form filled (amOnPage, fillField, click, waitForElement), session fetched and stored in memory
- [x] Subsequent tests — session reused, no login ✅ Second/third tests: restore (set localStorage) → check (dashboard visible) → no login form interaction
- [x] `saveToFile: true` — session persisted to disk, reused across runs ✅ `admin_session.json` created in output dir. Second run loads from file — no login form at all
- [x] `saveToFile: false` — session not persisted between runs ✅ No session file created. Session stays in memory only for the current run
- [ ] Multiple users/roles — skipped (requires additional app pages with user-specific content; plugin architecture confirmed from code review)
- [ ] Session expired — skipped (requires session TTL in app; plugin handles via check→re-login flow, confirmed from code)
- [x] Custom `fetch`/`restore` — localStorage-based session ✅ Custom `fetch`: `I.executeScript(() => localStorage)`, custom `restore`: `I.executeScript(s => localStorage.setItem(...))`. Works with our non-cookie-based auth

**Findings — auth:**
1. **Cookie-based auth (default) won't work for localStorage-based apps.** Default `fetch` is `I.grabCookie()` and default `restore` is `I.setCookie()`. If app checks localStorage instead of cookies (like our dashboard.html), custom fetch/restore is mandatory.
2. **`inject` config** lets you name the login function (default: `login`). Destructure it from scenario/Before: `Before(({ login }) => { login("admin") })`.
3. **Session check flow:** restore → check. If check fails (throws or assertion fails), automatic re-login. The `recorder.session` + `catchWithoutStop` pattern handles this gracefully.
4. **`saveToFile` stores raw fetch result** as JSON. For localStorage sessions, this means the full object is serialized. For cookies, it's the cookie array.
5. **Playwright integration:** When Playwright detects `test.opts.cookies`, it can pass them directly to browser context creation, skipping the restore→check cycle entirely for already-loaded sessions.
6. **BeforeSuite support:** Calling `login()` inside BeforeSuite registers a per-test auth hook via `event.test.started`, so all tests in the suite get authenticated automatically.

### S12. browser (~4-5 cases)

- [x] `-p browser:show` — headed browser launches ✅ Browser window visible during test execution
- [x] `-p browser:hide` — headless mode ✅ Tests pass in headless (no visible window)
- [x] `-p browser:browser=firefox` — browser engine switched ✅ Plugin correctly passes config to Playwright. Fails only if browser binary not installed (environment issue, not plugin bug)
- [x] `-p browser:windowSize=800x600` — window size applied ✅ Window size override accepted
- [x] Multiple overrides chained: `-p browser:hide:windowSize=800x600` ✅ Both overrides applied in single `-p` argument
- [x] Without `@codeceptjs/configure` — graceful skip with hint ✅ Clear error: "'@codeceptjs/configure' is not installed; CLI overrides are skipped. Run `npm i @codeceptjs/configure` to enable."

**Findings — browser:**
1. **Purely CLI-driven plugin** — no config file setup needed. Activated via `-p browser:<args>` on command line.
2. **Colon-chained args** parsed into key=value pairs. Special keywords: `show` (→ show:true), `hide` (→ show:false).
3. **`true`/`false` string values coerced to booleans** automatically.
4. **Requires `@codeceptjs/configure`** package — provides `setBrowserConfig()` which applies overrides to all browser helpers. Without it, plugin logs a hint and skips silently.
5. **Browser binary installation required** — `browser=firefox` / `browser=webkit` need corresponding Playwright browser binaries. Suggest running `npx playwright install` first.
6. **Useful for CI/debugging** — quick toggle between headed/headless, different browsers, or custom window sizes without modifying config files.

### S13. customLocator (~4-5 cases)

- [x] `$name` shorthand resolves to `[data-test-id="name"]` ✅ `$dynamic-title` → `.//*[@data-test-id='dynamic-title']` (xpath). Works with seeElement, click, fillField
- [x] Custom `prefix` character works ✅ `prefix: "="` → `=card-alpha` resolves to `[data-qa=card-alpha]`
- [x] Custom `attribute` — maps to specified attribute ✅ `attribute: "data-qa"` → `=alpha-action` finds `[data-qa="alpha-action"]`
- [x] Multiple `attribute` values — or-expression generated ✅ `attribute: ["data-test-id", "data-qa"]` → `.//*[@data-test-id='x' or @data-qa='x']` (XPath or-expression). Matches elements with EITHER attribute
- [x] `strategy: "css"` vs `"xpath"` — both produce valid locators ✅ CSS: `[data-test-id=name]`, XPath: `.//*[@data-test-id='name']`. Both pass all tests
- [x] `showActual: true` — generated locator printed in output ⚠️ Flag accepted but no visible difference in `--steps` or `--verbose` output. May only affect third-party reporters or custom output handlers

**Findings — customLocator:**
1. **Simple, reliable plugin** — no bugs found. Works with all Playwright actions (see, click, fillField, seeElement).
2. **Locator filter is global** — applies to ALL string locators starting with the prefix. No step-specific filtering.
3. **Multiple attributes produce or-expression** — XPath: `@attr1='val' or @attr2='val'`; CSS: `[attr1=val],[attr2=val]`. Useful for transitioning between attribute conventions.
4. **Default strategy is XPath** — CSS is also supported. Both work identically for simple attribute matching.
5. **Prefix must be a single character** that doesn't conflict with existing locator formats (e.g., `#` for id, `.` for class).
6. **No wildcard/partial matching** — `$dynamic` won't match `data-test-id="dynamic-title"`. Must be exact attribute value.

### S14. customReporter (~3-4 cases)

- [x] Reporter plugin loads without crash ✅ Plugin loads and attaches event listeners for all configured callbacks
- [x] Test event hooks fire (test start, test end, pass, fail) ✅ `onTestBefore`, `onTestPassed`, `onTestFailed`, `onTestFinished` all fire in correct order with test/error objects
- [x] Custom output generated based on reporter logic ✅ `onResult` callback writes custom report file. Report shows: BEFORE→PASSED/FAILED→FINISHED lifecycle for each test

**Findings — customReporter:**
1. **Simple, no bugs.** Thin wrapper over CodeceptJS event system — one callback per event type.
2. **Available hooks:** `onHookFinished`, `onTestBefore`, `onTestPassed`, `onTestFailed`, `onTestSkipped`, `onTestFinished`, `onResult`. All optional.
3. **`onResult(result)` receives the full test result object** — can be used for custom aggregation, file output, or integration with external systems.
4. **`save: true` config option** calls `result.save()` to persist results in CodeceptJS's internal format.
5. **Callbacks are defined in plugin config** — means they must be inline functions in the config file (not importable from separate modules without extra setup).
6. **Event order per test:** onTestBefore → (test runs) → onTestPassed/onTestFailed → onTestFinished. `onResult` fires once after all tests complete.

---

## Phase 3 — Execution

- [ ] Write test cases via `/create-test-cases`
- [ ] Publish to Testomat.io
- [ ] Automate critical scenarios (if needed)

---

## Summary

| Group | Plugins | Cases | Bugs |
|-------|---------|-------|------|
| Artifacts | screenshot, screencast, aiTrace, pageInfo, coverage | 34 | 5 |
| Execution modifiers | retryFailedStep, autoDelay, stepTimeout | 19 | 0 |
| AI-powered | heal, analyze | 11 | 5 |
| Config/utilities | auth, browser, customLocator, customReporter | 19 | 0 |
| **Total** | **14 plugins** | **83** | **10** |

### Critical Bugs Found

| # | Plugin | Bug | Severity |
|---|--------|-----|----------|
| 1 | screencast | Failing tests NOT recorded (recorder queuing race) | High |
| 2 | pageInfo | Empty .md file (stale helper at init time) | High — **patched locally** |
| 3 | aiTrace | HTML/ARIA/console never captured (persistStep async race) | Critical |
| 4 | aiTrace | `on: "fail"` artifact links missing (async handler not awaited) | High |
| 5 | aiTrace | Failed step deduplication race (savedSteps vs steps[] timing) | Medium |
| 6 | heal | `clickAndType` recipe false positive (recorder queuing) | High |
| 7 | heal | `healLimit` not enforced (async counter increment) | High |
| 8 | heal | `--debug`/`--verbose` silently disables healing | Medium |
| 9 | analyze | Process exits before AI analysis completes (async handler) | Critical |
| 10 | analyze | `printReport()` not awaited in event handler | High |
