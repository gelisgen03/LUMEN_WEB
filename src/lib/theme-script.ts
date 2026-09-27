export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before first paint (inlined in <head>):
 * - adds `js` so scroll-reveal styles only apply when JS can reveal them again;
 * - applies the theme (explicit choice in localStorage, else system preference) without a flash.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var k=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;d.classList.toggle("dark",k)}catch(e){}})()`;
