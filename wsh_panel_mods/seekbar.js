// ==PREPROCESSOR==
// @name "Seekbar"
// @author "Fleshgrinder"
// ==/PREPROCESSOR==

var
  /**
   * 1 if user is currently dragging, otherwise 0.
   *
   * @type Number
   */
  gDrag = 0,

  /**
   * Keeps track of the position change of the seekbar when the user drags.
   *
   * @type Number
   */
  gDragSeek = 0,

  /**
   * Default font object.
   *
   * @type gdi.Font()
   */
  gFont = gdi.Font("Open Sans", 10, 0),

  /**
   * Width of the text drawed next to the seekbar.
   *
   * @type Number
   */
  textWidth = 0;

/**
 * Helper function to format lengths.
 *
 * @syntax zeroPad(n)
 * @param {Number} n
 * @returns {String}
 */
function zeroPad(n) {
  return (n < 10 ? "0" : "") + n;
}

function formatLength(length) {
  var h, m, s;
  h = Math.floor(length / 3600);
  length -= h * 3600;
  m = Math.floor(length / 60);
  length -= m * 60;
  s = Math.floor(length);
  if (h > 0) {
    return h + ":" + zeroPad(m) + ":" + zeroPad(s);
  }
  return m + ":" + zeroPad(s);
}

function getSeekbarWidth() {
  return window.Width - textWidth;
}

function on_paint(gr) {
  var position = 0, seekbarWidth = getSeekbarWidth(), text = "foobar2000 1.2.3 fleshgrinder", textHeight = 0;
  if (fb.PlaybackTime > 0 && fb.PlaybackLength > 0) {
    if (gDrag) {
      position = parseInt(seekbarWidth * gDragSeek, 10);
      text = formatLength(gDragSeek * fb.PlaybackLength);
    } else {
      position = parseInt(seekbarWidth * (fb.PlaybackTime / fb.PlaybackLength), 10);
      text = formatLength(fb.PlaybackTime);
    }
    text += " / " + formatLength(fb.PlaybackLength);
  }
  textWidth = gr.CalcTextWidth(text, gFont) + 20;
  textHeight = gr.CalcTextHeight(text, gFont);
  seekbarWidth = getSeekbarWidth();
  gr.FillSolidRect(0, 0, window.Width, window.Height, -16777216 /* rgb(0, 0, 0) */);
  gr.FillSolidRect(0, window.Height - 7, seekbarWidth, 4, -11711153 /* rgb(77, 77, 79) */);
  gr.FillSolidRect(0, window.Height - 6, position, 2, -1 /* rgb(255, 255, 255) */);
  gr.GdiDrawText(text, gFont, -11711153 /* rgb(77, 77, 79) */, seekbarWidth, window.Height - textHeight, textWidth, textHeight, 2);
}

function on_mouse_lbtn_down() {
  gDrag = 1;
}

function on_mouse_lbtn_up(x) {
  if (gDrag) {
    gDrag = 0;
    gDragSeek = x / getSeekbarWidth();
    gDragSeek = (gDragSeek < 0) ? 0 : (gDragSeek < 1) ? gDragSeek : 1;
    fb.PlaybackTime = fb.PlaybackLength * gDragSeek;
  }
}

function on_mouse_move(x) {
  window.SetCursor(32649);
  if (gDrag) {
    gDragSeek = x / getSeekbarWidth();
    gDragSeek = (gDragSeek < 0) ? 0 : (gDragSeek < 1) ? gDragSeek : 1;
    window.Repaint();
  }
}

function on_playback_new_track() {
  window.Repaint();
}

function on_playback_stop() {
  window.Repaint();
}

function on_playback_seek() {
  window.Repaint();
}

function on_playback_time() {
  window.Repaint();
}