export interface IGameLayout {
  root: HTMLElement;
  hudSlot: HTMLElement;
  board: HTMLElement;
  actionSlot: HTMLElement;
  overlaySlot: HTMLElement;
  recipeSlot: HTMLElement;
  shelfSlot: HTMLElement;
  cauldronSlot: HTMLElement;
  barsSlot: HTMLElement;
}

/** Build the fixed play-board shell and return slot refs. */
export function createGameLayout(): IGameLayout {
  const root = document.createElement('div');
  root.className = 'game';

  const header = document.createElement('header');
  header.className = 'game__header';
  const heading = document.createElement('h1');
  heading.className = 'game__title';
  heading.textContent = "Alchemist's Cauldron";
  const hudSlot = document.createElement('div');
  hudSlot.className = 'game__hud';
  header.append(heading, hudSlot);

  const board = document.createElement('div');
  board.className = 'game__board';

  const actionSlot = document.createElement('div');
  actionSlot.className = 'game__actions';

  const main = document.createElement('main');
  main.className = 'game__main';

  const overlaySlot = document.createElement('div');
  overlaySlot.className = 'game__overlay';
  overlaySlot.hidden = true;

  const recipeSlot = document.createElement('section');
  recipeSlot.className = 'game__recipe';
  recipeSlot.setAttribute('aria-label', 'Recipe panel');

  const shelfSlot = document.createElement('section');
  shelfSlot.className = 'game__shelf';
  shelfSlot.setAttribute('aria-label', 'Shelf');

  const cauldronSlot = document.createElement('section');
  cauldronSlot.className = 'game__cauldron';
  cauldronSlot.setAttribute('aria-label', 'Cauldron');

  const barsSlot = document.createElement('section');
  barsSlot.className = 'game__bars';
  barsSlot.setAttribute('aria-label', 'Parameter bars');

  main.append(shelfSlot, cauldronSlot, recipeSlot, barsSlot);
  board.append(main, actionSlot, overlaySlot);
  root.append(header, board);

  return {
    root,
    hudSlot,
    board,
    actionSlot,
    overlaySlot,
    recipeSlot,
    shelfSlot,
    cauldronSlot,
    barsSlot,
  };
}
