<script lang="ts">
  import { onMount, tick } from "svelte";

  export let text: string = "";
  export let composition: string = "";
  export let selectionStart: number = 0;
  export let selectionEnd: number = 0;
  export let inputBoxStyle: string = "cyber-glow";
  export let onSelectionChange: (start: number, end: number) => void = () => {};
  export let onCopy: () => void = () => {};
  export let onClear: () => void = () => {};
  export let inputFontSize: string = "18pt";
  export let lang: "zh" | "en" = "zh";
  export let compositionCursor: number = 0;
  export let onCompositionCursorChange: (cursor: number) => void = () => {};
  export let wordWrap: boolean = false;

  const t = {
    zh: {
      title: "編輯區",
      words: "字數：",
      placeholder: "在此開始輸入注音...",
      copy: "複製內容",
      clear: "清除內容"
    },
    en: {
      title: "Input Box",
      words: "Words:",
      placeholder: "Start typing Zhuyin/Bopomofo here...",
      copy: "Copy Text",
      clear: "Clear Text"
    }
  };

  let textareaEl: HTMLTextAreaElement;
  let renderedViewEl: HTMLDivElement;

  // Build the combined array of characters (text + inline composition)
  $: displayChars = (() => {
    const textArr = Array.from(text);
    if (composition) {
      textArr.splice(selectionStart, 0, ...Array.from(composition));
    }
    return textArr;
  })();

  // Synchronize textarea value with composition included
  $: textareaValue = (() => {
    if (composition) {
      const textArr = Array.from(text);
      textArr.splice(selectionStart, 0, composition);
      return textArr.join("");
    }
    return text;
  })();

  // Sync cursor selection down to textarea element
  $: if (textareaEl) {
    const targetStart = composition ? selectionStart + compositionCursor : selectionStart;
    const targetEnd = composition ? selectionStart + compositionCursor : selectionEnd;
    tick().then(() => {
      if (textareaEl.selectionStart !== targetStart || textareaEl.selectionEnd !== targetEnd) {
        textareaEl.selectionStart = targetStart;
        textareaEl.selectionEnd = targetEnd;
      }
    });
  }

  function handleTextareaInput(e: Event) {
    const rawVal = (e.target as HTMLTextAreaElement).value;
    if (composition) {
      const compLen = Array.from(composition).length;
      const textArr = Array.from(rawVal);
      // Strip out the composition text to update parent state
      textArr.splice(selectionStart, compLen);
      text = textArr.join("");
    } else {
      text = rawVal;
    }
    handleTextareaSelect();
  }

  function handleTextareaSelect() {
    if (textareaEl) {
      if (composition) {
        const compLen = Array.from(composition).length;
        let start = textareaEl.selectionStart;
        const clickPos = Math.max(selectionStart, Math.min(selectionStart + compLen, start));
        const newCompCursor = clickPos - selectionStart;
        onCompositionCursorChange(newCompCursor);
      } else {
        onSelectionChange(textareaEl.selectionStart, textareaEl.selectionEnd);
      }
    }
  }

  function handleTextareaScroll() {
    if (textareaEl && renderedViewEl) {
      renderedViewEl.scrollTop = textareaEl.scrollTop;
      renderedViewEl.scrollLeft = textareaEl.scrollLeft;
    }
  }

  function scrollCaretIntoView() {
    if (!textareaEl || !renderedViewEl) return;
    requestAnimationFrame(() => {
      const caretEl = renderedViewEl.querySelector('.custom-caret-left, .custom-caret-right') as HTMLElement;
      if (caretEl) {
        const containerHeight = renderedViewEl.clientHeight;
        const caretTop = caretEl.offsetTop;
        const caretHeight = caretEl.offsetHeight || 24;

        // Auto scroll vertically to keep current typing line at the bottom of the visible area
        if (caretTop + caretHeight > textareaEl.scrollTop + containerHeight) {
          const newScrollTop = Math.max(0, caretTop + caretHeight - containerHeight + 8);
          textareaEl.scrollTop = newScrollTop;
          renderedViewEl.scrollTop = newScrollTop;
        } else if (caretTop < textareaEl.scrollTop) {
          const newScrollTop = Math.max(0, caretTop - 8);
          textareaEl.scrollTop = newScrollTop;
          renderedViewEl.scrollTop = newScrollTop;
        }

        // Auto scroll horizontally if horizontal overflow occurs
        const containerWidth = renderedViewEl.clientWidth;
        const caretLeft = caretEl.offsetLeft;
        const caretWidth = caretEl.offsetWidth || 10;
        if (caretLeft + caretWidth > textareaEl.scrollLeft + containerWidth) {
          const newScrollLeft = Math.max(0, caretLeft + caretWidth - containerWidth + 12);
          textareaEl.scrollLeft = newScrollLeft;
          renderedViewEl.scrollLeft = newScrollLeft;
        } else if (caretLeft < textareaEl.scrollLeft) {
          const newScrollLeft = Math.max(0, caretLeft - 12);
          textareaEl.scrollLeft = newScrollLeft;
          renderedViewEl.scrollLeft = newScrollLeft;
        }
      }
    });
  }

  $: if (displayChars || selectionStart || compositionCursor || textareaValue) {
    scrollCaretIntoView();
  }

  onMount(() => {
    const handleGlobalSelectionChange = () => {
      if (document.activeElement === textareaEl) {
        handleTextareaSelect();
      }
    };
    document.addEventListener("selectionchange", handleGlobalSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleGlobalSelectionChange);
    };
  });
</script>

<style>
  /* Hide scrollbar of custom rendered layer to match styling */
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Blinking caret styles with 0px layout footprint */
  .custom-caret-left {
    position: relative;
  }
  .custom-caret-left::before {
    content: "";
    position: absolute;
    left: 0;
    top: 15%;
    bottom: 15%;
    width: 2.5px;
    background-color: currentColor;
    animation: caret-blink-anim 1s infinite;
  }

  .custom-caret-right {
    position: relative;
  }
  .custom-caret-right::after {
    content: "";
    position: absolute;
    right: 0;
    top: 15%;
    bottom: 15%;
    width: 2.5px;
    background-color: currentColor;
    animation: caret-blink-anim 1s infinite;
  }

  @keyframes caret-blink-anim {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
  class="w-full max-w-3xl mx-auto mb-6 rounded-2xl transition-shadow duration-300 relative overflow-hidden min-h-[140px] h-[160px] max-h-[550px] resize-y
    {inputBoxStyle === 'cyber-glow' ? 'bg-zinc-950/90 border-2 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)] text-cyan-50' : ''}
    {inputBoxStyle === 'cyberpunk-red' ? 'bg-zinc-950/90 border-2 border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.25)] text-red-50' : ''}
    {inputBoxStyle === 'crt-terminal' ? 'bg-[#2b3a2a] border-4 border-[#3a4b39] shadow-inner text-[#76ff03] rounded-none crt-overlay' : ''}
    {inputBoxStyle === 'minimal-light' ? 'bg-white/80 backdrop-blur-md border border-zinc-200 shadow-sm text-zinc-800' : ''}
    {inputBoxStyle === 'minimal-dark' ? 'bg-zinc-900/90 border border-zinc-800 shadow-md text-zinc-100' : ''}
  "
  on:click={() => textareaEl?.focus()}
>
  {#if inputBoxStyle === 'crt-terminal'}
    <div class="absolute inset-0 pointer-events-none crt-overlay opacity-30"></div>
  {/if}

  <!-- Header -->
  <div class="absolute top-2.5 left-5 text-[10px] tracking-wider opacity-40 font-bold uppercase pointer-events-none select-none z-30">
    <span>{t[lang].title}</span>
  </div>

  <!-- Word Count (Bottom Left) -->
  <div class="absolute bottom-2.5 left-5 text-[10px] tracking-wider opacity-40 font-bold uppercase pointer-events-none select-none z-30">
    <span>{Array.from(text).length} {lang === 'zh' ? '字' : 'chars'}</span>
  </div>

  <!-- Copy Button (Top Right) -->
  <button
    type="button"
    tabindex="-1"
    on:mousedown={(e) => e.preventDefault()}
    on:click={onCopy}
    class="absolute top-2.5 right-2.5 z-40 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer border
      {inputBoxStyle === 'crt-terminal' ? 'border-[#76ff03]/30 text-[#76ff03] hover:bg-[#76ff03]/10' : ''}
      {inputBoxStyle === 'minimal-light' ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600' : ''}
      {inputBoxStyle !== 'crt-terminal' && inputBoxStyle !== 'minimal-light' ? 'bg-zinc-800/80 hover:bg-zinc-700/80 border-zinc-700 text-zinc-300' : ''}
    "
    title={t[lang].copy}
    aria-label={t[lang].copy}
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  </button>

  <!-- Clear Button (Bottom Right) -->
  <button
    type="button"
    tabindex="-1"
    on:mousedown={(e) => e.preventDefault()}
    on:click={onClear}
    class="absolute bottom-2.5 right-2.5 z-40 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer border
      {inputBoxStyle === 'crt-terminal' ? 'border-[#76ff03]/30 text-[#76ff03] hover:bg-[#76ff03]/10' : ''}
      {inputBoxStyle === 'minimal-light' ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600' : ''}
      {inputBoxStyle !== 'crt-terminal' && inputBoxStyle !== 'minimal-light' ? 'bg-zinc-800/80 hover:bg-zinc-700/80 border-zinc-700 text-zinc-300' : ''}
    "
    title={t[lang].clear}
    aria-label={t[lang].clear}
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  </button>

  <!-- Resize Grip Handle Indicator (Bottom Right Corner) -->
  <div class="absolute bottom-0.5 right-0.5 pointer-events-none opacity-20 select-none z-30">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 fill-current opacity-70" viewBox="0 0 16 16">
      <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14Z"/>
    </svg>
  </div>

  <!-- Scroll Container -->
  <div class="w-full h-full pt-8 pb-8 pl-5 pr-12 relative">
    
    <!-- Transparent Native Textarea (Z-20: Handles all user cursor interaction, mouse drags, pastes) -->
    <textarea
      bind:this={textareaEl}
      value={textareaValue}
      on:input={handleTextareaInput}
      on:select={handleTextareaSelect}
      on:keyup={handleTextareaSelect}
      on:mouseup={handleTextareaSelect}
      on:scroll={handleTextareaScroll}
      class="absolute top-8 left-5 right-12 bottom-8 bg-transparent text-transparent resize-none select-text outline-none border-none tracking-normal leading-relaxed caret-transparent z-20 font-mono {wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'}"
      style="font-size: {inputFontSize};"
      placeholder={t[lang].placeholder}
    ></textarea>

    <!-- Custom Rendered View (Z-10: Renders the visual glow, cursor, and selection highlight underneath) -->
    <div 
      bind:this={renderedViewEl}
      class="absolute top-8 left-5 right-12 bottom-8 overflow-y-auto tracking-normal leading-relaxed z-10 pointer-events-none select-none scrollbar-none font-mono {wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'} {inputBoxStyle === 'crt-terminal' ? 'crt-screen-glow' : ''}"
      style="font-size: {inputFontSize};"
    >{#each displayChars as char, idx}{@const isComp = composition && idx >= selectionStart && idx < selectionStart + Array.from(composition).length}{@const originalIdx = (() => {
          if (!composition) return idx;
          if (idx < selectionStart) return idx;
          if (idx >= selectionStart + Array.from(composition).length) return idx - Array.from(composition).length;
          return -1;
        })()}{@const isSelected = !isComp && originalIdx !== -1 && originalIdx >= selectionStart && originalIdx < selectionEnd}{@const isCaretHere = selectionStart === selectionEnd && (
          composition 
            ? (idx === selectionStart + compositionCursor)
            : (idx === selectionStart)
        )}{@const isRightCaretHere = selectionStart === selectionEnd && idx === displayChars.length - 1 && (
          composition
            ? (selectionStart + compositionCursor === displayChars.length)
            : (selectionStart === displayChars.length)
        )}<span 
          class="inline transition
            {isCaretHere ? 'custom-caret-left' : ''}
            {isRightCaretHere ? 'custom-caret-right' : ''}
            {isComp ? 
              (inputBoxStyle === 'cyber-glow' ? 'border-b-2 border-dashed border-cyan-400 text-cyan-300 animate-pulse' : '') +
              (inputBoxStyle === 'cyberpunk-red' ? 'border-b-2 border-dashed border-red-400 text-red-300 animate-pulse' : '') +
              (inputBoxStyle === 'crt-terminal' ? 'border-b-2 border-dashed border-[#76ff03] text-[#76ff03] animate-pulse' : '') +
              (inputBoxStyle === 'minimal-light' ? 'border-b-2 border-dashed border-indigo-500 text-indigo-600 animate-pulse' : '') +
              (inputBoxStyle === 'minimal-dark' ? 'border-b-2 border-dashed border-zinc-500 text-zinc-300 animate-pulse' : '')
            : ''}
            {isSelected ? 
              (inputBoxStyle === 'cyber-glow' ? 'bg-cyan-500/40 text-cyan-200' : '') +
              (inputBoxStyle === 'cyberpunk-red' ? 'bg-red-500/40 text-red-200' : '') +
              (inputBoxStyle === 'crt-terminal' ? 'bg-[#76ff03]/40 text-[#76ff03]' : '') +
              (inputBoxStyle === 'minimal-light' ? 'bg-indigo-100 text-indigo-900' : '') +
              (inputBoxStyle === 'minimal-dark' ? 'bg-zinc-800 text-white' : '')
            : ''}
          "
        >{char}</span>{/each}{#if displayChars.length === 0}<span class="custom-caret-left">&nbsp;</span>{/if}</div>
  </div>
</div>
