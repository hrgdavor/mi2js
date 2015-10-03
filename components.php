<?
$SCRIPTS= "mi/mi";
include "header.php";

?>
<style>
a {}
.disabled {
	border: solid 1px black;
}
bt { border: solid 1px gray; cursor: pointer; padding: 2px 6px 2px 6px;}
.sample{
	padding: 10px; 
	margin: 4px;
	border: solid 1px gray;
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

.hidden {
  display: none;
}

.AutoComplete {
  position: relative;
  display: inline-block;
}
.AutoComplete.inline {
  float: left;
}

.AutoCompleteList {
  position: absolute;
  padding: 6px;
  background: white;
  border: solid 1px #b8dceb;
  cursor: pointer;
  z-index: 10;
  max-height: 250px;
  overflow: auto;
  -moz-border-radius-bottomleft: 5px;
  -webkit-border-bottom-left-radius: 5px;
  border-bottom-left-radius: 5px;
  -moz-border-radius-bottomright: 5px;
  -webkit-border-bottom-right-radius: 5px;
  border-bottom-right-radius: 5px;
  -moz-box-shadow: 0px 2px 2px #b8dceb;
  -webkit-box-shadow: 0px 2px 2px #b8dceb;
  box-shadow: 0px 2px 2px #b8dceb;
}
.AutoCompleteList .selected {
  background: #eeeeee;
}
.AutoCompleteList .acItem {
  padding: 2px 6px 2px 6px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
}

[as="base/ShowHide"] {
  padding: 4px;
  margin-top: 8px;
  background-color: #eeeeee;
}
[as="base/ShowHide"] [p="title"] {
  font-size: 14px;
  font-weight: bold;
  margin-right: 16px;
}
[as="base/ShowHide"] b {
  font-weight: normal;
}

.ShowHidePanel {
  border: solid 1px #eeeeee;
  padding: 6px;
}

</style>
<script src="src/mi2.js"></script>
<script src="src/html.js"></script>
<script src="src/parse.js"></script>
<script src="src/find.js"></script>
<script src="src/comp.js"></script>

<script src="mi2.ext.js"></script>

<script src="build/en/base/Button.js"></script>
<script src="build/en/base/Input.js"></script>
<script src="build/en/base/Form.js"></script>
<script src="build/en/base/Calendar.js"></script>
<script src="build/en/base/CalendarWidget.js"></script>
<script src="build/en/base/List.js"></script>
<script src="build/en/base/ShowHide.js"></script>
<script src="build/en/base/Template.js"></script>
<script src="build/en/base/Pager.js"></script>
<script src="build/en/base/Table.js"></script>

<script type="text/javascript">
mi2JS.comp.add('base/TestExtendUnordered', 'base/AutoComplete', 'extend:base/AutoComplete',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){
	comp.constructor = function(el, tpl, parent){
		superClass.constructor.call(this, el, tpl, parent);
		function it(id,text) {return { id:id, text:text}; }
		this.data = [it(1,'John'), it(2,'Doe'), it(3, 'Monkey')];
	};
});
</script>

<script src="build/en/base/AutoComplete.js"></script>

<script>
function t(code) {return code;}

function test(){
	var comp = mi2JS.parse(document.getElementById('test'));


	comp.on_bt1 = function(evt){
		console.log("bt1",this, this.bt1);
		console.log('instanceof base/Button',this.bt1 instanceof mi2JS.comp.get("base/Button"));
		console.log('instanceof Base',this.bt1 instanceof mi2JS.comp.get("Base"));
	};

	comp.on_inp1 = function(evt){
		console.log("inp1",this.inp1.getValue());
	};

	comp.on_form1 = function(evt){
		console.log("form1",this.form1.getValue());
	};

	comp.on_cal1 = function(evt){
		console.log("cal1",this.cal1.getValue(), new Date(this.cal1.getValue()));
	};

	function it(id,text) {return { id:id, text:text}; }
	comp.ac1.data = [it(1,'John'), it(2,'Doe'), it(3, 'Monkey')];

	comp.on_ac1 = function(evt){
		console.log( "ac1", this.ac1.getValue() );
	};

	comp.on_ac2 = function(evt){
		console.log( "ac2", this.ac2.getValue() );
	};

	comp.list1.setValue([1,2,3]);
	comp.on_list1 = function(evt){
		console.log( "list1", this.list1.getValue() );
		this.list1.add(5);
	};

	comp.tpl1.setValue({name:'John', age:24});
	comp.on_tpl1 = function(evt){
		this.tpl1.setValue({name:'Jane', age:32});
	};

	comp.table1.setup({
		columns:{
			name: {sortable:1},
			age: {},
			city: {},
		}
	});

	comp.table1.update({
		limit:3, offset:3,rowcount: 10,
		data:[
			{name:'John', age:12, city:'New York'},
			{name:'Jane', age:36, city:'Washington'},
			{name:'Mily', age:55, city:'New York'}
		]
	});

} 

</script>
<BODY onload="test()">

<div id="test" as="Base">
	<div p="plain">plain element</div>
	<div class="sample"><b>Button</b>
		<bt as="base/Button" event="bt1" p="bt1">button1</bt>
	</div>
	<div class="sample"><b>Input</b>
		<input p="inp1" as="base/Input"/>
		<bt as="base/Button" event="inp1" p="bt.inp1">input test</bt>
	</div>

	<div class="sample"><b>Form</b>
		<div as="base/Form" p="form1">
			name:
			<input p="inp.name" as="base/Input"/>
			age:
			<input p="inp.age"/>
			<bt as="base/Button" event="form1" p="bt.form1">form test</bt>
		</div>
	</div>

	<div class="sample"><b>Calendar</b>
		<span p="cal1" as="base/Calendar"></span>
		<bt as="base/Button" event="cal1" p="bt.cal1">calendar test</bt>
	</div>

	<div class="sample"><b>AutoComplete</b>
		<span p="ac1" as="base/AutoComplete"></span>
		<bt as="base/Button" event="ac1" p="bt.ac1">AutoComplete test</bt>
	</div>

	<div class="sample"><b>AutoComplete Extend</b>
		<span p="ac2" as="base/TestExtendUnordered"></span>
		<bt as="base/Button" event="ac2" p="bt.ac2">Extend test</bt>
	</div>

	<div class="sample"><b>List</b>
		<span p="list1" as="base/List">
			<input as="base/Input" style="width:20px">
		</span>
		<bt as="base/Button" event="list1" p="bt.list1">List test</bt>
	</div>

	<div class="sample"><b>Show/Hide</b>
		<div p="sh1" as="base/ShowHide">first</div>
		<div>Bla Bla 1</div>
		<div p="sh1" as="base/ShowHide">second</div>
		<div class="hidden">Bla Bla 2</div>
	</div>

	<div class="sample"><b>Template</b>
		<span p="tpl1" as="base/Template">user: ${name} (${age})</span>
		<bt as="base/Button" event="tpl1" p="bt.tpl1">template test</bt>
	</div>

	<div class="sample"><b>Table</b>
		<span p="table1" as="base/Table"></span>
	</div>

</div>


<?include "footer.php";?>

