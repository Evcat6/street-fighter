import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const healthBarsHTML = document.getElementsByClassName('arena___health-bar');
    const healthBarsArray = [ ...healthBarsHTML ];
    const statusViewHTML = document.getElementsByClassName('arena___health-indicator');
    const statusViewsArray = [ ...statusViewHTML ];
    
    const gameStatus = {
      currentHealth: 100,
      criticalDamageChecker: Date.now(),
      block: false,
      keyCombination: [],  
    };
    
    const FighterOne = {
      ...firstFighter, 
      ...gameStatus, 
      healthBar: healthBarsArray[0], 
      statusView: statusViewsArray[0],
      position: 'left'
    };
    
    const FighterTwo = {
      ...secondFighter, 
      ...gameStatus, 
      healthBar: healthBarsArray[1], 
      statusView: statusViewsArray[1],
      position: 'left'
    };

    function fighterAttackHandler(attacker, defender) {
      if(attacker.block || defender.block) return;
      const damage = getDamage(attacker, defender);
      defender.currentHealth = defender.currentHealth - damage / defender.health * 100;

      if(defender.currentHealth <= 0) {
        document.removeEventListener('keyup', keyUp);
        document.removeEventListener('keydown', keyDown);
        resolve(attacker);
      }

      if(defender.currentHealth < 0) {
        defender.healthBar.style.width = '0%';
      }
      defender.healthBar.style.width = `${defender.currentHealth}%`;
    }

    function criticalDamage(fighter, defender, key) {
      if(fighter.keyCombination.length >= 3 ) return;
      fighter.keyCombination.push(key);

      const criticalChecker = new Date();
      if(criticalChecker - fighter.criticalDamageChecker >= 10000) {
        const criticalDamage = fighter.attack * 2;
        defender.currentHealth = defender.currentHealth - criticalDamage / defender.health * 100;
        defender.healthBar.style.width = `${defender.currentHealth}%`;
        fighter.criticalDamageChecker = criticalChecker;
      }
    }

    function keyUp(event) {
      switch(event.code) {
        case controls.PlayerOneAttack:
          fighterAttackHandler(FighterOne, FighterTwo)
          break;
        case controls.PlayerTwoAttack: 
          fighterAttackHandler(FighterTwo, FighterOne)
          break;
        case controls.PlayerOneBlock:
          FighterTwo.block = false;
          break;
        case controls.PlayerTwoBlock:
          FighterTwo.block = false;
          break;
      }

      FighterOne.keyCombination = [];
      FighterTwo.keyCombination = [];
    }

    function keyDown(event) {
      if(controls.PlayerOneCriticalHitCombination.includes(event.code)) {
        criticalDamage(FighterOne, FighterTwo, event.code);
      }
      if(controls.PlayerTwoCriticalHitCombination.includes(event.code)) {
        criticalDamage(FighterTwo, FighterOne, event.code);
      }
      switch(event.code) {
        case controls.PlayerOneBlock:
          FighterTwo.block = true;
          break;
        case controls.PlayerTwoBlock:
          FighterTwo.block = true;
          break;
      }
    }
    
    document.addEventListener('keyup', keyUp);
    document.addEventListener('keydown', keyDown);

  });
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  if(damage < 0) {
    return 0;
  }
  return damage;
  // return damage
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() + 1;
  const { attack } = fighter;
  const hitPower = attack * criticalHitChance;
  return hitPower;
  // return hit power
}

export function getBlockPower(fighter) {
  const { defense } = fighter;
  const dodgeChance = Math.random() + 1;
  const blockPower = defense * dodgeChance;
  return blockPower;
  // return block power
}
