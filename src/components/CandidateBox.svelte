<script lang="ts">
  export let candidates: string[] = [];
  export let selectedIndex: number = 0;
  export let theme: "esports" | "retro" | "low-profile" | "minimal-dark" = "esports";
  export let onSelect: (candidate: string) => void = () => {};
  export let lang: "zh" | "en" = "zh";
</script>

{#if candidates.length > 0}
  <div class="w-full max-w-3xl mx-auto mb-6 p-3 rounded-xl transition-all duration-200 flex flex-wrap items-center gap-2
    {theme === 'esports' ? 'bg-slate-900/90 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-purple-100' : ''}
    {theme === 'retro' ? 'bg-[#1b261a] border-2 border-[#76ff03]/40 text-[#76ff03] font-mono rounded-none' : ''}
    {theme === 'low-profile' ? 'bg-white border border-slate-200 shadow-md text-slate-800' : ''}
    {theme === 'minimal-dark' ? 'bg-zinc-900/95 border border-zinc-800 shadow-md text-zinc-100' : ''}
  ">
    <span class="text-xs font-semibold opacity-60 px-2">
      {lang === 'zh' ? '選字候選 (數字鍵或點擊選字):' : 'Candidates (Press number or click):'}
    </span>
    
    <div class="flex flex-wrap items-center gap-1.5">
      {#each candidates as candidate, i}
        <button
          type="button"
          tabindex="-1"
          on:click={(e) => {
            (e.currentTarget as HTMLButtonElement).blur();
            onSelect(candidate);
          }}
          class="px-3 py-1.5 rounded-lg text-lg transition-all flex items-center gap-1.5 cursor-pointer
            {i === selectedIndex
              ? (theme === 'esports' ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.6)] scale-105' 
                : theme === 'retro' ? 'bg-[#76ff03] text-[#1b261a] font-bold'
                : theme === 'minimal-dark' ? 'bg-zinc-700 text-white font-bold'
                : 'bg-indigo-600 text-white font-bold shadow-sm')
              : (theme === 'esports' ? 'hover:bg-slate-800 text-slate-300'
                : theme === 'retro' ? 'hover:bg-[#2b3a2a] text-[#76ff03]'
                : theme === 'minimal-dark' ? 'hover:bg-zinc-800 text-zinc-200'
                : 'hover:bg-slate-100 text-slate-700')}
          "
        >
          <span class="text-xs opacity-50 font-mono">{i + 1}.</span>
          <span>{candidate}</span>
        </button>
      {/each}
    </div>
  </div>
{/if}
