// ==PREPROCESSOR==
// @name "Last.fm"
// @author "Fleshgrinder"
// ==/PREPROCESSOR==
var lastFmUsername = ""; // Enter your Last.fm username between the two quotes!

/**
 * @type LastFMObject
 */
var lastfm = new LastFMObject(lastFmUsername);

/**
 * @type IconObject
 */
var icon = new IconObject();

/**
 * Print message to foobar2000 console.
 *
 * @param {String} message
 * @returns {void}
 */
function console(message) {
  fb.trace("WSH Panel Mod (Last.fm by Fleshgrinder): " + message);
}

/**
 * @returns {IconObject}
 * @constructor
 */
function IconObject() {
  /**
   * Contains the icons for all states:
   * <ul>
   *   <li><b>0</b> - Default</li>
   *   <li><b>1</b> - Hover</li>
   *   <li><b>2</b> - Loved</li>
   * </ul>
   *
   * @type Array
   */
  this.icons = [
    gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\gray_dark\\heart_fill_12x11.png"),
    gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\white\\heart_fill_12x11.png"),
    gdi.Image(fb.FoobarPath + "fleshgrinder\\iconic\\red\\heart_fill_12x11.png")
  ];

  /**
   * The current icon state.
   *
   * @type Number
   */
  this.state = 0;

  /**
   * The width of the icon.
   *
   * @returns {Number}
   */
  this.width = 12;

  /**
   * The height of the icon.
   *
   * @type Number
   */
  this.height = 11;

  /**
   * Get the current icon image.
   *
   * @returns {IGdiBitmap}
   */
  this.getIcon = function () {
    if (this.state !== 1) {
      this.state = lastfm.getUserLoved() ? 2 : 0;
    }
    return this.icons[this.state];
  };

  /**
   * Change the state of the icon.
   *
   * @param {Number} state
   * @returns {void}
   */
  this.setState = function (state) {
    this.state = state;
  };
}

/**
 * @param {String} username
 * @returns {LastFMObject}
 * @constructor
 */
function LastFMObject(username) {
  /**
   * Filesystem object.
   *
   * @type ActiveXObject
   */
  var fso = new ActiveXObject("Scripting.FileSystemObject");

  /**
   * The Last.fm username.
   *
   * @type String
   */
  this.username = username;

  /**
   * Elapsed time.
   *
   * @type Number
   */
  this.timeElapsed = 0;

  /**
   * Target time.
   *
   * @type Number
   */
  this.timeTarget = 5;

  /**
   * XMLHTTP ActiveX object for contacting Last.fm API.
   *
   * @type ActiveXObject
   */
  this.microsoftXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");

  /**
   * WScript shell for running SQLite executable.
   *
   * @type ActiveXObject
   */
  this.wshShell = new ActiveXObject("WScript.Shell");

  /**
   * Path to SQLite executable.
   *
   * @type String
   */
  this.sqliteExe = fso.GetFile(fb.ProfilePath + "fleshgrinder\\scripts\\sqlite3.exe").ShortPath;

  /**
   * Path to SQLite database.
   *
   * @type String
   */
  this.customDb = fso.GetFile(fb.ProfilePath + "customdb_sqlite.db").ShortPath;

  /**
   * Get the artist name.
   *
   * @returns {String}
   */
  this.getArtist = function () {
    return fb.TitleFormat("%artist%").EvalWithMetadb(this.getIFbMetadbHandle());
  };

  /**
   * Get the track title.
   *
   * @returns {String}
   */
  this.getTitle = function () {
    return fb.TitleFormat("%title%").EvalWithMetadb(this.getIFbMetadbHandle());
  };

  /**
   * Get the love status of the current track.
   *
   * @returns {Number}
   */
  this.getUserLoved = function () {
    var metaDb = this.getIFbMetadbHandle(), x = NaN;
    if (metaDb) {
      x = parseInt(fb.TitleFormat("%LASTFM_LOVED_DB%").EvalWithMetadb(metaDb), 10);
    }
    return isNaN(x) ? 0 : x;
  };

  /**
   * Get the playcount of the current track.
   *
   * @returns {Number}
   */
  this.getUserPlaycount = function () {
    var metaDb = this.getIFbMetadbHandle(), x = NaN;
    if (metaDb) {
      x = parseInt(fb.TitleFormat("%LASTFM_PLAYCOUNT_DB%").EvalWithMetadb(metaDb), 10);
    }
    return isNaN(x) ? 0 : x;
  };

  /**
   * Get <code>IFbMetadbHandle</code> for currently playing or selected track.
   *
   * @returns {IFbMetadbHandle}
   */
  this.getIFbMetadbHandle = function () {
    return fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
  };

  /**
   * Send XMLHTTP request to Last.fm. Response text will be handed over to the callback function.
   *
   * @param {Function} callback
   * @returns {void}
   */
  this.XMLHTTP = function (callback) {
    var response = null;
    this.microsoftXMLHTTP.open("GET", "http://ws.audioscrobbler.com/2.0/?format=json&api_key=501969a64294755d8b3d9f346f1cfcb5&user=" + this.username + "&username=" + this.username + "&s=" + Math.random() + "&method=track.getinfo&artist=" + encodeURIComponent(this.getArtist()) + "&track=" + encodeURIComponent(this.getTitle()) + "&autocorrect=1", true);
    this.microsoftXMLHTTP.send();
    this.microsoftXMLHTTP.onreadystatechange = function () {
      if (lastfm.microsoftXMLHTTP.readyState === 4) {
        if (lastfm.microsoftXMLHTTP.status === 200) {
          response = JSON.parse(lastfm.microsoftXMLHTTP.responsetext);
          if (response.error === 6) {
            console("Aborting! Artist / track not found!");
          } else if (response.error > 0) {
            console("Aborting! " + response.responsetext);
          } else {
            callback(response);
          }
        } else {
          console(lastfm.microsoftXMLHTTP.responsetext || "HTTP error: " + lastfm.microsoftXMLHTTP.status);
        }
      }
    };
  };
}

/**
 * React on left mouse button down events.
 *
 * @returns {void}
 */
function on_mouse_lbtn_down() {
  var metaDb = lastfm.getIFbMetadbHandle();
  if (metaDb) {
    fb.RunContextCommandWithMetadb("Last.fm " + (lastfm.getUserLoved() === 1 ? "Unlove" : "Love") + " Track '" + lastfm.getTitle() + "' by '" + lastfm.getArtist() + "'", metaDb, 8);
    lastfm.XMLHTTP(function (response) {
      var userLoved = parseInt(response.track.userloved, 10);
      if (userLoved !== lastfm.getUserLoved()) {
        console("Successfully " + (userLoved ? "loved" : "unloved") + " track '" + lastfm.getTitle() + "'");
        fb.RunContextCommandWithMetadb("Customdb Love " + userLoved, metaDb, 8);
        window.Repaint();
      }
    });
  }
}

/**
 * React on mouse move events.
 *
 * @returns {void}
 */
function on_mouse_move() {
  icon.setState(1);
  window.SetCursor(32649);
  window.Repaint();
}

/**
 * React on mouse leave events.
 *
 * @returns {void}
 */
function on_mouse_leave() {
  icon.setState(0);
  window.Repaint();
}

/**
 * Paint the panel.
 *
 * @param {IGdiGraphics} gr
 * @returns {void}
 */
function on_paint(gr) {
  gr.FillSolidRect(0, 0, window.Width, window.Height, -16777216 /* rgb(0, 0, 0) */);
  gr.DrawImage(icon.getIcon(), 0, 0, icon.width, icon.height, 0, 0, icon.width, icon.height);
}

/**
 * React on playback on new track events.
 *
 * @returns {void}
 */
function on_playback_new_track() {
  lastfm.timeElapsed = 0;
  if (fb.PlaybackLength === 0) {
    lastfm.timeTarget = 240;
  } else if (fb.PlaybackLength >= 30) {
    lastfm.timeTarget = Math.min(Math.floor(fb.PlaybackLength / 2), 240);
  } else {
    lastfm.timeTarget = 5;
  }
  window.Repaint();
}

/**
 * Update database when target time is reached.
 *
 * @returns {void}
 */
function on_playback_time() {
  lastfm.timeElapsed++;
  if (lastfm.timeElapsed === lastfm.timeTarget && lastfm.getIFbMetadbHandle() && lastfm.customDb) {
    lastfm.XMLHTTP(function (response) {
      var artistTitleHash = "";
      var attempt = 0;
      var metaDb = lastfm.getIFbMetadbHandle();
      var userPlaycount = parseInt(response.track.userplaycount, 10);

      userPlaycount = userPlaycount > 0 ? ++userPlaycount : 1;
      if (userPlaycount > lastfm.getUserPlaycount()) {
        fb.RunContextCommandWithMetadb("Customdb Delete Playcount", metaDb, 8);
        artistTitleHash = fb.TitleFormat("$crc32($lower(%artist%%title%))").EvalWithMetadb(metaDb);
        while (fb.TitleFormat("%LASTFM_PLAYCOUNT_DB%").EvalWithMetadb(metaDb) !== userPlaycount && attempt < 4) {
          lastfm.wshShell.Run(lastfm.sqliteExe + " " + lastfm.customDb + ' \"INSERT INTO quicktag(url,subsong,fieldname,value) VALUES(\\"' + artistTitleHash + '\\",\\"-1\\",\\"LASTFM_PLAYCOUNT_DB\\",\\"' + userPlaycount + '\\")\";', 0, true);
          attempt++;
        }
        fb.RunContextCommandWithMetadb("Customdb Refresh", metaDb, 8);
      }
    });
  }
}