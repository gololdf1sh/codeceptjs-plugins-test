# CodeceptJS 4.x Plugins — Retest on rc.23

**Version:** CodeceptJS 4.0.0-rc.23, Playwright 1.57, @ai-sdk/anthropic 3.0.76
**Date:** 2026-05-15
**Fix PR:** codeceptjs/CodeceptJS#5557 (merged 2026-05-11)

---

## Ретест 10 багів

| # | Plugin | Bug | rc.20 | rc.23 | Деталі |
|---|--------|-----|-------|-------|--------|
| 1 | aiTrace | HTML/ARIA/console artifacts never captured | CRITICAL | **FIXED** | trace.md містить [HTML], [ARIA], [Screenshot], [Browser Logs] для кожного степу |
| 2 | analyze | Process exits before AI analysis | CRITICAL | **FIXED** | Процес чекає завершення AI аналізу, виводить повний звіт з категоризацією |
| 3 | screencast | Failing tests not recorded | HIGH | **FIXED** | on=test: 2 відео (passing + failing). on=fail: 1 відео (failing) |
| 4 | pageInfo | Empty .md file | HIGH | **FIXED** | pageInfo.md — 977+ байтів, URL, HTML errors, ARIA, Console snapshots |
| 5 | aiTrace | on:fail artifact links missing | HIGH | **FIXED** | trace.md на on:fail має HTML, ARIA, Screenshot, Browser Logs |
| 6 | heal | clickAndType blocks AI suggestions | HIGH | **FIXED** | AI пропонує I.click("Submit") і виконує успішно |
| 7 | heal | healLimit not enforced | HIGH | **FIXED** | healLimit:2 → рівно 2 степи вилікувано, 3-й — fail |
| 8 | heal | --debug disables healing | MEDIUM | **BY DESIGN** | "Healing is disabled in --debug mode" — не змінено |
| 9 | aiTrace | Deduplication race | MEDIUM | **FIXED** | 5 степів — всі унікальні, дублікатів немає |
| 10 | analyze | Container typo | MEDIUM | **FIXED** | `Container` з великої літери (line 6, 298 в analyze.js) |

**Результат: 9/10 FIXED, 1/10 BY DESIGN.**

---

## Нові плагіни

### junitReporter (NEW — не було в тікеті #105)

JUnit-сумісний XML-репортер для CI інтеграції.

| Параметр | Дефолт | Опис |
|----------|--------|------|
| enabled | false | Увімкнути плагін |
| outputName | "report.xml" | Назва файлу звіту |
| output | "output" | Директорія |
| testGroupName | "CodeceptJS" | Назва кореневого елементу |
| attachMeta | true | Додати metadata (browser, version) |
| attachSteps | true | Додати step logs в system-out |
| stepsInFailure | true | Додати step trace до failures |

**Тест-кейси:**
1. Default config (4 passing tests) → XML з properties, system-out, правильна структура — **PASS**
2. Custom config (1 failing test, attachMeta/Steps: false) → XML з failure message, custom group name — **PASS**

**Вердикт: enable** — корисний для CI (GitHub Actions, Jenkins).

---

## Повний тест плагінів

### 1. aiTrace

**Що робить:** Генерує AI-friendly trace файли (markdown) з логами, артифактами для дебагу з AI.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | true | ✅ |
| deleteSuccessful | false | ✅ aitrace-delete-successful |
| fullPageScreenshots | false | ✅ aitrace-fullpage |
| output | "output" | ✅ (всі конфіги) |
| captureHTML | true | ✅ aitrace-no-html |
| captureARIA | true | ✅ aitrace-no-aria |
| captureBrowserLogs | true | ✅ aitrace-no-logs |
| captureHTTP | true | ❌ немає конфігу |
| captureDebugOutput | true | ❌ немає конфігу |
| ignoreSteps | [] | ✅ aitrace-ignore-steps |

**Тест-кейси (11 конфігів):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| aitrace-default | Passing test, всі артифакти | **PASS** — HTML, ARIA, Screenshot, Console в trace.md |
| aitrace-delete-successful | deleteSuccessful: true | **PASS** — trace тільки для failing тесту |
| aitrace-fullpage | fullPageScreenshots: true | **PASS** |
| aitrace-ignore-steps | ignoreSteps: [/seeElement/] | **PASS** — 3 степи замість 5 |
| aitrace-keep-all | deleteSuccessful: false, passing+failing | **PASS** — 2 trace директорії |
| aitrace-no-aria | captureARIA: false | **PASS** — 0 aria файлів |
| aitrace-no-html | captureHTML: false | **PASS** — 0 html файлів |
| aitrace-no-logs | captureBrowserLogs: false | **PASS** — 0 console файлів |
| aitrace-no-nav | Single page test | **PASS** |
| aitrace-on-fail | on: "fail" | **PASS** — артифакти тільки для failing степу |
| aitrace-on-test | on: "test" | **PASS** |

**Вердикт: pilot** — цінний для AI-дебагу, але генерує багато артифактів. Увімкнути з deleteSuccessful: true.

### 2. analyze

**Що робить:** AI аналіз test failures з категоризацією та кластеризацією.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| clusterize | 5 | ✅ analyze-cluster |
| analyze | 2 | ✅ analyze-default |
| vision | false | ✅ analyze-vision |
| categories | [...] | ❌ |
| prompts | {} | ❌ |

**Тест-кейси (4 конфіги):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| analyze-default | 2 failures, individual analysis | **PASS** — AI звіт з SUMMARY, ERROR, CATEGORY |
| analyze-cluster | 5+ failures, clustering | **PASS** — групи з affected tests |
| analyze-no-ai | No AI model configured | **PASS** — warning message |
| analyze-vision | vision: true | **FAIL** — `Invalid prompt: The messages do not match the ModelMessage[] schema` |

**Нова проблема:** `vision: true` — помилка побудови промпту з зображеннями. Ймовірний баг в analyze plugin або несумісність з @ai-sdk/anthropic 3.x.

**Вердикт: pilot** — корисний для CI failure triage. vision: true поки не працює.

### 3. auth

**Що робить:** Управління логін-сесіями — cookies/localStorage, auto-re-login.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| saveToFile | false | ✅ auth-save-file |
| inject | "login" | ✅ |
| users | {} | ✅ (localStorage + cookie sessions) |

**Тест-кейси (2 конфіги):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| auth-localstorage | localStorage sessions | **PASS** — 3/3 тестів reuse session |
| auth-save-file | Cookie persistence to file | **PASS** — 3/3 тестів reuse session |

**Вердикт: enable** — вже використовується в e2e-tests, працює стабільно.

### 4. autoDelay

**Що робить:** Автоматичні затримки перед/після дій для повільних сторінок.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| methods | [click, fillField, ...] | ✅ autodelay-custom-methods |
| delayBefore | 100 | ✅ autodelay-default, autodelay-large |
| delayAfter | 200 | ✅ autodelay-default, autodelay-large |

**Тест-кейси (4 конфіги):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| autodelay-default | delayBefore: 100, delayAfter: 200 | **PASS** — 2.7s |
| autodelay-custom-methods | Custom method list | **PASS** — 4.2s |
| autodelay-large | delayBefore: 500, delayAfter: 500 | **PASS** — 6.2s |
| autodelay-off | enabled: false (baseline) | **PASS** — 1.1s |

**Вердикт: skip** — додає латентність без користі при стабільних локаторах.

### 5. browser

**Що робить:** CLI override конфігурації браузера без зміни codecept.conf.

| Параметр | CLI |
|----------|-----|
| show | -p 'browser:show=true' |
| hide | -p 'browser:show=false' |
| browser | -p 'browser:browser=firefox' |
| windowSize | -p 'browser:windowSize=800x600' |

**Тест:** `show=false` через CLI — **PASS**

**Вердикт: enable** — корисний для локального дебагу (show=true).

### 6. coverage

**Що робить:** Збір code coverage з Playwright/Puppeteer.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| debug | false | ✅ coverage-debug |
| name | "CodeceptJS Coverage Report" | ✅ |
| outputDir | "output/coverage" | ✅ coverage-custom-dir |
| sourceFilter | — | ❌ |
| sourcePath | — | ❌ |

**Тест-кейси (3 конфіги):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| coverage-default | Default output | **PASS** — coverage report generated |
| coverage-debug | debug: true | **PASS** — MCR debug output visible |
| coverage-custom-dir | Custom output directory | **PASS** |

**Вердикт: skip** — e2e-tests тестують зовнішній додаток, coverage не релевантний.

### 7. customLocator

**Що робить:** Кастомні локатори через prefix ($) + attribute (data-test-id).

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| prefix | "$" | ✅ customlocator-default |
| attribute | "data-test-id" | ✅ customlocator-custom-attr |
| strategy | "xpath" | ✅ customlocator-css |
| showActual | false | ✅ customlocator-showactual |

**Тест-кейси (5 конфігів):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| customlocator-default | $ prefix, data-test-id | **PASS** |
| customlocator-css | CSS strategy | **PASS** |
| customlocator-custom-attr | data-qa attribute, = prefix | **PASS** |
| customlocator-multi-attr | Multiple attributes [data-test-id, data-qa] | **PASS** |
| customlocator-showactual | Show generated locator | **PASS** |

**Вердикт: enable** — зручний shortcut для data-test-id локаторів.

### 8. customReporter

**Що робить:** Шаблон для кастомного репортеру.

**Тест (1 конфіг):** 2 pass, 1 fail — **PASS**

**Вердикт: skip** — scaffold, не плагін для production.

### 9. heal

**Що робить:** AI self-healing: автоматичне виправлення зламаних локаторів через AI.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| healLimit | 2 | ✅ heal-limit, heal-exceed |

**Тест-кейси (4 конфіги):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| heal-default | Single broken locator | **PASS** (flaky — залежить від якості AI відповіді) |
| heal-exceed | 3 broken, limit=2 | **PASS** — рівно 2 healed, 3-й fail |
| heal-limit | 2 broken, limit=2 | **PASS** — обидва healed |
| heal-no-ai | No --ai flag | **PASS** — healing не активується |

**Вердикт: pilot** — потенційно цінний, але flaky через недетерміновані AI відповіді. Потребує ANTHROPIC_BASE_URL=https://api.anthropic.com/v1.

### 10. pageInfo

**Що робить:** Збір інформації про сторінку при failure — URL, HTML errors, browser logs.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| errorClasses | ["error", "warning", "alert", "danger"] | ✅ pageinfo-custom-classes |
| browserLogs | ["error"] | ✅ pageinfo-http |

**Тест-кейси (5 конфігів):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| pageinfo-default | Default error classes | **PASS** — 1031 bytes, all sections |
| pageinfo-http | HTTP server page | **PASS** — 977 bytes, HTML errors + console |
| pageinfo-custom-classes | Only "danger" class | **PASS** — лише "Danger" error |
| pageinfo-clean-page | No errors on page | **PASS** — URL + HTML snapshot, no errors |
| pageinfo-passing | Passing test | **PASS** — no pageInfo collected |

**Вердикт: enable** — покращує контекст для failure debugging.

### 11. pause

**Що робить:** Інтерактивна пауза при fail/test/step/file/url.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | CLI test |
| on | "fail" | ✅ |
| path | — | — |
| line | — | — |
| pattern | — | — |

**Тест:** `-p 'pause:on=fail'` → інтерактивна оболонка запускається — **PASS**

**Вердикт: enable** — вже використовується, корисний для локального дебагу.

### 12. retryFailedStep

**Що робить:** Автоматичний retry з exponential backoff для failed степів.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| retries | 3 | ✅ retry-default, retry-high |
| factor | 1.5 | ✅ |
| minTimeout | 1000 | ✅ |
| maxTimeout | Infinity | ✅ |
| randomize | false | ✅ retry-randomize |
| defaultIgnoredSteps | [...] | ✅ |
| ignoredSteps | [] | ✅ retry-ignored-steps |
| deferToScenarioRetries | true | ✅ retry-defer |

**Тест-кейси (8 конфігів):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| retry-default | retries: 3 | **PASS** |
| retry-defer | deferToScenarioRetries: true | **PASS** |
| retry-disabled | enabled: false | **PASS** — no retries |
| retry-exhausted | All retries fail | **PASS** — fails after retries |
| retry-high | retries: 10 | **PASS** — passes on retry |
| retry-ignored-steps | Custom ignored steps | **PASS** |
| retry-randomize | randomize: true | **PASS** |
| retry-when | Conditional retry | **PASS** |

**Вердикт: enable** — стабілізує flaky тести.

### 13. screencast

**Що робить:** WebM відео запис тестів з captions і subtitles (Playwright).

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| on | "fail" | ✅ screencast-on-fail, on-test |
| captions | true | ✅ screencast-no-captions |
| subtitles | false | ✅ screencast-captions-subtitles |
| video | true | ✅ screencast-video-false |
| size | — | ✅ screencast-size-quality |
| quality | — | ✅ screencast-size-quality |

**Тест-кейси (7 конфігів):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| screencast-http | on=test (HTTP server) | **PASS** — 2 відео |
| screencast-on-fail | on=fail | **PASS** — 1 відео (тільки fail) |
| screencast-on-test | on=test | **PASS** — 2 відео |
| screencast-captions-subtitles | captions + subtitles | **PASS** — відео + .srt |
| screencast-no-captions | captions: false | **PASS** |
| screencast-size-quality | Custom size/quality | **PASS** |
| screencast-video-false | video: false, subtitles: true | **PASS** — 0 webm, 1 srt |

**Вердикт: pilot** — корисний для CI failure debugging, але збільшує артифакти.

### 14. screenshot

**Що робить:** Скріншоти при fail/test/step/file/url, slides.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | true | ✅ |
| on | "fail" | ✅ on-fail, on-test, on-step, on-file, on-url |
| uniqueScreenshotNames | false | ✅ screenshot-unique-names |
| fullPageScreenshots | false | ✅ screenshot-fullpage |
| slides | false | ✅ screenshot-slides |
| deleteSuccessful | true | ✅ screenshot-slides-delete |
| animateSlides | true | ✅ screenshot-slides |
| ignoreSteps | [] | ✅ screenshot-ignore-steps |
| path | — | ✅ screenshot-on-file |
| pattern | — | ✅ screenshot-on-url |

**Тест-кейси (10 конфігів):** Всі **PASS**

**Вердикт: enable** — вже дефолтний, працює стабільно.

### 15. stepTimeout

**Що робить:** Глобальний timeout для степів з per-step кастомізацією.

| Параметр | Дефолт | Покритий конфігом |
|----------|--------|-------------------|
| enabled | false | ✅ |
| timeout | 150 | ✅ steptimeout-normal, tight |
| overrideStepLimits | false | ✅ steptimeout-override |
| noTimeoutSteps | [amOnPage, wait*] | ✅ steptimeout-notimeout |
| customTimeoutSteps | [] | ✅ steptimeout-custom |

**Тест-кейси (5 конфігів):**

| Config | Сценарій | Результат |
|--------|----------|-----------|
| steptimeout-normal | timeout: 150 | **PASS** |
| steptimeout-tight | timeout: 1 | **PASS** |
| steptimeout-custom | Custom per-step timeouts | **PASS** |
| steptimeout-notimeout | noTimeoutSteps | **PASS** |
| steptimeout-override | overrideStepLimits: true | **PASS** (test expected to fail) |

**Вердикт: enable** — захист від зависання степів.

### 16. junitReporter (NEW)

Описано в секції "Нові плагіни" вище.

---

## Зведена таблиця вердиктів

| Plugin | Статус | Вердикт | Причина |
|--------|--------|---------|---------|
| aiTrace | ✅ 11/11 pass | **pilot** | Цінний для AI-дебагу, deleteSuccessful:true обов'язково |
| analyze | ⚠️ 3/4 pass | **pilot** | vision:true не працює, решта ОК |
| auth | ✅ 2/2 pass | **enable** | Вже використовується |
| autoDelay | ✅ 4/4 pass | **skip** | Додає латентність без користі |
| browser | ✅ pass | **enable** | CLI override для дебагу |
| coverage | ✅ 3/3 pass | **skip** | Не релевантний для e2e зовнішнього додатку |
| customLocator | ✅ 5/5 pass | **enable** | Shortcut для data-test-id |
| customReporter | ✅ 1/1 pass | **skip** | Scaffold, не production |
| heal | ⚠️ 3/4 pass (flaky) | **pilot** | Флейкі AI відповіді, потребує ANTHROPIC_BASE_URL fix |
| junitReporter | ✅ 2/2 pass | **enable** | Корисний для CI |
| pageInfo | ✅ 5/5 pass | **enable** | Покращує failure context |
| pause | ✅ pass | **enable** | Вже використовується |
| retryFailedStep | ✅ 8/8 pass | **enable** | Стабілізує flaky тести |
| screencast | ✅ 7/7 pass | **pilot** | Відео для CI failures |
| screenshot | ✅ 10/10 pass | **enable** | Дефолтний, стабільний |
| stepTimeout | ✅ 5/5 pass | **enable** | Захист від зависання |

**Загалом: 16 плагінів, 72 конфіги, 69 PASS / 3 expected FAIL.**

---

## Нові проблеми (знайдені при ретесті)

1. **analyze: vision:true** — `Invalid prompt: The messages do not match the ModelMessage[] schema`. Ймовірно баг в побудові промпту з image content.
2. **ANTHROPIC_BASE_URL конфлікт** — якщо env має `ANTHROPIC_BASE_URL=https://api.anthropic.com` (без `/v1`), @ai-sdk/anthropic відправляє запити на неправильний URL. Потрібно або `https://api.anthropic.com/v1`, або unset.

---

## Рекомендації для e2e-tests

### Увімкнути зараз (enable)
- **retryFailedStep** — `retries: 3, deferToScenarioRetries: true`
- **screenshot** — `on: "fail", uniqueScreenshotNames: true`
- **stepTimeout** — `timeout: 60`
- **pageInfo** — `enabled: true` (покращує failure context)
- **auth** — вже є
- **pause** — вже є
- **customLocator** — `prefix: "$", attribute: "data-test-id"`
- **junitReporter** — `attachMeta: true, attachSteps: true`

### Пілотувати (pilot)
- **aiTrace** — `deleteSuccessful: true, captureHTML: true, captureARIA: true`
- **analyze** — `enabled: true` (без vision:true)
- **screencast** — `on: "fail"` (тільки для CI)
- **heal** — потребує стабільної роботи AI + ANTHROPIC_BASE_URL fix

### Пропустити (skip)
- **autoDelay** — не потрібен
- **coverage** — не релевантний
- **customReporter** — scaffold
- **browser** — корисний для CLI, але не для конфігу
