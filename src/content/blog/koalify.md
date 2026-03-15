---
title: "Koalify: Nine Years From Thesis to Library"
description: "How a master's thesis on logic programming for Python eventually became a small, focused open-source library."
date: 2026-03-15T10:00:00
tags: ["python", "koalify", "open-source"]
---

Back in 2017, I wrote my master's thesis at Imperial College London. It was called **NoLog** — a declarative logic programming system for Python, essentially a Pythonic reimplementation of Prolog's core ideas: predicates, unification, resolution. The kind of thing you build when you're deep in an AI programme and convinced that logic programming deserves better tooling.

NoLog worked. It was also never released properly. It lived in a repo, did its job for the thesis, and that was that. If you're curious about the academic side, the [full thesis is available here](/nolog-thesis.pdf).

But the ideas stuck with me.

## The problem that keeps coming back

Over the years, across multiple jobs and codebases, I kept running into the same pattern: I have data models, and I need to express logical conditions over them. Not just "is this field equal to X" — composable, readable rules that combine with AND, OR, NOT, and that someone can look at six months later and still understand.

I'm fairly sure anyone who's worked on a non-trivial Python backend has been here. You start with a couple of if-statements, then the requirements get more complex, and before long you've got a tangled mess of conditionals that nobody wants to touch. Or you write a small predicate system, feel clever about it, and then leave it behind when you change jobs.

That's exactly what I kept doing. Every time, I'd write something ad-hoc. Always drawing from the same well — the ideas from NoLog, stripped down to just the predicate evaluation bits.

Python and Pydantic have become phenomenal for data modelling. Pydantic in particular has made it trivially easy to define, validate, and work with structured data. But neither Python nor Pydantic give you a way to express logical sentences *about* those models — and justifiably so. That's not their job.

But it is a gap. And I got tired of filling it with throwaway code.

## So I built koalify

[Koalify](https://github.com/DragosDumitrache/koalify) is the distillation of all those ad-hoc implementations into a single, focused library. A predicate DSL for Python — zero dependencies, works with any object that has attributes (Pydantic models, dataclasses, plain classes, whatever).

It looks like this:

```python
from koalify import F

is_eligible = (
    (F.status == "active")
    & (F.age >= 18)
    & F.role.in_("admin", "moderator", "editor")
    & ~(F.name == "root")
)

is_eligible(user)  # True or False
```

That's it. `F` gives you field references, comparison operators produce criteria, `&` / `|` / `~` compose them. Rules are immutable, composable, and readable. You can build them dynamically from lists of conditions with `all_of()` and `any_of()`. They work on nested fields, list indices, dictionary keys — whatever your models look like.

The thing I cared about most was that it's **not prescriptive**. It doesn't force you into a framework, it doesn't require you to inherit from a base class, it doesn't couple to Pydantic or any other library. It's just predicates. Plug it in wherever you need rule evaluation and it stays out of your way.

## What it isn't

Koalify isn't NoLog. It doesn't do unification, it doesn't do resolution, it doesn't try to be Prolog. It's a much smaller, more practical thing — the subset of those ideas that I actually kept reaching for in real-world code.

If I ever need the full logic programming machinery again, that's a different project. Koalify solves the problem I've been solving repeatedly for nine years, and it solves it once.

## Where it goes from here

Honestly, I don't know yet. The library works for the use cases I've had, but I'm sure there are patterns and needs I haven't thought of. That's the whole point of releasing it — the more people use it, the more it'll evolve.

If you work with Python data models and find yourself writing ad-hoc rule evaluation logic, give it a try. And if something doesn't fit your use case, [open an issue](https://github.com/DragosDumitrache/koalify/issues) or send a PR. Feature requests are genuinely welcome — I'd rather shape this around real needs than guess at what might be useful.

```bash
pip install koalify
```
