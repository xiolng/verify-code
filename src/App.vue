<template>
    <div id="app">
        <Index />
    </div>
</template>

<script>
    import Index from './components/Index.vue'

    export default {
        name: 'app',
        components: {
            Index
        }
    }
</script>

<style>
body{
    min-width: 750px;
}
</style>
