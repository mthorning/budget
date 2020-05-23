<div>
    <h3>{`${balanceType.charAt(0).toUpperCase()}${balanceType.substr(1)}`}
    </h3>

    <table>
        <thead>
            {#each columns as col}
                <th>{col}</th>
            {/each}
        </thead>
        <tbody>
            {#each entries as entry}
                <tr>
                    {#each columns as col}
                        <td>{entry[col]}</td>
                    {/each}
                </tr>
            {/each}
            <Row on:balanceAdd {...{ columns, balanceType }} />
        </tbody> 
    </table>
</div>

<script>
    import Row from './Row.svelte';
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
    h3 {
        display: flex;
        justify-content: space-between;        
        align-items: baseline;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th, td {
        border: 1px solid #555;
    }
</style>
