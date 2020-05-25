<tr class:strike={!entry.checked}>
    <td class="text-center"><input on:click={onCheck} type="checkbox" checked={entry.checked} /></td>
    {#each columns as col}
        <td on:blur={editEntry(col)} on:keydown={onKeydown(col)} contenteditable="true">{entry[col]}</td>
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
            editEntry(col)(e)
        }
    }

    const editEntry = col => e => {
            dispatch('balanceEdit', { 
                balanceType, 
                editedBalance: { ...entry, [col]: e.target.innerHTML },
                onSuccess: () => e.target.blur()
            });
    }

    function onCheck(e) {
        dispatch('balanceEdit', {
            balanceType,
            editedBalance: {...entry, checked: e.target.checked }
        });
    }

</script>

<style>
    td {
        border: 1px solid #555;
    }
    tr.strike {
        text-decoration: line-through;
    }
</style>
