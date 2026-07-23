<script lang="ts">
  export let isOpen: boolean = false;
  export let theme: "esports" | "retro" | "low-profile" | "minimal-dark" = "esports";
  export let lang: "zh" | "en" = "zh";
  export let onClose: () => void = () => {};

  let currentTab = 0;

  const t = {
    zh: {
      title: "注音輸入法簡易教學",
      tabs: ["注音簡介", "鍵盤配置", "聲調與拼音", "選字技巧", "系統設定"],
      
      // Tab 0
      introTitle: "什麼是注音符號？",
      introDesc: "注音符號是中華民國所使用的中文拼音系統，每個字音由「聲母」、「介母」或「韻母」拼合而成，最後加上「聲調」。",
      consonants: "聲母",
      consonantsDesc: "字首輔音（共 21 個），例如：ㄅ、ㄆ、ㄇ、ㄈ等。",
      medials: "介母",
      medialsDesc: "介於聲韻母間的介音（共 3 個）：ㄧ、ㄨ、ㄩ。",
      vowels: "韻母",
      vowelsDesc: "字尾母音（共 13 個），例如：ㄚ、ㄛ、ㄜ、ㄞ等。",
      
      // Tab 1
      layoutTitle: "鍵盤按鍵對應",
      layoutDesc: "本系統採標準大千配置。提示：預設可用 [Ctrl + Space] 快捷鍵切換注音 / 英文。",
      layoutPoint1: "鍵帽大字：該按鍵對應的注音符號（如：ㄅ、ㄉ、ㄚ）。",
      layoutPoint2: "右下小字：實體英文鍵盤上的對應按鍵。",
      layoutPoint3: "例如：實體鍵 Q 會輸入 ㄆ，實體鍵 A 會輸入 ㄇ。",
      
      // Tab 2
      toneTitle: "聲調輸入規則",
      toneDesc: "打完注音後，必須輸入「聲調」才能送出字。對應按鍵如下：",
      tone1: "一聲（陰平）",
      tone1Desc: "以「空白鍵（一）」輸入。",
      tone2: "二聲（陽平）",
      tone2Desc: "以數字鍵「6」（ˊ）輸入。",
      tone3: "三聲（上聲）",
      tone3Desc: "以數字鍵「3」（ˇ）輸入。",
      tone4: "四聲（去聲）",
      tone4Desc: "以數字鍵「4」（ˋ）輸入。",
      tone5: "輕聲（五聲）",
      tone5Desc: "以數字鍵「7」（˙）輸入。",
      toneExample: "拼音練習範例：",
      toneExample1: "「臺」（ㄊㄞˊ）：ㄊ（w） ➔ ㄞ（9） ➔ ˊ（6）",
      toneExample2: "「灣」（ㄨㄢ）：ㄨ（j） ➔ ㄢ（0） ➔ 一聲（空白鍵）",
      
      // Tab 3
      selectTitle: "如何選擇候選字？",
      selectDesc: "拼音完成後，下方會自動出現選字候選區。",
      selectPoint1: "按「選字鍵（↑）」可將焦點移至選字候選區。",
      selectPoint2: "用「方向鍵 ⬅ ➔」移動選取，按「Enter」或「空白鍵」確認該字。",
      selectPoint3: "或直接點擊候選字，或按數字鍵「1 至 9」進行選字。",
      
      // Tab 4
      settingsTitle: "系統與主題設定面板",
      settingsDesc: "點擊右上角「齒輪」圖示開啟設定面板，您能自訂所有的外觀與輸入偏好：",
      settingsPoint1_1: "預設風格：提供電競、復古、低調與極簡黑。",
      settingsPoint1_2: "配色燈效：自訂鍵帽與背景，支援多彩霓虹燈效。",
      settingsPoint2_1: "按鍵配置：支援原生對照或模擬美規對照。",
      settingsPoint2_2: "自訂快捷：自由更改輸入法切換鍵（如 Ctrl + Space）。",
      settingsPoint3_1: "打字輔助：支援中英文自動空格與自動換行。",
      settingsPoint3_2: "縮放調整：可調整字型與介面整體尺寸大小。",
    },
    en: {
      title: "Quick Zhuyin (Bopomofo) Guide",
      tabs: ["Intro", "Layout", "Tones", "Select", "Settings"],
      
      // Tab 0
      introTitle: "What is Zhuyin / Bopomofo?",
      introDesc: "Zhuyin (Bopomofo) is the standard phonetic system used in R.O.C.(Taiwan). Sounds consist of initial Consonants, Medials, and Vowels, plus a Tone.",
      consonants: "Consonants (聲母)",
      consonantsDesc: "Initial sounds of a syllable (21 in total). E.g., ㄅ (b), ㄆ (p), ㄇ (m), ㄈ (f).",
      medials: "Medials (介母)",
      medialsDesc: "Intermediate glide vowels (only three): ㄧ (i), ㄨ (u), ㄩ (ü).",
      vowels: "Vowels (韻母)",
      vowelsDesc: "Final vowel sounds (13 in total). E.g., ㄚ (a), ㄛ (o), ㄜ (e), ㄞ (ai).",
      
      // Tab 1
      layoutTitle: "Keyboard Key Mapping",
      layoutDesc: "Uses standard Daqian layout. Tip: Use [Ctrl + Space] to quickly switch layouts.",
      layoutPoint1: "Large symbol: Zhuyin character mapped to key.",
      layoutPoint2: "Small bottom-right text: Physical QWERTY keyboard key.",
      layoutPoint3: "Example: Pressing Q on QWERTY keyboard inputs ㄆ; pressing A inputs ㄇ.",
      
      // Tab 2
      toneTitle: "Tones & Spelling",
      toneDesc: "You must type a tone key at the end of spelling to commit the character:",
      tone1: "1st Tone (flat)",
      tone1Desc: "No marker. Type using [Space Bar (一)].",
      tone2: "2nd Tone (rising)",
      tone2Desc: "Type using the [6] key (ˊ).",
      tone3: "3rd Tone (falling-rising)",
      tone3Desc: "Type using the [3] key (ˇ).",
      tone4: "4th Tone (falling)",
      tone4Desc: "Type using the [4] key (ˋ).",
      tone5: "5th / Neutral Tone (dot)",
      tone5Desc: "Type using the [7] key (˙).",
      toneExample: "Spelling Practice:",
      toneExample1: "\"臺\" (tái / ㄊㄞˊ): Type ㄊ (w) ➔ ㄞ (9) ➔ ˊ (6)",
      toneExample2: "\"灣\" (wān / ㄨㄢ): Type ㄨ (j) ➔ ㄢ (0) ➔ 1st Tone (Space Bar)",
      
      // Tab 3
      selectTitle: "How to Select Candidates?",
      selectDesc: "A candidate selection bar will appear below once a syllable is spelled.",
      selectPoint1: "Press [Select Key (↑)] to move focus to candidates.",
      selectPoint2: "Use [Left ⬅ / Right ➔] to scroll, [Enter] or [Space] to select.",
      selectPoint3: "Or click candidate directly, or press numbers [1 - 9].",
      
      // Tab 4
      settingsTitle: "System & Theme Settings",
      settingsDesc: "Click the gear icon in the top-right to open settings and customize your preferences:",
      settingsPoint1_1: "Presets: Esports, Retro, Low Profile, or Minimal Dark.",
      settingsPoint1_2: "Colors & RGB: Customize keycaps, backgrounds, and neon glow.",
      settingsPoint2_1: "Key Mapping: Toggle Native or simulated US Layout mapping.",
      settingsPoint2_2: "Hotkeys: Customize layout-switching keys (e.g. Ctrl + Space).",
      settingsPoint3_1: "Typing Assist: Toggle auto-spacing and word wrapping.",
      settingsPoint3_2: "Sizing: Adjust typing font size and UI scale."
    }
  };

  // Helper classes for keys
  $: keycapClass = theme === 'esports' ? 'px-1.5 py-0.5 bg-slate-800 text-zinc-300 border border-zinc-700 rounded font-mono text-sm shadow-inner'
                 : theme === 'retro' ? 'px-1.5 py-0.5 bg-[#e5e9e4] border-2 border-t-white border-l-white border-r-[#868a85] border-b-[#868a85] text-black font-mono text-sm shadow-sm font-bold'
                 : theme === 'low-profile' ? 'px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded font-mono text-sm shadow-sm'
                 : 'px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-150 rounded font-mono text-sm shadow-sm';
</script>

{#if isOpen}
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <!-- Modal container -->
    <div class="w-full max-w-2xl p-8 rounded-2xl transition-all shadow-2xl relative flex flex-col max-h-[90vh]
      {theme === 'esports' ? 'bg-slate-900 border border-slate-800 text-white shadow-2xl' : ''}
      {theme === 'retro' ? 'bg-[#c3c7c2] border-4 border-[#868a85] text-black font-mono rounded-none shadow-[10px_10px_0px_rgba(0,0,0,0.5)]' : ''}
      {theme === 'low-profile' ? 'bg-white border border-slate-200 text-slate-800 shadow-xl shadow-slate-300/30' : ''}
      {theme === 'minimal-dark' ? 'bg-zinc-900 border border-zinc-800 text-zinc-100' : ''}
    ">
      
      <!-- Title header -->
      <div class="flex justify-between items-center mb-5 pb-3 border-b
        {theme === 'esports' ? 'border-slate-800' : ''}
        {theme === 'minimal-dark' ? 'border-zinc-800' : ''}
        {theme === 'low-profile' || theme === 'retro' ? 'border-slate-200' : ''}
      ">
        <h3 class="font-bold text-lg tracking-wider flex items-center gap-2.5">
          <!-- SVG Info icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t[lang].title}</span>
        </h3>
        
        <button
          on:click={onClose}
          class="w-9 h-9 rounded-full flex items-center justify-center font-bold transition cursor-pointer text-sm
            {theme === 'esports' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : ''}
            {theme === 'minimal-dark' ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : ''}
            {theme === 'low-profile' || theme === 'retro' ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800' : ''}
          "
        >
          ✕
        </button>
      </div>

      <!-- Horizontal Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none select-none border-b
        {theme === 'esports' ? 'border-slate-800' : ''}
        {theme === 'minimal-dark' ? 'border-zinc-800' : ''}
        {theme === 'low-profile' || theme === 'retro' ? 'border-slate-100' : ''}
      ">
        {#each t[lang].tabs as tab, idx}
          <button
            on:click={() => (currentTab = idx)}
            class="px-4 py-2 rounded-lg text-base font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2
              {currentTab === idx
                ? (theme === 'esports' ? 'bg-slate-800/40 border-slate-600 text-zinc-200 font-bold' : (theme === 'minimal-dark' ? 'bg-zinc-800 border-zinc-500 text-white' : 'bg-slate-100 border-slate-700 text-slate-900 font-bold'))
                : 'border-transparent text-opacity-70 hover:text-opacity-100'
              }
              {theme === 'retro' && currentTab === idx ? 'border-2 border-slate-600 bg-slate-300/40 rounded-none' : ''}
              {theme === 'retro' && currentTab !== idx ? 'border-2 border-transparent rounded-none' : ''}
            "
          >
            {tab}
          </button>
        {/each}
      </div>

      <!-- Tab Content Scroll Panel -->
      <div class="flex-grow overflow-y-auto pr-2 pb-5 text-base leading-relaxed space-y-6">
        {#if currentTab === 0}
          <!-- Tab 0: Bopomofo Intro -->
          <div>
            <h4 class="font-bold text-xl mb-3 {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-200'}">{t[lang].introTitle}</h4>
            <p class="opacity-80 text-base mb-4">{t[lang].introDesc}</p>
            
            <div class="space-y-3 mt-5">
              <div class="p-4 rounded-lg border
                {theme === 'esports' ? 'bg-slate-950/40 border-slate-800' : ''}
                {theme === 'minimal-dark' ? 'bg-zinc-955/40 border-zinc-800' : ''}
                {theme === 'low-profile' || theme === 'retro' ? 'bg-slate-50 border-slate-200' : ''}
              ">
                <span class="font-bold text-base {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-650' : 'text-zinc-400'} block mb-1.5">{t[lang].consonants}</span>
                <span class="text-base opacity-75">{t[lang].consonantsDesc}</span>
              </div>

              <div class="p-4 rounded-lg border
                {theme === 'esports' ? 'bg-slate-950/40 border-slate-800' : ''}
                {theme === 'minimal-dark' ? 'bg-zinc-955/40 border-zinc-800' : ''}
                {theme === 'low-profile' || theme === 'retro' ? 'bg-slate-50 border-slate-200' : ''}
              ">
                <span class="font-bold text-base {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-650' : 'text-zinc-400'} block mb-1.5">{t[lang].medials}</span>
                <span class="text-base opacity-75">{t[lang].medialsDesc}</span>
              </div>

              <div class="p-4 rounded-lg border
                {theme === 'esports' ? 'bg-slate-950/40 border-slate-800' : ''}
                {theme === 'minimal-dark' ? 'bg-zinc-955/40 border-zinc-800' : ''}
                {theme === 'low-profile' || theme === 'retro' ? 'bg-slate-50 border-slate-200' : ''}
              ">
                <span class="font-bold text-base {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-650' : 'text-zinc-400'} block mb-1.5">{t[lang].vowels}</span>
                <span class="text-base opacity-75">{t[lang].vowelsDesc}</span>
              </div>
            </div>
          </div>

        {:else if currentTab === 1}
          <!-- Tab 1: Keyboard Mapping -->
          <div>
            <h4 class="font-bold text-xl mb-3 {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-200'}">{t[lang].layoutTitle}</h4>
            <p class="opacity-80 text-base mb-4">{t[lang].layoutDesc}</p>
            
            <ul class="list-disc pl-4 space-y-2.5 text-base opacity-95">
              <li>{t[lang].layoutPoint1}</li>
              <li>{t[lang].layoutPoint2}</li>
              <li>
                {#if lang === 'zh'}
                  實體鍵 <kbd class={keycapClass}>Q</kbd> 會輸入 <span class="{theme === 'low-profile' || theme === 'retro' ? 'text-zinc-900' : 'text-zinc-100'} font-bold">ㄆ</span>；實體鍵 <kbd class={keycapClass}>A</kbd> 會輸入 <span class="{theme === 'low-profile' || theme === 'retro' ? 'text-zinc-900' : 'text-zinc-100'} font-bold">ㄇ</span>。
                {:else}
                  Press <kbd class={keycapClass}>Q</kbd> to input <span class="{theme === 'low-profile' || theme === 'retro' ? 'text-zinc-900' : 'text-zinc-100'} font-bold">ㄆ</span>; press <kbd class={keycapClass}>A</kbd> to input <span class="{theme === 'low-profile' || theme === 'retro' ? 'text-zinc-900' : 'text-zinc-100'} font-bold">ㄇ</span>.
                {/if}
              </li>
            </ul>

            <div class="mt-5 p-4 rounded-lg border flex items-center justify-between text-base
              {theme === 'esports' ? 'bg-slate-950/40 border-slate-800 text-zinc-300' : ''}
              {theme === 'minimal-dark' ? 'bg-zinc-955/40 border-zinc-800 text-zinc-350' : ''}
              {theme === 'low-profile' || theme === 'retro' ? 'bg-zinc-100/50 border-zinc-200 text-zinc-800' : ''}
            ">
              {#if lang === 'zh'}
                💡 <strong>提示：</strong> 可點擊右上角「注音 / English」按鈕切換英文輸入。
              {:else}
                💡 <strong>Tip:</strong> Click "Zhuyin / English" on top-right to toggle layout.
              {/if}
            </div>
          </div>

        {:else if currentTab === 2}
          <!-- Tab 2: Tones and Spelling -->
          <div class="space-y-4">
            <h4 class="font-bold text-xl mb-3 {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-200'}">{t[lang].toneTitle}</h4>
            <p class="opacity-85 text-base">{t[lang].toneDesc}</p>

            <!-- Tones List -->
            <div class="grid grid-cols-1 gap-3 mt-3">
              <div class="flex items-center justify-between p-3 rounded border border-dashed border-opacity-30
                {theme === 'esports' ? 'border-zinc-800 bg-zinc-955/20' : 'border-zinc-500 bg-zinc-500/5'}
              ">
                <span class="text-base font-bold">{t[lang].tone1}</span>
                <span class="text-base">{t[lang].tone1Desc}</span>
              </div>
              
              <div class="flex items-center justify-between p-3 rounded border border-dashed border-opacity-30
                {theme === 'esports' ? 'border-zinc-800 bg-zinc-955/20' : 'border-zinc-500 bg-zinc-500/5'}
              ">
                <span class="text-base font-bold">{t[lang].tone2}</span>
                <span class="text-base">{t[lang].tone2Desc} <kbd class={keycapClass}>6</kbd></span>
              </div>

              <div class="flex items-center justify-between p-3 rounded border border-dashed border-opacity-30
                {theme === 'esports' ? 'border-zinc-800 bg-zinc-955/20' : 'border-zinc-500 bg-zinc-500/5'}
              ">
                <span class="text-base font-bold">{t[lang].tone3}</span>
                <span class="text-base">{t[lang].tone3Desc} <kbd class={keycapClass}>3</kbd></span>
              </div>

              <div class="flex items-center justify-between p-3 rounded border border-dashed border-opacity-30
                {theme === 'esports' ? 'border-zinc-800 bg-zinc-955/20' : 'border-zinc-500 bg-zinc-500/5'}
              ">
                <span class="text-base font-bold">{t[lang].tone4}</span>
                <span class="text-base">{t[lang].tone4Desc} <kbd class={keycapClass}>4</kbd></span>
              </div>

              <div class="flex items-center justify-between p-3 rounded border border-dashed border-opacity-30
                {theme === 'esports' ? 'border-zinc-800 bg-zinc-955/20' : 'border-zinc-500 bg-zinc-500/5'}
              ">
                <span class="text-base font-bold">{t[lang].tone5}</span>
                <span class="text-base">{t[lang].tone5Desc} <kbd class={keycapClass}>7</kbd></span>
              </div>
            </div>

            <!-- Examples -->
            <div class="mt-5 p-4 rounded-lg border
              {theme === 'esports' ? 'bg-slate-950 border-slate-800' : ''}
              {theme === 'minimal-dark' ? 'bg-zinc-950 border-zinc-800' : ''}
              {theme === 'low-profile' || theme === 'retro' ? 'bg-zinc-50 border-zinc-200 text-zinc-700' : ''}
            ">
              <span class="font-bold text-base {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-300'} block mb-2">{t[lang].toneExample}</span>
              <ul class="list-none space-y-2 text-base opacity-90 pl-1">
                <li>💡 {t[lang].toneExample1}</li>
                <li>💡 {t[lang].toneExample2}</li>
              </ul>
            </div>
          </div>

        {:else if currentTab === 3}
          <!-- Tab 3: Word Selection -->
          <div>
            <h4 class="font-bold text-xl mb-3 {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-200'}">{t[lang].selectTitle}</h4>
            <p class="opacity-80 text-base mb-4">{t[lang].selectDesc}</p>
            
            <ul class="list-disc pl-4 space-y-2.5 text-base opacity-95">
              <li>
                {#if lang === 'zh'}
                  按 <kbd class={keycapClass}>選字</kbd> 鍵或實體鍵盤的 <kbd class={keycapClass}>↑</kbd> 鍵可將焦點移至選字候選區。
                {:else}
                  Press the <kbd class={keycapClass}>Select</kbd> key or the <kbd class={keycapClass}>↑</kbd> key on your physical keyboard to move focus to the Candidate Box.
                {/if}
              </li>
              <li>
                {#if lang === 'zh'}
                  使用 <kbd class={keycapClass}>⬅</kbd> 或 <kbd class={keycapClass}>➔</kbd> 移動，按 <kbd class={keycapClass}>Enter</kbd> 鍵或 <kbd class={keycapClass}>Space</kbd> 鍵確認。
                {:else}
                  Use <kbd class={keycapClass}>⬅</kbd> / <kbd class={keycapClass}>➔</kbd> to scroll, and press <kbd class={keycapClass}>Enter</kbd> or <kbd class={keycapClass}>Space</kbd> to select.
                {/if}
              </li>
              <li>
                {#if lang === 'zh'}
                  或直接點選候選字，或按數字鍵 <kbd class={keycapClass}>1</kbd> 至 <kbd class={keycapClass}>9</kbd> 選取。
                {:else}
                  Or click candidate directly, or press number keys <kbd class={keycapClass}>1</kbd> to <kbd class={keycapClass}>9</kbd>.
                {/if}
              </li>
            </ul>
          </div>

        {:else if currentTab === 4}
          <!-- Tab 4: Settings -->
          <div class="space-y-4">
            <h4 class="font-bold text-xl mb-3 {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-200'}">{t[lang].settingsTitle}</h4>
            <p class="opacity-80 text-base mb-4">{t[lang].settingsDesc}</p>
            
            <div class="space-y-4 text-base opacity-95">
              <div>
                <strong class="block mb-2 {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-300'}">{lang === 'zh' ? '外觀主題' : 'Appearance'}</strong>
                <ul class="list-disc pl-4 space-y-1.5 opacity-90">
                  <li>{t[lang].settingsPoint1_1}</li>
                  <li>{t[lang].settingsPoint1_2}</li>
                </ul>
              </div>

              <div>
                <strong class="block mb-2 {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-300'}">{lang === 'zh' ? '按鍵配置' : 'Keymap'}</strong>
                <ul class="list-disc pl-4 space-y-1.5 opacity-90">
                  <li>{t[lang].settingsPoint2_1}</li>
                  <li>{t[lang].settingsPoint2_2}</li>
                </ul>
              </div>

              <div>
                <strong class="block mb-2 {theme === 'low-profile' || theme === 'retro' ? 'text-zinc-800' : 'text-zinc-300'}">{lang === 'zh' ? '輸入輔助' : 'Typing'}</strong>
                <ul class="list-disc pl-4 space-y-1.5 opacity-90">
                  <li>{t[lang].settingsPoint3_1}</li>
                  <li>{t[lang].settingsPoint3_2}</li>
                </ul>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer button -->
      <div class="mt-5 flex justify-end">
        <button
          type="button"
          on:click={onClose}
          class="px-5 py-2.5 text-base font-semibold rounded-lg cursor-pointer transition-all duration-150
            {theme === 'esports' ? 'bg-zinc-800 hover:bg-zinc-750 text-white border border-zinc-700' : ''}
            {theme === 'retro' ? 'bg-[#d0d4cf] border-2 border-black text-black font-bold shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_#000]' : ''}
            {theme === 'low-profile' ? 'bg-slate-800 hover:bg-slate-700 text-white' : ''}
            {theme === 'minimal-dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700' : ''}
          "
        >
          {lang === 'zh' ? '我知道了' : 'Got it'}
        </button>
      </div>

    </div>
  </div>
{/if}
