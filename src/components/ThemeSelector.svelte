<script lang="ts">
  export let activePreset: string = "charcoal";
  export let keyboardStyle: "esports" | "retro" = "esports";
  export let keycapColor: string = "bow";
  export let inputBoxStyle: string = "minimal-light";
  export let material: string = "dark-gray";
  export let backgroundStyle: "dark" | "bright" = "dark";
  export let rgbEnabled: boolean = false;
  export let keyboardMappingMode: "native" | "us-layout" = "native";

  export let onPresetChange: (p: string) => void = () => {};
  export let onKeyboardStyleChange: (s: "esports" | "retro") => void = () => {};
  export let onKeycapColorChange: (k: string) => void = () => {};
  export let onInputBoxStyleChange: (i: string) => void = () => {};
  export let onMaterialChange: (m: string) => void = () => {};
  export let onBackgroundStyleChange: (b: "dark" | "bright") => void = () => {};
  export let onRgbToggle: () => void = () => {};
  export let onKeyboardMappingModeChange: (m: "native" | "us-layout") => void = () => {};
  export let systemFontSize: string = "md";
  export let inputFontSize: string = "18pt";
  export let onSystemFontSizeChange: (s: string) => void = () => {};
  export let onInputFontSizeChange: (f: string) => void = () => {};
  export let lang: "zh" | "en" = "zh";
  export let shortcutConfig: {
    ctrl: boolean;
    space: boolean;
    shift: boolean;
    capslock: boolean;
    tab: boolean;
    alt: boolean;
    leftCtrl: boolean;
    rightCtrl: boolean;
    leftShift: boolean;
    rightShift: boolean;
  };
  export let onShortcutConfigChange: (config: any) => void = () => {};
  export let autoSpacingEnabled: boolean = false;
  export let onAutoSpacingToggle: () => void = () => {};
  export let wordWrap: boolean = true;
  export let onWordWrapToggle: () => void = () => {};

  const t = {
    zh: {
      title: "個人化設定",
      preset: "風格預設",
      keyboardStyle: "鍵盤樣式",
      keycaps: "鍵帽",
      inputArea: "輸入區",
      base: "底座",
      background: "背景",
      rgb: "RGB",
      uiScale: "系統大小",
      textSize: "打字區大小",
      keyboardLayout: "鍵盤配置",
      keyboardMapping: "鍵盤對應模式",
      mappingModes: {
        native: "目前鍵盤",
        usLayout: "美式鍵盤"
      },
      layouts: {
        zhuyin: "注音",
        english: "英文"
      },
      advTitle: "進階設定",
      shortcutLabel: "切換快捷鍵（可複選）",
      noneLabel: "無",
      autoSpacing: "中英文自動空格（pangu.js）",
      wordWrap: "打字區自動折行（Word Wrap）",
      keys: {
        ctrl: "Ctrl",
        space: "Space",
        shift: "Shift",
        capslock: "Caps Lock",
        tab: "Tab",
        alt: "Alt",
        leftCtrl: "左 Ctrl",
        rightCtrl: "右 Ctrl",
        leftShift: "左 Shift",
        rightShift: "右 Shift"
      },
      presets: {
        charcoalDark: "深色",
        charcoalLight: "淺色",
        cyber: "科技",
        retro: "復古",
        wood: "木質",
        sakura: "櫻花"
      },
      styles: {
        modern: "現代",
        retro: "復古"
      },
      keycapsList: {
        cyber: "科技",
        light: "淺色",
        gray: "灰色",
        retro: "復古",
        dark: "深色",
        sakura: "櫻花",
        pastel: "夢幻紫"
      },
      inputAreaList: {
        cyber: "科技",
        esports: "電競",
        retro: "復古",
        light: "淺色",
        dark: "深色"
      },
      baseList: {
        dark: "深色",
        silver: "銀灰",
        wood: "木質",
        light: "淺色",
        sakura: "櫻花"
      },
      bgList: {
        dark: "深色",
        bright: "淺色"
      },
      scales: {
        sm: "小",
        md: "中",
        lg: "大",
        xl: "特大"
      }
    },
    en: {
      title: "Settings",
      preset: "Preset",
      keyboardStyle: "Keyboard Style",
      keycaps: "Keycaps",
      inputArea: "Input Area",
      base: "Base Casing",
      background: "Background",
      rgb: "RGB",
      uiScale: "UI Scale",
      textSize: "Text Size",
      keyboardLayout: "Keyboard Layout",
      keyboardMapping: "Keyboard Mapping Mode",
      mappingModes: {
        native: "Current Keyboard",
        usLayout: "US Keyboard"
      },
      layouts: {
        zhuyin: "Zhuyin",
        english: "English"
      },
      advTitle: "Advanced Settings",
      shortcutLabel: "Switch Hotkey (Checkboxes)",
      noneLabel: "None",
      autoSpacing: "Auto CJK Spacing (pangu.js)",
      wordWrap: "Auto Word Wrap",
      keys: {
        ctrl: "Ctrl",
        space: "Space",
        shift: "Shift",
        capslock: "Caps Lock",
        tab: "Tab",
        alt: "Alt",
        leftCtrl: "Left Ctrl",
        rightCtrl: "Right Ctrl",
        leftShift: "Left Shift",
        rightShift: "Right Shift"
      },
      presets: {
        charcoalDark: "Dark",
        charcoalLight: "Light",
        cyber: "Cyber",
        retro: "Retro",
        wood: "Wood",
        sakura: "Sakura"
      },
      styles: {
        modern: "Modern",
        retro: "Retro"
      },
      keycapsList: {
        cyber: "Cyber",
        light: "Light",
        gray: "Gray",
        retro: "Retro",
        dark: "Dark",
        sakura: "Sakura",
        pastel: "Pastel"
      },
      inputAreaList: {
        cyber: "Cyber",
        esports: "Esports",
        retro: "Retro",
        light: "Light",
        dark: "Dark"
      },
      baseList: {
        dark: "Dark",
        silver: "Silver",
        wood: "Wood",
        light: "Light",
        sakura: "Sakura"
      },
      bgList: {
        dark: "Dark",
        bright: "Light"
      },
      scales: {
        sm: "Small",
        md: "Medium",
        lg: "Large",
        xl: "Extra Large"
      }
    }
  };

  // Simple Chinese Preset translation for indicator
  const PRESET_NAMES: Record<string, string> = {
    cyber: "科技",
    retro: "復古",
    wood: "木質",
    sakura: "櫻花",
    charcoalDark: "深色",
    charcoalLight: "淺色",
    custom: "自訂"
  };

  let isAdvancedOpen = false;
</script>

<div class="w-full p-4 rounded-2xl border backdrop-blur-lg shadow-2xl transition-all duration-300
  {backgroundStyle === 'dark' ? 'bg-zinc-900/95 border-zinc-800 text-zinc-200 shadow-zinc-950/40' : 'bg-white/95 border-zinc-200 text-zinc-800 shadow-zinc-300/40'}
">
  <!-- Small header inside the card -->
  <div class="flex items-center justify-between mb-3 pb-2 border-b select-none
    {backgroundStyle === 'dark' ? 'border-zinc-800/60' : 'border-zinc-100'}
  ">
    <div class="flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase opacity-75">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-[0.875rem] w-[0.875rem] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>{t[lang].title}</span>
    </div>
  </div>

  <div class="overflow-y-auto max-h-[65vh] pr-1.5 custom-scroll flex flex-col gap-3.5 select-none" style="scrollbar-width: thin;">
    <div class="grid grid-cols-2 gap-3 text-xs">
    <!-- Style Preset -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].preset}</span>
      <select
        value={activePreset}
        on:change={(e) => onPresetChange(e.currentTarget.value)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="charcoalDark">{t[lang].presets.charcoalDark}</option>
        <option value="charcoalLight">{t[lang].presets.charcoalLight}</option>
        <option value="cyber">{t[lang].presets.cyber}</option>
        <option value="retro">{t[lang].presets.retro}</option>
        <option value="wood">{t[lang].presets.wood}</option>
        <option value="sakura">{t[lang].presets.sakura}</option>
        <option value="custom" disabled>{lang === 'zh' ? '自訂' : 'Custom'}</option>
      </select>
    </div>

    <!-- Keyboard Style -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].keyboardStyle}</span>
      <select
        value={keyboardStyle}
        on:change={(e) => onKeyboardStyleChange(e.currentTarget.value as any)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="esports">{t[lang].styles.modern}</option>
        <option value="retro">{t[lang].styles.retro}</option>
      </select>
    </div>


    <!-- Keycap Color -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].keycaps}</span>
      <select
        value={keycapColor}
        on:change={(e) => onKeycapColorChange(e.currentTarget.value)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="cyber-cyan">{t[lang].keycapsList.cyber}</option>
        <option value="bow">{t[lang].keycapsList.light}</option>
        <option value="white-grey">{t[lang].keycapsList.gray}</option>
        <option value="vintage-beige">{t[lang].keycapsList.retro}</option>
        <option value="minimal-charcoal">{t[lang].keycapsList.dark}</option>
        <option value="sakura-pink">{t[lang].keycapsList.sakura}</option>
        <option value="pastel-purple">{t[lang].keycapsList.pastel}</option>
      </select>
    </div>

    <!-- Input box style -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].inputArea}</span>
      <select
        value={inputBoxStyle}
        on:change={(e) => onInputBoxStyleChange(e.currentTarget.value)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="cyber-glow">{t[lang].inputAreaList.cyber}</option>
        <option value="cyberpunk-red">{t[lang].inputAreaList.esports}</option>
        <option value="crt-terminal">{t[lang].inputAreaList.retro}</option>
        <option value="minimal-light">{t[lang].inputAreaList.light}</option>
        <option value="minimal-dark">{t[lang].inputAreaList.dark}</option>
      </select>
    </div>

    <!-- Case Material -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].base}</span>
      <select
        value={material}
        on:change={(e) => onMaterialChange(e.currentTarget.value)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="dark-gray">{t[lang].baseList.dark}</option>
        <option value="silver-gray">{t[lang].baseList.silver}</option>
        <option value="wood">{t[lang].baseList.wood}</option>
        <option value="plastic">{t[lang].baseList.light}</option>
        <option value="plastic-pink">{t[lang].baseList.sakura}</option>
      </select>
    </div>

    <!-- Background Style -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].background}</span>
      <select
        value={backgroundStyle}
        on:change={(e) => onBackgroundStyleChange(e.currentTarget.value as any)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="dark">{t[lang].bgList.dark}</option>
        <option value="bright">{t[lang].bgList.bright}</option>
      </select>
    </div>

    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].rgb}</span>
      <div class="flex items-center h-[1.93rem]">
        <button
          type="button"
          on:click={onRgbToggle}
          class="relative inline-flex h-[1.25rem] w-[2.5rem] items-center rounded-full transition-colors focus:outline-none cursor-pointer
            {rgbEnabled ? (backgroundStyle === 'dark' ? 'bg-zinc-200' : 'bg-zinc-800') : 'bg-zinc-700'}"
          aria-label="切換 RGB 燈效"
        >
          <span
            class="inline-block h-[0.875rem] w-[0.875rem] rounded-full bg-white transition-transform duration-200"
            style="transform: translateX({rgbEnabled ? '1.375rem' : '0.25rem'})"
          ></span>
        </button>
      </div>
    </div>

    <!-- System Font Size Selection -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].uiScale}</span>
      <select
        value={systemFontSize}
        on:change={(e) => onSystemFontSizeChange(e.currentTarget.value)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="sm">{t[lang].scales.sm}</option>
        <option value="md">{t[lang].scales.md}</option>
        <option value="lg">{t[lang].scales.lg}</option>
        <option value="xl">{t[lang].scales.xl}</option>
      </select>
    </div>

    <!-- Input Font Size Selection (pt) -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].textSize}</span>
      <select
        value={inputFontSize}
        on:change={(e) => onInputFontSizeChange(e.currentTarget.value)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="6pt">6 pt</option>
        <option value="8pt">8 pt</option>
        <option value="10pt">10 pt</option>
        <option value="12pt">12 pt</option>
        <option value="14pt">14 pt</option>
        <option value="16pt">16 pt</option>
        <option value="18pt">18 pt</option>
        <option value="20pt">20 pt</option>
        <option value="24pt">24 pt</option>
        <option value="32pt">32 pt</option>
      </select>
    </div>

    <!-- Keyboard Mapping Mode -->
    <div class="flex flex-col gap-1">
      <span class="font-semibold opacity-70">{t[lang].keyboardMapping}</span>
      <select
        value={keyboardMappingMode}
        on:change={(e) => onKeyboardMappingModeChange(e.currentTarget.value as any)}
        class="border rounded p-1.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 cursor-pointer
          {backgroundStyle === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}"
      >
        <option value="native">{t[lang].mappingModes.native}</option>
        <option value="us-layout">{t[lang].mappingModes.usLayout}</option>
      </select>
    </div>
  </div>

  <!-- Advanced Settings Section -->
  <div class="mt-4 pt-3 border-t select-none
    {backgroundStyle === 'dark' ? 'border-zinc-800/60' : 'border-zinc-100'}
  ">
    <!-- Clickable Header Toggler -->
    <button
      type="button"
      on:click={() => isAdvancedOpen = !isAdvancedOpen}
      class="w-full flex items-center justify-between mb-2 font-bold text-[10px] tracking-wider uppercase opacity-75 hover:opacity-100 cursor-pointer focus:outline-none py-1"
    >
      <div class="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span>{t[lang].advTitle}</span>
      </div>
      <!-- Chevron Arrow Icon -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-3.5 w-3.5 transition-transform duration-250 {isAdvancedOpen ? 'rotate-180' : ''}" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="3"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    {#if isAdvancedOpen}
      <div class="flex flex-col gap-2 text-xs mt-2 transition-all duration-300">
        <span class="font-semibold opacity-70">{t[lang].shortcutLabel}</span>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 p-2 rounded-lg border
          {backgroundStyle === 'dark' ? 'bg-zinc-955 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}
        ">
          {#each Object.keys(shortcutConfig) as key}
            {@const configKey = key as keyof typeof shortcutConfig}
            {@const transKey = key as keyof typeof t.zh.keys}
            <label class="flex items-center gap-2 cursor-pointer py-0.5 hover:opacity-85">
              <input
                type="checkbox"
                checked={shortcutConfig[configKey]}
                on:change={(e) => {
                  const newConfig = { ...shortcutConfig, [configKey]: e.currentTarget.checked };
                  onShortcutConfigChange(newConfig);
                }}
                class="w-3.5 h-3.5 rounded cursor-pointer accent-zinc-850 dark:accent-zinc-200"
              />
              <span class="font-medium text-[11px]">{t[lang].keys[transKey] || key}</span>
            </label>
          {/each}
        </div>

        <!-- Auto Spacing toggle -->
        <label class="flex items-center gap-2 cursor-pointer mt-1.5 p-2 rounded-lg border select-none hover:opacity-85
          {backgroundStyle === 'dark' ? 'bg-zinc-955 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-750'}
        ">
          <input
            type="checkbox"
            checked={autoSpacingEnabled}
            on:change={onAutoSpacingToggle}
            class="w-3.5 h-3.5 rounded cursor-pointer accent-zinc-850 dark:accent-zinc-200"
          />
          <span class="font-semibold text-[11px]">{t[lang].autoSpacing}</span>
        </label>

        <!-- Word Wrap toggle -->
        <label class="flex items-center gap-2 cursor-pointer mt-1.5 p-2 rounded-lg border select-none hover:opacity-85
          {backgroundStyle === 'dark' ? 'bg-zinc-955 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-750'}
        ">
          <input
            type="checkbox"
            checked={wordWrap}
            on:change={onWordWrapToggle}
            class="w-3.5 h-3.5 rounded cursor-pointer accent-zinc-850 dark:accent-zinc-200"
          />
          <span class="font-semibold text-[11px]">{t[lang].wordWrap}</span>
        </label>
      </div>
    {/if}
  </div>
</div>
</div>

<style>
  .custom-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.35);
    border-radius: 10px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.55);
  }
</style>
