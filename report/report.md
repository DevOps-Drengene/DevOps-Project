# DevOps, Software Evolution & Software Maintenance – Exam Report

**Course code:** BSDSESM1KU

**Submission date:** May 12th 2020

**Group**: K

**Students:**

- Caspar Sloth Olesen (cole@itu.dk)
- Dag Bjerre Andersen (daga@itu.dk)
- Emil Joakim Jensen Bartholdy (emba@itu.dk)
- Gustav Kofoed Clausen (gucl@itu.dk)
- Lasse Vilhelm Raatz (lraa@itu.dk)

# Introduction

This report constitutes the complete documentation of the system *ITU-MiniTwit* (henceforth just *MiniTwit*), a [*Twitter*](https://twitter.com) clone developed and maintained throughout the course *DevOps, Software Evolution and Software Maintenance* at the IT University of Copenhagen. MiniTwit is a rather simple client-server web application on which users should be able to post tweets and read each others' timelines. From session four until the last session, a *simulator* set up by the course managers to mimic user behavior has been interacting with our system.

The application is written entirely in *JavaScript* and containerized using *Docker*. Throughout the course, the application has been hosted on the cloud platform *DigitalOcean*.

The report contains three chapters. First, we present the *System Perspective*, in which the technical aspects of the system are thoroughly described. Secondly, we present the *Process Perspective*, in which the aspects relating to the development process are elaborated upon. Finally, we present the *Lesson Learned Perspective*, in which we reflect on our learnings during the course.

# Table of Contents

| Chapter                     | File                                               |
|-----------------------------|----------------------------------------------------|
| System Perspective          | [system-perspective.md](./system-perspective.md)   |
| Process Perspective         | [process-perspective.md](./process-perspective.md) |
| Lessons Learned Perspective | [lessons-learned.md](./lessons-learned.md)         |

# References
Jabbari, Ramtin & Ali, Nauman & Petersen, Kai & Tanveer, Binish. (2016). *What is DevOps?: A Systematic Mapping Study on Definitions and Practices*. 1-11. 10.1145/2962695.2962707.

Gene Kim, Patrick Debois, John Willis, and Jez Humble. (2016). *The DevOps Handbook: How to Create World-Class Agility, Reliability, and Security in Technology Organizations*. IT Revolution Press.
