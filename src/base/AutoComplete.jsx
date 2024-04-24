// @jsx h
// @jsxFrag "frag"
// @jsxRuntime classic

export function AutoCompleteTpl(h, t, state, self){return(<>

<div p="div" class="AutoCompleteList" hidden></div>
<input type="hidden" p="idInput"/>
<input type="text" p="textInput" autocomplete="auto-complete"/>
<b class="bt icon icon-delete" p="clearBt" event="clear" as="base/Button" hidden></b>

</>)}
