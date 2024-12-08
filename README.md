# DevCycle Feature Flag Challenge DEV Challenge

[DevCycle Feature Flag Challenge DEV Challenge][4] is a project about building an app that showcases the most unique, creative, or fun way to use feature flags in an application by leveraging a [DevCycle SDK][1], [OpenFeature Provider][2] or [the API][2]!

This project will not be maintained after the DEV Challenges is finished. Feel free to fork and maintain your own version.

[1]: https://docs.devcycle.com/sdk/
[2]: https://docs.devcycle.com/integrations/openfeature
[3]: https://docs.devcycle.com/management-api/
[4]: https://dev.to/challenges/devcycle

## What are DEV Challenges?

DEV Challenges are like miniature Hackathons, and provide a fun opportunity for you to build up experience using new tools or to publicly show off your best skills to the community, potential employers and more. You can find more information about DEV Challenges [here](https://dev.to/challenges).

## What I Built

The app that I built for this challenge is a Trivia App that allows users to answer multiple-choice trivia questions. The app features a backend built with FastAPI and a frontend using HTML, CSS, and JavaScript. The backend serves trivia questions and handles user answers, while the frontend provides an interactive interface for users to engage with the trivia questions.

### Features Flag

- Time Limit - A question must be answered within a given time limit. Based on the user's difficulty level, the time limit is adjusted.
- Difficuliy - When a user answers a question correctly, they add to their answer streak. Based on the user's streak, the app adjusts the difficulty of the questions.
- Score Multiplier - When a user answers a question correctly, they earn points. The score multiplier feature allows users to earn more points for answering questions within the given time limit.

## Live Demo

You can view the live demo of the app [here](https://bert-cafecito.github.io/devcycle-feature-flag-challenge/).

## My DevCycle Experience

Integrating DevCycle into my app was an insightful experience. Initially, understanding how to effectively use feature flags was challenging. Feature flags allow you to enable or disable features without deploying new code, which is powerful but requires a good grasp of the system.

One of the key challenges was learning and understanding how to properly set up a feature with the DevCycle platform. After a few attempts, I was able to gain a better understanding of how to create and manage features using the DevCycle platform. I accomplished this by setting up variations for variables on features to create a more dynamic experience for users.

Another key challenge was learning how to use user targeting to personalize the experience for different users. By leveraging DevCycle's user targeting capabilities, I was able to create a more dynamic and engaging trivia experience. Here's how I accomplished this:

- **Feature Flag Evaluation**: I used targeting rules based on custom properties that I set up for the project. This enabled me to present different variables for each feature based on the user's progress in the trivia game.

- **Dynamic Adjustments**: Based on the feature flag values, I adjusted the trivia questions' difficulty and time limits to create a personalized experience for each user. This made the app more engaging and challenging for users with different skill levels.

Overall, using DevCycle's feature flags evaluation and user targeting capabilities allowed me to create a more personalized and dynamic trivia app, enhancing the user experience.

## Suggestions for Improving DevCycle

Based on my experience, here are a few suggestions for improving DevCycle:

- **Enhanced Documentation**: Providing more detailed documentation and examples on setting up and managing feature flags would help new users get up to speed more quickly.
- **SDK Key Permissions**: I would to see a section explaining how to the client SDK key permissions is set up. Looking at the documentation, I couldn't find a clear explanation on the permissions for SDK keys. At enterprise level, I feel that CISOs would like to know what permissions are being granted to the SDK keys.

By addressing these areas, DevCycle can further enhance its platform and provide an even better experience for its users.

## Support

If you would like to support this project or me, you can do so in the following ways:

### Follow Me on Social Media

- [**Bluesky**](https://bsky.app/profile/bert-cafecito.bsky.social)
- [**Dev Community**](https://dev.to/bert-cafecito)
- [**GitHub**](https://github.com/bert-cafecito)


### Star the Repository

If you find this project useful, please consider starring the repository on GitHub. Starring a repository helps increase its visibility and lets others know that the project is valuable. It also provides motivation and support to the maintainers to continue improving the project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.