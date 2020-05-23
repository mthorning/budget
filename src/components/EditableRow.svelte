<tr >
    {#each columns as col}
        <td on:keydown={onKeydown(col)} contenteditable="true">{entry[col]}</td>
    {/each}
</tr>

<script>
    import { createEventDispatcher } from 'svelte';
    export let balanceType, entry, columns;

    const dispatch = createEventDispatcher();

    const onKeydown = col => e => {
        if(e.keyCode === 46) {
            dispatch('balanceDelete', { balanceType, timestamp: entry.timestamp });
        }

        if(e.keyCode === 13) {
            e.preventDefault();
            dispatch('balanceEdit', { 
                balanceType, 
                editedBalance: { ...entry, [col]: e.target.innerHTML },
                onSuccess: () => e.target.blur()
            });
        }
    }

</script>

<style>
    td {
        border: 1px solid #555;
    }
</style>
