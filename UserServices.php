<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$name = $request->name;

$conn = new mysqli("mysql.idhostinger.com", "u532537586_vidi", "database2", "u532537586_vidi");

$result = $conn->query("SELECT t.Date Date,
t.amount Amount,
t.desc Description
 FROM Customer c join w0_transaction t on c.ID=t.cust_ID
 where c.Name = '".$name."'");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"Date":"'  . $rs["Date"] . '",';
	$outp .= '"Description":"'  . $rs["Description"] . '",';
    $outp .= '"Amount":"'. $rs["Amount"]     . '"}'; 
}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo($outp);
?>