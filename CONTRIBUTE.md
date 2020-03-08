# Contribution guide

This document summarizes how work is organized and structured using Git to lay out the common guidelines for contributions to this project.

## The project's repository setup

The whole project is gathered in this mono repository with both the frontend and backend part of the application, as well as all tests. This is done to have the whole application versioned as one large package, and enables it to be deployed as a single unit. 
The repository, hosted here on GitHub, support an intended centralized workflow in which it acts as a shared repository that all contributors contribute their work to.

## Integrating contributions

All contributions must be submitted via pull requests on GitHub to support the centralized workflow.

The next section goes in detail with the branching model, but it is important to note that contributions are made in commits on separate branches, other than the master branch, to keep work separated and avoid change conflicts. The master branch is kept protected which prevents contributors to commit changes directly onto the branch that is intended to be kept up-to-date with the latest approved changes.
Thus, all contributions must be submitted as a pull request into the master branch or any other branch for that matter.

The whole project team is responsible for integrating and reviewing the submitted pull requests.
As a general rule, <u>one</u> team member with the required knowledge to review the changes within the specific subsystem is required to review the pull request, and if approved, merge the changes. Without this approval, the changes cannot be merged.


**Auto releases**  
Whenever an approved PR is merged to master, and the changes has passed the CI/CD pipeline and thus deployed to the production server, then the latest commit on master will be tagged with the latest version number and a GitHub release will be created.
To support correct version-numbering, it is important that the title of the PR-merge commit contains a *version-tag* that will determine what part of the version that will be incremented (i.e. major, minor, and patch).  
A general guideline is listed below.

* Major:
  * Version-tag: `#major`.
  * Example of PR-merge commit title: `Change REST API to V2 #major`.
  * Requirement for use of tag:
    * API changes.
    * Versions that are incompatible with other versions.
* Minor:
  * Version-tag: `#minor`.
  * Example of PR-merge commit title: `Implemented tweet-flagging feature #minor`.
  * Requirement for use of tag:
    * New features/functionality.
* Patch:
  * Version-tag: `#patch`.
  * Example of PR-merge commit title: `Optimized calls to DB #patch`.
  * Requirement for use of tag:
    * Bug fixes.
    * Refactoring.
    * Small code changes.

## The branching and commit model

**Branches**

The repository follow a topic-based branching model, which means that branches are short-lived and created for a particular feature, bugfix, or other related work.
The topic is based on a GitHub issue that describes what needs to be done – i.e. "write simulator endpoint". Thus, a branch to implement this change is created, and these changes are local to this one feature.

**Commits**

Each contributor should strive to keep their commits as "atomic" as possible for an easier rollback structure and history tracking as described in this [article](https://www.freshconsulting.com/atomic-commits/). The approach is to:

* Commit each fix or task as a separate change.
* Only commit when a block of work is complete.
* Joint commit for layout file, code-behind file, and additional resources.

It then becomes easier to roll back without affecting other changes, make changes on the fly, and merge features to other branches from commits, when following this approach.
