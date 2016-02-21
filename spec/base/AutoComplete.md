# AutoComplete

 - Used to help choose values from existing options, or id/text pairs.
 - 

## general

### force value or allow empty
 - attribute: `no-empty` 
 - does not allow empty selection
 - selects first option as soon as data is available
 - selects first option when setValue is not in the list
 - if only one value is available

### empty value
 - attribute: `empty-id="..."` - by default null is used to as return value when nothing is selected
 - attribute: `empty-text="..."` - by default empty string `''` is displayed as option text for the unselect option. This can be customized to give contextual meaning to not selecting anything
 - 

### restrict options
 - use `getOptions` method internally to allow an override to temporarily restrict some of the options from the selection

### allow new value
Allow this AutoComplete to provide means of entering new value that is not in the provided options.

 - attribute: `allow-new`
 - attribute `new-value="..."` - by default void(0) is used as id
 - if text is entered that does not exist in the options

## Edge cases
 - 