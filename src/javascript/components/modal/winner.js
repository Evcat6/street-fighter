import { showModal } from './modal';

export function showWinnerModal(fighter) {
  // call showModal function 
  const fightResult = {
    title: "Winner!",
    bodyElement: fighter.name 
  }
  return showModal(fightResult);
}
