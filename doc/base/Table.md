# Table component
 - collect TH tags as definitions for column headers
 - collect TD tags as definitions for table cells (they become part or row component template)

to setup table you can define the template in this way:

```html
<table>
    <tr>
        <th column="first" sort></th><td gender="${gender}">${first}</td>
        <th column="last" sort></th> <td>${last}</td>
        <th column="age" sort></th>  <td>${age}</td>
    </tr>
</table>
```

 - Browser will wrap the TR tag with TBODY by default
 - Table component will move all TH tags to table's THEAD to get variant below 

Above variant is more manageable when needing
to move columns in temmplate as TH and TR are together. Both variants can be used
when configuring the Table cmponent.

```html
<table as="abe/Table">
    <thead>
        <th column="first" sort=""></th>
        <th column="last" sort=""></th>
        <th column="age" sort=""></th>
    </thead>
    <tbody>
        <tr as="base/Tpl">
            <td gender="${gender}">$(first)</td>
            <td>$(last)</td>
            <td>$(age)</td>
        </tr>
    </tbody>
</table>
```

