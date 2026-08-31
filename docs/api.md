# Macondo API Docs (Unofficial)

**This is not official, this was made by @andrew. although it could be 😉**

Helped by @perchancearootej

> Macondo's endpoint responses can change at any time. Ensure your code is vigorous enough to handle these changes.

> :warning: **THIS IS STILL A WORK IN PROGRESS!**
> *If there's any issues, just DM me.*

> Macondo has implemented [API keys!](https://macondo.hackclub.com/settings/api-keys) **These work with all requests labeled with 🔑 in this doc!** You can set the expiration date for the keys to 30 days, 90 days, a year, or indefinitely. There are a few limitations though:
>
> These keys are **read only**. Therefore only GET requests work.
>
> **No internal endpoints**. Those will always reject keys.
>
> **PII info is withheld**.
>
> Rate-limiting is also applied at 20 req/s and 60 req/m.

> Macondo has an API guide found here, it covers how to make api keys: https://macondo.hackclub.com/docs/api-keys
>
> There is also an OpenAPI documentation page here, although it does not include many endpoints: https://macondo.hackclub.com/openapi

**Todo:**

- [ ] Response examples
- [ ] the rest of the api 😭

# Key

- 🛡️ — Authentication is needed for this action. You will get a 401 Unauthorized if you do not supply the `macondo_rv` and `macondo_session` cookies.
- 💣 — This action is destructive, and you may not be able to undo it.
- 🔑 — This action can be used with Macondo's built in API keys.
- 🚫 — This action is no longer supported or is not being updated.

# Table of Contents

- **Project Operations**
  - Get Project
  - Create Project
  - Edit Project
  - Get authenticated user projects
  - Hackatime Breakdown
  - List project collaborators
  - Open Graph Metadata
  - README Status
  - Download Project
  - Get Project Journals
- **User Operations**
  - Get User
  - Region Override
  - Get User Balance
  - Get User Starfruit
  - Sync Hackatime
  - Get User Streaks
  - Get earning rate
  - Get achievements
- **Shop Operations**
  - Get shop items
  - Get user suggestions
  - Vote on a user suggestion
  - Get user suggestion matches
  - Submit user suggestion
  - Get Address
  - Order Item
- **Explore Operations**
  - Get Explore Projects
  - Get Explore Users
  - Get Leaderboard
  - Get Events
- **Misc**
  - Get Authorized User Info
  - Get Notifications
  - Mark Notification as read
  - Get NPS Eligibility
  - Send NPS

# Project Operations

## Get Project 🔑

```
/api/projects/:id
```

GET Request

### Description

Gets the `id`, `user_id`, `name`, `type`, `description`, `fruit`, `level`, `stage`, `demo_url`, `thumbnail_url`, `repository_url`, `hackatime_projects`, `is_fork`, `guide`, `html_content`, `css_content`, `readme_content`, `last_html_sha`, `last_css_sha`, `invite_code`, `project_streak_days`, `last_worked_date`, `auto_use_streak_freezes`, `cart_screenshots`, `build_cost_cents`, `next_ship_needs_funding`, `next_ship_is_build_complete`, `next_ship_used_ai`, `next_ship_ai_usage_description`, `next_ship_is_update`, `next_ship_update_description`, `next_ship_reviewer_note`, `deleted_at`, `created_at`, `updated_at`, `owner`, `journals`, `viewer_is_owner`, `viewer_can_edit`, `activeShip`, `needsChangesShip`, `latestActiveGrant`, `has_active_grant`, `hasPreviousShippedShip`, `permRejected`, `is_extra_fruity`, `pendingFruit`, `previousShippedHackatimeHours`, `unshippedJournalHours`, and `streakStatus` of the project.

### Example Output

(see the original canvas for the attached `example.json`)

## Create Project 🛡️

```
/api/projects
```

POST Request with body

```json
{
    "name": "Name",
    "description": "Description",
    "type": "software",
    "level": 1
}
```

`type` can be `software` or `hardware`

`level` can be from 1 - 4

### Description

Creates a project with the parameters in the body.

## Edit Project 🛡️

```
/api/projects/:id
```

PATCH Request with one of the following parameters

**Change Description**

```json
{"description": "Edited Description"}
```

**Change Name**

```json
{"name": "Edited Name"}
```

TODO: add the rest

### Description

Edits the project with the requested parameters.

## Get authenticated user projects 🛡️ 🔑

```
/api/projects
```

GET Request

### Description

Returns the authenticated user's projects

## Hackatime Breakdown

```
GET /api/projects/:id/hackatime-breakdown
```

Authentication required. API-key compatibility has not been verified.

### Description

Returns the number of hours that have been worked on the project and how many contributors there are

### Example

```json
{"hackatimeBreakdown":[{"name":"example-project","hours":12.5}],"contributors":[{"user_id":"00000000-0000-0000-0000-000000000000","username":"example-user","slack_id":"U00000000","image":"https://example.com/avatar.png","is_owner":true,"is_self":true,"projects":[{"name":"example-project","hours":12.5}]}]}
```

## List project collaborators 🔑

```
/api/projects/:id/collaborators
```

GET Request

### Description

Gets all the collaborators of the project id

### Example

```json
{
    "owner_id": "8df66353-df37-4da0-97cb-4197e4f4b69d",
    "is_owner": false,
    "max_collaborators": 4,
    "collaborators": []
}
```

## Open Graph Metadata

```
GET /api/projects/:id/og
```

GET Request

### Description

Public endpoint that returns Open Graph metadata for a project: name, ownerName, ownerImage, type, hours, hasThumbnail, and thumbnailUrl.

### Example

```json
{"name":"Example Project","ownerName":"example-user","ownerImage":"https://example.com/avatar.png","type":"software","hours":0,"hasThumbnail":true,"thumbnailUrl":"https://example.com/thumbnail.png"}
```

The exact meaning of hours is unclear; it may represent shipped or credited hours rather than total Hackatime time.

## README Status

```
GET /api/projects/:id/readme-status
```

GET Request

Authentication required. API-key compatibility has not been verified.

### Description

Returns the generated README status for a project. Other possible status values are currently unknown.

### Example

```json
{"status":"ok"}
```

## Download Project

```
GET /api/projects/:id/download
```

GET Request

Authentication required. API-key compatibility has not been verified.

### Description

Returns an application/zip response with a Content-Disposition attachment filename based on the project name.

This endpoint is weird, may return an effectively empty ZIP, and probably was never intended for public use.

## Get Project Journals

```
GET /api/projects/:id/journals
```

### Description

Public endpoint that returns the project's journal entries as a JSON array. The response publicly exposes author metadata, including user IDs, Slack IDs, usernames, and avatar URLs.

### Example

```json
[{"id":12345,"short_brief":"Example update","long_brief":"Built the first version.","hours":1.5,"created_at":"2026-01-01T00:00:00.000Z","archived":false,"archived_at":null,"content_language":"en","author_id":"00000000-0000-0000-0000-000000000000","author_username":"example-user","author_slack_id":"U00000000","author_image":"https://example.com/avatar.png"}]
```

# User Operations

## Get User 🔑

```
/api/users/:id
```

### Description

Gets `id`, `username`, `image`, `slack_id`, `created_at`, `last_active_date`, `project_count`, `total_upvotes`, `top_streak_days`, and `projects` from the user.

## Override Region 🛡️

```
/api/user/region-override
```

PATCH Request

### Description

TODO

## Get User Balance 🛡️ 🔑

```
/api/users/balance
```

GET Request

### Description

Gets the authenticated user's gold balance

## Get User Starfruit 🛡️ 🔑

```
/api/users/starfruit
```

GET Request

### Description

Gets the authenticated user's starfruit balance and how many they have earned in their lifetime

## Sync Hackatime

```
/api/users/sync-hackatime
```

GET Request

### Description

TODO

## Get User Streaks 🛡️ 🔑

```
/api/profile/streaks
```

GET Request

### Description

TODO

## Get earning rate 🛡️ 🔑

```
/api/users/earning-rate
```

GET Request

### Description

TODO

## Get User Achievements

```
GET /api/achievements
```

### Description

it returns ur achievements it seems

# Shop Operations

## Get Shop Items 🔑

> :warning: **THIS WORKAROUND COULD BE DELETED AT ANYTIME**

```
/_ui/catalog
```

### Description

Returns `id`, `slug`, `name`, `description`, `name_translations`, `description_translations`, `price_hours`, `price_fruit_type`, `price_fruit_amount`, `price_fruit_level`, `price_fruit_category`, `image_url`, `kind`, `fulfillment_provider`, `source`, `grant_amount_cents`, `attachment_urls`, `inventory_mode`, `stock_remaining`, `max_per_user`, `sale_price_hours`, `available_until`, `available`, `coming_soon`, `requires_shipped_project`, `pinned`, `extra_fruity`, `regional_pricing`, `modifiers`, `category`, `created_at`, `updated_at`, `price_gold`, `regular_price_hours`, `regular_price_gold`, `is_on_sale`, `is_expired`, `is_sold_out`, `is_purchasable`, `available_in_region`, `resolved_region`, `user_has_unlocked`, `user_purchased_count`, `hit_per_user_cap`, `blocked_no_shipped_project`, `is_locked`, `max_quantity_per_order`, and `starred` for each item.

## Get user suggestions 🔑

> :warning: **THIS FEATURE IS PLANNED FOR DEPRECATION!**

```
/api/shop/requests
```

GET Request

### Query String Parameters

- `sort` — sorts by `new` or `top`
- `page` — number
- `limit` — number
- `q` — query (string)

### Description

Gets user shop suggestions

## Vote on a user suggestion 🛡️

> :warning: **THIS FEATURE IS PLANNED FOR DEPRECATION!**

```
/api/shop/requests/:id/vote
```

POST Request with body

`{"direction":"up"}` OR `{"direction":"down"}`

### Description

Upvotes or Downvotes the suggestion. Note: Your vote toggles. If you send the request (upvote) 2 times, it will upvote, then remove the upvote.

## Get user suggestion matches 🔑

> :warning: **THIS FEATURE IS PLANNED FOR DEPRECATION!**

```
/api/shop/requests/matches
```

GET Request

### Query Parameters

- `q` — Query (String) (Required)

### Description

Gets user suggestions that may match the query provided.

## Submit user suggestion 🛡️

> :warning: **THIS FEATURE IS PLANNED FOR DEPRECATION!**

```
/api/shop/requests
```

POST Request with body

```json
{"name":"Name","description":"Description","store_url":"https://www.example.com","image_url":"https://www.example.com","show_username":false}
```

`store_url` and `image_url` should be set to `null` when appropriate. `show_username` can be set to `true` or `false`.

### Description

Submits a user suggestion.

## Get Address 🛡️

> :warning: **This endpoint will respond with PII. Be careful about your sensitive information.**

```
/api/shop/address
```

GET Request

### Description

Gets the authenticated users address

> You will get a 204 No Content response if you have not authorized Macondo to your billing addresses

## Order Item 🛡️ 💣

> :warning: **This endpoint will order an item from the shop. Use extreme care when using it.**

```
/api/shop/orders
```

POST Request with body

```json
{"itemId":1,"quantity":1,"addressId":"addr!123456"}
```

You can get `itemId` from `id` at Get Shop Items and `addressId` at Get Address.

### Description

Buys one or multiple items from the shop.

### Example Response

(see the original canvas for the attached `example.json`)

# Explore Operations

## Get Explore Projects 🔑

```
/api/explore/projects
```

GET Request

### Query Parameters

- `sort` — String as `recently_updated`, `newest`, `popularity`, or `streak`
- `status` — String as `shipped` or `in_progress`
- `limit` — Number
- `type` — String as `software` or `hardware`
- `fruit` — String as `extra_fruity`, `Mango`, `Guava`, `Pineapple`, `Coconut`, `Papaya`, `Watermelon`, `Cocoa`, or `Avocado`
- `search` — String

### Description

Gets projects from users on Macondo.

## Get Explore Users 🔑

```
/api/explore/people
```

GET Request

### Query Parameters

- `sort` — String as `newest`, `popularity`, `recently_active`, or `streak`
- `limit` — Number
- `search` — String

### Description

Gets users on Macondo.

## Get Leaderboard 🔑

```
/api/explore/leaderboard
```

GET Request

### Query Parameters

- `type` — String as `referrals`, `gold`, `ships`, `hours`, or `upvotes`
- `limit` — Number

### Description

Gets the leaderboard for the type.

## Get Events 🔑

```
/api/explore/events
```

GET Request

### Query Parameters

- `limit` — Number

### Description

Gets current and upcoming events.

# Misc

## Get Authenticated User Info 🛡️ 🔑

> :warning: **This endpoint can respond with PII. Be careful about your sensitive information.**
>
> :information_source: **If you are using a Macondo API Key, this endpoint will withhold any PII.**

```
/api/auth/me
```

GET Request

## Get Notifications 🛡️ 🔑

```
/api/notifications
```

GET Request

### Query Parameters

- `limit` — number

### Description

Gets the notifications of the authorized user.

## Mark Notification as Read 🛡️

```
/api/notifications/:id/read
```

POST Request

### Example Response

```json
{"id":12345,"updated":true}
```

## Get NPS Eligibility 🛡️

```
/api/nps/eligibility
```

GET Request

### Example Responses

**If eligible:**

```json
{"eligible":true,"npsCount":1,"shippedCount":1,"unlockCondition":null}
```

In this example, the user has sent 1 NPS and shipped 1 project. `unlockCondition` is set to `null` because they are eligible.

**If not eligible:**

```json
{"eligible":false,"npsCount":2,"shippedCount":1,"unlockCondition":"ship_project"}
```

In this example, the user has sent more NPS submissions than ships, therefore they are not eligible.

## Send NPS 🛡️

> :information_source: Please be considerate. Don't send random junk. Anything you send via the NPS will be read by Macondo's staff.

```
/api/nps/submit
```

POST Request with body

```json
{"score":10,"doing_well":"string","can_improve":"string","anything_else":"string, optional"}
```

`score` should be a number between 1 - 10