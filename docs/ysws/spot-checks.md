> For the complete documentation index, see [llms.txt](https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/spot-checks.md).

# Spot-Checks

### Spot-check Verdicts

These are the possible verdicts you can receive for a spot-check:

1. <mark style="color:$success;">Accepted</mark> - The project requires no changes and remains in the Unified Database
2. <mark style="color:$warning;">Needs Changes (fine issued)</mark> - The project does not qualify for submission into the Unified Database in its current state, but **it can be resubmitted after changes are made**
3. <mark style="color:$danger;">Rejected (fine issued)</mark> - The project cannot qualify for submission into the Unified Database even if changes are made and **should not be resubmitted**

Reasons a project can receive a certain verdict include, but are not limited to, the following:

<table><thead><tr><th width="48">#</th><th width="169">Verdict</th><th>Criteria</th></tr></thead><tbody><tr><td>1</td><td><mark style="color:$danger;">Rejected</mark></td><td>Project is a duplicate and is not a team project, update, or approved cross-program submission</td></tr><tr><td>2</td><td><mark style="color:$danger;">Rejected</mark></td><td>Project is the result of fraud (Hackatime hour inflation, skirting program-specific rules, etc.)</td></tr><tr><td>3</td><td><mark style="color:$danger;">Rejected</mark></td><td>Project is plagiarized from another source (tutorial with no modifications, stolen code, copy of a previous project with little/no modifications, etc.)</td></tr><tr><td>4</td><td><mark style="color:$danger;">Rejected</mark></td><td>Project was made for a school assignment</td></tr><tr><td>5</td><td><mark style="color:$danger;">Rejected</mark></td><td>Project was built as part of Hack Club employment or other paid Hack Club work (doesn't count personal projects made during unpaid time while employed by Hack Club)</td></tr><tr><td>6</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Project does not work as described by the submitter (ex. project description claims Google OAuth support but no option is shown during login)</td></tr><tr><td>7</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Submitted project does not match the reviewer justification (ex. hour mismatch, feature mismatch, Hackatime project mismatch)</td></tr><tr><td>8</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>One or more required fields are missing/blank (see <a href="/pages/fe0ca5c654608ed5288a55cc59307dde395586d8">Required Fields</a>)</td></tr><tr><td>9</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Screenshot does not represent the project (see <a href="/pages/fe0ca5c654608ed5288a55cc59307dde395586d8#screenshot">Screenshot</a>)</td></tr><tr><td>10</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Playable URL is broken or not able to be publicly experienced (see <a href="/pages/fe0ca5c654608ed5288a55cc59307dde395586d8#playable-url">Playable URL</a>)</td></tr><tr><td>11</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Code URL is broken or not publicly accessible (see <a href="/pages/fe0ca5c654608ed5288a55cc59307dde395586d8#code-url">Code URL</a>)</td></tr><tr><td>12</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Project is not reproducible (see <a href="/pages/fe0ca5c654608ed5288a55cc59307dde395586d8">Reproducibility</a>)</td></tr><tr><td>13</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Project is a duplicate and is part of a team project, update, or approved cross-program submission, BUT reasoning for it being a duplicate is not present in reviewer justification (see <a href="/pages/4d848e8aa2e9cec1a4045c12da332ab3c982a029">Duplicate and Updated Submissions</a>)</td></tr><tr><td>14</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Reviewer justification does not contain all required elements/is insufficient to justify hours submitted (see <a href="/pages/5ca35ed71b38d496319fe88e62453c16c78f39f9">Override Hours Spent Justification</a>)</td></tr><tr><td>15</td><td><mark style="color:$warning;">Needs Changes</mark></td><td>Required evidence (ex. Hackatime projects) cannot be located using the information provided (see <a href="/pages/5ca35ed71b38d496319fe88e62453c16c78f39f9">Override Hours Spent Justification</a>)</td></tr></tbody></table>

#### Disputing verdicts

Spot-checkers make mistakes, too! If you think a fine was issued by mistake, please don't hesitate to reach out and raise a dispute. To have the best chance of a fine being reversed, keep in mind that:

* You must prove, with evidence, that **the criteria were not met and the spot-checker made a mistake** (e.g., the screenshot does match the project but it's in dark mode so it looks significantly different).
* You cannot dispute by providing an excuse after the submission (e.g., there is no screenshot because the submitter's dog ate their Print Screen button) -- **the issue should have been resolved before submission to the Unified Database** by either coordinating with the submitter or reaching out to the spot-checker.

#### Resubmitting Projects

If your project is marked as "Needs Changes" or "Rejected", **it is removed from the Unified Database**. **"Needs Changes" projects can be resubmitted** to the Unified Database (becoming eligible for payout again) by making the necessary changes and then clicking the "Automation - Submit to Unified YSWS" again in your program Airtable. **"Rejected" projects should not be resubmitted** to the Unified Database even with changes unless you have received permission from a spot-checker.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/spot-checks.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
