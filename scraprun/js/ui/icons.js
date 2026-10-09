/* Menu icons: chunky, filled shapes that hold up at small sizes and match
   the angular lettering. All use currentColor so they follow button state. */

const svg = (body, vb = '0 0 24 24') =>
  `<svg class="icon" viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;

export const ICONS = {
  play: svg('<path d="M6 3.5 20.5 12 6 20.5Z" fill="currentColor"/>'),
  wrench: svg('<path d="M21.2 6.1 17.6 9.7l-3.1-.4-.4-3.1 3.6-3.6a6 6 0 0 0-7.6 7.4L2.6 17.5a2 2 0 0 0 0 2.9l1 1a2 2 0 0 0 2.9 0l7.5-7.5a6 6 0 0 0 7.2-7.8Z" fill="currentColor"/>'),
  gear: svg('<path fill="currentColor" fill-rule="evenodd" d="M10.3 1.5h3.4l.6 2.9 1.9.8 2.5-1.6 2.4 2.4-1.6 2.5.8 1.9 2.9.6v3.4l-2.9.6-.8 1.9 1.6 2.5-2.4 2.4-2.5-1.6-1.9.8-.6 2.9h-3.4l-.6-2.9-1.9-.8-2.5 1.6-2.4-2.4 1.6-2.5-.8-1.9-2.9-.6v-3.4l2.9-.6.8-1.9-1.6-2.5 2.4-2.4 2.5 1.6 1.9-.8ZM12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"/>'),
  exit: svg('<path fill="currentColor" d="M3 3h10v4h-2.5V5.5h-5v13h5V17H13v4H3Z"/><path fill="currentColor" d="M15 7.5 20.5 12 15 16.5v-3H8.5v-3H15Z"/>'),
  back: svg('<path fill="currentColor" d="M10 5.5 3.5 12l6.5 6.5v-4.2h10.5V9.7H10Z"/>'),
  skull: svg('<path fill="currentColor" fill-rule="evenodd" d="M12 2C6.9 2 3.5 5.6 3.5 10.2c0 2.7 1.2 4.5 2.9 5.6V20h2.4v-2h1.6v2h3.2v-2h1.6v2h2.4v-4.2c1.7-1.1 2.9-2.9 2.9-5.6C20.5 5.6 17.1 2 12 2ZM8.5 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>'),
  target: svg('<path fill="currentColor" fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>'),
  lock: svg('<path fill="currentColor" fill-rule="evenodd" d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10Zm2.5 0h5V7a2.5 2.5 0 0 0-5 0Z"/>'),
  /* scrap: a hex nut with a gear-toothed rim */
  scrap: svg('<path fill="currentColor" fill-rule="evenodd" d="M12 1.5 14 3.4l2.7-.5.9 2.6 2.6.9-.5 2.7 1.9 2-1.9 2 .5 2.7-2.6.9-.9 2.6-2.7-.5-2 1.9-2-1.9-2.7.5-.9-2.6-2.6-.9.5-2.7-1.9-2 1.9-2-.5-2.7 2.6-.9.9-2.6 2.7.5ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/>'),
  fullscreen: svg('<path fill="currentColor" d="M3 3h7v2.5H5.5V10H3Zm11 0h7v7h-2.5V5.5H14ZM3 14h2.5v4.5H10V21H3Zm15.5 0H21v7h-7v-2.5h4.5Z"/>')
};
