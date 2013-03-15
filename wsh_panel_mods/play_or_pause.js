// ==PREPROCESSOR==
// @name "Play or Pause"
// @author "Fleshgrinder"
// ==/PREPROCESSOR==

/**
 * <code>1</code> if currently hovering, otherwise <code>0</code>.
 *
 * @type Number
 */
var hover = 0;

/**
 * Contains the icons for both states (default and hover).
 *
 * @type Object The object contains two offsets, one for <em>play</em> and one for <em>pause</em> both contain an array
 * with two indexes containing the images for both states:
 * <ul>
 *   <li><b>0</b> - Default</li>
 *   <li><b>1</b> - Hover</li>
 * </ul>
 */
var icon = {
  pause: [
    gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\gray_dark\\play_9x12.png"),
    gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\white\\play_9x12.png")
  ],
  play: [
    gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\gray_dark\\pause_9x12.png"),
    gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\white\\pause_9x12.png")
  ]
};

/**
 * React on left mouse button down events.
 *
 * @returns {void}
 */
function on_mouse_lbtn_down() {
  fb.PlayOrPause();
}

/**
 * @param {IGdiGraphics} gr
 * @returns {void}
 */
function on_paint(gr) {
  gr.FillSolidRect(0, 0, window.Width, window.Height, -16777216 /* rgb(0, 0, 0) */);
  gr.DrawImage(icon[fb.IsPaused ? "pause" : "play"][hover], 0, 0, 9, 12, 0, 0, 9, 12);
}

/**
 * React on mouse over events.
 *
 * @returns {void}
 */
function on_mouse_move() {
  hover = 1;
  window.SetCursor(32649);
  window.Repaint();
}

/**
 * React on mouse leave events.
 *
 * @returns {void}
 */
function on_mouse_leave() {
  hover = 0;
  window.Repaint();
}