# fly.io: Scheduled machines

At some point during 2023, the folks at fly.io updated their documentation to support scheduled machines. They had
already introduced machines prior to that, but that, at least to me, a basic user only interested in the shortest path
to a deployed service, seemed not too dissimilar to their v1 apps.

The release of scheduled machines changed that perception. As I'm writing this, I've gone back and forth trying to piece
together what little bits of knowledge I could find online. Their documentation is fairly lacking in this regard, most
information being in community threads on their forum.

This is going to be a fairly short, introductory post. It assumes some familiarity with [fly.io](https://fly.io),
`Docker` and the entire process of deploying a Docker container to fly. If you're not familiar with fly, I'd recommend
reading their [documentation](https://fly.io/docs/) first. They've even put together
a [Getting started](https://fly.io/docs/getting-started/) that you can interactively work through.

## My use case

To understand what I was looking for, it was a way of running a container on a schedule. I had a simple (well, for this
exercise at least) Python script that I wanted to run once a day. `Scheduled machines` support hourly, daily or monthly
intervals. If you're looking for more granular controls, you might want to look at something like `cron` or `supercron`
solutions.

## See also

TODO: Add some short details on `cron` and `supercron` at the end
