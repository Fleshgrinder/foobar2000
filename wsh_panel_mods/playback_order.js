// ==PREPROCESSOR==
// @name "Playback Order"
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
var playBackOrderDropdownIcon = [
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-dropdown.png"),
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-dropdown-hover.png")
];

/**
 * Contains the icons for all known playback orders.
 *
 * @type Array
 * <ul>
 *
 * </ul>
 */
var playBackOrderIcon = [
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-0.png"),
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-1.png"),
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-2.png"),
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-3.png"),
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-4.png"),
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-5.png"),
  gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\playbackorder-6.png")
];

/**
 * React on left mouse button down events.
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {void}
 */
function on_mouse_lbtn_down(x, y) {
  var menu = window.CreatePopupMenu(), mode;

  menu.AppendMenuItem(0, 0, "Default");
  menu.AppendMenuItem(0, 1, "Repeat (Playlist)");
  menu.AppendMenuItem(0, 2, "Repeat (Track)");
  menu.AppendMenuItem(0, 3, "Random");
  menu.AppendMenuItem(0, 4, "Shuffle (Tracks)");
  menu.AppendMenuItem(0, 5, "Shuffle (Albums)");
  menu.AppendMenuItem(0, 6, "Shuffle (Folders)");
  menu.CheckMenuRadioItem(0, 6, fb.PlayBackOrder);

  mode = menu.TrackPopupMenu(x, y);

  if (mode >= 0 && mode <= 6) {
    fb.PlayBackOrder = mode;
  }

  menu.Dispose();
}

/**
 * @param {IGdiGraphics} gr
 * @returns {void}
 */
function on_paint(gr) {
  gr.FillSolidRect(0, 0, window.Width, window.Height, -16777216 /* rgb(0, 0, 0) */);
  gr.DrawImage(playBackOrderDropdownIcon[hover], 19, 0, 5, 14, 0, 0, 5, 14);
  gr.DrawImage(playBackOrderIcon[fb.PlayBackOrder], 0, 0, 12, 14, 0, 0, 12, 14);
}

/**
 * @returns {void}
 */
function on_playback_order_changed() {
  window.Repaint();
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