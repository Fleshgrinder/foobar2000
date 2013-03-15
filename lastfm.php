<?php

header('content-type: text/plain');
$response = 'error';

try {
  function db_path($id) {
    return __DIR__ . '/dbs/' . $id;
  }

  function db_name() {
    return '/customdb_sqlite.db';
  }

  function db_full_path($id) {
    return db_path($id) . db_name();
  }

  function db_connect($id) {
    return new PDO('sqlite:' . db_path($id) . db_name());
  }

  if (isset($_POST['create_db'])) {
    $id = rand();
    $db_path = db_path($id);
    $db_full_path = $db_path . db_name();
    mkdir($db_path, 0777, true);
    touch($db_full_path);
    $db = db_connect($id);
    $db->exec('CREATE TABLE quicktag(url TEXT, subsong INT, fieldname TEXT, value TEXT)');
    $db->exec('CREATE UNIQUE INDEX url_idx ON quicktag(url, subsong, fieldname)');
    unset($db);
    $response = $id;
  }
  else if (isset($_POST['id']) && is_numeric($_POST['id']) && isset($_POST['method']) && isset($_POST['data'])) {
    $db = db_connect($_POST['id']);
    $db->beginTransaction();
    foreach ($_POST['data'] as $delta => $data) {
      $db->exec('INSERT INTO quicktag(url, subsong, fieldname, value) VALUES("' . $data['key'] . '", "-1", "LASTFM_' . strtoupper($_POST['method']) . '_DB", "' . $data['value'] . '");');
    }
    $db->commit();
    unset($db);
    $response = 'finished';
  }

  echo $response;
}
catch (Exception $e) {
  echo $e;
}