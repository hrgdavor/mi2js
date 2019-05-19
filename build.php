<script>var util = {};</script>
<?
// generate minimized file for each js, so I can check size of each part when minimized
$BUILD_SEPARATE_MIN_JS = false; 

include "header.php";

include "rebuild_comp.php";
$_start = microtime(true);

rebuild_comp("en");
rebuild_comp("hr");
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
	$cmd .= " --language_in=ECMASCRIPT6_TYPED ";

	echo "generating file<br/>".htmlspecialchars($cmd)."<br><br>";
	flush();
	echo "<pre>";
	system($cmd." 2>&1");
	system("echo //# sourceMappingURL=".$_GET['baseName'].".map >> build/".$_GET['baseName'].".c.js ");
	echo "</pre>";

	if($_GET['copyTo']){
		$to = str_replace('\\', '/', $_GET['copyTo']);
//		$to = $_GET['copyTo'];
		echo "copy to ".$to.'\\'.$_GET['baseName'].".c.js";
		copy('build/'.$_GET['baseName'].".c.js", $to.'/'.$_GET['baseName'].".c.js") or die(" - no copy");
		copy('build/'.$_GET['baseName'].".map", $to.'/'.$_GET['baseName'].".map");
	}
	echo '<br>File size:'.filesize('build/'.$_GET['baseName'].".c.js");

	echo "<br><br><a href=\"build.php?sel=".str_replace(' ', '+', $_GET["sel"])
		."&baseName=".$_GET['baseName']
		."&copyTo=".$_GET['copyTo']."\">back</a>";
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
var scripts = {}, scriptsGroup={};
scriptsGroup.core = {
	"mi2":{
		"desc": "Base utilities, required by most" , 
		"require":[]
	},
	"html":{
		"desc": "Html basic utility functions for NodeWrapper" , 
		"require":["mi2"]
	},
	"html.common":{
		"desc": "Html extra utility functions for NodeWrapper" , 
		"require":["mi2","html"]
	},
	"ajax": {
		"desc": "Simple, minimal ajax implementation", 
		"require":["mi2"]
	}
};
scriptsGroup.comp = {
	"filter":{
		"desc": "Value filters" , 
		"require":["mi2"]
	},
	"parse": {
		"desc": "Binding DOM nodes to script objects and components if com.js included", 
		"require":["mi2","html"]
	},
	"comp": {
		"desc": "Simple component abstraction over HTML nodes", 
		"require":["parse"]
	},
	"NWGroup": {
		"desc": "", 
		"require":["mi2"]
	},
	"Base": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Button": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Group": {
		"desc": "", 
		"require":["comp","Base"]
	},
	"base/Loop": {
		"desc": "", 
		"require":["comp","Group","base/Group"]
	},
	"base/Table": {
		"desc": "", 
		"require":["base/Loop"]
	}
};
scriptsGroup.compForms = {
	"validate": {
		"desc": "", 
		"require":[]
	},
	"base/InputBase": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Input": {
		"desc": "", 
		"require":["base/InputBase"]
	}
};
scriptsGroup.compExt = {
	"base/AutoComplete": {
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
	"base/ShowHide": {
		"desc": "", 
		"require":["comp"]
	},
	"base/Pager": {
		"desc": "", 
		"require":["comp"]
	},
};
function $(id){ return document.getElementById(id); }

for(var grpCode in scriptsGroup){
	for(var scCode in scriptsGroup[grpCode]){
		scripts[scCode] = scriptsGroup[grpCode][scCode];
	}
}
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
	for(var grpCode in scriptsGroup){
		str += '<div><b>'+grpCode+'</b></div>';
		for(var scCode in scriptsGroup[grpCode]){
			var def = scriptsGroup[grpCode][scCode];
			var checked = sel[scCode] ? 'CHECKED':'';
			str += '<div><span class="chb" onclick="doCheck(event,this)">';
			str += '<input type="checkbox" name="'+scCode+'" '+checked+'/>'+scCode+'</span>';
			str += '<smallInfo>'+def.desc+'</smallInfo>';
			str += '</div>';
		}
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
	// "for(var p in selOpts)" could give incompatible order of scripts
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
<div><b>Selection</b></div>
<ul>
	<li><a href="build.php?sel=mi2+html+html.common+ajax+filter+parse+comp+NWGroup+Base+base/Tpl+base/Button+base/Group+base/Loop+base/Table+validate+base/Form+base/InputBase+base/Input+base/AutoComplete+base/Calendar+base/CalendarWidget+base/ShowHide+base/Pager&baseName=mi2">full components build</a></li>
	<li><a href="build.php?sel=mi2+html+html.common+ajax+filter+parse+comp+NWGroup+Base+base/Tpl+base/Button+base/Group+base/Loop+base/Table&baseName=mi2">core components build</a></li>
</ul>
<hr/>
Link to recently generated: 
	<a href="build/<?=$_GET['baseName']?>.c.js?mt<?=rand(10000000,999999999)?>"><?=$_GET['baseName']?>.c.js</a> / 
	<a href="build/<?=$_GET['baseName']?>.map?mt<?=rand(10000000,999999999)?>"><?=$_GET['baseName']?>.map</a><br>
<smallInfo>If using source map add following line to the end of js file:<br>
//# sourceMappingURL=<?=$_GET['baseName']?>.map
</smallInfo>

<?include "footer.php";?>
