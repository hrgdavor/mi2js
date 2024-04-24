<?
$SCRIPTS= "mi/mi";
include "../header.php";
  
include "../rebuild_comp.php";
rebuild_comp("en");






?>
<style>
  body, html{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
body, table, button{
  font-family: verdana;
}
button{
  border: none;
  background: transparent;
}

a {}
.disabled {
	border: solid 1px black;
}
[as="base/Button"]{
	cursor: pointer;
}

[as="base/Picker"]{
  cursor: pointer ;
  border: solid 1px #aaa;
  padding: 5px 10px;
}

.picker-click-ctrl{
  font-size: 14px;
  position: fixed;
  cursor: pointer;
  background: white;
  border: solid 1px #eee;
  padding: 5px;
}
.picker-click-ctrl > div{
  font-size: 14px;
  padding: 5px;
}

.picker-click-ctrl > div:hover,
.picker-click-ctrl > div.selected{
  background: #eee;
}

*[hidden] {
  display: none !important;
}
</style>
<script src="../src/mi2.js"></script>
<script src="../src/html.js"></script>
<script src="../src/html.common.js"></script>
<script src="../src/parse.js"></script>
<script src="../src/filter.js"></script>
<script src="../src/comp.js"></script>
<script src="../src/Base.js"></script>
<script _src="../src/NWGroup.js">
(function(){

  var mi2 = mi2JS;
/**
@class NWGroup
@memberof mi2JS(core)
*/
  var DEF = mi2.NWGroup = function NWGroup(group){

    // better we fix the case when called without "new" operator than confusing developer with err later
    if(!(this instanceof DEF)) return new DEF(group);
    if(group) for(var p in group) this[p] = group[p];

  }

  function makeMap(arr, val){
    // TODO in j6x use Map
    var obj = {};
    if(typeof arr == 'string'){
            obj[arr] = val;
        }else if(arr instanceof Array || arr.length){
          // if came from single argument array parameter like: visibleIs(['a','b']);
          if(arr.length == 1 && arr[0] instanceof Array ) arr = arr[0]; 
            for(var i=0; i<arr.length; i++){
                obj[arr[i]] = val;
            }          
    }else{
      return arr; // already a map
    }
    return obj;
  }

  var nwDefs = {};

  mi2.addToNwGroup = function(prop, val){
    Object.defineProperty(DEF.prototype, prop, nwDefs[prop] = {value:val});
  }
  
  mi2.applyNwGroup = function(obj){
    for(var p in nwDefs) Object.defineProperty(obj, p, nwDefs[p]);
      return obj;
  }

  /** 
  like array for each, but also supports object (string keys)

  @method forEach
  @instance
  @memberof mi2JS(core).NWGroup
  */
  mi2.addToNwGroup('forEach', function(func){
    for(var p in this){
      func(this[p], p, this);
    }
  });

/**
@method item
@instance
@memberof mi2JS(core).NWGroup
*/
  mi2.addToNwGroup('getItem', function(code){
    if(code && code.tagName){
      for(var p in this) if(this[p].el == code) return this[p];
    }
    return this.items[code];
  });

  mi2.addToNwGroup('toggleParams', function(funcName, arr, on, off){
    var what = makeMap(arr, true), items = this, item;
    for(var p in items){
      item = items[p];
      item[funcName].apply( item, what.hasOwnProperty(p) ? on : off );
    }
  });


  function addToggle(funcName, prop){
    // new Name
    mi2.addToNwGroup(funcName+'Ex', function(){
      this.toggleParams(funcName,  arguments, [true], [false]);
    });
    mi2.addToNwGroup(prop, function(){
      this.toggleParams(funcName,  arguments, [true], [false]);
    });
  }
  // TODO in j6x remove visibleIs..., leave *Ex
  addToggle('setVisible', 'visibleIs');// + setVisibleEx
  addToggle('setEnabled', 'enabledIs');// + setEnabledEx
  addToggle('setSelected', 'selectedIs');// + setSelectedEx


  mi2.addToNwGroup('getValue', function(){
    var ret = (this instanceof Array) ? []:{};
    for(var p in this){
      if(this[p].getValue){       
        var val = this[p].getValue();
        if(val !== void 0) ret[p] = val;
      }else{
        mi2.logError('getValue not defined for '+p,new Error(p),{key:p, obj:this[p]});
      }
    }
    return ret;
  });

  mi2.addToNwGroup('setValue', function(value){
    value = value || {};
    for(var p in this){
      if(this[p].setValue){       
        this[p].setValue(value[p]);
      }else{
        mi2.logError('setValue not defined for '+p,new Error(p),{key:p, obj:this[p]});
      }
    }
  });

  mi2.addToNwGroup('setConfig', function(config){
    config = config || {};
    for(var p in this){
      if(this[p].setConfig){
        this[p].setConfig(config[p]);
      }else{
        mi2.logError('setConfig not defined for '+p,new Error(p),{key:p, obj:this[p]});
      }
    }
  });

  mi2.addToNwGroup('forEachGet', function(func){
    if(this instanceof Array){
      var ret = [];
      for(var p in this){
          var val = func(this[p], p, this);
          if(val !== void 0) ret.push(val);
      }
    }else{
      var ret = {};
      for(var p in this){
          var val = func(this[p], p, this);
          if(val !== void 0) ret[p] = val;
      }
    }
    return ret;
  });


}());
  

mi2JS.addToNwGroup('sum', function(){ 
  var sum = 0;
  for(var p in this) sum +=this[p];
    return sum;
});


var y = new mi2JS.NWGroup();
y.a=1;
y.b=5;
console.log('sum',y.sum());


function InnerTest(){}
var proto = InnerTest.prototype;
Object.defineProperty(proto, 'setValue', {value:function(v){this.value = v}});
Object.defineProperty(proto, 'setVisible', {value:function(v){this.visible = v}});
Object.defineProperty(proto, 'setConfig', {value:function(c){this.config = c}});
Object.defineProperty(proto, 'getValue', {value:function(){return this.value}});


var t = new mi2JS.NWGroup();
t.a = new InnerTest();
t.b = new InnerTest();
t.setValue({a:1,b:2});
t.setConfig({a:11,b:22});
console.log('t',Object.keys(t), t.getValue(), t);
t.a.setValue(10001);
console.log('t',t.getValue(), t.forEachGet(item=>item.value % 2 == 0? item.value:void 0));

for(var p in t) console.log(p, t[p].getValue());

var t = [new InnerTest(), new InnerTest(),new InnerTest(), new InnerTest()];
mi2JS.applyNwGroup(t);
t.setValue([1,2,3,4]);
t.setConfig([11,22]);
console.log('t', Object.keys(t), t.getValue(), t);
t[0].setValue(10001);
console.log('t',t.getValue(), t.forEachGet(item=>item.value % 2 == 0? item.value:void 0));


t.visibleIs(1);
for(var p in t) console.log(p, t[p].visible, t[p].getValue());

console.table(t);

</script>

<script src="../mi2.ext.js"></script>

<script src="../build/en/base/Group.js"></script>
<script src="../build/en/base/Button.js"></script>
<script src="../build/en/base/InputBase.js"></script>
<script src="../build/en/base/Input.js"></script>
<script src="../build/en/base/Calendar.js"></script>
<script src="../build/en/base/CalendarWidget.js"></script>
<script src="../build/en/base/Loop.js"></script>
<script src="../src/util/ScrollableList.js"></script>
<script type="text/javascript">
function t(code) {return code;}


mi2JS.addCompClass('base/Picker', 'base/InputBase', '',


// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){
 
  var mi2 = mi2JS;
  var configId = 1;

  proto.initChildren = function(){
    superProto.initChildren.call(this);
    this.value = 1;
    this.config = [];
    this.configId = ++configId;
    this.mode = this.attrDef('mode','click');

    this.listen(this.el, 'touchstart',this.on_mousedown);
    this.listen(this.el, 'mousedown');      
    this.listen(this.el, 'mousemove');      
    this.listen(this.el, 'mouseout', this.on_mousemove);

    if(this.mode == 'click'){
      this.listen(this.el, 'click',this.on_mousedown);
    }//else if(this.mode == 'mousedown'){
    //}
  };
 
  proto.on_mousemove = function(evt){
    if(this.isReadOnly()) return;
    if(this.mouseIsDown && (evt.type=='mouseout' || Math.abs(evt.clientX - this.clientX) > 3 || Math.abs(evt.clientY - this.clientY) > 3)){
      this.moveActivated = true;
      this.showPopup();
    }
  };

  proto.on_mousedown = function(evt){
    this.moveActivated = false;
    evt.stop();
    if(this.isReadOnly()) return;
    
    this.mouseIsDown = evt.type == 'mousedown';

    if(this.mouseIsDown){
      this.clientX = evt.clientX;
      this.clientY = evt.clientY;
    }
    if(this.mode == evt.type){
      this.showPopup();
    }
  };

  proto.setRawValue = function(value){
    this.selected = null;
    var self = this;
    this.config.forEach(function(item,i){
      if(value == item.id){
        self.selected = item;
      } 
    });

    this.updateText(this, this.selected);
  };

  proto.on_click = function(evt){
    this.mouseIsDown = false;
    var target = evt.target;
    while(target && !target.data) target = target.parentNode;
    if(!target.data) return;
    this.selected = target.data;
    this.updateText(this, this.selected);
    this.hidePopup();
    this.fireIfChanged();
  };

  proto.updateText = function(item, value){
    if(value){
      if(value.html)
        item.setHtml(value.html);
      else
        item.setText(value.name || value.text);    
    }else{
      item.setText('');
    }
  };
  
  proto.setConfig = function(conf){
    this.config = conf;
    this.configId = ++configId;
  };

  proto.cancelPopup = function(){
    this.hidePopup();
  };

  proto.hidePopup = function(){
    proto.ctrl.currentComp = null; 
    proto.ctrl.setVisible(false); 
  }

  proto.showPopup = function(){
    var self = this;
    if(!this.ctrl){
      proto.items = [];
      proto.ctrl = new mi2(mi2.insertHtml(document.body,new mi2JS.TagDef('DIV')));
      this.view = new mi2(proto.ctrl.el);

      //proto.ctrl.el
      mi2.listen(document,'mouseup', function(evt){
        var currentComp = proto.ctrl.currentComp;
        if(!currentComp) return;
        if(!currentComp || (currentComp.mode != 'mousedown' && !currentComp.moveActivated )) return;

        var i=0, parent = evt.target.parentNode;
        while(i< 5 && parent && parent != proto.ctrl.el){
          parent = parent.parentNode;
          i++;
        }

        if(parent != proto.ctrl.el){
           currentComp.cancelPopup();
        }else{
          currentComp.on_click(evt);
        }
        currentComp.mouseIsDown = false;
      });

      mi2.listen(proto.ctrl.el,'click', function(evt){
          if(proto.ctrl.currentComp){
            if(proto.ctrl.currentComp.mode == 'mousedown') return;
            proto.ctrl.currentComp.on_click(evt);
          } 
      });

    }
    if(this.configId != proto.ctrl.configId){
      proto.ctrl.configId = this.configId;
      var config = this.config;
      proto.items = [];
      this.ctrl.el.innerHTML = '';

      for(var i=0; i<config.length; i++){
        var data = config[i];
        if(typeof data == 'string' || typeof data == 'number') data = {id:data, name:data};
        var el = mi2.insertHtml(this.ctrl.el,new mi2JS.TagDef('DIV'));
        el.data = data;

        el = new mi2(el);
        this.updateText(el, data);
        this.items.push(el);
      }
    }

    var value = this.selected ? this.selected.id : null;
    this.items.forEach(function(item,i){
      item.setSelected(value == item.el.data.id);
    });

    proto.ctrl.currentComp = this;

    var offsetTop = 0;
    var value = this.selected ? this.selected.id : void 0;
    proto.ctrl.setVisible(true);
    this.items.forEach(function(item){
      if(item.el.data.id == value) offsetTop = item.el.offsetTop * -1;
    });
    proto.ctrl.el.className = 'picker-click-ctrl '+this.attrDef('ctrl-class');

    mi2.popupControl(this,this.ctrl, {alignTop:'top', offsetTop:offsetTop} );
  };

  proto.getRawValue = function(){
    return this.selected ? this.selected.id : void 0;
  };
  
});



function test(){
  var inp = mi2JS.makeComp(document.getElementById('component'));
  var conf = [];
  for(var i=0; i<=10; i++){
    conf.push({id:i/10, name:(i*10)+'%'});
  }
  inp.setConfig(conf);
  inp.setValue(0);
  inp.listen(inp,'change', function(evt){
    console.log('change',evt);
  });
  inp = mi2JS.makeComp(document.getElementById('component2'));
  inp.setConfig(conf);
  inp.setValue(0.4);
}



</script>
<BODY onload="test()">
  <div>
    <button id="component" as="base/Picker" mode="mousedown"></button>
    <button id="component2" as="base/Picker" style="position: absolute; top: 200px; left: 100px;"></button>
  </div>
  <button style="height: 1000px"></button>
</BODY>
