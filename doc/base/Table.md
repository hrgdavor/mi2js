# Table component
 - collect TH tags as definitions for column headers
 - collect TD tags as definitions for table cells (they become part or row component template)

to setup table you can define the template in this way

```html
<table>
    <tr>
        <th column="first" sort></th><td gender="${gender}">$(first)</td>
        <th column="last" sort></th> <td>$(last)</td>
        <th column="age" sort></th>  <td>$(age)</td>
    </tr>
</table>
```

becomes

```html
<table as="abe/Table">
    <thead>
        <tr>
            <th column="first" sort></th>
            <th column="last" sort></th>
            <th column="age" sort></th>
        </tr>
    </thead>
    <tbody>
        <tr as="base/TableRow">
            <td gender="${gender}">$(first)</td>
            <td>$(last)</td>
            <td>$(age)</td>
        </tr>
    </tbody>
</table>
```
