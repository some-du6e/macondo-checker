import { app } from "./slack/slack.ts"



;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  app.logger.info("⚡️ Bolt app is running!")
})()


