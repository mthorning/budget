<tr>
    <td class="text-center"><input bind:this={checkbox} type="checkbox" checked={allChecked} /></td>
    {#each columns as col}
        <td on:blur={() => addEntry()} bind:this={els[col]} on:keydown={onKeydown} contenteditable="true" />
    {/each}
</tr>

<script>
    import { createEventDispatcher } from 'svelte';
    export let balanceType, columns, checkbox;
    export let allChecked = true;

    const dispatch = createEventDispatcher();
    const els = {};

    function onKeydown(e) {
        if(e.keyCode === 13) {
            e.preventDefault();
            addEntry(() => els[columns[0]].focus());
        }
    }

    function addEntry(focusNextRow) {
        const newBalance = columns.reduce((balances, col) => {
            const value = els[col].innerHTML.trim(); 
            return value ? { ...balances, [col]: value } : balances;
        }, {});

        if(Object.keys(newBalance).length === columns.length) {
            newBalance.timestamp = Date.now();
            newBalance.checked = checkbox.checked;

            const onSuccess = () => {
                for(const el in els) {
                    els[el].innerHTML = '';
                }
                if(focusNextRow) focusNextRow();
            }
            dispatch('balanceAdd', { balanceType, newBalance, onSuccess});
        }
    }
</script>

<style>
    td {
        border: 1px solid #555;
    }
</style>
