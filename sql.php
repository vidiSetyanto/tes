<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("mysql.idhostinger.com", "u276525806_vidi", "database2", "u276525806_pulsa");

$result = $conn->query("SELECT * FROM Customer");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"Name":"'  . $rs["Name"] . '",';
    $outp .= '"ID":"'. $rs["ID"]     . '"}'; 
}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo($outp);
?>