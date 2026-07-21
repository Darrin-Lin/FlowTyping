<script lang="ts">
  export let activeKeys: Set<string> = new Set();
  export let theme: "esports" | "retro" = "esports"; // Physically simulated switch/layout type
  export let rgbEnabled: boolean = true;
  export let material: string = "dark-gray"; // Base Casing texture
  export let keycapColor: string = "cyber-cyan"; // Keycap color style
  export let onKeyPress: (key: string, symbol: string) => void = () => {};
  export let onToggleEmoji: () => void = () => {};
  export let onToggleSymbols: () => void = () => {};
  export let lang: "zh" | "en" = "zh";
  export let layout: "zhuyin" | "english" = "zhuyin";

  const t = {
    zh: { symbols: "符號", emoji: "Emoji" },
    en: { symbols: "Symbols", emoji: "Emoji" }
  };

  $: isShiftActive = activeKeys.has('ShiftLeft') || activeKeys.has('ShiftRight');
  $: isCapsLockActive = activeKeys.has('CapsLock');
  $: isCapsActive = isCapsLockActive !== isShiftActive; // XOR logic

  function getKeyDisplay(k: { code: string; key: string; symbol: string }, currentLayout: string, capsActive: boolean, shiftActive: boolean) {
    if (currentLayout === "english") {
      // Standard letters
      if (k.code.startsWith("Key")) {
        return capsActive ? k.key.toUpperCase() : k.key.toLowerCase();
      }
      // Digit keys (1-0)
      if (k.code.startsWith("Digit")) {
        if (shiftActive) {
          const digitShiftMap: Record<string, string> = {
            Digit1: "!", Digit2: "@", Digit3: "#", Digit4: "$", Digit5: "%",
            Digit6: "^", Digit7: "&", Digit8: "*", Digit9: "(", Digit0: ")"
          };
          return digitShiftMap[k.code] || k.key;
        }
        return k.key;
      }
      // Punctuation keys that represent Zhuyin characters
      if (shiftActive) {
        const punctuationShiftMap: Record<string, string> = {
          Minus: "_",
          Semicolon: ":",
          Comma: "<",
          Period: ">",
          Slash: "?"
        };
        if (k.code in punctuationShiftMap) {
          return punctuationShiftMap[k.code];
        }
      } else {
        const punctuationNormalMap: Record<string, string> = {
          Minus: "-",
          Semicolon: ";",
          Comma: ",",
          Period: ".",
          Slash: "/"
        };
        if (k.code in punctuationNormalMap) {
          return punctuationNormalMap[k.code];
        }
      }
    }
    return k.symbol;
  }

  // Standard Taiwan Zhuyin Keyboard Layout
  const rows = [
    [
      { code: 'Backquote', key: '`', symbol: '`' },
      { code: 'Digit1', key: '1', symbol: 'ㄅ' },
      { code: 'Digit2', key: '2', symbol: 'ㄉ' },
      { code: 'Digit3', key: '3', symbol: 'ˇ' },
      { code: 'Digit4', key: '4', symbol: 'ˋ' },
      { code: 'Digit5', key: '5', symbol: 'ㄓ' },
      { code: 'Digit6', key: '6', symbol: 'ˊ' },
      { code: 'Digit7', key: '7', symbol: '˙' },
      { code: 'Digit8', key: '8', symbol: 'ㄚ' },
      { code: 'Digit9', key: '9', symbol: 'ㄞ' },
      { code: 'Digit0', key: '0', symbol: 'ㄢ' },
      { code: 'Minus', key: '-', symbol: 'ㄦ' },
      { code: 'Equal', key: '=', symbol: '=' },
      { code: 'Backspace', key: 'Backspace', symbol: '⌫', width: 'w-16' }
    ],
    [
      { code: 'Tab', key: 'Tab', symbol: 'Tab', width: 'w-14' },
      { code: 'KeyQ', key: 'q', symbol: 'ㄆ' },
      { code: 'KeyW', key: 'w', symbol: 'ㄊ' },
      { code: 'KeyE', key: 'e', symbol: 'ㄍ' },
      { code: 'KeyR', key: 'r', symbol: 'ㄐ' },
      { code: 'KeyT', key: 't', symbol: 'ㄔ' },
      { code: 'KeyY', key: 'y', symbol: 'ㄗ' },
      { code: 'KeyU', key: 'u', symbol: 'ㄧ' },
      { code: 'KeyI', key: 'i', symbol: 'ㄛ' },
      { code: 'KeyO', key: 'o', symbol: 'ㄟ' },
      { code: 'KeyP', key: 'p', symbol: 'ㄣ' },
      { code: 'BracketLeft', key: '[', symbol: '[' },
      { code: 'BracketRight', key: ']', symbol: ']' }
    ],
    [
      { code: 'CapsLock', key: 'CapsLock', symbol: 'Caps', width: 'w-16' },
      { code: 'KeyA', key: 'a', symbol: 'ㄇ' },
      { code: 'KeyS', key: 's', symbol: 'ㄋ' },
      { code: 'KeyD', key: 'd', symbol: 'ㄎ' },
      { code: 'KeyF', key: 'f', symbol: 'ㄑ' },
      { code: 'KeyG', key: 'g', symbol: 'ㄕ' },
      { code: 'KeyH', key: 'h', symbol: 'ㄘ' },
      { code: 'KeyJ', key: 'j', symbol: 'ㄨ' },
      { code: 'KeyK', key: 'k', symbol: 'ㄜ' },
      { code: 'KeyL', key: 'l', symbol: 'ㄠ' },
      { code: 'Semicolon', key: ';', symbol: 'ㄤ' },
      { code: 'Quote', key: "'", symbol: "'" },
      { code: 'Enter', key: 'Enter', symbol: 'Enter ↵', width: 'w-20' }
    ],
    [
      { code: 'ShiftLeft', key: 'Shift', symbol: '⇧ Shift', width: 'w-24' },
      { code: 'KeyZ', key: 'z', symbol: 'ㄈ' },
      { code: 'KeyX', key: 'x', symbol: 'ㄌ' },
      { code: 'KeyC', key: 'c', symbol: '橫', width: 'w-12' } // placeholder corrected dynamically
    ]
  ];
  // Dynamic fix for key list
  rows[3][3] = { code: 'KeyC', key: 'c', symbol: 'ㄏ' };
  rows[3].push(
    { code: 'KeyV', key: 'v', symbol: 'ㄒ' },
    { code: 'KeyB', key: 'b', symbol: 'ㄖ' },
    { code: 'KeyN', key: 'n', symbol: 'ㄙ' },
    { code: 'KeyM', key: 'm', symbol: 'ㄩ' },
    { code: 'Comma', key: ',', symbol: 'ㄝ' },
    { code: 'Period', key: '.', symbol: 'ㄡ' },
    { code: 'Slash', key: '/', symbol: 'ㄥ' },
    { code: 'ShiftRight', key: 'Shift', symbol: '⇧ Shift', width: 'w-24' }
  );

  // Prevent browser focus loss on typing
  function handleButtonMouseDown(e: MouseEvent) {
    e.preventDefault();
  }

  // Resolves the class for the inner keycap face
  function getKeycapFaceClass(isActive: boolean, capColor: string, switchStyle: "esports" | "retro", rgbOn: boolean) {
    let base = "w-full h-full flex flex-col items-center justify-center relative transition-all ";
    
    if (switchStyle === 'retro') {
      base += "rounded-none ";
    } else {
      base += "rounded-[6px] ";
    }

    if (isActive) {
      base += "translate-y-[1px] ";
    }

    if (rgbOn) {
      if (capColor === 'cyber-cyan') {
        base += isActive ? "bg-cyan-500 text-zinc-955 font-bold" : "bg-zinc-955 text-cyan-400";
      } else if (capColor === 'bow') {
        base += isActive ? "bg-zinc-950 text-white font-bold" : "bg-white text-zinc-950";
      } else if (capColor === 'white-grey') {
        base += isActive ? "bg-zinc-400 text-white font-bold" : "bg-white text-zinc-400";
      } else if (capColor === 'vintage-beige') {
        base += isActive ? "bg-[#a3a7a2] text-black font-bold" : "bg-[#e5e9e4] text-black";
      } else if (capColor === 'minimal-charcoal') {
        base += isActive ? "bg-zinc-100 text-zinc-950 font-bold" : "bg-zinc-900 text-zinc-100";
      } else if (capColor === 'sakura-pink') {
        base += isActive ? "bg-pink-500 text-white font-bold" : "bg-pink-50 text-pink-700";
      } else if (capColor === 'pastel-purple') {
        base += isActive ? "bg-purple-600 text-white font-bold" : "bg-purple-50 text-purple-700";
      }
    } else {
      if (capColor === 'cyber-cyan') {
        if (isActive) {
          base += "bg-cyan-500 text-zinc-955 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]";
        } else {
          base += "bg-zinc-900 border border-zinc-800/60 text-cyan-400 hover:bg-zinc-800 " + 
                  (switchStyle === 'retro' 
                    ? 'border-2 border-t-[#555] border-l-[#555] border-r-zinc-955 border-b-zinc-955 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]' 
                    : 'shadow-[0_3px_0_#09090b]');
        }
      } else if (capColor === 'bow') {
        if (isActive) {
          base += "bg-zinc-950 text-white font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border-zinc-700";
        } else {
          base += "bg-white border border-slate-200 text-black hover:bg-slate-100 " + 
                  (switchStyle === 'retro' 
                    ? 'border-2 border-t-white border-l-white border-r-slate-300 border-b-slate-300 shadow-[2px_2px_0px_rgba(0,0,0,0.15)]' 
                    : 'shadow-[0_3px_0_#e2e8f0]');
        }
      } else if (capColor === 'white-grey') {
        if (isActive) {
          base += "bg-zinc-400 text-white font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border-zinc-400";
        } else {
          base += "bg-white border border-zinc-200 text-zinc-400 hover:bg-zinc-50 " + 
                  (switchStyle === 'retro' 
                    ? 'border-2 border-t-white border-l-white border-r-zinc-200 border-b-zinc-200 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]' 
                    : 'shadow-[0_3px_0_#e2e8f0]');
        }
      } else if (capColor === 'vintage-beige') {
        if (isActive) {
          base += "bg-[#a3a7a2] text-black border-2 border-black font-bold shadow-none";
        } else {
          base += "bg-[#e5e9e4] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#868a85] border-b-[#868a85] text-black font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.2)]";
        }
      } else if (capColor === 'minimal-charcoal') {
        if (isActive) {
          base += "bg-zinc-100 text-zinc-950 font-bold shadow-inner";
        } else {
          base += "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 " + 
                  (switchStyle === 'retro' 
                    ? 'border-2 border-t-[#555] border-l-[#555] border-r-slate-950 border-b-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]' 
                    : 'shadow-[0_3px_0_#18181b]');
        }
      } else if (capColor === 'sakura-pink') {
        if (isActive) {
          base += "bg-pink-500 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.6)]";
        } else {
          base += "bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 " + 
                  (switchStyle === 'retro' 
                    ? 'border-2 border-t-white border-l-white border-r-pink-300 border-b-pink-300 shadow-[2px_2px_0px_rgba(244,63,94,0.2)]' 
                    : 'shadow-[0_3px_0_#fbc2d0]');
        }
      } else if (capColor === 'pastel-purple') {
        if (isActive) {
          base += "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.6)]";
        } else {
          base += "bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 " + 
                  (switchStyle === 'retro' 
                    ? 'border-2 border-t-white border-l-white border-r-purple-300 border-b-purple-300 shadow-[2px_2px_0px_rgba(168,85,247,0.2)]' 
                    : 'shadow-[0_3px_0_#d8b4fe]');
        }
      }
    }

    return base;
  }
</script>

<!-- Keyboard Outer Case Bezel -->
<div class="w-full max-w-4xl mx-auto p-5 transition-all duration-300 relative select-none border shadow-2xl
  {theme === 'retro' ? 'rounded-none border-4 border-[#868a85] shadow-[8px_8px_0px_rgba(0,0,0,0.5)]' : 'rounded-[32px]'}
  {material === 'dark-gray' ? 'bg-casing-dark border-zinc-850' : ''}
  {material === 'silver-gray' ? 'bg-casing-silver border-slate-300/80' : ''}
  {material === 'wood' ? 'bg-wood bg-wood-texture border-amber-950/50' : ''}
  {material === 'plastic' ? 'bg-plastic border-slate-300' : ''}
  {material === 'plastic-pink' ? 'bg-plastic-pink border-pink-300/40' : ''}
">
  <!-- Inner Keys Plate Box -->
  <div class="relative p-4 transition-all duration-300 z-10
    {theme === 'retro' ? 'bg-[#1b261a]/10 border border-[#868a85]/40 rounded-none' : 'bg-transparent rounded-2xl border border-black/5'}
  ">
    <!-- RGB Glow Outline (Matching current casing background texture for seamless integration) -->
    {#if rgbEnabled}
      <div class="absolute -inset-[2px] rgb-glow-border rounded-[17px] pointer-events-none z-0"></div>
      <div class="absolute inset-0 rounded-[15px] z-0
        {material === 'dark-gray' ? 'bg-casing-dark' : ''}
        {material === 'silver-gray' ? 'bg-casing-silver' : ''}
        {material === 'wood' ? 'bg-wood bg-wood-texture' : ''}
        {material === 'plastic' ? 'bg-plastic' : ''}
        {material === 'plastic-pink' ? 'bg-plastic-pink' : ''}
      "></div>
    {/if}

    <div class="relative z-10 flex flex-col gap-2">
      {#each rows as row}
        <div class="flex justify-center gap-1.5">
          {#each row as k}
            {@const isActive = activeKeys.has(k.code) || activeKeys.has(k.key.toLowerCase())}
            <button
              type="button"
              tabindex="-1"
              on:mousedown={handleButtonMouseDown}
              on:click={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                const display = getKeyDisplay(k, layout, isCapsActive, isShiftActive);
                onKeyPress(k.key, display);
              }}
              class="relative transition-all duration-75 cursor-pointer rounded-lg font-medium {k.width || 'w-12'} h-12
                {theme === 'retro' ? 'rounded-none' : ''}
                {rgbEnabled ? 'p-[1.5px] rgb-glow-border shadow-[0_0_8px_rgba(0,240,255,0.25)]' : ''}
              "
            >
              <!-- Inner Keycap Face -->
              <div class="{getKeycapFaceClass(isActive, keycapColor, theme, rgbEnabled)}">
                <span class="text-base font-bold leading-none">{getKeyDisplay(k, layout, isCapsActive, isShiftActive)}</span>
                {#if layout === 'zhuyin' && k.key !== k.symbol && k.key.length === 1}
                  <span class="text-[9px] opacity-40 absolute bottom-1 right-1.5 font-mono">{k.key.toUpperCase()}</span>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      {/each}

      <!-- Bottom Action Row -->
      <div class="flex justify-center gap-2 mt-1">
        <!-- Symbols Button -->
        <button
          type="button"
          tabindex="-1"
          on:mousedown={handleButtonMouseDown}
          on:click={(e) => {
            (e.currentTarget as HTMLButtonElement).blur();
            onToggleSymbols();
          }}
          class="h-11 px-3.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-all text-sm relative overflow-hidden
            {rgbEnabled ? 'p-[1.5px] rgb-glow-border shadow-[0_0_8px_rgba(0,240,255,0.25)]' : ''}
          "
        >
          <div class="w-full h-full flex items-center justify-center rounded-[6px] px-3
            {theme === 'retro' ? 'rounded-none' : ''}
            {!rgbEnabled && keycapColor === 'cyber-cyan' ? 'bg-purple-900/60 border border-purple-500/50 text-purple-200 hover:bg-purple-800' : ''}
            {!rgbEnabled && keycapColor === 'bow' ? 'bg-white border border-zinc-200 text-black hover:bg-zinc-100 shadow-sm' : ''}
            {!rgbEnabled && keycapColor === 'white-grey' ? 'bg-white border border-zinc-200 text-zinc-400 hover:bg-zinc-50 shadow-sm' : ''}
            {!rgbEnabled && keycapColor === 'vintage-beige' ? 'bg-[#d0d4cf] border-2 border-[#868a85] text-black font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.2)]' : ''}
            {!rgbEnabled && keycapColor === 'minimal-charcoal' ? 'bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700' : ''}
            {!rgbEnabled && keycapColor === 'sakura-pink' ? 'bg-pink-100 border border-pink-200 text-pink-700 hover:bg-pink-150' : ''}
            {!rgbEnabled && keycapColor === 'pastel-purple' ? 'bg-purple-100 border border-purple-200 text-purple-700 hover:bg-purple-150' : ''}
            {rgbEnabled && keycapColor === 'cyber-cyan' ? 'bg-zinc-955 text-cyan-400' : ''}
            {rgbEnabled && keycapColor === 'bow' ? 'bg-white text-black' : ''}
            {rgbEnabled && keycapColor === 'white-grey' ? 'bg-white text-zinc-400' : ''}
            {rgbEnabled && keycapColor === 'vintage-beige' ? 'bg-[#e5e9e4] text-black' : ''}
            {rgbEnabled && keycapColor === 'minimal-charcoal' ? 'bg-zinc-900 text-zinc-100' : ''}
            {rgbEnabled && keycapColor === 'sakura-pink' ? 'bg-pink-50 text-pink-700' : ''}
            {rgbEnabled && keycapColor === 'pastel-purple' ? 'bg-purple-50 text-purple-700' : ''}
          ">
            <span>{t[lang].symbols}</span>
          </div>
        </button>

        <!-- Emoji Button -->
        <button
          type="button"
          tabindex="-1"
          on:mousedown={handleButtonMouseDown}
          on:click={(e) => {
            (e.currentTarget as HTMLButtonElement).blur();
            onToggleEmoji();
          }}
          class="h-11 px-3.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-all text-sm relative overflow-hidden
            {rgbEnabled ? 'p-[1.5px] rgb-glow-border shadow-[0_0_8px_rgba(0,240,255,0.25)]' : ''}
          "
        >
          <div class="w-full h-full flex items-center justify-center rounded-[6px] px-3
            {theme === 'retro' ? 'rounded-none' : ''}
            {!rgbEnabled && keycapColor === 'cyber-cyan' ? 'bg-purple-900/60 border border-purple-500/50 text-purple-200 hover:bg-purple-800' : ''}
            {!rgbEnabled && keycapColor === 'bow' ? 'bg-white border border-zinc-200 text-black hover:bg-zinc-100 shadow-sm' : ''}
            {!rgbEnabled && keycapColor === 'white-grey' ? 'bg-white border border-zinc-200 text-zinc-400 hover:bg-zinc-50 shadow-sm' : ''}
            {!rgbEnabled && keycapColor === 'vintage-beige' ? 'bg-[#d0d4cf] border-2 border-[#868a85] text-black font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.2)]' : ''}
            {!rgbEnabled && keycapColor === 'minimal-charcoal' ? 'bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700' : ''}
            {!rgbEnabled && keycapColor === 'sakura-pink' ? 'bg-pink-100 border border-pink-200 text-pink-700 hover:bg-pink-150' : ''}
            {!rgbEnabled && keycapColor === 'pastel-purple' ? 'bg-purple-100 border border-purple-200 text-purple-700 hover:bg-purple-150' : ''}
            {rgbEnabled && keycapColor === 'cyber-cyan' ? 'bg-zinc-955 text-cyan-400' : ''}
            {rgbEnabled && keycapColor === 'bow' ? 'bg-white text-black' : ''}
            {rgbEnabled && keycapColor === 'white-grey' ? 'bg-white text-zinc-400' : ''}
            {rgbEnabled && keycapColor === 'vintage-beige' ? 'bg-[#e5e9e4] text-black' : ''}
            {rgbEnabled && keycapColor === 'minimal-charcoal' ? 'bg-zinc-900 text-zinc-100' : ''}
            {rgbEnabled && keycapColor === 'sakura-pink' ? 'bg-pink-50 text-pink-700' : ''}
            {rgbEnabled && keycapColor === 'pastel-purple' ? 'bg-purple-50 text-purple-700' : ''}
          ">
            <span>{t[lang].emoji}</span>
          </div>
        </button>

        <button
          type="button"
          tabindex="-1"
          on:mousedown={handleButtonMouseDown}
          on:click={(e) => {
            (e.currentTarget as HTMLButtonElement).blur();
            onKeyPress(' ', ' ');
          }}
          class="h-11 flex-1 max-w-md rounded-lg transition-all duration-75 cursor-pointer relative font-semibold text-xs tracking-widest uppercase flex items-center justify-center
            {rgbEnabled ? 'p-[1.5px] rgb-glow-border shadow-[0_0_8px_rgba(0,240,255,0.25)]' : ''}
          "
        >
          <div class="w-full h-full flex items-center justify-center rounded-[6px]
            {theme === 'retro' ? 'rounded-none' : ''}
            {activeKeys.has('Space') && rgbEnabled && keycapColor === 'cyber-cyan' ? 'bg-cyan-500 text-black' : ''}
            {activeKeys.has('Space') && !rgbEnabled && keycapColor === 'cyber-cyan' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.8)] scale-98 border-b-0' : ''}
            {!activeKeys.has('Space') && rgbEnabled && keycapColor === 'cyber-cyan' ? 'bg-zinc-955 text-cyan-400' : ''}
            {!activeKeys.has('Space') && !rgbEnabled && keycapColor === 'cyber-cyan' ? 'bg-zinc-900 border border-zinc-800/60 text-cyan-400 hover:bg-zinc-800 shadow-[0_4px_0_#09090b]' : ''}
            {keycapColor === 'bow' ? (activeKeys.has('Space') ? 'bg-zinc-955 text-white font-bold' : 'bg-white border border-zinc-200 text-black hover:bg-zinc-100 shadow-sm') : ''}
            {keycapColor === 'white-grey' ? (activeKeys.has('Space') ? 'bg-zinc-400 text-white font-bold' : 'bg-white border border-zinc-200 text-zinc-400 hover:bg-zinc-50 shadow-sm') : ''}
            {keycapColor === 'vintage-beige' ? (activeKeys.has('Space') ? 'bg-[#a3a7a2] text-black' : 'bg-[#e5e9e4] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#868a85] border-b-[#868a85] text-black font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:translate-y-0.5') : ''}
            {keycapColor === 'minimal-charcoal' ? (activeKeys.has('Space') ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 shadow-sm') : ''}
            {keycapColor === 'sakura-pink' ? (activeKeys.has('Space') ? 'bg-pink-500 text-white' : 'bg-pink-50 border border-pink-200 text-pink-600 hover:bg-pink-100 shadow-sm') : ''}
            {keycapColor === 'pastel-purple' ? (activeKeys.has('Space') ? 'bg-purple-600 text-white' : 'bg-purple-50 border border-purple-200 text-purple-600 hover:bg-purple-100 shadow-sm') : ''}
          ">
            Space
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
