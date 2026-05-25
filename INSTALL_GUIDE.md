# SotF Quest HUD - Quick Setup Guide

## Basic Idea

Every quest is just an RPG Maker item.

The item description becomes the quest objective shown on screen.

You can use variables to update progress dynamically.

---

# Simple Example Quest

## Goal

Talk to 5 shadow children.

---

# Step 1 — Create Variable

Open:

Database → Variables

Create:

```text
Variable 1 = Shadow Children Helped
```

---

# Step 2 — Create Quest Item

Open:

Database → Items

Create:

| Field | Value |
|---|---|
| Name | Shadow Children |
| Description | Talk to the shadow children. Talked to: \V[1]/5 |

---

# Step 3 — Show Quest HUD

In an event:

Plugin Command → Show Quest HUD

Choose the item ID.

The quest now appears on screen.

---

# Step 4 — Increase Progress

When player talks to a child:

```text
Control Variables: Variable 1 += 1
```

The HUD updates automatically.

---

# Step 5 — Finish Quest

When Variable 1 reaches 5:

Use:

```text
Plugin Command → Hide Quest HUD
```

or show a new quest.

---

# Tips

## Multiple Quests

You can display multiple quests at the same time.

---

## Dynamic Counters

You can use:

```text
\V[2]
\V[3]
\V[10]
```

Any variable works.

---

## Good Uses

- Kill counters
- Collect items
- Relationship events
- Exploration objectives
- Story progression

---

# Recommended Workflow

1. Create variable
2. Create item
3. Show HUD
4. Update variable
5. Hide HUD when complete

Very fast and easy once set up.
