<?php

header('content-type: application/octet-stream');

if (isset($_GET['foobar2000']) && isset($_GET['version'])) {
  header('content-disposition: attachment; filename="foobar2000-1.2.3-fleshgrinder.zip"');
  readfile(__DIR__ . '/fb2k/' . $_GET['version'] . '.zip');
}
else if (isset($_GET['id']) && is_numeric($_GET['id'])) {
  header('content-disposition: attachment; filename="customdb_sqlite.db"');
  readfile(__DIR__ . '/dbs/' . $_GET['id'] . '/customdb_sqlite.db');
}