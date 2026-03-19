import React from "react";
import { useMemo, useState } from "react";
import Entity from "./Entity.jsx";
import GameOver from "./GameOver.jsx";
import Log from "./Log.jsx";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Clamp health to keep it in the valid range {0, 100}
function clampHealth(value) {
  return Math.max(0, Math.min(value, 100));
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: `takes ${damage} damage`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: `heals ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [logs, setLogs] = useState([]);
  const [round, setRound] = useState(0);

  // Computed winner text based on current health values
  const winner = useMemo(() => {
    if (monsterHealth <= 0 && playerHealth <= 0) {
      return "It is a draw!";
    }
    if (monsterHealth <= 0) {
      return "You won!";
    }
    if (playerHealth <= 0) {
      return "You lost!";
    }
    return null;
  }, [monsterHealth, playerHealth]);

  // Special attack is available every 3 rounds
  const canUseSpecialAttack = round !== 0 && round % 3 === 0;

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  // Store a new log item at the top of the list
  function addLog(log) {
    setLogs((previousLogs) => [log, ...previousLogs]);
  }

  // Start a brand new game by resetting all state values
  function restartGame() {
    setMonsterHealth(100);
    setPlayerHealth(100);
    setLogs([]);
    setRound(0);
  }

  // Apply a player attack and then a monster counter attack
  function handleAttack() {
    if (winner) {
      return;
    }

    const playerDamage = getRandomValue(5, 12);
    const monsterDamage = getRandomValue(5, 12);

    setMonsterHealth((currentHealth) => clampHealth(currentHealth - playerDamage));
    setPlayerHealth((currentHealth) => clampHealth(currentHealth - monsterDamage));

    addLog(createLogAttack(true, playerDamage));
    addLog(createLogAttack(false, monsterDamage));
    setRound((currentRound) => currentRound + 1);
  }

  // Apply a stronger player attack and then a monster counter attack
  function handleSpecialAttack() {
    if (winner || !canUseSpecialAttack) {
      return;
    }

    const playerDamage = getRandomValue(10, 25);
    const monsterDamage = getRandomValue(5, 12);

    setMonsterHealth((currentHealth) => clampHealth(currentHealth - playerDamage));
    setPlayerHealth((currentHealth) => clampHealth(currentHealth - monsterDamage));

    addLog(createLogAttack(true, playerDamage));
    addLog(createLogAttack(false, monsterDamage));
    setRound((currentRound) => currentRound + 1);
  }

  // Heal player and then apply the monster counter attack
  function handleHeal() {
    if (winner) {
      return;
    }

    const healing = getRandomValue(8, 20);
    const monsterDamage = getRandomValue(5, 12);

    setPlayerHealth((currentHealth) => clampHealth(currentHealth + healing - monsterDamage));
    addLog(createLogHeal(healing));
    addLog(createLogAttack(false, monsterDamage));
    setRound((currentRound) => currentRound + 1);
  }

  // End the game immediately by setting player health to 0
  function handleSurrender() {
    if (winner) {
      return;
    }

    setPlayerHealth(0);
    addLog({
      isPlayer: true,
      isDamage: true,
      text: "surrenders",
    });
  }

  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  // Render controls only while the game is active
  function renderControls() {
    if (winner) {
      return null;
    }

    return (
      <section id="controls">
        <button onClick={handleAttack}>ATTACK</button>
        <button onClick={handleSpecialAttack} disabled={!canUseSpecialAttack}>
          SPECIAL !
        </button>
        <button onClick={handleHeal}>HEAL</button>
        <button onClick={handleSurrender}>KILL YOURSELF</button>
      </section>
    );
  }

  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <Entity health={monsterHealth} entityName="Monster" />
      <Entity health={playerHealth} entityName="Your" />

      {winner && <GameOver title={winner} restartGame={restartGame} />}

      {renderControls()}

      <Log logs={logs} />
    </>
  );
}

export default Game;
