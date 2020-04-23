# Session 12

## Software Quality in General

- Identify and list qualities of your MiniTwit system from the four perspectives (except of the transcendental) from the Kitchenham paper.

| Perspective        | Qualities                                        |
| ------------------ | ------------------------------------------------ |
| User view          | **Reliability**, Efficiency, Usability, Security |
| Manufacturing view | **Robustness**, Portability                      |
| Product view       | **Understandability**, Complexity, Modularity    |
| Value-based view   | **Resilience**                                   |

- Did you focus on any perspective or any qualities, perhaps even without being aware of it? If yes, list these.

  - Robustness (testing, CI/CD pipelines)
  - Reliability + Efficiency (SLA, measuring our endpoints with Datadog)
  - Resilience (Logging and monitoring)
  - Modularity (Code splitting, every code-file has a well-defined purpose)
  - Understandability (peer reviews)

- Rank the identified qualities per perspective by decreasing importance to you and provide an argument for why you choose certain as the most important.

  - The qualities in the table above have been ranked by importance to us.
    - **Reliability** is the most important _User view_ quality to us, as users will stop using the platform if it has a poor uptime.
    - **Robustness** is the most important _Manufacturing view_ quality to us, as it ensures constant specification fulfillment.
    - **Understandability** is the most import _Product view_ quality to us, as it enables fellow developers to understand the codebase and be productive as fast as possible. Furthermore, striving to write understandable code often leads to lower complexity.
    - **Resilience** is the most important _Value-based view_ to us, because it is the golden middle-way between what the user wants and what the production wants. We in this context understand resilience as resilience to attacks and internal failures, which both back the robustness and reliability of the system.

- Think about and discuss with your group fellows, how you can measure the qualities that you ranked the most important. That is, try to define a set of metrics that would allow to measure these (multiple metrics per quality can be possible).
  - **Reliability**: Probing the system every 5 minutes with Datadog allows to us to track uptime and be alerted of any downtime issues.
  - **Robustness**: Testing as part of CI/CD pipeline ensures that no existing code is broken with the addition of new code. This, of course, requires all components to actually have tests - they do in our case :)
  - **Understandability**: All pull requests require a peer developer's review and approval. This ensures that all new code are understandable by someone other than the code owner.
  - **Resilience**: Logging and monitoring are set in place to allow us to track the system and watch out for any abnormalities.

## How maintainable are your systems?

- How can you identify and measure *maintainability* of your MiniTwit systems?

  - Measuring maintainability is a difficult task, as the quality is hard to unambiguously specify. We can, however, keep an eye out for the testability of the code, the modularity (how easy different components can be switched out for others that fulfill the same purpose) and understandability (how easy it is for other developers to look at the codebase and understand what's happening).

- Is your MiniTwit system *maintainable*?

  - If yes, describe and argue for why it is?
    - Time shows that the system _is_ somewhat maintainable, as it is still running quite well after multiple months ...
  - If not, describe and argue for why it is not?
    - ... but having a team of multiple developers using a plethora of different tools makes maintenance more difficult. This is something we have attempted to alleviate somewhat with code reviews - but this still only includes two persons each time.

- Collect a set of characteristics that make your system *maintainable*. Try to include more than just the source code.
  - Clean source code
  - Logs and monitoring dashboard
  - Instructions on how to run tests in README

## Do you have Technical Debt in your systems?

Likely you already heard of the concept "Technical Debt". Without further reading describe:

1.  what is Technical Debt for you?
    - We think Technical Debt refers to how long it would take to rework the system away from easy hacks that have been made to make the system work _now._ The _debt_ part probably comes from the fact that the more easy hacks you do now, the longer it will take to rework to proper code down the line - and if bad code depends on other bad code, then this accumulates fast.
2.  describe how you could identify and measure it?
    - Try to identify future features and how resource consuming it would be to implement these.
    - Look at the existing code and somehow count the number of occurrences of poor code or bad patterns.

Now analyze software quality and technical debt of your MiniTwit with [SonarQube](https://www.sonarqube.org/) ([SonarCloud](https://sonarcloud.io/) is a readily available hosted version of SonarQube). Do the following once per group:

- Navigate to [https://sonarcloud.io/](https://sonarcloud.io/)
- Login via Github
- Add a new project by clicking the `+` sign on the top right of the window followed by `Analyze new project`
- And select the repository or the repositories that you want to assess.

After the analysis is complete, try to understand with the [documentation](https://docs.sonarqube.org/latest/user-guide/metric-definitions/#header-4) and if necessary with [Letouzey *"The SQALE method for evaluating technical debt"*](https://www.researchgate.net/profile/Jean_Louis_Letouzey/publication/239763591_The_SQALE_method_for_evaluating_Technical_Debt/links/0c9605357748774a21000000/The-SQALE-method-for-evaluating-Technical-Debt.pdf) what is presented as technical debt. Does that correspond to your understanding of technical debt?

- SonarQube reports that we have 5 code smells on our master branch. These, however, are only in the handed-out Python code, and as such, there are no code smells in our own codebase. The code smells include duplicate literals that could have been defined in constants, and unused local variables that should be removed.
- SonarQube counts "code smells" (which we called "poor code") and defines technical debt as the amount of time it would take to fix all the "code smells". This corresponds pretty well to our own understanding.
