# SotF Quest HUD

A lightweight and optimized quest HUD plugin for RPG Maker MZ.

This plugin allows you to display active quest objectives directly on the map using item descriptions and dynamic variable updates.

Designed to be simple, stable, beginner friendly, and compatible with most RPG Maker MZ projects.

---

# Features

- Multiple active quest HUDs
- Dynamic quest progress using variables
- Automatic text wrapping
- Lightweight and optimized
- Save/load compatible
- Customizable colors, font sizes, opacity, and positioning
- Easy plugin commands
- Beginner friendly setup

---

# Requirements

- RPG Maker MZ

No additional plugins required.

---

# Installation

1. Download the plugin file:

```text
SotF_QuestHUD.js
```

2. Place the file inside your project folder:

```text
js/plugins/
```

3. Open RPG Maker MZ.

4. Open:

```text
Plugin Manager
```

5. Add:

```text
SotF_QuestHUD
```

6. Turn the plugin ON.

---

# Plugin Commands

## Show Quest HUD

Displays a quest in the HUD.

| Parameter | Description |
|---|---|
| Item ID | The database item used as the quest |

---

## Hide Quest HUD

Removes a specific quest from the HUD.

| Parameter | Description |
|---|---|
| Item ID | The quest item to remove |

---

## Hide All Quest HUDs

Removes all active quests from the HUD.

---

# How It Works

The plugin reads quest information from items in the database.

Each quest is simply a normal item with a name and description.

The item description becomes the quest objective shown in the HUD.

This means you can easily create and update quests without complicated systems.

---

# Beginner Quest Setup Example

## Step 1 — Create a Quest Item

Open:

```text
Database → Items
```

Create a new item.

Example:

| Field | Value |
|---|---|
| Name | Shadow Children |
| Description | Talk to the shadow children. Talked to: \V[1]/5 |
| Price | 0 |
| Consumable | OFF |

Important:

```text
\V[1]
```

means:

"Show the value of Variable 1"

So if Variable 1 becomes 3, the player will see:

```text
Talked to: 3/5
```

---

## Step 2 — Show the Quest HUD

Create an event.

Use:

```text
Plugin Command → SotF_QuestHUD → Show Quest HUD
```

Select the Item ID of your quest item.

---

## Step 3 — Update Progress

Whenever the player talks to a child:

```text
Control Variables → Variable 1 += 1
```

The HUD updates automatically.

---

## Step 4 — Remove the Quest

When completed:

```text
Plugin Command → SotF_QuestHUD → Hide Quest HUD
```

or

```text
Hide All Quest HUDs
```

---

# Recommended Usage

This plugin works especially well for:

- Main quests
- Side quests
- Collection objectives
- Hunt missions
- Relationship events
- Exploration goals

---

# Compatibility

Tested with:

- RPG Maker MZ
- Default RPG Maker systems
- Most UI plugins

May conflict with plugins that heavily modify map HUD rendering.

---

# Credits

Plugin by dranahel

If you use this plugin in a commercial or free project, credit is appreciated.

---

# License

MIT License

Free for commercial and non-commercial use.

You may:

- Use
- Modify
- Share
- Include in commercial games

Credit appreciated but not required.

---

# Version

Current version: 2.6
