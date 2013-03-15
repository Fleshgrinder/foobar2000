<?php

/**
 * Clean up the database folder and remove all generated databases. This script is triggered once a day via a cronjob.
 */
exec('rm -rf ' . __DIR__ . '/dbs/');