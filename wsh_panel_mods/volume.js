// ==PREPROCESSOR==
// @name "Volume"
// @author "Fleshgrinder"
// ==/PREPROCESSOR==

/**
 * 1 if user is currently dragging, otherwise 0.
 *
 * @type Number
 */
var gDrag = 0;

/**
 * Called on each <code>window.Repaint()</code> call.
 *
 * @param {IGdiGraphics} gr
 * @returns {void}
 */
function on_paint(gr) {
  gr.FillSolidRect(0, 0, window.Width, window.Height, -16777216 /* rgb(0, 0, 0) */);
  gr.FillSolidRect(0, 3, window.Width, 4, -11711153 /* rgb(77, 77, 79) */);
  gr.FillSolidRect(0, 4, (Math.exp((-(-fb.Volume - 100) * Math.log(100)) / 100)) * window.Width / 100, 2, -1 /* rgb(255, 255, 255) */);
}

/**
 * React on mouse movement.
 *
 * @param {Number} x
 * @returns {void}
 */
function on_mouse_move(x) {
  var position, volume;
  window.SetCursor(32649);
  if (gDrag) {
    position = x * 100 / window.Width;
    volume = 100 - (Math.log(position) * 100) / Math.log(100);
    volume = -((volume < 0) ? 0 : (volume < 100) ? volume : 100);
    if (fb.Volume !== volume) {
      fb.Volume = volume;
    }
  }
}

/**
 * React on left mouse button down events.
 *
 * @returns {void}
 */
function on_mouse_lbtn_down() {
  gDrag = 1;
}

/**
 * React on left mouse button up events.
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {void}
 */
function on_mouse_lbtn_up(x, y) {
  on_mouse_move(x, y);
  gDrag = 0;
}

/**
 * React on mouse wheel events.
 *
 * @param {Number} delta
 * @returns {void}
 */
function on_mouse_wheel(delta) {
  delta > 0 ? fb.VolumeUp() : fb.VolumeDown();
}

/**
 * React on volume change events.
 *
 * @returns {void}
 */
function on_volume_change() {
  window.Repaint();
}