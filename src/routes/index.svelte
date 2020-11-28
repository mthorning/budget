<script context="module">
    export async function preload() {
        const res = await this.fetch("/balances");
        const balances = await res.json();
        return { balances };
    }
</script>

<script>
    import BalancePanel from "../components/BalancePanel.svelte";
    import Graph from "../components/Graph.svelte";
    import SaveBalancesButton from "../components/SaveBalancesButton.svelte";

    export let balances = {};

    let min = 0;
    let max = 5000;
    let months = 12;
    let balanceTypes = ["expenses", "income", "savings"];

    $: totals = balanceTypes.map((type) => {
        if (balances[type]) {
            return balances[type].reduce(
                (acc, curr) => (curr.checked ? (acc += curr.amount) : acc),
                0
            );
        }
        return;
    });

    $: expenses = totals[balanceTypes.indexOf("expenses")] || 0;
    $: income = totals[balanceTypes.indexOf("income")] || 0;
    $: savings = totals[balanceTypes.indexOf("savings")] || 0;
    $: monthlyChange = income - expenses;

    function preventEmpty(e) {
        if (e.target.value === "") e.target.value = 0;
    }
    function updateBalances(newBal) {
        balances = newBal;
    }

    function onBalanceAdd({ detail: { balanceType, newBalance, onSuccess } }) {
        if (!balances[balanceType]) balances[balanceType] = [];

        normalize(newBalance, (normalled) => {
            balances = {
                ...balances,
                [balanceType]: [...balances[balanceType], normalled],
            };
            onSuccess();
        });
    }

    function onBalanceEdit({
        detail: { balanceType, editedBalance, onSuccess },
    }) {
        normalize(editedBalance, (normalled) => {
            balances = {
                ...balances,
                [balanceType]: balances[balanceType].map((entry) => {
                    return entry.timestamp === editedBalance.timestamp
                        ? normalled
                        : entry;
                }),
            };
            if (onSuccess) onSuccess();
        });
    }

    function onBalanceDelete({ detail: { balanceType, timestamp } }) {
        balances = {
            ...balances,
            [balanceType]: balances[balanceType].filter(
                (entry) => entry.timestamp !== timestamp
            ),
        };
    }

    function onBalanceCheck({ detail: { balanceType, checked } }) {
        if (balances[balanceType]) {
            balances = {
                ...balances,
                [balanceType]: balances[balanceType].map((entry) => ({
                    ...entry,
                    checked,
                })),
            };
        }
    }

    function normalize(balance, cb) {
        const amount = Number(balance.amount);
        if (!isNaN(amount)) {
            cb({ ...balance, amount });
        }
    }
</script>

<style>
    div,
    section {
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
        display: flex;
        height: 30px;
        justify-content: space-between;
        align-items: baseline;
        flex-direction: row;
    }
    :global(.text-center) {
        text-align: center;
    }
</style>

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
                on:balanceCheck={onBalanceCheck}
                total={totals[i]}
                {...{ balanceType, balances }} />
        {/each}
    </section>
    <div class="controls">
        <span>
            <input type="number" bind:value={min} on:change={preventEmpty} />
            <input type="number" bind:value={max} on:change={preventEmpty} />
            <input type="number" bind:value={months} on:change={preventEmpty} />
        </span>
        {monthlyChange}
        <span>
            <button on:click={() => (balances = {})}>Reset</button>
            <SaveBalancesButton {...{ balances }} />
        </span>
    </div>
    <section>
        <Graph {...{ savings, monthlyChange, min, max, months }} />
    </section>
</div>
