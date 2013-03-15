// ==PREPROCESSOR==
// @name "Next"
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
 * @type Array
 * <ul>
 *   <li><b>0</b> - Default</li>
 *   <li><b>1</b> - Hover</li>
 * </ul>
 */
var icon = [
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\gray_dark\\last_12x12.png"),
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\white\\last_12x12.png")
];

/**
 * React on left mouse button down events.
 *
 * @returns {void}
 */
function on_mouse_lbtn_down() {
  fb.Next();
}

/**
 * @param {IGdiGraphics} gr
 * @returns {void}
 */
function on_paint(gr) {
  gr.FillSolidRect(0, 0, window.Width, window.Height, -16777216 /* rgb(0, 0, 0) */);
  gr.DrawImage(icon[hover], 0, 0, 12, 12, 0, 0, 12, 12);
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