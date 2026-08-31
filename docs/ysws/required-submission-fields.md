> For the complete documentation index, see [llms.txt](https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/required-submission-fields.md).

# Required Submission Fields

The following table lists every field that must be filled out for a project submission:

| Field                                  | Description                                                                                                                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code URL                               | A link to the project's source code repository (see [below](#code-url)).                                                                                                                           |
| Playable URL                           | A public link where the project can be experienced (see [below](#playable-url)).                                                                                                                   |
| First Name                             | Submitter's first name.                                                                                                                                                                            |
| Last Name                              | Submitter's last name.                                                                                                                                                                             |
| Email                                  | Submitter's contact email address.                                                                                                                                                                 |
| Screenshot                             | An image that showcases the project (see [below](#screenshot)).                                                                                                                                    |
| Description                            | A brief explanation of the project (see [below](#description)).                                                                                                                                    |
| Address (Line 1)                       | Submitter's address, first line.                                                                                                                                                                   |
| Address (Line 2)                       | Submitter's address, second line (if applicable).                                                                                                                                                  |
| City                                   | Submitter's city.                                                                                                                                                                                  |
| State / Province                       | Submitter's state or province.                                                                                                                                                                     |
| Country                                | Submitter's country.                                                                                                                                                                               |
| ZIP / Postal Code                      | Submitter's ZIP or postal code.                                                                                                                                                                    |
| Birthday                               | The submitter's date of birth.                                                                                                                                                                     |
| **Override Hours Spent**               | **The approved number of hours for this project (see** [**Override Hours Spent**](/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/override-hours-spent.md)**).**                          |
| **Override Hours Spent Justification** | **Supporting evidence for the approved hours (see** [**Override Hours Spent Justification**](/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/override-hours-spent-justification.md)**).** |

### Sometimes Required Fields

These fields are required in certain cases. When they are required, they must be filled out before the project is submitted to the Unified Database.

| Field                                       | Required When                                                              | Description                                                                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Optional - Override Duplicate Justification | The project shares a Code URL with another project in the Unified Database | Why this project/code is allowed to be submitted in multiple places (e.g., team projects)                           |
| Optional - Override Age Justification       | The project submitter is over 18 at the time of review                     | Why the submitted project is still eligible (usually because the submitter turned 19 between submission and review) |

## Playable URL

The **Playable URL** must be a publicly accessible link where *anyone* can experience the project without requiring significant technical knowledge.

**Acceptable examples:**

* A browser-based game or web application.
* A downloadable executable (installer or standalone binary).
* A hosted demo or interactive prototype.

**Not acceptable:**

* A GitHub release page that contains only source code.
* A project that requires the user to compile or build from source in order to run it.
* A Google Colab notebook, Jupyter notebook runner, or similar hosted notebook environment.\
  These are development tools, not deployable project demos.
* LeetCode, competitive programming, or algorithmic challenge solutions

The project does **not** need to run on every platform. As long as it can be experienced on at least one platform (e.g. Windows, macOS, Linux, or the web), it satisfies this requirement.

## Code URL

The **Code URL** must point to a version-control repository, preferably on GitHub, though other providers (GitLab, Bitbucket, etc.) are permitted. The repository must satisfy the following conditions:

1. It must be **public**, accessible to anyone without authentication.
2. It must be **open source**, with a license that allows others to view and modify the code. The license is **not required** but is a good practice and we highly encourage it!&#x20;
3. It must contain a **README**. The README should explain what the project is, how to set\
   it up, and how to run it.
4. It should have **multiple commits** that reflect the development progress of the project. A repository with a single commit is not acceptable for projects claiming significant hours of work. For example, a 20-hour project with only one commit does not follow the guidelines. The commit history should tell the story of how the project was built over time.

## Screenshot

The **Screenshot** should visually demonstrate the project. Suitable screenshots include:

* A screenshot of the running application or game.
* A photograph of a hardware project or 3D model.
* Any image that gives a clear impression of what the project looks and feels like.

Screenshots cannot be a non-image filetype (ex., no .mp4) and cannot be animated (ex., no .GIF).

## Description

The **Description** should explain what the project is and what it is intended for. It does not need to be overly detailed; a clear, concise summary that conveys the project's purpose and functionality is sufficient.

## Reproducibility

Projects are meant to be used! Although this isn't an official submission field, **all projects submitted to the Unified Database should be able to be recreated by someone with minimal technical knowledge using only the information in the submission.**

For software projects, there should be a README that explains how the project can be experienced and what technology went into making it.

For games, there should be instructions somewhere on how to play the game and, if applicable, how to set it up or download it. These can be in the README or on the page the game is hosted on (e.g., itch.io) as long as they are easily accessible.

For hardware projects, the repo should contain everything someone would need to build the project from scratch. This means, at minimum:

* PCB schematics/wiring diagrams
* CAD files in a modifiable format (acceptable examples: .STEP, .blend; not acceptable examples: .STL)
* A bill of materials
* A README with an explanation of what the project is and any special instructions for building it (i.e., anything beyond soldering parts where they're labeled on the PCB)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/required-submission-fields.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
