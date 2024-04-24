<?
$SCRIPTS= "mi/mi";
include "../header.php";
  
include "../rebuild_comp.php";
rebuild_comp("en");

?>
<style>
a {}
.disabled {
	border: solid 1px black;
}

[as="base/Button"]{
	cursor: pointer;
}

.Calendar {
  position: relative;
}

.CalendarWidget {
  cursor: pointer;
  border: solid 1px #cccccc;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  padding: 5px;
  background: white;
  display: inline-block;
  position: absolute;
  z-index: 10;
}
.CalendarWidget table {
  border-collapse: separate;
  border-spacing: 1px;
}
.CalendarWidget th, .CalendarWidget td {
  font-size: 14px;
  padding: 4px;
}
.CalendarWidget .buttons {
  display: block;
  padding-top: 4px;
  border-top: solid 1px #eeeeee;
}
.CalendarWidget .buttons .bt{
	display: inline-block;
	margin-right: 8px;
}

.CalendarDays td {
  width: 20px;
  height: 20px;
  text-align: center;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  border: solid 1px white;
}
.CalendarDays .today {
  font-weight: bold;
}
.CalendarDays td:hover {
  border-color: #eeeeee;
}
.CalendarDays td.selected {
  background: #eeeeee;
  border-color: #cccccc;
}
.CalendarDays .prevMonth, .CalendarDays .nextMonth {
  color: #cccccc;
}

*[hidden] {
  display: none; !important;
}
</style>
<script src="../src/mi2.js"></script>
<script src="../src/html.js"></script>
<script src="../src/html.common.js"></script>
<script src="../src/parse.js"></script>
<script src="../src/filter.js"></script>
<script src="../src/comp.js"></script>
<script src="../src/Base.js"></script>
<script src="../src/NWGroup.js"></script>
<script src="../src/InputGroup.js"></script>
<script src="../src/template.js"></script>

<script src="../mi2.ext.js"></script>

<script src="../build/en/base/Group.js"></script>
<script src="../build/en/base/Button.js"></script>
<script src="../build/en/base/InputBase.js"></script>
<script src="../build/en/base/Input.js"></script>
<script src="../build/en/base/Calendar.js?__mt__=<?=filemtime('../build/en/base/Calendar.js')?>"></script>
<script src="../build/en/base/CalendarWidget.js?__mt__=<?=filemtime('../build/en/base/CalendarWidget.js')?>"></script>
<script src="../build/en/base/Loop.js"></script>
<script src="../src/util/ScrollableList.js"></script>
<script type="text/javascript">
function t(code) {return code;}

function test(){
	var comp = mi2JS.parse(document.getElementById('test'));
  console.log('comp',comp);
  comp.listen(comp,'change', function(evt){
    console.log('change',evt);
  });
	comp.setVisible(true);
	comp.focus();
  mi2JS.parse(document.getElementById('test2'));
}

// var list = new ScrollableList([90,33,1,2,32,3,4,44,455,6,11,8]);

// console.log('data',list.data);
// list.setSort(function(a,b){ return a-b;});

// console.log('chunk',list.chunk, list.offset);
// list.setLimit(3);
// console.log('chunk',list.chunk, list.offset);
// list.setOffset(3);
// console.log('chunk',list.chunk, list.offset);
// list.moveOffset(4);
// console.log('chunk',list.chunk, list.offset);

// list.moveOffset(3);
// console.log('chunk',list.chunk, list.offset);

// list.setOffset(0,0);
// console.log('chunk',list.chunk);

// list.setFilter(function(x){ return x%2 == 1});
// console.log('chunk',list.chunk);


</script>
<BODY onload="test()">
  <div>
  	<div id="test" as="base/Calendar" datetime ></div>
  </div>

  <button style="height:1000px"></button>
  <div id="test2" as="base/Calendar" datetime style="position: absolute; top: 250px; left: 100px;"></div>
</BODY>
