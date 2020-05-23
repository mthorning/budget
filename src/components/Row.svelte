<tr >
    {#each columns as col}
        <td bind:this={els[col]} on:keydown={onKeydown(col)} contenteditable="true" />
    {/each}
</tr>

<script>
    import { createEventDispatcher } from 'svelte';
    export let balanceType, columns;

    const dispatch = createEventDispatcher();
    const els = {};

    const onKeydown = col => e => {
        if(e.keyCode === 13) {
            e.preventDefault();
            const newBalance = columns.reduce((balances, col) => {
                const value = els[col].innerHTML.trim(); 
                return value ? { ...balances, [col]: value } : balances;
            }, {});
            if(Object.keys(newBalance).length === columns.length) {
                dispatch('balanceAdd', { balanceType, newBalance });
                for(const el in els) {
                    els[el].innerHTML = '';
                    els[columns[0]].focus();
                }
            }
        }
    }
</script>

<style>
    td {
        border: 1px solid #555;
    }
</style>
