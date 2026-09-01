# Privacy Policy

Effective date: August 31, 2026

This policy explains how macondo-checker (the "Bot") handles information when
you interact with it in Slack. It applies only to the Bot, not to Slack,
Macondo, Hack Club, linked project sites, or other third-party services.

## Information the Bot handles

The Bot may handle:

- Slack message text that you send in a configured channel or in a message that
  mentions the Bot.
- Slack identifiers and metadata needed to reply, including user, team,
  channel, message, and thread identifiers.
- Public Macondo project information, including project descriptions, owner
  profiles, journals, submission details, repository links, and demo links.
- Public repository contents and history when they are relevant to a requested
  project review.
- AI responses, tool inputs and outputs, errors, and other session data needed
  to continue a conversation and operate the Bot.

Do not send passwords, API keys, private repository credentials, private
personal records, or other sensitive information to the Bot.

## How information is used

The Bot uses this information to:

- Answer Macondo support questions.
- Review projects and provide advisory feedback.
- Maintain context within a Slack thread.
- Run tools needed to inspect public project information safely.
- Diagnose errors, prevent abuse, and improve the Bot.

The Bot's reviews are advisory and are not official Macondo decisions.

## AI processing and third parties

To generate a response, the Bot sends your message, relevant conversation
context, system instructions, and relevant tool results to its configured AI
model provider. The default configuration uses
[OpenRouter](https://openrouter.ai/privacy), which may route requests to the
selected model provider. A deployment may instead use another compatible AI
provider.

The Bot also uses:

- [Slack](https://slack.com/trust/privacy/privacy-policy) to receive messages
  and post responses.
- [E2B](https://e2b.dev/privacy) to run inspection tools in an isolated
  cloud sandbox. Public repositories and related review artifacts may be
  copied into that sandbox.
- The public Macondo API and public project, repository, and demo services that
  are relevant to your request.

These services process information under their own terms and privacy policies.
The Bot does not sell personal information or use it for advertising.

## Storage and retention

The Bot stores conversation session files on the operator's server so a Slack
thread can retain context across messages. These files can include message
content, AI responses, tool activity, timestamps, model details, and the Slack
thread identifier. The Bot currently has no automatic deletion period for
these local session files; they remain until the operator deletes them.

Active sessions are removed from memory after a short idle period. E2B
sandboxes are shut down when the session sleeps or ends, but third-party
providers may retain data according to their own policies and the operator's
account settings. Slack separately retains messages according to the Slack
workspace's settings.

## Data choices and deletion

You can avoid further collection by not interacting with the Bot. To request
access to or deletion of Bot session data, contact the Bot operator in the
Slack workspace where the Bot is installed. Include the Slack thread link or
thread timestamp needed to identify the session.

Deleting Bot session data does not delete copies retained by Slack or other
third-party services. Requests involving those services must be made to the
relevant service or workspace administrator.

## Security

The operator uses reasonable safeguards, including isolated execution for
untrusted project code and environment-based credential storage. No system is
completely secure, so the Bot should not be used to transmit secrets or highly
sensitive information.

## Changes to this policy

This policy may change as the Bot's features or providers change. Updates will
be posted in this repository with a revised effective date.

## Contact

Contact the Bot operator in the Slack workspace where the Bot is installed. For
repository-related questions, you may also open an issue in the
[macondo-checker repository](https://github.com/some-du6e/macondo-checker/issues),
but do not include sensitive information in a public issue.
