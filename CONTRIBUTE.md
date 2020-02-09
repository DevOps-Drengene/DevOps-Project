# Contribution guide

This document summarizes how work is organized and structured using Git to lay out the common guidelines for contributions to this project.

## The project's structure in repositories

The project is split up in two distributed repositories – one for the frontend and backend part of the application. This is done to completely separate the two subsystems from each other, and let the repositories be managed by their own version control setup to control releases and such independently.

The repositories, hosted on GitHub, support an intended centralized workflow in which each one of them acts as a shared repository that all contributors contribute their work to.

Link to frontend repository: https://github.com/caspar-itu/minitwit-react-frontend
Link to backend repository: http://github.com/emilbartholdy

## Integrating contributions

All contributions must be submitted via pull requests on GitHub to support the centralized workflow.

The next section goes in detail with the branching model, but it is important to note that contributions are made in commits on separate branches, other than the master branch, to keep work separated and avoid change conflicts. The master branch is kept protected which prevents contributors to commit changes directly onto the branch that is intended to be kept up-to-date with the latest approved changes.
Thus, all contributions must be submitted as a pull request into the master branch or any other branch for that matter.

The whole project team is responsible for integrating and reviewing the submitted pull requests.
As a general rule, <u>one</u> team member with the required knowledge to review the changes within the specific subsystem is required to review the pull request, and if approved, merge the changes. Without this approval, the changes cannot be merged.

## The branching and commit model

**Branches**

The repositories follow a topic-based branching model, which means that branches are short-lived and created for a particular feature, bugfix, or other related work.
The topic is based on a GitHub issue that describes what needs to be done – i.e. "write simulator endpoint". Thus, a branch to implement this change is created, and these changes are local to this one feature.

**Commits**

Each contributor should strive to keep their commits as "atomic" as possible for an easier rollback structure and history tracking as described in this [article](https://www.freshconsulting.com/atomic-commits/). The approach is to:

* Commit each fix or task as a separate change.
* Only commit when a block of work is complete.
* Joint commit for layout file, code-behind file, and additional resources.

It then becomes easier to roll back without affecting other changes, make changes on the fly, and merge features to other branches from commits, when following this approach.