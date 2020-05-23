<svelte:head>
	<title>Budget</title>
</svelte:head>

<div>
    {#each balanceTypes as balanceType}
    <BalancePanel 
        on:balanceAdd={onBalanceAdd} 
        on:balanceEdit={onBalanceEdit} 
        on:balanceDelete={onBalanceDelete} 
        {...{ balanceType, balances }} 
    />
    {/each}
</div>

<script>
    import BalancePanel from '../components/BalancePanel.svelte';
    let balanceTypes = ['expenses', 'income', 'savings'];
    let balances = {}

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
    div {
        height: 50vh;
        display: flex;
        justify-content: space-around;
    }
</style>
