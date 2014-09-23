<?php

// made it a function to avoid adding variables to global scope
function rebuild_comp($lang){ global $TRANS;

	if(!file_exists("build/".$lang)) mkdir("build/".$lang, 0777, true);
	$langfile = "lang/$lang.json";
	$str = file_get_contents($langfile);
	$langMt = filemtime($langfile);
	$TRANS = json_decode($str,true);
	
	$in_dir = "src/base";
	$out_dir = "build/$lang/base";
	rebuild_comp_do($in_dir,$out_dir,$lang, $langMt);

	$in_dir = "src";
	$out_dir = "build/$lang";
	rebuild_comp_do($in_dir,$out_dir,$lang, $langMt);
}

/* Bundle all component templates into the js file. */
function rebuild_comp_do($in_dir,$out_dir,$lang, $langMt){
	if(!file_exists($out_dir)) mkdir($out_dir, 0777, true);

	$files = scandir($in_dir);
	
	foreach($files as $file) {
		if($file == "." || $file =="..") continue;
		if(str_ends($file,'.js')){
			$name = substr($file,0, strlen($file) -3);
			rebuild_comp_file($in_dir, $out_dir, $name, $langMt);
		}
	}
}

function rebuild_comp_file($in_dir, $out_dir, $name, $langMt){ global $TRANS;
	$output = $out_dir."/".$name.".js";

	$in_js = $in_dir."/".$name.".js";
	$in_tpl = $in_dir."/".$name.".html";

	$outMt = file_exists($output)  ? filemtime($output) : 0;
	$inMt  = filemtime($in_js);

	if(file_exists($in_tpl)) $inMt = max($inMt, filemtime($in_tpl));


	// output older than template and language
	if($outMt > 0 && $inMt <= $outMt && $langMt <= $outMt) return;
	echo "rebuild: ".$output."<br>";


	$tpl = "";
	if(file_exists($in_tpl)){
		// remove newlines
		$tpl = preg_replace('/^\s+|\n|\r|\s+$/m', '', file_get_contents($in_tpl));
		$tpl = preg_replace_callback('/\$\(([a-zA-z_0-9]+)\)/', 'rebuild_comp_trans', $tpl );
	}

	$fp = fopen($output,'w');
	$lines = file($in_js);

	foreach($lines as $line){
		$idx = strpos($line,"'<-TEMPLATE->'");
		if($idx !== false){
			fputs($fp, substr($line,0,$idx));
			fputs($fp, json_encode($tpl));
			fputs($fp, substr($line,$idx+14));
		}else{
			fputs($fp,$line);
		}
		// fputs($fp,"\n");
	}

	flush($fp); fclose($fp);
}

function rebuild_comp_trans($match){ global $TRANS;
	$code = $match[1];
	$ret = $TRANS[$code];
	if($ret) return $ret;
	return $code;
}

function rebuild_comp_add_path($dir, $file){
	if($dir == '') return $file;
	return $dir.'/'.$file;
}

?>