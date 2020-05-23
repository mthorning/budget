<div>
    <h3>
        {`${balanceType.charAt(0).toUpperCase()}${balanceType.substr(1)}`}
        <span>£{(entries.reduce((acc, curr) => acc += curr.amount, 0)).toFixed(2)}</span>
    </h3>

    <table>
        <thead>
            {#each columns as col}
                <th>{col}</th>
            {/each}
        </thead>
        <tbody>
            {#each entries as entry (entry.timestamp)}
                <EditableRow 
                    on:balanceEdit
                    on:balanceDelete
                    {...{ balanceType, columns, entry }} 
                />
            {/each}
            <InputRow on:balanceAdd {...{ columns, balanceType }} />
        </tbody> 
    </table>
</div>

<script>
    import InputRow from './InputRow.svelte';
    import EditableRow from './EditableRow.svelte';
    export let balanceType, balances;
    let columns = ['description', 'amount']

    
    $: entries = balances[balanceType] || [];

</script>

<style>
    div {
        width: 30vw;
        border: 1px solid gray;
        height: 100%;
        margin: 4px;
        padding: 4px;
    }
    h3 span {
        float: right
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th {
        border: 1px solid #555;
    }
</style>
