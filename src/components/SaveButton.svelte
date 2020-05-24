<button on:click={onClick}>Save</button>

<script>
    export let balances;

    function onClick() {
        fetch('/balances', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(balances),
        });
    }
</script>

<style>
    button {
        height: 100%;
    }
</style>
