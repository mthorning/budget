<div class="wrapper">
    <h3>
        {`${balanceType.charAt(0).toUpperCase()}${balanceType.substr(1)}`}
        <span>£{(total ? total : 0).toFixed(2)}</span>
    </h3>

    <div class="table">
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
</div>

<script>
    import InputRow from './InputRow.svelte';
    import EditableRow from './EditableRow.svelte';
    export let balanceType, balances, total;

    let columns = ['description', 'amount']

    $: entries = balances[balanceType] || [];

</script>

<style>
    .wrapper {
        flex: 1 1 auto;
        margin: 0 2px;
        border: 1px solid gray;
        padding: 4px;
        box-sizing: border-box;
    }
    h3 span {
        float: right
    }
    .table {
        overflow-y: auto;
        height: 186px;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th {
        border: 1px solid #555;
    }
</style>
