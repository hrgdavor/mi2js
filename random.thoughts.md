# general
 - avoid programming inside templates (no code evaluation or property expansion)


# cleanup
 - remove leftovers of previous approach to inputs 
   - remove support for augmenting `<input>` fields and `<form>` elements 
   - abandon `<form>` element as it fails for nested forms (editing object graph)
 - rethink if distinction between augmented html node and real component is needed
   - augmented node has no other information except the node reference
 - rethink form validation
   - ? remove label reference and info box reference
 - rethink validation error filter
   - for combining form default validation and custom validation after
   - filter for getting validation error from server
   - for easier adding validation errors
   - ? validation object with some utiliy metohds
 - refactor Table, remove onclick handler and move it to base/ClickableRow maybe

# event (and direction for fire)
 - Button - fire to parent (dir:down, hops:1) or (call on parent, hops:0)
 - visibility(show/hide) - fire to children to notify visibility changed (propagation based on visibility)
 - RenderTable - fire to parent (dir:down, hops:1) or (call on parent, hops:0)
 - List - forward dir:down events, preserve hops

## components delegating stuff to parent (transitive)
 - transitive components are just placeholders, used by some other component
   - example1: `base/Loop` with multiple copies of a component (multi address editor)
 - When extending, component can be made non-transitive again by overriding `isTransitive` to `return false`
 - event should be recognized somehow so transitive component can forward it up or down
 - filtering is transitive for transitive component
 - if multiple functionalities can have different behavior for transitive component
  - ? how to handle situation when you want to have partial transitive behavior

Use case for `base/Button` 
 - fires action event to parent directly
 - parent does not have to add listener to each button, just add `on_actionName` method
 - transient component should forward the event to the parent

## components firing events down to parent
 - should have event="xxx" attribute to change event name
 - should have action="xxx" attribute to enable one event handler handlig similar actions
   - example: event="changeLanguage" action="en"
   - example: event="delete" action="archive"
   - example: event="rowClick" action="preview"


## show/hide event
 - [x] parent show:
   - [x] visible child: forward
   - [x] hidden  child: ignore
 - [x] parent hide:
   - [x] visible child: forward
   - [x] hidden  child: ignore
 - [x] check parent visibility before firing (if parent is hiden hide was fired already)
 - [x] initial show event must be fired to avoid incosistencies

# data source
 - syntax like filters (name and parameters separated by commas)
 - yesNo

# filters
 - filters a value to another value (number,string,object) 
 - some textual filter examples: date, datetime, datetime-with-seconds ... etc 
 - some are locale specific
   - date (31.12.2015)
   - decimal (1.000,00 or 1,000.00 )
 - filter(x,'date') returns x filtered as date 
 - filter(x,['decimal',2]) returns x filtered as decimal (options:[2] , understood as 2 decimal places)
 - null handling
   - ifNull,empty 

## filters in transitive components
 - is local filtering needed ? 
 - maybe work on nicer looking data transformation when preparing for ViewPort

## renderers
 - render HTML (for short filtered texts without using components)
 - __actually it is a regualr filter, but receiving side mut allow the HTML to be injected and not converted to plain text__
 - 

# RenderTable
examples of column config
```javascript
date:{
    title: t('date'),
    filter: 'date',
}
```

parameters inside template
```html
<cell-age-template></cell-age-template>
<cell-template col="age"></cell-template>
```

# template fornmat and transformation
```html
- ${propname:filter} -
  <tpl-text p="text.propname" filter="filter"></tpl-text>
- ${birthday:ifNull,unknown,date}
  <tpl-text p="text.birthday" filter="ifNull,unknown,date"></tpl-text>
- <div>${age:intStr}</div>
  <div><tpl-text p="text.age" filter="intStr"></tpl-text></div>
```

# inputs for numbers
 - communication type (int, float)
  - display filter (language specific: 1.00 1,00)
  - null incomming: empty or zero
  - null/empty outgoing (domNode.value is null) is null or zero ? config ?
  - parsing more forgiving than filter ( nice option is to use last decimal as decimal and ignore rest)
    - 1.000,01 -> 1000.01
    - 100,1 -> 100.1
    - 1,2,3,4 -> 123.4 (unlikely user will type this, but)
  - onchange refilter (parse+filter) to display what was understood
  - validation options (min,max,required)



