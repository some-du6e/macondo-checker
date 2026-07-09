# Good Journaling

**A journal entry is a short write-up of a chunk of work, plus a photo or two and the hours you spent.** You post one as you build, it logs your time, it keeps your project streak alive, and it is the evidence a reviewer reads when you ship. Good journals get your hours approved. Lazy or AI-written ones get you bounced back.

Here is the whole job: write what you did and **why**, show a picture of it, and log honest hours. That's it. The rest of this page is how to do that well.

## Why does my journal matter?

You're building something new. Learning new skills, making mistakes, making decisions. When you look back at your project in a few years, you probably won't remember most of that.

**Journaling is the keepsake of your journey. It's also a trove of knowledge others can learn from.**

Without a journal, your steps are not documented. How did you piece this together? Why did you do X instead of Y? Journaling lets others glimpse your thought process and mistakes.

Reviewers use your journals too. After submitting your design, reviewers check your work to make sure:

1. Your decisions make sense
2. Your work is original
3. Your design meets the [submission requirements](https://macondo.hackclub.com/docs/submitting-design)

There is also a reward angle. The hours you log on journals count toward your approved hours when you ship, and they keep your project streak ticking. See [Currency](https://macondo.hackclub.com/docs/currency) for how hours turn into gold.

## What goes in a journal entry?

When you post an entry, you fill in a few things. The platform checks them before it saves:

| Field | What it is | The rule |
|-------|-----------|----------|
| Title | A short line describing the entry | Required, 75 characters or fewer |
| Content | Your write-up of the work | Required, at least 100 characters of actual writing (images don't count) |
| Image | A photo or screenshot of the work | Required (hardware needs more for longer sessions, see below) |
| Hours | How long you worked | Logged in 0.1-hour steps, up to 20 per entry |

If a session ran longer than 20 hours, split it into multiple entries. Short and frequent beats one giant dump anyway.

## How do I write a good entry?

A good journal is a story. _Your story._

You don't need perfect English or grammar. AI doesn't know your story, so it'll write bad journals. Don't use it.

> **No AI in journals**
>
> Reviewers can tell when a journal is AI-generated, and AI-written journals are grounds for rejection. Write it yourself, even if you think your writing is bad. Honest beats polished.

Write one entry for each day's work or when you reach a milestone. Short and frequent beats long and sparse.

### Explain your decisions, not just your actions

The most important part of a journal entry is explaining _why_, not just _what_. Every entry should answer:

- What did you do?
- Why did you do it?
- What problems did you face?

### Screenshot and document everything

_Everything._ Screenshot your work at every meaningful step, not just when it's polished. Show the messy intermediates. Show the before and after when you fix something. Same goes for photos when you're working on physical builds.

For hardware, the number of images scales with the hours you log: roughly **one image per 5 hours of work**, with at least one on every entry. A 20-hour entry backed by a single screenshot isn't reviewable, so spread the photos across the work.

### Make mistakes. Describe them. Fix them.

You will make mistakes. Footprints that are off, wiring that needs to be redone. Write about them, then fix them. A journal with no mistakes is a manual, not a journal.

## Can I put a video in my journal?

Yes. Videos are great for showing something working, a timelapse, or a tricky build step. The one rule: **video links must be hosted on `cdn.hackclub.com`**. Upload through the journal editor's formatting buttons and it lands on the CDN for you. The same goes for images, they must be `cdn.hackclub.com` URLs, which the upload button handles automatically.

A regular link to a YouTube video is fine to paste into your text. The CDN rule only applies to direct video file links (things ending in `.mp4`, `.mov`, `.webm`, and the like).

## Can I log time I spent learning?

Time you spend on the project counts when it's real work on the project, including the figuring-out and the false starts. The exact rule for what hours count toward your reward and your streak (Hackatime time plus your logged journal hours, and the 1-hour-per-day floor) lives in one place so it stays consistent. See [Currency](https://macondo.hackclub.com/docs/currency) for the full breakdown, and log your hours honestly in the entry.

## Art and Asset Hours

Many projects log art, design, and asset hours through journals: sprite art, UI mockups, music, 3D models, level design, and so on. These hours count toward your approved total alongside your coding or build hours.

As a general rule, **art and asset hours should not exceed roughly 40% of your project's total approved hours.** Reviewers can grant exceptions when the art is exceptionally high quality and clearly elevates the project, but the bar for an exception is real polish, original work, and intermediates documented in your journal entries. Quick sketches, generic stock assets, and AI-generated art won't earn the exception.

### Record a timelapse for art work

The most reliable way to back up art and asset hours is a **timelapse of the work**. [Lapse](https://lapse.hackclub.com) is purpose-built for this and works great for digital art, Figma, music production, and similar work. You can also screen-record manually if you prefer.

When you log the journal entry, **include a link to the timelapse video** so reviewers can verify the hours. Either upload it to YouTube (unlisted is fine) and paste the link, or host it on a CDN or file storage and link the playable URL. Include the link directly in the journal text so the reviewer doesn't have to dig for it.

If your project is art-heavy by nature and you want every hour counted, make the journals show it: references, iterations, before and after shots, the timelapse link, and a clear thought process. The same standard from "Explain your decisions, not just your actions" applies.

## Do's and Don'ts

| Do | Don't |
|----|-------|
| Explain what you did, why you did it, and how | State only what you did without explaining why |
| Screenshot and document EVERYTHING | Have generic statements like "I wired it up" or "I did CAD" |
| Describe your mistakes | Show only the end product |

## Examples

### Bad Journal Entry

> I added a buck converter and wired it up. I did CAD and added a case. I soldered everything together and it worked!

![Bad journal example](https://macondo.hackclub.com/_ipx/q_80/images/docs/journal-bad.webp)

**What's wrong with this:**

- Why did you do this?
- What is the buck converter and case for?
- What features does the case have? Any special design choices?
- How did you test to make sure it worked?
- The image is generic and doesn't show what _you_ did.

### Good Journal Entry

_From [@alexren](https://github.com/qcoral/)'s [hwdocs](https://hwdocs.hackclub.dev/shipping/example-journal/)_

**June 8: Got the screen to work!!**

I got the raspberry pi to actually display on the LCD! I based the wiring off of another project originally, but they used a different display driver. That meant I had to figure out how to modify it for the display I was using instead.

![Good journal example 1](https://macondo.hackclub.com/_ipx/q_80/images/docs/journal-good-1.webp)

The original project documented how the software was set up, which gave me a starting point. The main problem was figuring out the right kernel driver parameters for my specific display. A bunch of digging through GitHub repos eventually led me to the right driver file. Using that, I got video output working.

![Good journal example 2](https://macondo.hackclub.com/_ipx/q_80/images/docs/journal-good-2.webp)

**Key difference:** The good example shows the thought process, the research chain, the mistakes, and the solution. It includes images at intermediate stages, not just the final result. It reads like a story, not a checklist.

## See also

- [Currency](https://macondo.hackclub.com/docs/currency) - how logged hours and streaks turn into gold
- [Shipping Your Design](https://macondo.hackclub.com/docs/submitting-design) - what reviewers check when you ship
- [Hackatime](https://macondo.hackclub.com/docs/hackatime) - how your coding time gets tracked
