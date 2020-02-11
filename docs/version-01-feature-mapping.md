# Feature mapping

This document contains all the features of the initial version of *ITU-MiniTwit* before it was refactored to another tech-stack in the following version (version 02 in session 02).

## Features

### Public timeline

**Route**

`/public`

**Description**

* ALL messages/tweets (hereafter "tweet(s)") from ALL users is shown. This includes the current user's tweets, as well as tweets from all users whether he or she follows the author of the tweet.
* The tweets include the name of the author (including a link to his/her profile), the message of the tweet, and the timestamp of creation.
* The user can click on the author of the tweet to this profile's timeline.

**Access**

It is NOT a requirement to be logged in to view this page.



### Register

**Route:**

`/register`

**Description:**

* Allows the user to sign up for the service. The registration form contains the following requirements:
  * Username is required and must be unique across all user accounts.
  * Email is required and must contain `@` in its value.
  * A password is required.
  * The repeat password field is required and must match the 'password' field.

* If an error occurs in the sign up then a specific error message explaining the error is shown to the user (e.g. username is already taken).

* After completing the sign-up, the user is navigated to the login page.

**Access:**

It is NOT a requirement to be logged in to view this page.



### Login

**Route:**

`/login`

**Description:**

* It allows the user to sign in to the service.
* All fields in the form (i.e. username and password) are required, and the credentials must match an existing user that the user wishes to log in as.
* If an error occurs in the sign-in then a specific error message explaining the error is shown to the user (e.g. invalid username).
* After completing the sign-in, the user is redirected to his/her timeline.

**Access:**

It is NOT a requirement to be logged in to view this page.



### Logout

**Route:**

`/logout`

**Description:**

It allows the user to sign out of the service. It destroys the user session and redirects the user to the public timeline.

**Access:**

It is a requirement to be logged in to sign out, however, any user can access the page.



### Personal timeline

**Route:**

`/`

**Description:**

* The current user's tweets including tweets from all users that he or she follows are shown.
* The tweets include the name of the author (including a link to his/her profile), the message of the tweet, and the timestamp of creation.
* The user can write a personal tweet.

**Access:**

It is a requirement to be logged in to view this page. If the user is not signed in, then he or she is redirected to the public timeline.



### **Profile timeline**

**Route:**

`/{username of user}`

**Description:**

* Only the tweets posted by the given user profile are shown.
* The tweets include the name of the author (including a link to his/her profile), the message of the tweet, and the timestamp of creation.
* If the current user does not follow the given user, then it is possible to click on a button to follow this user. Otherwise, a button to unfollow the user is shown.
  If the current user accesses his/her profile, then it is not possible to follow/unfollow him-/herself.

**Access:**

It is a requirement to be logged in to view this page. If the user is not signed in, then the application crashes which has been identified to be a bug in the application.

