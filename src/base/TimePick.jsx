// @jsx h
// @jsxFrag "frag"
// @jsxRuntime classic

export function TimePickTpl(h, t, state, self){return(<>

<input p="timePickInput" readonly/>
<div p="timePicker" class="time-picker" tabindex="-1" hidden>
    <div class="section hour">
        <label>{t`hours`}</label>
        <input type="number" p="hrInput" class="hr" />
    </div>
    <div class="separator">:</div>
    <div class="section minute">
        <label>{t`minutes`}</label>
        <input type="number" p="minInput" class="min" />
    </div>
    <div p="secSeparat" class="separator">:</div>
    <div p="secForm" class="section second">
        <label>{t`seconds`}</label>
        <input type="number" p="secInput" class="sec" />
    </div>
</div>

</>)}
