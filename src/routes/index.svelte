<svelte:head>
	<title>Budget</title>
</svelte:head>

<div>
    <section>
        {#each balanceTypes as balanceType, i}
            <BalancePanel 
                on:balanceAdd={onBalanceAdd} 
                on:balanceEdit={onBalanceEdit} 
                on:balanceDelete={onBalanceDelete} 
                total={totals[i]}
                {...{ balanceType, balances }} 
            />
        {/each}
    </section>
    <section class="controls">
        <h3>Monthly Change: £{monthlyChange}</h3>
        <button>Save</button>
    </section>
    <section>
        <Graph {...{ savings, monthlyChange }} />
    </section>
</div>

<script>
    import BalancePanel from '../components/BalancePanel.svelte';
    import Graph from '../components/Graph.svelte';

    let balanceTypes = ['expenses', 'income', 'savings'];
    let balances = {}

    $: totals =  balanceTypes.map(type => {
        if(balances[type]) {
            return balances[type].reduce((acc, curr) => acc += curr.amount, 0);
        }
        return;
    });

    $: expenses = totals[balanceTypes.indexOf('expenses')] || 0;
    $: income = totals[balanceTypes.indexOf('income')] || 0;
    $: savings = totals[balanceTypes.indexOf('savings')] || 0;
    $: monthlyChange = income - expenses;

    function onBalanceAdd({ detail: { balanceType, newBalance, onSuccess }}) {
        if(!balances[balanceType]) balances[balanceType] = [];
        
        normalize(newBalance, normalled => {
            balances = {
                ...balances,
                [balanceType]: [
                    ...balances[balanceType],
                        normalled
                ]
            };
            onSuccess();
        });
    }

    function onBalanceEdit({ detail: { balanceType, editedBalance, onSuccess }}) {
        normalize(editedBalance, normalled => {
            balances = {
                ...balances,
                [balanceType]: [
                    ...balances[balanceType].filter(entry => 
                        entry.timestamp !== editedBalance.timestamp
                    ),
                    normalled
                ]
            };
            onSuccess();
        });
    }

    function onBalanceDelete({ detail: { balanceType, timestamp }}) {
        balances = {
            ...balances,
            [balanceType]: [
                ...balances[balanceType].filter(entry => 
                    entry.timestamp !== timestamp
                )
            ]
        }
    }

    function normalize(balance, cb) {
        const amount = Number(balance.amount);
        if(!isNaN(amount)) {
            cb({ ...balance, amount });
        }
    }
</script>

<style>
    div, section {
        display: flex;
    }
    div {
        height: 90vh;
        width: 100%;
        flex-direction: column;
    }
    section {
        margin: 2px 0;
        flex: 1 0 auto;
    }
    .controls {
        flex: 0 0 50px;
        justify-content: space-between;
        align-items: baseline;
    }
    .controls button {
        height: 100%;
    }
</style>
