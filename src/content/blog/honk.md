---
title: "I built a GitHub-to-Slack tool because the existing ones frustrated me"
description: "Existing GitHub-Slack integrations are either too dumb, too expensive, or both. So I built Honk — partly to fix real problems, partly because building things is fun."
date: 2026-03-22T12:00:00
tags: ["side-projects", "developer-experience", "github", "slack"]
featured: true
---

Every engineering team I've been on has gone through the same cycle with GitHub and Slack. Someone installs the GitHub Slack app, points it at a channel, and within a day the channel is a wall of noise that everyone mutes. Or you try one of the third-party tools, get it working, and then discover you're paying $15/user/month for what is essentially a webhook forwarder with a nicer UI. For a 20-person team, that's $3,600 a year to send messages to Slack. Come on.

I tried the alternatives. GitHub's built-in Slack integration is all-or-nothing — no filtering, no threading, no awareness of who actually needs to see what. The paid tools like Axolo or LinearB add features but charge per-seat, and the pricing scales in a way that feels extractive for what is, at its core, a pretty simple data pipeline problem. And most of them are opinionated in ways that didn't match how my teams actually work.

So I built [Honk](https://app.gethonk.io). Partly because I wanted something better. Partly because I wanted to have fun building it.

## What annoyed me about existing tools

The fundamental limitation of every GitHub-Slack tool I've used is that they treat notification routing as a simple mapping problem: events from repo X go to channel Y. But that's not how teams work.

A frontend engineer doesn't care about infrastructure PRs. A tech lead wants to see all PRs but only get pinged for approvals. The on-call engineer needs CI failures immediately but can ignore review comments. And everyone wants the related activity — reviews, comments, CI results — threaded under the original PR notification so Slack doesn't become a timeline of disconnected updates.

The tools that do support filtering either charge you more for it or make you write YAML configs that nobody maintains. And almost none of them handle auto-mentions properly — they either don't do it at all, or require you to manually maintain a GitHub-to-Slack user mapping table that goes stale the moment someone joins or leaves.

The pricing bothered me most. Per-seat pricing for a notification router is hard to justify. The cost of processing a webhook is fractions of a cent. The value is real, but it doesn't scale linearly with headcount — a 5-person team and a 50-person team use roughly the same infrastructure. Charging per seat is a business model choice, not a cost-driven one, and it's one that makes the tool harder to adopt because someone has to justify the line item.

## Building Honk (the fun part)

I wanted an excuse to build something end-to-end anyway. I'd been doing a lot of backend and infrastructure work, and I missed the feeling of building a product from scratch — choosing the stack, designing the data model, writing the frontend, figuring out billing. Side projects are how I stay sharp on the parts of engineering that a staff role can insulate you from.

Honk sits between GitHub webhooks and Slack. You install a GitHub App on your org, connect Slack, and then build rules.

A rule has three parts: **what to watch** (event type), **when to match** (filter conditions), and **where to send** (Slack channels + who to mention). The filter conditions use DNF logic — groups of AND conditions joined by OR — which sounds academic but maps perfectly to how people actually think about notifications: "notify me about PRs that touch the payments repo AND are labeled urgent, OR any PR where I'm a requested reviewer."

The part I'm most pleased with is **auto-mentions**. Honk resolves GitHub usernames to Slack users automatically (by email matching) and @mentions the right people — the PR author, requested reviewers, or assignees — without anyone having to maintain a mapping table. When a review comes in, it threads under the original PR notification, mentions the author, and keeps the channel clean.

Reviews get their own config layer. You can enable review notifications per rule and filter by state — maybe you only want to know about approvals and changes requested, not every "LGTM" comment. You can even set different auto-mention rules for reviews versus the original PR notification.

I priced it flat — per org, not per seat. Free tier gets you one channel with PR events. $100/month gets you five channels, all event types, and the metrics dashboard. $200/month for unlimited. If you think that's too much, fair enough, but at least the number doesn't change when you hire your next engineer.

## The metrics rabbit hole

Once I had the notification pipeline working, I realised I was sitting on a goldmine of data. Every webhook event that flows through Honk tells you something about how your team works: how long PRs stay open, how fast reviews happen, how often CI fails, who's doing the most reviewing.

So I built a metrics dashboard. It started as "let me just count merged PRs" and ended up with eight summary cards, three trend charts, a reviewer leaderboard, and a filterable PR table. Scope creep, absolutely, but it was the most fun I'd had coding in months.

The metrics I find most useful aren't the vanity ones. It's things like:

- **Time to first review**: This correlates most directly with developer frustration. A PR that sits unreviewed for a day might as well sit for a week — the author has context-switched and the review becomes a chore for everyone.
- **Cycle time trends**: Not the absolute number (which varies wildly by PR size and type), but the trend. If it's creeping up week over week, something systemic is going wrong.
- **Reviewer distribution**: The leaderboard isn't about gamification. It's about spotting when one person is doing 60% of the reviews and burning out while others aren't pulling their weight.

One thing I got wrong initially was CI duration tracking. I was computing it from per-PR check run data, but GitHub's `check_suite` webhook often sends an empty `pull_requests` array — so most CI runs were invisible. I had to decouple CI metrics entirely and track check suites at the org level, regardless of whether they're linked to a specific PR. Sometimes the right abstraction isn't obvious until you see the data not showing up.

## Things I learned the hard way

**Webhook payloads are inconsistent.** GitHub sends review states lowercase in some contexts and uppercase in others. The same field might be present or absent depending on the event action. You can't trust the shape of the data — you have to normalize aggressively on ingestion. I shipped a bug where review metrics showed zero approvals because I was storing the state as-is from GitHub and filtering for uppercase "APPROVED." Took a data migration to fix.

**Caching is essential but invalidation is the real problem.** The metrics dashboard queries across potentially thousands of PRs with time range filters. Without caching, every page load is a full table scan. But every incoming webhook needs to invalidate the right cache keys, and "the right cache keys" depends on which org, which time range, and whether you're filtering by repository. I ended up with a simple pattern: invalidate all cache keys for an org whenever any metric changes. It's not surgical, but it's correct, and correctness matters more than cache hit rate when you're showing people numbers about their team.

**Building billing is more fun than expected.** I'd always treated Stripe integration as a chore, but designing a pricing model from scratch — deciding what to gate, what to give away, how to communicate upgrade paths — was genuinely interesting. It forces you to think about your product from the customer's perspective in a way that pure feature building doesn't.

## The stack

Backend is Django 5.2 on Python 3.13, which continues to be the fastest way I know to build a robust API with proper auth, migrations, and admin tooling. Frontend is React with TypeScript, Vite, and shadcn/ui — the standard stack that just works. Both deployed on Fly.io.

I use Stripe for billing, django-allauth for GitHub OAuth, and structlog for logging. Nothing exotic. The most interesting architectural decision was keeping the webhook processing synchronous rather than queueing events. At current scale, processing a webhook takes single-digit milliseconds, and the simplicity of "process it in the request" beats the operational complexity of a message queue. That'll change eventually, but premature optimization is still the root of all evil.

## Try it — free for 3 months

Honk is live at [app.gethonk.io](https://app.gethonk.io). I'm offering **3 months free on any paid plan** — use the coupon code `GETHONK` at checkout. No strings attached. I'm still early and I want real teams using it so I can learn what actually matters and what's missing.

Fair warning: this is a young product, and as with anything early, things might not work exactly as expected. If you hit a rough edge — and you probably will — reach out at [dragos@gethonk.io](mailto:dragos@gethonk.io) and I'll get it sorted out. I'm a one-person team right now, which means there's no support queue — just me, fixing things quickly because I care about this working well.

Whether it's a bug, feedback, a feature request, or just to tell me what you think is missing — I want to hear it. The best product decisions I've made so far came from watching how other people use the thing differently than I expected.

And if you're a developer who's been looking for an excuse to build something end-to-end, I can't recommend it enough. The space between "I'm annoyed by this tool" and "I'll build my own" is where the most satisfying projects live.
