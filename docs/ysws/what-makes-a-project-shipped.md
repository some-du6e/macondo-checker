> For the complete documentation index, see [llms.txt](https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/what-makes-a-project-shipped.md).

# What Makes a Project "Shipped"?

YSWS programs are supposed to be creative and mostly unconstrained. We don't want you to be worrying about going through a maze of bureaucracy and approvals — we want you to make and run cool programs!

However, all projects eventually end up in the same place, the Unified Database, and all projects in the Unified Database need to be shipped. So, there's one hurdle you do need to jump through when creating your program: how will you make sure the projects you're submitting are shipped, and what's the definition of shipped anyway?

{% hint style="info" %}
**Universal Ship Requirements**

Generally, a shipped project:

* Works (as a minimum viable product, even if it's not fully complete yet)
* Has its full code published to a site like GitHub
* Is able to be experienced by anyone with minimal technical knowledge
* Requires < 2 minutes of setup
* Is reproducible
  {% endhint %}

This guide walks you through exactly what will be accepted (and what will get your project rejected from Unified) for common project types. If you have a unique project or new YSWS model that necessitates a different type of ship, don't worry — just run it by Max or a spot-checker to see what the best format for it would be!

### Table of Contents

#### Project Types

* [Games](#games)
  * [Downloadable](#downloadable)
  * [Web playable](#web-playable)
  * [Platform-specific (Sprig, retro system, custom hardware, etc.)](#platform-specific)
  * [Special Cases](#special-cases)
    * [Roblox](#roblox)
* [Software](#software)
  * [Websites/Web Apps](#websites-web-apps)
  * [Mobile Apps](#mobile-apps)
  * [Desktop Apps](#desktop-apps)
  * [CLIs](#clis)
  * [Libraries](#libraries)
  * [Browser Extensions](#browser-extensions)
  * [Bots (Discord, Slack)](#bots)
  * [Mods/plugins](#mods-plugins)
  * [Contributions (e.g., Pull Requests)](#contributions)
* [Hardware](#hardware)

#### Hosts

* [Disallowed Hosts (and what to use instead)](#disallowed-hosts-and-what-to-use-instead)
  * [Web hosts](#web-hosts)
  * [Demo videos](#demo-videos)

### Games

<details>

<summary>Downloadable</summary>

1. Must have a build for at least one of the major operating systems (no source code dumps!)
2. If special install steps are required (e.g., Gatekeeper bypass), instructions must be included in the README or itch.io description

</details>

<details>

<summary>Web playable</summary>

1. Must be hosted either on an allowed web host (e.g., GitHub Pages, Vercel) or on itch.io as a play-in-browser game

</details>

<details>

<summary>Platform-specific (Sprig, retro system, custom hardware, etc.)</summary>

1. If an online emulator is available (e.g., Sprig), the playable link should either:
   1. go straight to the emulator with the game already loaded
   2. if the game is unable to be encoded within the link, go to a releases page with the game build (e.g., a ROM), a link to the emulator, and instructions on how to run the game within the emulator
2. If no online emulator is available (e.g., custom hardware), the project must include a demo video (on an allowed host) of the project clearly working on the hardware
3. If special install steps are required (e.g., jailbreak + 3rd party software), instructions must be included in the README

</details>

#### Special Cases

<details>

<summary>Roblox</summary>

If the submitter is eligible to publish already or if you are willing to fund them to do so, the game should be published to Roblox for all ages (requires a fee). Otherwise, the game should include links to each of the following somewhere within its Playable URL:

1. The game, published to Roblox for ages 16+ (free)
2. A demo video clearly showing the game being played with its core features

</details>

### Software

<details>

<summary>Websites/Web Apps</summary>

1. Must be published to a public, non-ephemeral URL
2. Must not be gated behind credentials (submitters need to provide demo login information)
3. Must not be hosted on a disallowed host

</details>

<details>

<summary>Mobile Apps</summary>

1. Must include a demo for one or both of the major platforms (iOS and Android) in one or more of the following forms (ordered from most to least preferred):
   1. Full Play Store/iOS App Store release (consider funding Apple developer licenses through your program)
   2. Open/Closed/Internal test release (via TestFlight for iOS)
   3. Signed APK with sideloading instructions or IPA build with sideloading instructions
   4. If none of the above options are possible, demo video on an allowed host that showcases all app features

</details>

<details>

<summary>Desktop Apps</summary>

1. Must have a build for one or more of the major platforms (Windows, Mac, and Linux) in one of the following forms:
   1. GitHub release with an installer/executable file
      * ex. .exe, .deb, .x86\_64, .AppImage, .dmg, .msi
   2. Release to an application host
      * ex. Microsoft Store, Mac App Store, Homebrew, apt

</details>

<details>

<summary>CLIs</summary>

1. Must be released as either
   1. a package on a package host (PyPI, crates.io, npm, etc.)
   2. an executable file build for one or more of the major platforms (Windows, Mac, and Linux)

</details>

<details>

<summary>Libraries</summary>

1. Must be released as a package on a package host (PyPI, crates.io, npm, etc.)
2. Must have documentation such that other users will be able to use it (i.e., doesn't need to be insanely detailed, but should cover all the functions)

</details>

<details>

<summary>Browser Extensions</summary>

1. Must be published to one or both of the Firefox and Chrome stores

Notes:

* If you need a quick turnaround **and the user has proof that their project is in the review process for the Firefox/Chrome store**, it is acceptable to, in the meantime, link a release with a ZIP containing only the needed files for the extension and/or a .CRX file with instructions on how to load the extension into your browser. The proof that the extension was published and, when approved, the store links, should be present somewhere in the project repo.

</details>

<details>

<summary>Bots (Discord, Slack)</summary>

1. Must have a functional invite link with proper scopes for the bot for users to add to their own servers
2. Must have an invite link to a test server or channel where users can see the bot functioning

Notes:

* If the submitter is unable to host the bot themselves **due to external cost only** ("this integral API costs me 1c/call," not "I don't feel like figuring out Nest"), they can instead include **detailed self-host instructions**, preferably with a single script that takes care of most of the setup

</details>

<details>

<summary>Mods/plugins</summary>

1. Must be fully published to the respective platform's mod hosting site (Modrinth, Curseforge, Steam Workshop, VS Code Extensions Store, etc.)

Notes:

* If and only if the platform the user is publishing to **requires a publishing fee**, the user can instead include a build of the mod or plugin and detailed instructions on how to load/sideload it

</details>

<details>

<summary>Contributions (e.g., Pull Requests)</summary>

1. Must include a link to the contribution/pull request (open or merged)
2. Must include a live link to the project the user contributed to
   1. If applicable, this must be the link to the specific part of the project the user contributed to (e.g., a subpage)
3. Must include a description of what the contribution added or changed (in the pull request itself or otherwise prominent in the ship)

</details>

### Hardware

<table><thead><tr><th width="313">Component</th><th width="199">Required If</th><th>Notes</th></tr></thead><tbody><tr><td><p>A BOM with:</p><ol><li>All components used in the project (regardless of whether the submitter already owns them)</li><li>Specific part names (e.g., "Seeed Studio XIAO RP2040," not "Microcontroller")</li></ol></td><td>Always required, unless the project is 3D model/print only</td><td></td></tr><tr><td>A schematic and all PCB project files</td><td>The project uses a PCB</td><td>For KiCad: .kicad_pro, .kicad_sch, .kicad_pcb</td></tr><tr><td>A wiring diagram</td><td>The project has electronic components but does not have a PCB/schematic (or if there are additional components not included on the PCB)</td><td></td></tr><tr><td>3D models in a modifiable format</td><td>The project includes a 3D printed component (like a case)</td><td>.STEP, .STP, .F3D, etc. — they can include meshes like .STL, but they need .STEP/etc. in addition</td></tr><tr><td>Firmware</td><td>The project needs firmware to accomplish its primary purpose (most projects with microcontrollers)</td><td>The firmware doesn't need to be tested and can be basic if the project is in the design phase</td></tr></tbody></table>

***

### Disallowed Hosts (and what to use instead)

#### Web hosts

**Disallowed**

* Streamlit

**Use Instead**

* Nest
* Railway
* Render
* Vercel

#### Demo videos

**Disallowed**

* Google Drive
* Uncommon downloadable video formats
  * Ex. Proprietary formats that aren't playable on some devices/require conversion

**Use Instead**

* YouTube
* Vimeo
* Hosted/downloadable .mp4 file via #cdn (preferred) or on GitHub


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR/what-makes-a-project-shipped.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
