# Egg Guardian Game 🥚🛡️

A simple HTML/CSS/JS-based game that demonstrates the use of synchronous and asynchronous loops in game development.

## 🕹️ Game Concept

In **Egg Guardian**, your goal is to protect randomly spawned **eggs** on the ground from invading **monsters**. The monsters try to push eggs out of their way, and once a **larva** hatches from an egg, it becomes vulnerable — if it comes in contact with a monster, the monster **eats the larva**!

This game is built to demonstrate the difference between synchronous and asynchronous loops in JavaScript using a visual, interactive simulation.

## 🎮 Gameplay

- **Eggs** spawn randomly across the game field.
- **Monsters** roam the field and push eggs aside if they’re in the way.
- If an egg hatches into a **larva**, it begins to move.
- **Monsters eat larvae** on contact.
- The objective is to prevent larvae from being eaten for as long as possible.

## ⚙️ Technologies Used

- **HTML** – Game structure and layout.
- **CSS** – Visual styling.
- **JavaScript** – Game logic and rendering loops.

## 🔄 Sync vs Async Loops

This game includes two versions:

- **Synchronous Loop Version**: Uses traditional `requestAnimationFrame()` with blocking logic for game updates.
- **Asynchronous Loop Version**: Uses `async/await`, `setTimeout`, or other non-blocking constructs to demonstrate how asynchronous behavior affects gameplay flow and responsiveness.


## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/egg-guardian-game.git
cd egg-guardian-game


