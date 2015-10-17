# general
 - avoid programming inside templates (no code evaluation or property expansion)

# event (and direction for fire)
 - Button - fire to parent (dir:down, hops:1) or (call on parent, hops:0)
 - visibility(show/hide) - fire to children to notify visibility changed (propagation based on visibility)
 - RenderTable - fire to parent (dir:down, hops:1) or (call on parent, hops:0)
 - List - forward dir:down events, preserve hops

## components firing events down to parent
 - should have event="xxx" attribute to change event name
 - should have action="xxx" attribute to enable one event handler handlig similar actions
  - example: event="changeLanguage" action="en"
  - example: event="delete" action="archive"
  - example: event="rowClick" action="preview"

## show/hide event
 - afterCreate event becomes obsolete after this works (used only by ShowHide component now)
 - ? should ti be event
 - parent show:
  - visible child: forward
  - hidden  child: ignore
 - parent hide:
  - visible child: forward
  - hidden  child: ignore
 - check parent visibility before firing (if parent is hiden hide was fired already)
 - initial show event must be fired to avoid incosistencies

# formaters
 - formats a value to another value (number,string,object) 
 - some textual format examples: date, datetime, datetime-with-seconds ... etc 
 - some are language specefic
  - date (31.12.2015)
  - decimal (1.000,00 or 1,000.00 )
 - format(x,'date') returns x formatted as date 
 - format(x,['decimal',2]) returns x formatted as decimal (options:[2] , understood as 2 decimal places)
 - null handling
  - ifNull,empty 


# renderers
 - render HTML (for short formated texts without using components)
 - __actually it is a regualr formatter, but receiving side mut allow the HTML to be injected and not converted to plain text__
 - 

# RenderTable
examples of column config
```javascript
date:{
    title: t('date'),
    format: 'date',
}
```

parameters inside template
```html
<cell-age-template></cell-age-template>
<cell-template col="age"></cell-template>
```

# template fornmat and transformation
```html
- ${propname:format} -
  <tpl-text p="text.propname" format="format"></tpl-text>
- ${birthday:ifNull,unknown,date}
  <tpl-text p="text.birthday" format="ifNull,unknown,date"></tpl-text>
- <div>${age:intStr}</div>
  <div><tpl-text p="text.age" format="intStr"></tpl-text></div>
```

# inputs for numbers
 - communication type (int, float)
  - display format (language specific: 1.00 1,00)
  - null incomming: empty or zero
  - null/empty outgoing (domNode.value is null) is null or zero ? config ?
  - parsing more forgiving than format ( nice option is to use last decimal as decimal and ignore rest)
    - 1.000,01 -> 1000.01
    - 100,1 -> 100.1
    - 1,2,3,4 -> 123.4 (unlikely user will type this, but)
  - onchange reformat (parse+format) to display what was understood
  - validation options (min,max,required)



