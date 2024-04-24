// @jsx h
// @jsxFrag "frag"
// @jsxRuntime classic

export function CalendarWidgetTpl(h, t, state, self){return(<>

  <div class="">
	<select p="year" as="base/Input"></select>
	<select p="month" as="base/Input">
		<option value="0">{t`month1`}</option>
		<option value="1">{t`month2`}</option>
		<option value="2">{t`month3`}</option>
		<option value="3">{t`month4`}</option>
		<option value="4">{t`month5`}</option>
		<option value="5">{t`month6`}</option>
		<option value="6">{t`month7`}</option>
		<option value="7">{t`month8`}</option>
		<option value="8">{t`month9`}</option>
		<option value="9">{t`month10`}</option>
		<option value="10">{t`month11`}</option>
		<option value="11">{t`month12`}</option>
	</select>
</div>
<div class="calendar-mid">
	<table>
		<thead p="dayNames" names={[t`sday0`,t`sday1`,t`sday2`,t`sday3`,t`sday4`,t`sday5`,t`sday6`].join(',')}></thead>
		<tbody p="dayGrid" class="CalendarDays"></tbody>
	</table>
	<div hidden p="timeArea">
		<div><input p="times."/></div>
		<input p="times."/>
		<span>:</span>
		<input p="times."/>
		<input p="times."/>
	</div>
</div>
<div class="buttons">
	<a p="today" class="bt" as="base/Button" event="today">{t`today`}</a>
	<a p="done" class="bt" as="base/Button" event="done">{t`done`}</a>
	<a p="clear" class="bt" as="base/Button" event="done" action="clear">{t`clear`}</a>
	<input p="timeInput" size="5" as="base/Input"/>
</div>

</>)}
