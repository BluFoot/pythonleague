<?php
$myfile = fopen($_REQUEST["FILE"], "r") or die("Unable to open file!");
echo (fread($myfile,filesize($_REQUEST["FILE"])));
fclose($myfile);
?>