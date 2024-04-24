import { TimePickTpl } from './TimePick.jsx'
export default { TimePickTpl }

mi2JS.addCompClass('base/TimePick', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype
  function (proto, superProto, comp, mi2, h, t, filters) {

    proto.initChildren = function () {
      superProto.initChildren.call(this)

        this.sec = this.attr('sec')
        this.min = this.attr('min')
        this.focus = false
                    
        this.listen(this.hrInput.el,'keyup', this.changeHour)
        this.listen(this.minInput.el,'keyup', this.changeMin)
        this.listen(this.secInput.el,'keyup', this.changeSec)

        this.listen(this.timePickInput.el,'click', () => {
            if(!this.attr('disabled')){
                this.timePicker.setVisible(!this.timePicker.isVisible());
                this.timePicker.el.focus(); 
                this.timePicker.isVisible() ? this.focus = true:this.focus = false
            }
        })
        
        this.listen(this.timePicker.el,'blur', () => {
            this.focus = false
        })
        
        this.listen(this.parent.el,'click', (evt) => {
            let evtParentEl = evt.target.parentNode.parentNode
			if(evt.target.getAttribute('p') === 'timePickInput'){
                if(this.focus) return
                this.timePicker.setVisible(false)
            } 
			if(evtParentEl && evtParentEl.getAttribute('p') === 'timePicker' ) return
			this.timePicker.setVisible(false)
            this.focus = false 
        })
    }

    proto.setValue = function(data) {
        if(this.min){
            this.secForm.setVisible(false)
            this.secSeparat.setVisible(false)
        }
        if(!data) return
        this.state.value = data
        this.hour = (data && this.sec) ? Math.floor(data / 3600) : (data && !this.sec) ? Math.floor(data / 60) : '0'
        this.minute = (data && this.sec) ? Math.floor(data % 3600 / 60) : (data && !this.sec) ? Math.floor(data % 3600 % 60) : '0'
        this.second = (data && this.sec) ? Math.floor(data % 3600 % 60) : '0'
        this.hrInput.setValue(this.hour)
        this.minInput.setValue(this.minute)
        this.secInput.setValue(this.second)
        let setSeconds = this.sec ? ' :'+this.secInput.getValue()+'sec':''
        this.timePickInput.setValue(this.hrInput.getValue()+'h :'+this.minInput.getValue()+'min'+setSeconds)
    }

    proto.checkLength = function(e){
        let value = e.target.value
        if(value.length > 2) e.target.value = value.substring(0,2)
        if(value.length === 0) e.target.value = 0
        return e
    }

    proto.changeHour = function(e){
        e = this.checkLength(e)
        if (parseInt(e.target.value) < 0) e.target.value = '0'

        this.hrInput.setValue(e.target.value)
        this.hour = parseInt(e.target.value)
        let convertVal = (this.sec) ? this.convertToSec() : this.convertToMin()
        this.setValue(convertVal)
        this.fireEvent({name:'change', value: convertVal})
    }

    proto.changeMin = function(e){
        e = this.checkLength(e)
        if (parseInt(e.target.value) > 59) e.target.value = 59
        if (parseInt(e.target.value) < 0) e.target.value = '0'

        this.minInput.setValue(e.target.value)
        this.minute = parseInt(e.target.value)
        let convertVal = (this.sec) ? this.convertToSec() : this.convertToMin()
        this.setValue(convertVal)
        this.fireEvent({name:'change', value: convertVal})
    }

    proto.changeSec = function(e){
        e = this.checkLength(e)
        if (parseInt(e.target.value) > 59) e.target.value = 59
        if (parseInt(e.target.value) < 0) e.target.value = '0'

        this.secInput.setValue(e.target.value)
        this.second = parseInt(e.target.value)
        let convertVal = (this.sec) ? this.convertToSec() : this.convertToMin()
        this.setValue(convertVal)
        this.fireEvent({name:'change', value: convertVal})
    }

    proto.getValue = function(){
        return this.state.value
    }

    proto.setTime = function(){
        this.hrInput.setValue(this.hour)
        this.minInput.setValue(this.minute)
        this.secInput.setValue(this.second)

        let convertVal = (this.sec) ? this.convertToSec() : this.convertToMin()

        // console.warn(convertVal)        
        this.state.value = convertVal
        this.timePickInput.setValue(this.hrInput.getValue()+'h :'+this.minInput.getValue()+'min :'+this.secInput.getValue()+'sec')
        this.fireEvent({name:'change', value: convertVal})
        // console.warn(this.parent.items.getValue())
    }

    proto.convertToSec = function(){
        return (parseInt(this.hrInput.getValue()) * 60 * 60) + (parseInt(this.minInput.getValue()) * 60) + parseInt(this.secInput.getValue())
    }

    proto.convertToMin = function(){
        return (parseInt(this.hrInput.getValue()) * 60) + parseInt(this.minInput.getValue())
    }

    proto.initTemplate = TimePickTpl

  }
)

