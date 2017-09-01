# general
 - avoid programming inside templates (no code evaluation or property expansion)

# component initialization
  - component is contructed ( `construct` )
    - define
  - if lazyInit nothing else happens until visible or initialized
    - if component does not have a parent and is visible already initialize it anyway so root component is started properly as expected by the user
  - `__init` - do initialization if not done already (safe to call multiple times)
  - `afterParentInit` ( in this pahse all children are created but their tempalte is not applied yet )
  - `initTemplate` ( apply template and construct children, at this stage it is like all children are lazy-initialized )
  - `afterInitTemplate`
  - `initChildren` ( initTemplate for each child that is "not lazyInit and hidden" )

initializing component template has few use cases.
 - a node without children and component that has html defined to put inside

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

# useful boolean attributes in html
  - disabled
  - required
  - selected
  - checked
  - readOnly
  - open

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

# unify array/map for components
  - components sometimes follow organization like object graph
  - a simple component can be regarded like a simple value in object graph
  - components grouped by key/value are similar to objects and maps
  - components repeated with just ordering (key being the location in the array is array like organization)
  - common operations
    - array: push(c) , map: add(key,c)
    - array: remove(key), map: remove(key)
    - array: remove(c), map: remove(c)  ... compare object and remove the key as well
    - array: slice(index,count, insert extra...) ... useful array manipulation func
    - array: move(c, cBefore)
    - array: insertBefore(c, cBefore)
    - array: insert(c, index) ... alias to slice(index,0,c)
    - array: indexOf(c):key  map:indexOf()  ... makes sense even for map if needed 

# inline loop
```html
<table as="base/Loop" template>
  <tr  template>
    <td p="leftColumns" loop as="base/CheckBox">${}</td>
    <td>Divider</td>
    <td p="rightColumns" loop="base/Loop" as="base/Button">${}</td>
  </tr>
  <tr class="footer">
    <td>...</td>
  </tr>
</table>


```


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

# template for components
 - make parser inspect and use all dom elements even inside a component, unless `template` attribute is present
 - this means child component parsing is deferred until all current nodes are checked to avoid the component changing the DOM
 - this will allow a component to access all that is defined in it's own template even if placed inside another
 - components that will allow the parent to have things placed inside them (tab component or alike) will have to account for it. There is already a way to get references to already instantiated components from the parent

# template format and transformation
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
  - [x] onchange refilter (parse+filter) to display what was understood
  - [x] validation options (min,max,required)


# validation
 - define fields to skip  
    - if needed for dsiabling validation fo fields that are not currently used due to some reason
    - example: checkbox for advanced options (if disabled, do not validate theose options)
 - validate input text (out filter can interfere, need to use getRawValue)
 - required validation can be done also via value, if input returns null for empty value
 - validate input values
 - custom validation for values
 - async validation for values


# AutoComplete

## Free text with proposals
non existing value + ENTER
 - apply selection

non existing value + TAB
 - set value same as the text

## Classic selection
