/* App-level states. GameManager is the only writer. */
export const AppState = Object.freeze({
  BOOT: 'boot',
  MENU: 'menu',
  MATCHMAKING: 'matchmaking',
  DEPLOY: 'deploy',
  PLAYING: 'playing',
  RESULTS: 'results',
});

export const gameState = {
  app: AppState.BOOT,
  screen: 'home',      // which menu tab is open
  match: null,         // live MatchManager
  paused: false,
};
