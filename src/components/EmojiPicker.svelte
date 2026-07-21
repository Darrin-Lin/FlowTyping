<script lang="ts">
  export let isOpen: boolean = false;
  export let theme: "esports" | "retro" | "low-profile" | "minimal-dark" = "esports";
  export let onSelectEmoji: (emoji: string) => void = () => {};
  export let onClose: () => void = () => {};
  export let mode: "emoji" | "symbol" = "emoji";
  export let lang: "zh" | "en" = "zh";

  const t = {
    zh: {
      titleEmoji: "表情符號選擇",
      titleSymbol: "特殊字元選擇",
      catEmoji: ["表情臉部", "手勢身體", "動物自然", "食物飲料", "活動旅行", "物品心形"],
      catSymbol: ["常用標點", "數學符號", "希臘字母", "箭頭指標", "單位符號", "框線製圖", "特殊圖案", "創意顏文"]
    },
    en: {
      titleEmoji: "Emoji Picker",
      titleSymbol: "Special Characters",
      catEmoji: ["Smileys", "Body", "Animals", "Food", "Travel", "Objects"],
      catSymbol: ["Punctuation", "Math", "Greek", "Arrows", "Units", "Box Drawing", "Symbols", "Kaomoji"]
    }
  };

  const emojiCategories = [
    {
      name: "表情臉部",
      items: [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🫨", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "ghost", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"
      ]
    },
    {
      name: "手勢身體",
      items: [
        "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "🩸"
      ]
    },
    {
      name: "動物自然",
      items: [
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐒", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", " scorpion", "蜘蛛", "🕷️", "🐢", "🐍", "🦎", "🐙", "🦑", "🦀", "🐠", "🐟", "🐬", "🐳", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🐘", "🦛", "🦏", "🐪", "🦒", "🦘", "🐂", "🐎", "🐏", "🐑", "🐐", "🦌", "🐕", "🐈", "🐓", "🕊️", "🐇", "🐿️", "🦔"
      ]
    },
    {
      name: "食物飲料",
      items: [
        "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🥭", "🍍", "🥥", "🍅", "茄子", "🥑", " Broccoli", "🌽", "🥕", "🍞", "🥐", "🥨", "🥞", "🧀", "🍖", "🍗", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🥚", "🍳", "🍲", "🥗", "🍿", "🍱", " sushi", "🥟", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🍵", "🍷", "🍸", "🍹", "🍺", "🍻", "🥤", "🧋", "🧊"
      ]
    },
    {
      name: "活動旅行",
      items: [
        "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🎱", "🎯", "🎮", "🕹️", "🎲", "🧩", "🎳", "🚗", "🚕", "🚙", "🏎️", "🚓", "🚑", "🚒", "🚜", "🛵", "🏍️", "🚲", "🛴", " skateboard", "🚢", "✈️", "🚀", "🛸", "🚁", "🎈", "🎆", "🎉", "🎊", "⭐️", "🌟", "✨", "⚡", "💥", "🔥", "🌈", "☀️", "🌤️", "🌧️", "❄️", "⛄", "🌍", "🌎", "🗻", "🏕️", "🏖️", "🏝️"
      ]
    },
    {
      name: "物品心形",
      items: [
        "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💌", "💤", "💢", "💣", "💎", "🔮", "💡", "🕯️", "📖", "📕", "💻", "📱", "📷", "🎥", "🎬", "🎨", "🎤", "🎧", "🎼", "🎸", "🎹", "🪙", "💵", "✉️", "✏️", "🔑", "📦", "🛠️", "⚙️", "🩺", "🧪", "🌡️", "🧬", "⚖️", "🔬", "🔭"
      ]
    }
  ];

  const symbolCategories = [
    {
      name: "常用標點",
      items: [
        "，", "。", "！", "？", "；", "：", "、", "．", "…", "—", "「", "」", "『", "』", "（", "）", "《", "》", "〈", "〉", "〔", "〕", "【", "】", "〖", "〗", "～", "＆", "＠", "＃", "％", "＊", "＋", "－", "／", "＝", "＿", "｜", "“", "”", "‘", "’", "«", "»", "‹", "›", "″", "′"
      ]
    },
    {
      name: "數學符號",
      items: [
        "＋", "－", "×", "÷", "＝", "≠", "≈", "≅", "≡", "≤", "≥", "≮", "≯", "±", "∓", "√", "∛", "∜", "∝", "∞", "∠", "∟", "⊥", "∥", "∫", "∬", "∭", "∮", "∂", "∇", "∴", "∵", "∈", "∉", "∋", "⊆", "⊇", "⊂", "⊃", "∪", "∩", "⊕", "⊗", "⊙", "⊿", "∑", "∏", "π", "θ", "‰", "％", "ƒ", "′", "″"
      ]
    },
    {
      name: "希臘字母",
      items: [
        "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ",
        "ο", "π", "ρ", "σ", "ς", "τ", "υ", "φ", "χ", "ψ", "ω", "Α", "Β", "Γ",
        "Δ", "Ｅ", "Ｚ", "Ｈ", "Θ", "Ｉ", "Ｋ", "Λ", "Ｍ", "Ｎ", "Ξ", "Ο", "Π", "Ρ",
        "Σ", "Ｔ", "Υ", "Φ", "Ｘ", "Ψ", "Ω"
      ]
    },
    {
      name: "箭頭指標",
      items: [
        "↑", "↓", "←", "→", "↖", "↗", "↙", "↘", "↔", "↕", "⇄", "⇅", "⇆", "⇦", "⇨", "⇧", "⇩", "➔", "➘", "➚", "➛", "➜", "➝", "➞", "➟", "➠", "➡", "➢", "➣", "➤", "➥", "➦", "➶", "➴", "➵", "➻", "➼", "➽", "⇚", "⇛", "⇜", "⇝", "⇞", "⇟", "⇠", "⇡", "⇢", "⇣"
      ]
    },
    {
      name: "單位符號",
      items: [
        "℃", "℉", "㎜", "㎝", "㎞", "㎡", "㎥", "㎎", "㎏", "㏄", "㎕", "㎖", "㎗", "㎘", "㎙", "㎚", "㎛", "㏎", "㏕", "㏓", "㏔", "㏕", "㏖", "㏗", "㏘", "㏙", "㏚", "㏛", "㏜", "㏝", "％", "‰", "㏑", "㏒"
      ]
    },
    {
      name: "框線製圖",
      items: [
        "┌", "┐", "└", "┘", "├", "┤", "┬", "┴", "┼", "━", "┃", "┏", "┓", "┗", "┛", "┣", "┫", "┳", "┻", "╋", "═", "║", "╔", "╗", "╚", "╝", "╠", "╣", "╦", "╩", "╬", "─", "│"
      ]
    },
    {
      name: "特殊圖案",
      items: [
        "★", "☆", "♥", "♦", "♠", "♣", "☀", "☁", "☂", "☃", "⚡", "♨", "✓", "✗", "✔", "✖", "▲", "▼", "◀", "▶", "▽", "◄", "►", "◆", "◇", "○", "●", "◎", "♂", "♀", "♪", "♫", "♬", "♯", "♮", "♭", "✉", "✏", "✒", "✂", "☎", "⚙", "✿", "❀", "☣", "☢", "☠", "☕", "☯", "☸", "☮", "☻", "☺", "☹"
      ]
    },
    {
      name: "創意顏文",
      items: [
        "(⁠•⁠‿⁠•⁠)", "(⁠￣⁠︶⁠￣⁠)", "(⁠T⁠_⁠T⁠)", "(⁠≧⁠▽⁠≦⁠)", "╰⁠(⁠▔⁠∀⁠▔⁠)⁠╯", "(๑•̀ㅂ•́)و✧",
        "(=^･^=)", "(>_<)", "(^_-)-☆", "(*^▽^*)", "o(≧▽≦)o", "(´• ω •`)",
        "(＠_＠;)", "(￣ヘ￣;)", "(;﹏;)", "(─.─||)", "(︶︹︺)", "＼(￣▽￣)／",
        "(*￣▽￣)b", "┌(★ｏ★)┘", "凸(￣ヘ￣)", "(;-_-)ノ", "ヽ(°〇°)ﾉ", "( ˘ ³˘)♥"
      ]
    }
  ];

  $: categories = mode === "emoji" ? emojiCategories : symbolCategories;

  let currentCategory = 0;

  // Reset category index when switching mode
  $: if (mode) {
    currentCategory = 0;
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="w-full max-w-lg p-5 rounded-2xl transition-all shadow-2xl relative
      {theme === 'esports' ? 'bg-slate-900 border border-purple-500/50 text-white shadow-[0_0_30px_rgba(168,85,247,0.3)]' : ''}
      {theme === 'retro' ? 'bg-[#c3c7c2] border-4 border-[#868a85] text-black font-mono rounded-none shadow-[10px_10px_0px_rgba(0,0,0,0.5)]' : ''}
      {theme === 'low-profile' ? 'bg-white border border-slate-200 text-slate-800 shadow-xl shadow-slate-300/30' : ''}
      {theme === 'minimal-dark' ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-2xl' : ''}
    ">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 pb-2 border-b
        {theme === 'esports' ? 'border-slate-800' : ''}
        {theme === 'minimal-dark' ? 'border-zinc-800' : ''}
        {theme === 'low-profile' || theme === 'retro' ? 'border-slate-200' : ''}
      ">
        <h3 class="font-bold text-sm tracking-wider flex items-center gap-2">
          <span>{mode === 'emoji' ? t[lang].titleEmoji : t[lang].titleSymbol}</span>
        </h3>
        <button
          on:click={onClose}
          class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition cursor-pointer text-xs
            {theme === 'esports' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : ''}
            {theme === 'minimal-dark' ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : ''}
            {theme === 'low-profile' || theme === 'retro' ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800' : ''}
          "
        >
          ✕
        </button>
      </div>

      <!-- Categories -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none select-none">
        {#each categories as cat, i}
          <button
            on:click={() => (currentCategory = i)}
            class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition
              {currentCategory === i
                ? (theme === 'esports' ? 'bg-purple-600 text-white font-bold' : (theme === 'minimal-dark' ? 'bg-zinc-700 text-white' : 'bg-slate-800 text-white'))
                : (theme === 'esports' ? 'bg-slate-800/85 text-slate-300 hover:bg-slate-700' : (theme === 'minimal-dark' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'))}
            "
          >
            {mode === 'emoji' ? t[lang].catEmoji[i] : t[lang].catSymbol[i]}
          </button>
        {/each}
      </div>

      <!-- Grid -->
      <div class="grid gap-2 max-h-64 overflow-y-auto p-1
        {categories[currentCategory].name === '創意顏文' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-6'}
      ">
        {#each categories[currentCategory].items as item}
          <button
            on:click={() => {
              onSelectEmoji(item);
              onClose();
            }}
            class="p-2.5 rounded-lg flex items-center justify-center transition cursor-pointer hover:scale-105 active:scale-95
              {categories[currentCategory].name === '創意顏文' ? 'text-xs md:text-sm font-medium border border-transparent' : 'text-xl'}
              {theme === 'esports' ? 'hover:bg-purple-500/10 text-white hover:border-purple-500/20' : ''}
              {theme === 'minimal-dark' ? 'hover:bg-zinc-800 text-zinc-100 hover:border-zinc-700/50' : ''}
              {theme === 'low-profile' || theme === 'retro' ? 'hover:bg-slate-100 text-slate-800 hover:border-slate-200' : ''}
            "
          >
            {item}
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
