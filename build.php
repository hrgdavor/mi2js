<script>var util = {};</script>
<?

$SCRIPTS= "mi/mi;find;assign;comp;checkform;form;calendar;microajax;anim;drag;reorder";
include "header.php";

include "rebuild_comp.php";
$_start = microtime(true);

rebuild_comp("en");
echo "<br>".((microtime(true) - $_start)*1000)." ms</br>";

if($_GET['baseName'] == '') $_GET['baseName'] = 'mi2'; 

if($_GET['inc']){


	$base = "build/en/";
	$cmd = "java -jar compiler.jar ";
	$arr = explode(' ', $_GET['inc']);

	for($i=0; $i<count($arr);$i++){
		$cmd .= " --js ".$base.$arr[$i].'.js';
	}
	$cmd .= " --js_output_file build/".$_GET['baseName'].".c.js ";
	$cmd .= " --create_source_map build/".$_GET['baseName'].".map ";
	$cmd .= " --source_map_format V3 ";

	echo "generating file<br/>".htmlspecialchars($cmd)."<br><br>";
	flush();
	echo "<pre>";
	system($cmd." 2>&1");
	system("echo //# sourceMappingURL=".$_GET['baseName'].".map >> build/".$_GET['baseName'].".c.js ");
	echo "</pre>";
	echo "<a href=\"build.php?sel=".str_replace(' ', '+', $_GET["sel"])
		."&baseName=".$_GET['baseName']
		."&copyTo=".$_GET['copyTo']."\">back</a>";

	if($_GET['copyTo']){
		$to = str_replace('\\', '/', $_GET['copyTo']);
//		$to = $_GET['copyTo'];
		echo "copy to ".$to.'\\'.$_GET['baseName'].".c.js";
		copy('build/'.$_GET['baseName'].".c.js", $to.'/'.$_GET['baseName'].".c.js") or die(" - no copy");
		copy('build/'.$_GET['baseName'].".map", $to.'/'.$_GET['baseName'].".map");
	}
	exit;
}

?>
<style>
smallInfo {
	padding-left: 20px; 
	display:inline-block;
}
.chb {
	display: inline-block; 
	min-width: 80px; 
	cursor:pointer;
	padding: 2px;
}
.chb:hover {background: #eee;}
</style>

<script>

<? if($_GET["reload"]){
	echo "setTimeout(function(){document.location.reload();},1000);\n";
}
?>

// --create_source_map
var base = 'src/';
var scripts = {
	"mi2":{
		"desc": "Base utilities, required by most" , 
		"require":[]
	},
	"html":{
		"desc": "Html utility function for wrapped object" , 
		"require":["mi2"]
	},
	"formatter":{
		"desc": "Value formatters" , 
		"require":["mi2"]
	},
	"template":{
		"desc": "String template rendering, values can be transformed by formatters" , 
		"require":["mi2","formatter"]
	},
	"parse": {
		"desc": "Binding DOM nodes to script objects and components if com.js included", 
		"require":["mi2","html"]
	},
	"comp": {
		"desc": "Simple component abstraction over HTML nodes", 
		"require":["mi2","html","parse"]
	},
	"comp.FormHandler": {
		"desc": "", 
		"require":["comp"]
	},
	"comp.GroupHandler": {
		"desc": "", 
		"require":["comp"]
	},
	"ajax": {
		"desc": "Simple, minimal ajax implementation", 
		"require":["mi2"]
	},
	"base/AutoComplete": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Button": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Calendar": {
		"desc": "", 
		"require":["comp"]
	},
	"base/CalendarWidget": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Form": {
		"desc": "", 
		"require":["comp.FormHandler"]
	},
	"base/Input": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Tpl": {
		"desc": "Render values via template (template strings in html and attributes)", 
		"require":["comp","template"]
	},
	"base/Loop": {
		"desc": "", 
		"require":["comp","Tpl"]
	},
	"base/Table": {
		"desc": "", 
		"require":["comp","loop"]
	},
	"base/TabPane": {
		"desc": "", 
		"require":["comp"]
	},
	"base/ShowHide": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Pager": {
		"desc": "", 
		"require":["comp"]
	},
	"base/RenderTable": {
		"desc": "", 
		"require":["comp"]
	}
};
function $(id){ return document.getElementById(id); }

window.onload = function(){
	console.log(document.form, document.location.href);
	var href = document.location.href;
	var sel = {};
	var idx = href.indexOf('sel=');
	if(idx != -1){
		href = href.substring(idx+4);
		idx = href.indexOf('&');
		if(idx != -1) href = href.substring(0,idx);
		var arr = href.split('+');
		for(var op in arr) sel[arr[op]] = 1;
	}
	var str = '';
	for(var scCode in scripts){
		var def = scripts[scCode];
		var checked = sel[scCode] ? 'CHECKED':'';
		str += '<div><span class="chb" onclick="doCheck(event,this)">';
		str += '<input type="checkbox" name="'+scCode+'" '+checked+'/>'+scCode+'</span>';
		str += '<smallInfo>'+def.desc+'</smallInfo>';
		str += '</div>';
	}
	$('selection').innerHTML = str;
};

function doCheck(event,elem){
	var chb = $child(elem,'INPUT');
	if(event.target == chb) return;
	if(chb) chb.checked = !chb.checked;
}

function generateFiles () {
	var items = document.form.elements;
	var selStr = '';
	var delim = '';
	var selOpts = {};
	var incStr = '';
	for(var i=0; i<items.length; i++){
		if(items[i].checked){
			selStr += delim + items[i].name;
			addSel(selOpts,items[i].name);
			delim = '+';
		}
	}
	delim = '';
	// preserve defined order, by not traversing selOpts for url generation
	// "for(p in selOpts)" could give incompatible order of scripts
	for(var p in scripts){ 
		if(selOpts[p]){
			incStr += delim+p;
			delim = '+';			
		}
	}
	var href = document.location.href;
	var idx = href.indexOf('?');
	if(idx != -1) href = href.substring(0,idx);
	href += '?sel='+selStr+'&inc='+incStr+'&baseName='+$('baseName').value+'&copyTo='+$('copyTo').value;
	document.location = href;
}

function addSel(selOpts, addon){
	var def = scripts[addon];
	if(def){
		selOpts[addon] = 1;
		if(def.require){
			for(var i=0; i<def.require.length; i++){
				if(!selOpts[def.require[i]]) addSel(selOpts, def.require[i]);
			}
		}
	}
}

</script>


<form name="form">
<div id="selection"></div>
base name: <input id="baseName" name="baseName" value="<?=$_GET['baseName']?>"><br>
copy to: <input id="copyTo" name="copyTo" value="<?=$_GET['copyTo']?>" style="width:350px"><br>

</form>

<a href="#" onclick="generateFiles();return false;">Generate</a>

<hr/>
Link to recently generated: 
	<a href="build/<?=$_GET['baseName']?>.c.js?mt<?=rand(10000000,999999999)?>"><?=$_GET['baseName']?>.c.js</a> / 
	<a href="build/<?=$_GET['baseName']?>.map?mt<?=rand(10000000,999999999)?>"><?=$_GET['baseName']?>.map</a><br>
<smallInfo>If using source map add following line to the end of js file:<br>
//# sourceMappingURL=<?=$_GET['baseName']?>.map
</smallInfo>

<?include "footer.php";?>
