/* The one place the localStorage key is written down.
   Both the store and the exercise catalogue need it, and the catalogue cannot
   import the store without a cycle, so the constant lives on its own. */
export const STORAGE_KEY = 'worksheethub:v1';
