<?php

include_once 'config.php';
$images = glob($imgDirectory . "*.*"); //All images
//$images = glob($imgDirectory . "*.jpg"); //Only jpg images

//Show by date desc
usort($images, function ($a, $b) {
            return filemtime($b) - filemtime($a);
        });

$imgNames = array();
foreach ($images as $image) {
    $imgNames[] = $image;
}
echo json_encode($imgNames);
?>
 