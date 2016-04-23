<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$_serviceName = $request->serviceName;
$_datas = $request->datas;

$conn = new mysqli("mysql.idhostinger.com", "u532537586_vidi", "database2", "u532537586_vidi");
if($_serviceName=="RetrieveTransaction")
{
	$name = $request->name;
	$result = $conn->query("SELECT t.Date Date,
	t.amount Amount,
	t.desc Description
	FROM Customer c join w0_transaction t on c.ID=t.cust_ID
	where c.Name = '".$name."' order by Date desc");

	$outp = "";
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"Date":"'  . $rs["Date"] . '",';
		$outp .= '"Description":"'  . $rs["Description"] . '",';
		$outp .= '"Amount":"'. $rs["Amount"]     . '"}'; 
		}
		$outp ='{"records":['.$outp.']}';
		$conn->close();
}
else if( $_serviceName == "AddTransaction" )
{
	if($_datas->pwd != "aslk")
	{
		trigger_error("Not authorized");		
		$conn->close();
		return;
	}
	$_name = $request->name;
	$result = $conn->query("INSERT INTO w0_transaction( `amount`, `cust_ID`, `desc`) 
	VALUES (".$_datas->amount.",".$_datas->name->ID.",'".$_datas->description."')");

	
		$conn->close();
}

else if($_serviceName == "RetrieveAllTransaction")
{
	$result = $conn->query("SELECT t.Date Date,
	c.Name,
	t.amount Amount,
	t.desc Description
	FROM Customer c join w0_transaction t on c.ID=t.cust_ID
	  where c.Name != 'Vd'
	  order by Date desc limit 0,30");

	$outp = "";
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"Date":"'  . $rs["Date"] . '",';
		$outp .= '"Name":"'  . $rs["Name"] . '",';
		$outp .= '"Description":"'  . $rs["Description"] . '",';
		$outp .= '"Amount":"'. $rs["Amount"]     . '"}'; 
		}
		$outp ='{"records":['.$outp.']}';
		$conn->close();
}

else if($_serviceName == "RetrievePendings")
{
	$result = $conn->query("SELECT 
	c.Name,
	(select sum(amount) from w0_transaction where cust_ID=c.id) as Total
	FROM Customer c join w0_transaction t on c.ID=t.cust_ID
	where c.Name !='vd'
	group by c.Name
	order by c.Name asc");

	$outp = "";
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"Name":"'  . $rs["Name"] . '",';
		$outp .= '"Total":"'. $rs["Total"]     . '"}'; 
		}
		$outp ='{"records":['.$outp.']}';
		$conn->close();	
}

if($outp)
	echo($outp);
?>