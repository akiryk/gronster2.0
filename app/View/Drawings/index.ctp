<!-- File: /app/View/Drawings/index.ctp -->
<h1>Index of Drawings</h1>

<table>
    <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Created</th>
    </tr>

    <!-- Here is where we loop through our $posts array, printing out post info -->

    <?php foreach ($drawings as $drawing): ?>
    <tr>
        <td><?php echo $drawing['Drawing']['id']; ?></td>
        <td> 
            <?php 
                if ($drawing['Drawing']['drawing_small'] != null){
                    $image = '/' . $drawing['Drawing']['drawing_small'];
                    echo $this->Html->image($image, array('url' => 'view/' . $drawing['Drawing']['id']));
                } else {
                    echo $this->Html->link($drawing['Drawing']['name'],array('controller' => 'drawings', 'action' => 'view', $drawing['Drawing']['id']));
                }
            ?>

            <?php  ?>
        </td>
        <td>
        	<?php 
        				// use postLink() to post the delete request using javascript
        	echo $this->Form->postLink(
                'Delete',
                array('action' => 'delete', $drawing['Drawing']['id']),
                array('confirm' => 'Are you sure?'));
            ?>

        </td>

        <td><?php echo $drawing['Drawing']['panel_count']; ?></td>
    </tr>
    <?php endforeach; ?>

</table>