/* What the game itself needs before it can start.

   Empty for now: the game has not been built yet, only its loading screen.
   As assets are added, list them here and the loading screen will download
   them and move the bar by their real byte counts:

     { label: 'Arena: Rust Bowl', url: 'assets/levels/rust-bowl.json', weight: 3 }

   `weight` is the share of the bar the file gets relative to the others —
   roughly its size or its load time. */

export const GAME_ASSETS = [];
