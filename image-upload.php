<?php

include_once 'config.php';
$fileName = $_FILES['imageName']['name'];
$ext = substr(strrchr(strtolower($fileName), '.'), 1);
$extArr = array('jpg', 'jpeg', 'gif', 'png', 'bmp');

if (in_array($ext, $extArr)) {
    $tmpFileName = $_FILES['imageName']['tmp_name'];
    $newName = 'chimay235-'.time().'-'.$fileName.$ext;
    move_uploaded_file($tmpFileName, $imgDirectory . $newName);
    echo '<div id="image">' .$imgDirectory. $newName . '</div>';
} else {
    
}
?>