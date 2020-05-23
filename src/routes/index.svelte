<svelte:head>
	<title>Budget</title>
</svelte:head>

<div>
    <BalancePanel on:balanceAdd={onBalanceAdd} {...{ balanceType: "expenses", balances }} />
    <BalancePanel on:balanceAdd={onBalanceAdd} {...{balanceType: "income", balances }} />
    <BalancePanel on:balanceAdd={onBalanceAdd} {...{ balanceType: "savings", balances }} />
</div>

<script>
    import BalancePanel from '../components/BalancePanel.svelte';
    let balances = {}

    function onBalanceAdd({ detail: { balanceType, newBalance }}) {
        if(!balances[balanceType]) balances[balanceType] = [];
        
        normalize(newBalance, normalled => {
            balances = {
                ...balances,
                [balanceType]: [
                    ...balances[balanceType],
                        normalled
                ]
            };
        });
    }

    function normalize(balance, cb) {
        const amount = Number(balance.amount);
        if(!isNaN(amount)) {
            cb({ ...balance, amount });
        }
    }
    $: console.log('balances = ', balances)
</script>

<style>
    div {
        height: 50vh;
        display: flex;
        justify-content: space-around;
    }
</style>
