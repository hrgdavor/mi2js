<?
  ini_set('display_errors', 1);
  error_reporting(E_ALL ^ (E_NOTICE | E_WARNING | E_DEPRECATED));

function str_starts($str, $prefix){
  return strncmp($str, $prefix, strlen($prefix)) == 0;
}

function str_ends($str, $sufix){
  return substr($str,-1*strlen($sufix)) == $sufix;
}


?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<HTML>
 <HEAD>
  <TITLE> </TITLE>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <META NAME="Generator" CONTENT="EditPlus">
  <link rel="stylesheet" type="text/css" media="all" href="/style.css" />
 </HEAD>
<BODY>
<div class="menu">
  <a href="/components.php">Components</a>
  <a href="/build.php">Build</a>
</div>
