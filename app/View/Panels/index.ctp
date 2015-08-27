<!-- File: /app/View/Drawings/index.ctp -->
<h1>Index of Panels</h1>

<table>
    <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Created</th>
    </tr>

    <!-- Here is where we loop through our $posts array, printing out post info -->

    <?php foreach ($panels as $panel): ?>
    <tr>
        <td><?php echo $panel['Panel']['id']; ?></td>
        <td> 
           Hello
        </td>
        <td>
        

        </td>

       
    </tr>
    <?php endforeach; ?>

</table>