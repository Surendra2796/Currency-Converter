/*
* retrieving the latest currency conversion rates from open exchange rates API
*/
<?php
require_once '../../../wp-load.php';
$ch = curl_init("http://openexchangerates.org/api/latest.json?app_id=".$_REQUEST['appId']."&base=INR");
$fp = fopen("".ABSPATH."wp-content/plugins/currency-converter/latest.json", "w");

curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_HEADER, 0);

curl_exec($ch);
curl_close($ch);
fclose($fp);
echo $ch;
?>
