# CodeceptJS 4.x Plugins Audit — Results

**14 plugins, 83 test cases, 10 bugs found.**
Version: CodeceptJS 4.0.0-rc.20, Playwright 1.57, Anthropic AI (Claude Sonnet 4).

## Bugs

### Critical

| # | Plugin | Bug |
|---|--------|-----|
| 1 | aiTrace | HTML/ARIA/console artifacts never captured — `persistStep()` calls `page.evaluate` outside recorder chain, execution context destroyed before captures complete. Only screenshots survive. |
| 2 | analyze | Process exits before AI analysis completes — `printReport()` not awaited + EventEmitter can't await async handlers. Spinner appears, then exit. |

### High

| # | Plugin | Bug |
|---|--------|-----|
| 3 | screencast | Failing tests not recorded — screencast start queued via `recorder.add()`, fast-failing tests exit before it's processed. Primary use case (`on: "fail"`) silently broken. |
| 4 | pageInfo | Empty .md file — helper captured at init time before Playwright is ready. All errors silently swallowed. Fixed with lazy re-resolution inside `recorder.add`. |
| 5 | aiTrace | `on: "fail"` — artifact files written to disk but links missing from trace.md (async handler not awaited). |
| 6 | heal | `clickAndType` recipe fires on `click` steps (should only handle `fillField`/`appendField`), blocks correct AI suggestions from executing. Test reports `healed: true` but still fails. |
| 7 | heal | `healLimit` not enforced — async counter increment. `healLimit: 2` allowed 3 heals (3 AI calls, 19s). |

### Medium

| # | Plugin | Bug |
|---|--------|-----|
| 8 | heal | `--debug`/`--verbose` silently disables healing. Workaround: `DEBUG=codeceptjs:heal`. |
| 9 | aiTrace | Deduplication race between `savedSteps` Set and `steps[]` array — step can be lost from trace.md under specific timing. |
| 10 | analyze | `printReport()` missing `await` (contributing factor to #2). |

**Root cause pattern:** 7/10 bugs are async work outside the recorder chain or inside EventEmitter handlers that can't be awaited.

## No bugs found

screenshot, retryFailedStep, autoDelay, stepTimeout, coverage, auth, browser, customLocator, customReporter — all work as documented.

## Reproduction

Test project: **[codeceptjs-plugins-test](https://github.com/gololdf1sh/codeceptjs-plugins-test)**

### Setup

```bash
git clone https://github.com/gololdf1sh/codeceptjs-plugins-test.git
cd codeceptjs-plugins-test
npm ci
npx playwright install chromium
npx http-server app -p 8787 -s &   # required for screencast, aiTrace, pageInfo
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env   # required for heal, analyze
```

### Repro commands

```bash
# Bug 1 — aiTrace: check trace.md, only screenshots, no HTML/ARIA/console links
npx codeceptjs run --config configs/aitrace-default.conf.ts
cat output/aitrace-default/trace_*/trace.md

# Bug 2 — analyze: output ends with "Analyzing failure..." then exits
npx codeceptjs run --config configs/analyze-default.conf.ts --ai

# Bug 3 — screencast: passing test gets video, failing test doesn't
npx codeceptjs run --config configs/screencast-http.conf.ts -p 'screencast:on=test'
ls output/screencast-http/screencast/   # only 1 video for 2 tests

# Bug 4 — pageInfo: empty .md (revert patch first — see note below)
npx codeceptjs run --config configs/pageinfo-http.conf.ts
wc -c output/pageinfo-http/*.pageInfo.md   # 0 bytes without patch

# Bug 5 — aiTrace on:fail: _console.json on disk but no link in trace.md
npx codeceptjs run --config configs/aitrace-on-fail.conf.ts
cat output/aitrace-on-fail/trace_*/trace.md   # step header but no artifact links
ls output/aitrace-on-fail/trace_*/            # _console.json exists

# Bug 6 — heal: clickAndType blocks AI suggestions
DEBUG=codeceptjs:heal npx codeceptjs run --config configs/heal-default.conf.ts --ai
# log shows clickAndType function executed, AI's I.click("Submit") never tried

# Bug 7 — healLimit: 3 heals despite limit=2
npx codeceptjs run --config configs/heal-exceed.conf.ts --ai
# report: "3 steps were healed"

# Bug 8 — heal: --verbose disables healing
npx codeceptjs run --config configs/heal-default.conf.ts --ai --verbose 2>&1 | grep -i heal
# "Healing is disabled in --debug mode"
```

> **Note on bug 4:** The local `node_modules/codeceptjs/lib/plugin/pageInfo.js` contains a fix (lazy helper re-resolution at line 52). To reproduce the original bug, reinstall: `npm ci`.
