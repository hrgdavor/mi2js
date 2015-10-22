# Table component
 - collect TH tags as definitions for column headers
 - collect TD tags as definitions for table cells (they become part or row component template)

to setup table you can define the template in this way:

```html
<table as="base/Table">
    <tr>
        <th column="first" sort>First</th><td gender="${gender}">${first}</td>
        <th column="last" sort>Last</th>  <td>${last}</td>
        <th column="age" sort>Age</th>    <td>${age}</td>
    </tr>
</table>
```

 - Browser will wrap the TR tag with TBODY by default
 - Table component will move all TH tags to table's THEAD to get variant below 

Above variant is more manageable when needing
to move columns in temmplate as TH and TR are together. Both variants can be used
when configuring the Table cmponent.

```html
<table as="base/Table">
    <thead>
        <th column="first" sort="">First</th>
        <th column="last" sort="">Last</th>
        <th column="age" sort="">Age</th>
    </thead>
    <tbody>
        <tr as="base/Tpl">
            <td gender="${gender}">${first}</td>
            <td>${last}</td>
            <td>${age}</td>
        </tr>
    </tbody>
</table>
```

 - The first row will be used as template for creating new rows depending on number of elements
   provided in setValue(data).
 - default component for the row is base/Tpl
 - if using a custom component, it has to handle te display of the data itself

Data can now be displayed by calling setValue.

```javascript
var data = [
    {first:"John", last:'Doe',   age:44, gender:'M'},
    {first:"Mary", last:'Blast', age:33, gender:'F'}
];
table.setValue(data);
```

results in this HTML

```html
<table as="base/Table">
    <thead>
        <th column="first" sort="">First</th>
        <th column="last" sort="">Last</th>
        <th column="age" sort="">Age</th>
    </thead>
    <tbody>
        <tr as="base/Tpl">
            <td gender="M">John</td>
            <td>Doe</td>
            <td>44</td>
        </tr>
        <tr as="base/Tpl">
            <td gender="F">Mary</td>
            <td>Blast</td>
            <td>33</td>
        </tr>
    </tbody>
</table>
```
