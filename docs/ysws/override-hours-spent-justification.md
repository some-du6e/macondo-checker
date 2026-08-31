> For the complete documentation index, see [llms.txt](https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/override-hours-spent-justification.md).

# Override Hours Spent Justification

The **Override Hours Spent Justification** field must provide supporting evidence for the approved hour count. The standard is simple: **someone who was not involved in the review should be able to read this justification, follow the links, and reach the same conclusion you did.**

This means the justification must contain *specific, verifiable* information, including links, numbers, and concrete observations. If your justification does not point to anything that another person could go check for themselves, it is not sufficient.

This field is **not public-facing**. The submitter will not see what you write here. It is an internal record intended for other reviewers and for auditing purposes. Because of this, the justification should be written as a factual explanation of the evidence you examined and the conclusion you reached. It is not the place for encouragement, or commentary directed at the submitter.

In the YSWS Projects Submission component, for convenience, **there are several fields that are combined into the Override Hours Spent Justification field in the Unified Database**. Some of these can be omitted depending on your YSWS and submission type.

### For Smaller YSWS Using the Airtable Directly

Fill out the [Justification Fields](#justification-fields) in the Airtable that are applicable to your submission — that's all you need for your justification. Don't put anything in the Optional - Override Hours Spent Justification field. The automation will combine your fields into the justification field in the Unified Database.

### For Larger YSWS with Custom Review Flows

You can fill out the [Justification Fields](#justification-fields) one-by-one, but it's probably easier to put your filled-out custom template in Optional - Override Hours Spent Justification, which overrides the individual fields — just make sure that each element you need to include per the [Justification Fields](#justification-fields) is present in your templated justification.&#x20;

## Justification Fields

<table><thead><tr><th width="228">Field</th><th>Description</th><th>Include When</th></tr></thead><tbody><tr><td>Hackatime Project Name(s) and Date Range(s)</td><td>Hackatime project names associated with the submission along with the dates they were analyzed over (see <a href="#hackatime-project-name-s-and-date-range-s">below</a>). Can/should be automated.</td><td>Using Hackatime to track hours</td></tr><tr><td>Submitter Hackatime ID</td><td>Submitter's numeric Hackatime ID. Can/should be automated.</td><td>Using Hackatime to track hours</td></tr><tr><td>Lapse Link(s)</td><td>Links to any timelapses associated with the submission. Comma-separated. Can/should be automated.<br><br>(coding Lapses only) Each Lapse should have a short explanation/justification of how much time in the Lapse was on-task and what deflation was applied as a result</td><td>Using Lapse to track hours</td></tr><tr><td>Specific Technical Features</td><td>Features that the project has that justifies the number of hours spent on it (see <a href="#specific-technical-features">below</a>). Should be human-written.</td><td>Always required (unless you have received an exception)</td></tr><tr><td>Deflation Justification</td><td>Explanation of why hours were deflated if they were deflated from what was originally claimed (see <a href="#deflation-justification">below</a>). Should be human-written.</td><td>The time tracked on the project was deflated by the reviewer</td></tr><tr><td>Alternate Tracking Method</td><td>Explanation of how you determined hours if you did not only use Hackatime/Lapse (see <a href="#alternate-tracking-method">below</a>). The explanation of how your time-tracking works can be automated; if there is some subjectivity to it (e.g., self-reported), also include a human-written explanation of why you feel the submitted hours are reasonable.</td><td>You are tracking time using something other than Hackatime or Lapse</td></tr><tr><td>Additional Justification</td><td>Additional information you want to convey to the spot-checker that doesn't fit in the other fields. Can be automated (e.g., extra review links), human-written (e.g., personal testimony), or a mix of both.</td><td><p>Other fields may not be sufficient to justify the number of hours, or the submission requires additional context to be fairly reviewed (see <a href="#additional-justification">Additional Justification</a>)</p><p><br>You want to include additional links with more evidence (ex. the project page on a custom YSWS review platform)</p></td></tr></tbody></table>

### Hackatime Project Name(s) and Date Range(s)

The **Hackatime Project Name(s) and Date Range(s)** field should specify 1) what Hackatime projects were looked at when calculating hours for this project and 2) the days over which the hours were counted. For example, a project update should include only dates after the previous update was submitted.

This field should be formatted as a comma-separated list.&#x20;

Example: For hackatime-project tracked from 7/20/2026 to 7/22/2026 and hackatime-project-2 tracked from 7/21/2026 to 7/23/2026, write as:

`hackatime-project 7/20/2026-7/22/2026, hackatime-project-2 7/21/2026-7/23/2026`

### Specific Technical Features

The **Specific Technical Features** justification field should detail what qualities the project has that explains the number of hours the user spent on it. This should be as specific as possible and not just a list of the languages used.

| Project Type                     | Good Example                                                                      | Bad Example                                      |
| -------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| Godot game                       | "realtime multiplayer, procedurally-generated worlds, cloud saving"               | "fun and unique game, has lots of pretty assets" |
| Web app                          | "OAuth authentication, full REST API, self-hosted Postgres database"              | "React"                                          |
| Hardware project                 | "USB-C battery charging with discharge management, custom case designed with CAD" | "super cool project, very polished"              |
| Simple portfolio site (beginner) | "multiple pages, CSS features like flexbox and animations, custom onclick script" | "HTML, CSS, JS"                                  |

### Alternate Tracking Method

Your justification should include a brief explanation of what method you used (ex. self-reported by user, base amount for project of this type, in-house YSWS-specific tracker) and why you are confident that the number of hours submitted (after deflation, if applicable) are accurate according to your method.

### Deflation Justification

**If the submitted hours are deflated from the number of hours tracked, you should include:**&#x20;

1. **the number of hours they were deflated to**, and
2. **why you deflated them** (i.e., why submitter experience doesn't match with technical features<sup>1</sup> or why evidence does not support the amount of time claimed)

Some examples of deflation justifications are:

* Ex. "Deflated from 10 hours to 2.5 hours because site contains only basic HTML/CSS/JS, user has created websites before, and UI was clearly created with AI"
* Ex. "Deflated from 8 hours to 4 hours because journal entries overstate design and build time for an experienced hardware builder"
* Ex. "Deflated from 7 hours to 4 hours because only 3 commits with code changes were made"

<sup>1</sup>If technical features far exceed submitter experience, consider if AI was used in a way not conducive to learning, which would warrant hour deflation. If user experience far exceeds technical features, consider how many hours it reasonably should have taken for the submitter to create the project or how many hours of genuine effort likely went into it, and then deflate to that amount of hours.

### Additional Justification

If the submission has one or more suspicious characteristics, more information may be required for a secondary reviewer or spot-checker to be confident in your assessment. Suspicious qualities include (but aren't limited to):

* The project has **very few significant** (i.e., not README updates or very minor changes) **commits** in comparison to the number of hours
* The project **heartbeats on Hackatime show suspicious/fraudulent patterns** (very long coding sessions, rods to god, etc.)
* The project contains a **high percentage of AI-written code** in comparison to the number of hours spent and number of significant commits (ex. only one commit which includes code with lots of AI signifiers)

If you submit a project with suspicious characteristics without sufficient justification, it may be subject to a fine when spot-checked. So, even if you aren't completely sure about a project being suspicious, it's a good idea to include extra justification just in case.

Some examples of elements you can include in additional justification are:

1. Submitter experience in project field with evidence
   * Ex. "beginner - this is their first hardware project per GitHub repos"
   * Ex. "advanced - they have completed multiple HTML/CSS/JS websites in the past per GitHub repos"
   * Ex. "beginner - they don't use Python conventions or advanced methods in their code"
2. Why submitter experience matches technical features
   * Ex. "No adjustment to the hours tracked was made because 15 hours is typical for a hardware beginner making their first macropad"

## What does not pass

The following are examples of justifications that fail this standard:

* "Hackatime checks out." (Checks out how? No project name, no date range, no numbers, nothing for anyone else to verify.)
* "Looks like a solid project, approving 10 hours." (What made it look solid? No evidence cited.)
* A bare Hackatime project name with no summary or analysis. (The name alone does not explain what the reviewer actually looked at or concluded.)
* "Good job :)" or "Great project, approved!" (The justification field is not for feedback or encouragement. It is an internal evidence record, not a message to the submitter.)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/override-hours-spent-justification.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
