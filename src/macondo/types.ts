type fruit = 
    "Mango" | "Pineapple" | "Papaya" | "Cocoa" // software
    | "Guava" | "Coconut" | "Watermelon" | "Avocado" // hardware

type user = {
    id: string
    image: string
    username: string
    slack_id: string
  }


type project = {
  id: number
  user_id: string
  name: string
  type: "software" | "hardware"
  description: string
  fruit: fruit
  level: "3"
  stage: 3
  demo_url: null
  thumbnail_url: string
  repository_url: string
  hackatime_projects: string[]
  is_fork: boolean
  guide: null
  html_content: null
  css_content: null
  readme_content: null
  last_html_sha: null
  last_css_sha: null
  invite_code: null
  project_streak_days: 6
  last_worked_date: "2026-06-25"
  auto_use_streak_freezes: true
  cart_screenshots: null
  build_cost_cents: null
  next_ship_needs_funding: false
  next_ship_is_build_complete: false
  next_ship_used_ai: boolean
  next_ship_ai_usage_description: string
  next_ship_is_update: false
  next_ship_update_description: null
  next_ship_reviewer_note: null
  created_at: string
  updated_at: string
  owner: user
  journals: [
    {
      id: 13818
      short_brief: "Update"
      long_brief: '![image](https://cdn.hackclub.com/019ef10e-9fe1-7e02-8ba7-9bb89b7d028c/image.png)\nits looking pretty good, i need to open the popup thing and also make the streaks work and maybe put the stage tree thing at the par\n\nalso thank you claude for making each plant a different name so i had to manually go and dig for the correct name \n\n```javascript\nunction convertfruittoshit(fruit) {\n        if (fruit == "Papaya") { return "papaya/icon_interior.webp" }\n        if (fruit == "Coconut") { return "coco/icon_interior.webp"}\n\n        if (fruit == "Pineapple") { return "pineapple/icon.webp"}\n        if (fruit == "Mango") { return "mango/icon.webp" }\n        \n    }\n```'
      hours: 0
      created_at: "2026-06-22T20:41:52.105Z"
      archived: false
      archived_at: null
      content_language: "en"
      author_id: "55713394-2958-4465-b827-64651bf50536"
      author_username: "Karim"
      author_slack_id: "U082DRXPMF1"
      author_image: "https://avatars.slack-edge.com/2026-06-22/11448835118112_10c745b85b1d97799c45_512.png"
    },
    {
      id: 13751
      short_brief: "wef4r5thrtghqweSDREQ"
      long_brief: "![image](https://cdn.hackclub.com/019eeffe-fb4c-79a2-8494-68313827e8ca/image.png)\nfound something atleast with codex taht does that\n\n>..........................................................................................."
      hours: 0
      created_at: "2026-06-22T15:46:35.609Z"
      archived: false
      archived_at: null
      content_language: "en"
      author_id: "55713394-2958-4465-b827-64651bf50536"
      author_username: "Karim"
      author_slack_id: "U082DRXPMF1"
      author_image: "https://avatars.slack-edge.com/2026-06-22/11448835118112_10c745b85b1d97799c45_512.png"
    },
    {
      id: 13619
      short_brief: "dnshjksfwdjokwefjiofwejfiowejiofwejiofwe"
      long_brief: "why is there 0 extension compat. atkeast stadance has some data attributes but this has nothing. \n\ni have to show the game world and hide the project and stuff and do al ot of stuff\nalso bc of zero extension compat i ran out of 3 accounts 5 hour limit"
      hours: 0
      created_at: "2026-06-22T00:13:22.433Z"
      archived: false
      archived_at: null
      content_language: "en"
      author_id: "55713394-2958-4465-b827-64651bf50536"
      author_username: "Karim"
      author_slack_id: "U082DRXPMF1"
      author_image: "https://avatars.slack-edge.com/2026-06-22/11448835118112_10c745b85b1d97799c45_512.png"
    },
  ]
  viewer_is_owner: true
  viewer_can_edit: true
  activeShip: null
  needsChangesShip: null
  latestActiveGrant: null
  has_active_grant: false
  hasPreviousShippedShip: false
  permRejected: false
  is_extra_fruity: false
  pendingFruit: null
  previousShippedHackatimeHours: null
  unshippedJournalHours: 0
  streakStatus: "active"
}
