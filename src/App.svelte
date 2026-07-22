<script lang="ts">
  import { onMount } from "svelte";
  import InputArea from "./components/InputArea.svelte";
  import CandidateBox from "./components/CandidateBox.svelte";
  import Keyboard from "./components/Keyboard.svelte";
  import EmojiPicker from "./components/EmojiPicker.svelte";
  import ThemeSelector from "./components/ThemeSelector.svelte";
  import { ZhuyinEngine, CONSONANTS, MEDIALS, VOWELS, TONES } from "./engine/ZhuyinEngine";
  import { DictionaryLoader } from "./engine/DictionaryLoader";
  import pangu from "pangu";

  const engine = new ZhuyinEngine();
  const dictLoader = new DictionaryLoader();

  // Standard Taiwan QWERTY to Zhuyin (Bopomofo) Mapping
  const KEY_TO_ZHUYIN: Record<string, string> = {
    '1': 'ㄅ', '2': 'ㄉ', '3': 'ˇ', '4': 'ˋ', '5': 'ㄓ', '6': 'ˊ', '7': '˙', '8': 'ㄚ', '9': 'ㄞ', '0': 'ㄢ', '-': 'ㄦ',
    'q': 'ㄆ', 'w': 'ㄊ', 'e': 'ㄍ', 'r': 'ㄐ', 't': 'ㄔ', 'y': 'ㄗ', 'u': 'ㄧ', 'i': 'ㄛ', 'o': 'ㄟ', 'p': 'ㄣ',
    'a': 'ㄇ', 's': 'ㄋ', 'd': 'ㄎ', 'f': 'ㄑ', 'g': 'ㄕ', 'h': 'ㄘ', 'j': 'ㄨ', 'k': 'ㄜ', 'l': 'ㄠ', ';': 'ㄤ',
    'z': 'ㄈ', 'x': 'ㄌ', 'c': '橫', // placeholder corrected below
    'v': 'ㄒ', 'b': 'ㄖ', 'n': 'ㄙ', 'm': 'ㄩ', ',': 'ㄝ', '.': 'ㄡ', '/': 'ㄥ'
  };
  KEY_TO_ZHUYIN['c'] = 'ㄏ'; // Explicit correction

  let text = "你好！";
  let composition = "";
  let selectionStart = Array.from(text).length;
  let selectionEnd = Array.from(text).length;
  let cursorPos = selectionEnd;
  let activeKeys = new Set<string>();

  // Customization States
  let activePreset: "cyber" | "retro" | "wood" | "sakura" | "charcoalDark" | "charcoalLight" | "custom" = "charcoalDark";
  let keyboardStyle: "esports" | "retro" = "esports";
  let keycapColor: "cyber-cyan" | "bow" | "vintage-beige" | "minimal-charcoal" | "sakura-pink" | "pastel-purple" | "white-grey" = "minimal-charcoal";
  let inputBoxStyle: "cyber-glow" | "cyberpunk-red" | "crt-terminal" | "minimal-light" | "minimal-dark" = "minimal-dark";
  let material: "dark-gray" | "silver-gray" | "wood" | "plastic" | "plastic-pink" = "dark-gray";
  let backgroundStyle: "dark" | "bright" = "dark";
  let rgbEnabled = false;

  let isEmojiOpen = false;
  let isSettingsOpen = false;
  let pickerMode: "emoji" | "symbol" = "emoji";
  let systemFontSize: "sm" | "md" | "lg" | "xl" = "md";
  let inputFontSize: string = "18pt";
  let lang: "zh" | "en" = "zh";
  let keyboardLayout: "zhuyin" | "english" = "zhuyin";
  let shortcutConfig = {
    ctrl: true,
    space: true,
    shift: false,
    capslock: false,
    tab: false,
    alt: false,
    leftCtrl: false,
    rightCtrl: false,
    leftShift: false,
    rightShift: false
  };
  let shiftPressedTime = 0;
  let otherKeyPressedWhileShift = false;
  let autoSpacingEnabled = false;
  let wordWrap = false;

  let lastFormattedText = "";
  $: if (autoSpacingEnabled && text && text !== lastFormattedText) {
    const formatted = pangu.spacingText(text);
    if (formatted !== text) {
      const leftPart = Array.from(text).slice(0, cursorPos).join("");
      const formattedLeftPart = pangu.spacingText(leftPart);
      const addedSpacesLeft = Array.from(formattedLeftPart).length - Array.from(leftPart).length;
      
      text = formatted;
      lastFormattedText = formatted;
      cursorPos = cursorPos + addedSpacesLeft;
      selectionStart = cursorPos;
      selectionEnd = cursorPos;
    }
  }

  function toggleLanguage() {
    lang = lang === "zh" ? "en" : "zh";
  }

  function toggleKeyboardLayout() {
    if (keyboardLayout === "zhuyin" && (stagedSyllables.length > 0 || !engine.isEmpty())) {
      commitCompositionSentence();
    }
    keyboardLayout = keyboardLayout === "zhuyin" ? "english" : "zhuyin";
  }

  function isModifierOnlyConfig(): boolean {
    return !shortcutConfig.space && !shortcutConfig.tab;
  }

  function checkHotkeyMatch(e: KeyboardEvent): boolean {
    // 1. Space
    if (shortcutConfig.space) {
      if (e.code !== "Space") return false;
    } else {
      if (e.code === "Space") return false;
    }

    // 2. Tab
    if (shortcutConfig.tab) {
      if (e.code !== "Tab") return false;
    } else {
      if (e.code === "Tab") return false;
    }

    // 3. CapsLock
    if (shortcutConfig.capslock) {
      if (e.code !== "CapsLock") return false;
    } else {
      if (e.code === "CapsLock") return false;
    }

    // 4. Ctrl
    const isLeftCtrl = e.code === "ControlLeft" || activeKeys.has("ControlLeft");
    const isRightCtrl = e.code === "ControlRight" || activeKeys.has("ControlRight");
    const isAnyCtrl = e.ctrlKey || isLeftCtrl || isRightCtrl;

    if (shortcutConfig.leftCtrl && !isLeftCtrl) return false;
    if (shortcutConfig.rightCtrl && !isRightCtrl) return false;
    if (shortcutConfig.ctrl && !isAnyCtrl) return false;
    if (!shortcutConfig.leftCtrl && !shortcutConfig.rightCtrl && !shortcutConfig.ctrl) {
      if (isAnyCtrl) return false;
    }

    // 5. Shift
    const isLeftShift = e.code === "ShiftLeft" || activeKeys.has("ShiftLeft");
    const isRightShift = e.code === "ShiftRight" || activeKeys.has("ShiftRight");
    const isAnyShift = e.shiftKey || isLeftShift || isRightShift;

    if (shortcutConfig.leftShift && !isLeftShift) return false;
    if (shortcutConfig.rightShift && !isRightShift) return false;
    if (shortcutConfig.shift && !isAnyShift) return false;
    if (!shortcutConfig.leftShift && !shortcutConfig.rightShift && !shortcutConfig.shift) {
      if (isAnyShift) return false;
    }

    // 6. Alt
    const isLeftAlt = e.code === "AltLeft" || activeKeys.has("AltLeft");
    const isRightAlt = e.code === "AltRight" || activeKeys.has("AltRight");
    const isAnyAlt = e.altKey || isLeftAlt || isRightAlt;
    if (shortcutConfig.alt && !isAnyAlt) return false;
    if (!shortcutConfig.alt && isAnyAlt) return false;

    return true;
  }

  $: shortcutDisplayLabel = (() => {
    const activeKeysList = Object.entries(shortcutConfig)
      .filter(([_, val]) => val)
      .map(([key, _]) => {
        const labels: Record<string, string> = {
          ctrl: "Ctrl",
          space: "Space",
          shift: "Shift",
          capslock: "Caps Lock",
          tab: "Tab",
          alt: "Alt",
          leftCtrl: "L-Ctrl",
          rightCtrl: "R-Ctrl",
          leftShift: "L-Shift",
          rightShift: "R-Shift"
        };
        return labels[key] || key;
      });
    return activeKeysList.length > 0 ? activeKeysList.join(" + ") : (lang === "zh" ? "無" : "None");
  })();

  const t = {
    zh: {
      title: "FlowTyping",
      copied: "已複製",
      cleared: "已清空",
      custom: "自訂",
      presets: {
        charcoalDark: "深色",
        charcoalLight: "淺色",
        cyber: "科技",
        retro: "復古",
        wood: "木質",
        sakura: "櫻花",
      }
    },
    en: {
      title: "FlowTyping",
      copied: "Copied!",
      cleared: "Cleared!",
      custom: "Custom",
      presets: {
        charcoalDark: "Dark",
        charcoalLight: "Light",
        cyber: "Cyber",
        retro: "Retro",
        wood: "Wood",
        sakura: "Sakura",
      }
    }
  };

  $: if (typeof document !== 'undefined') {
    const sizeMap = {
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px"
    };
    document.documentElement.style.fontSize = sizeMap[systemFontSize] || "";
  }
  let candidates: string[] = [];
  let selectedCandidateIndex = 0;
  let stagedSyllables: Array<{ char: string; pinyinKey: string }> = [];
  let compositionCursor = 0;

  let toastMessage = "";
  let toastTimeout: any;

  // Preset Configurations
  const presets = {
    cyber: {
      keyboardStyle: "esports",
      keycapColor: "cyber-cyan",
      inputBoxStyle: "cyber-glow",
      material: "dark-gray",
      backgroundStyle: "dark",
      rgbEnabled: true
    },
    retro: {
      keyboardStyle: "retro",
      keycapColor: "vintage-beige",
      inputBoxStyle: "crt-terminal",
      material: "plastic",
      backgroundStyle: "bright",
      rgbEnabled: false
    },
    wood: {
      keyboardStyle: "retro",
      keycapColor: "minimal-charcoal",
      inputBoxStyle: "minimal-light",
      material: "wood",
      backgroundStyle: "dark",
      rgbEnabled: false
    },
    sakura: {
      keyboardStyle: "esports",
      keycapColor: "sakura-pink",
      inputBoxStyle: "minimal-light",
      material: "plastic-pink",
      backgroundStyle: "bright",
      rgbEnabled: true
    },
    charcoalDark: {
      keyboardStyle: "esports",
      keycapColor: "minimal-charcoal",
      inputBoxStyle: "minimal-dark",
      material: "dark-gray",
      backgroundStyle: "dark",
      rgbEnabled: false
    },
    charcoalLight: {
      keyboardStyle: "esports",
      keycapColor: "bow",
      inputBoxStyle: "minimal-light",
      material: "plastic",
      backgroundStyle: "bright",
      rgbEnabled: false
    }
  };

  function applyPreset(presetName: "cyber" | "retro" | "wood" | "sakura" | "charcoalDark" | "charcoalLight") {
    activePreset = presetName;
    const settings = presets[presetName];
    keyboardStyle = settings.keyboardStyle as any;
    keycapColor = settings.keycapColor as any;
    inputBoxStyle = settings.inputBoxStyle as any;
    material = settings.material as any;
    backgroundStyle = settings.backgroundStyle as any;
    rgbEnabled = settings.rgbEnabled;
  }

  function handleCustomChange() {
    activePreset = "custom";
  }

  function showToast(msg: string) {
    const translated = msg === "已複製" ? t[lang].copied : (msg === "已清空" ? t[lang].cleared : msg);
    toastMessage = translated;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastMessage = "";
    }, 2000);
  }

  function isDirectZhuyin(s: string): boolean {
    return CONSONANTS.has(s) || MEDIALS.has(s) || VOWELS.has(s) || (s in TONES);
  }

  function keepFocus(e: Event) {
    e.preventDefault();
  }

  function insertAtCursor(chars: string) {
    const arr = Array.from(text);
    const start = selectionStart;
    const end = selectionEnd;
    
    // Replace the selection (or insert at cursor if start === end)
    arr.splice(start, end - start, chars);
    text = arr.join("");
    
    selectionStart = start + Array.from(chars).length;
    selectionEnd = selectionStart;
    cursorPos = selectionStart;
  }

  function deleteSelection() {
    const arr = Array.from(text);
    arr.splice(selectionStart, selectionEnd - selectionStart);
    text = arr.join("");
    selectionEnd = selectionStart;
    cursorPos = selectionStart;
  }

  function commitCompositionSentence() {
    if (stagedSyllables.length > 0 || !engine.isEmpty()) {
      const commitText = stagedSyllables.map(s => s.char).join("") + engine.getCompositionString();
      insertAtCursor(commitText);
      stagedSyllables = [];
      compositionCursor = 0;
      engine.reset();
      composition = "";
    }
  }

  function getCompositionString(): string {
    const left = stagedSyllables.slice(0, compositionCursor).map(s => s.char).join("");
    const right = stagedSyllables.slice(compositionCursor).map(s => s.char).join("");
    return left + engine.getCompositionString() + right;
  }

  function previewCandidateAtCursor(newCandidate: string) {
    if (compositionCursor > 0 && stagedSyllables[compositionCursor - 1]) {
      stagedSyllables[compositionCursor - 1].char = newCandidate;
      stagedSyllables = [...stagedSyllables];
      composition = getCompositionString();
    }
  }

  function replaceCandidateAtCursor(newCandidate: string) {
    previewCandidateAtCursor(newCandidate);
    candidates = [];
    selectedCandidateIndex = 0;
  }

  function handleSelectionChange(start: number, end: number) {
    selectionStart = start;
    selectionEnd = end;
    cursorPos = end;
  }

  function handleCompositionCursorChange(cursor: number) {
    compositionCursor = cursor;
  }

  function handleSymbolInput(symbol: string) {
    if (candidates.length > 0) {
      candidates = [];
    }

    // Overwrite selected text if typing new input
    if (selectionStart !== selectionEnd) {
      deleteSelection();
    }

    const result = engine.input(symbol);

    if (result.finalized && result.syllable) {
      const foundCandidates = dictLoader.getCandidates(result.syllable.pinyinKey);
      const defaultChar = foundCandidates.length > 0 ? foundCandidates[0] : result.syllable.raw;
      
      stagedSyllables.splice(compositionCursor, 0, {
        char: defaultChar,
        pinyinKey: result.syllable.pinyinKey
      });
      stagedSyllables = [...stagedSyllables];
      compositionCursor++;
      
      candidates = [];
      composition = getCompositionString();
    } else {
      composition = getCompositionString();
    }
  }

  function mapCodeToEnglish(code: string, shift: boolean): string | null {
    // Letters
    if (code.startsWith("Key")) {
      const char = code.slice(3).toLowerCase(); // 'KeyQ' -> 'q'
      const caps = activeKeys.has("CapsLock");
      const isUpper = caps !== shift; // XOR
      return isUpper ? char.toUpperCase() : char;
    }
    // Numbers
    if (code.startsWith("Digit")) {
      const num = code.slice(5); // 'Digit1' -> '1'
      if (shift) {
        const shiftMap: Record<string, string> = {
          "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
          "6": "^", "7": "&", "8": "*", "9": "(", "0": ")"
        };
        return shiftMap[num] || num;
      }
      return num;
    }
    // Punctuation
    const normalMap: Record<string, string> = {
      Backquote: "`", Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]",
      Backslash: "\\", Semicolon: ";", Quote: "'", Comma: ",", Period: ".", Slash: "/",
      Space: " "
    };
    const shiftMap: Record<string, string> = {
      Backquote: "~", Minus: "_", Equal: "+", BracketLeft: "{", BracketRight: "}",
      Backslash: "|", Semicolon: ":", Quote: '"', Comma: "<", Period: ">", Slash: "?",
      Space: " "
    };
    if (shift) {
      return shiftMap[code] || null;
    }
    return normalMap[code] || null;
  }

  async function handleKeyDown(e: KeyboardEvent) {
    const isCtrl = e.ctrlKey || e.metaKey;
    const k = e.key;

    // Highlight keycap
    activeKeys.add(e.code);
    activeKeys = new Set(activeKeys);

    // Layout switching hotkey logic
    if (!isModifierOnlyConfig()) {
      if (checkHotkeyMatch(e)) {
        e.preventDefault();
        toggleKeyboardLayout();
        return;
      }
    } else {
      const isModifierKey = e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "CapsLock";
      if (isModifierKey) {
        shiftPressedTime = Date.now();
        otherKeyPressedWhileShift = false;
      } else if (activeKeys.has("ShiftLeft") || activeKeys.has("ShiftRight") || activeKeys.has("ControlLeft") || activeKeys.has("ControlRight") || activeKeys.has("AltLeft") || activeKeys.has("AltRight") || activeKeys.has("CapsLock")) {
        otherKeyPressedWhileShift = true;
      }
    }

    // Handle Ctrl shortcuts (Skip standard clipboard/select-all keys to allow native behavior)
    if (isCtrl) {
      const clipboardKeys = ['a', 'c', 'v', 'x', 'z', 'y'];
      if (clipboardKeys.includes(k.toLowerCase())) {
        // Let browser handle native copy/paste/cut/select-all/undo/redo natively on the transparent textarea
        if (k.toLowerCase() === 'a') {
          showToast(lang === 'zh' ? "已全選" : "Selected All");
        } else if (k.toLowerCase() === 'c') {
          showToast(lang === 'zh' ? "已複製" : "Copied");
        } else if (k.toLowerCase() === 'x') {
          showToast(lang === 'zh' ? "已剪下" : "Cut");
        } else if (k.toLowerCase() === 'v') {
          showToast(lang === 'zh' ? "已貼上" : "Pasted");
        }
        return;
      }

      // Ctrl + Punctuation mapping for Book Title Marks & Brackets
      const ctrlPunctMap: Record<string, string> = {
        ',': '《', '<': '《',
        '.': '》', '>': '》',
        '[': '〈', '{': '〔',
        ']': '〉', '}': '〕'
      };
      
      if (k in ctrlPunctMap) {
        e.preventDefault();
        if (composition) {
          commitCompositionSentence();
        }
        insertAtCursor(ctrlPunctMap[k]);
        candidates = [];
        return;
      }
      return;
    }

    // INTERCEPT TYPING IF IN ENGLISH KEYBOARD LAYOUT
    if (keyboardLayout === "english") {
      const code = e.code;
      if (k === "Backspace") {
        e.preventDefault();
        if (selectionStart !== selectionEnd) {
          deleteSelection();
        } else if (cursorPos > 0) {
          const arr = Array.from(text);
          arr.splice(cursorPos - 1, 1);
          text = arr.join("");
          selectionStart = cursorPos - 1;
          selectionEnd = selectionStart;
          cursorPos = selectionStart;
        }
        candidates = [];
        return;
      }
      if (k === "Enter") {
        e.preventDefault();
        insertAtCursor("\n");
        candidates = [];
        return;
      }
      if (k === "ArrowLeft" || k === "ArrowRight") {
        return;
      }
      
      // Map physical code to English character!
      const englishChar = mapCodeToEnglish(code, e.shiftKey);
      if (englishChar !== null) {
        e.preventDefault();
        insertAtCursor(englishChar);
        candidates = [];
        return;
      }
      return;
    }

    const keyLower = k.toLowerCase();

    // Full-width Chinese Punctuation support
    if (e.shiftKey) {
      const shiftMap: Record<string, string> = {
        '<': '，', ',': '，',
        '>': '。', '.': '。',
        '?': '？', '/': '？',
        ':': '：', ';': '：',
        '"': '、', "'": '、',
        '!': '！', '1': '！',
        '@': '＠', '2': '＠',
        '#': '＃', '3': '＃',
        '$': '＄', '4': '＄',
        '%': '％', '5': '％',
        '^': '︿', '6': '︿',
        '&': '＆', '7': '＆',
        '*': '＊', '8': '＊',
        '(': '（', '9': '（',
        ')': '）', '0': '）',
        '_': '——', '-': '——',
        '+': '＋', '=': '＋',
        '{': '『', '[': '『',
        '}': '』', ']': '』',
        '|': '｜', '\\': '｜'
      };
      
      if (k in shiftMap) {
        e.preventDefault();
        if (composition) {
          commitCompositionSentence();
        }
        insertAtCursor(shiftMap[k]);
        candidates = [];
        return;
      }
    } else {
      const normalMap: Record<string, string> = {
        '[': '「',
        ']': '」',
        '\\': '、',
        "'": '、'
      };
      if (k in normalMap) {
        e.preventDefault();
        if (composition) {
          commitCompositionSentence();
        }
        insertAtCursor(normalMap[k]);
        candidates = [];
        return;
      }
    }

    // Candidate Navigation via Arrow Keys
    if (candidates.length > 0) {
      if (k === "ArrowLeft" || k === "ArrowUp") {
        e.preventDefault();
        selectedCandidateIndex = (selectedCandidateIndex - 1 + candidates.length) % candidates.length;
        previewCandidateAtCursor(candidates[selectedCandidateIndex]);
        return;
      } else if (k === "ArrowRight" || k === "ArrowDown") {
        e.preventDefault();
        selectedCandidateIndex = (selectedCandidateIndex + 1) % candidates.length;
        previewCandidateAtCursor(candidates[selectedCandidateIndex]);
        return;
      }
    }

    if (k === "Backspace") {
      e.preventDefault();
      if (composition.length > 0) {
        if (!engine.isEmpty()) {
          engine.backspace();
        } else if (compositionCursor > 0) {
          stagedSyllables.splice(compositionCursor - 1, 1);
          stagedSyllables = [...stagedSyllables];
          compositionCursor--;
        }
        composition = getCompositionString();
        if (stagedSyllables.length === 0 && engine.isEmpty()) {
          composition = "";
        }
      } else if (selectionStart !== selectionEnd) {
        deleteSelection();
      } else if (cursorPos > 0) {
        const arr = Array.from(text);
        arr.splice(cursorPos - 1, 1);
        text = arr.join("");
        selectionStart = cursorPos - 1;
        selectionEnd = selectionStart;
        cursorPos = selectionStart;
      }
      candidates = [];
    } else if (k === "ArrowLeft" || k === "ArrowRight") {
      if (composition.length > 0) {
        if (k === "ArrowLeft" && compositionCursor > 0) {
          e.preventDefault();
          compositionCursor--;
        } else if (k === "ArrowRight" && compositionCursor < stagedSyllables.length + engine.getCompositionString().length) {
          e.preventDefault();
          compositionCursor++;
        }
        return;
      }
      return;
    } else if (k === "ArrowUp") {
      if (compositionCursor > 0 && stagedSyllables[compositionCursor - 1]) {
        const pinyinKey = stagedSyllables[compositionCursor - 1].pinyinKey;
        if (pinyinKey) {
          candidates = dictLoader.getCandidates(pinyinKey);
          if (candidates.length > 0) {
            e.preventDefault();
            selectedCandidateIndex = 0;
            return;
          }
        }
      }
    } else if (k === "Enter") {
      if (candidates.length > 0) {
        e.preventDefault();
        replaceCandidateAtCursor(candidates[selectedCandidateIndex]);
      } else if (stagedSyllables.length > 0 || !engine.isEmpty()) {
        e.preventDefault();
        const commitText = stagedSyllables.map(s => s.char).join("") + engine.getCompositionString();
        insertAtCursor(commitText);
        stagedSyllables = [];
        compositionCursor = 0;
        engine.reset();
        composition = "";
      } else {
        insertAtCursor("\n");
      }
    } else if (k === " ") {
      e.preventDefault();
      if (candidates.length > 0) {
        selectedCandidateIndex = (selectedCandidateIndex + 1) % candidates.length;
        previewCandidateAtCursor(candidates[selectedCandidateIndex]);
      } else if (!engine.isEmpty()) {
        handleSymbolInput(" ");
      } else if (stagedSyllables.length > 0) {
        stagedSyllables.splice(compositionCursor, 0, { char: " ", pinyinKey: "" });
        stagedSyllables = [...stagedSyllables];
        compositionCursor++;
        composition = getCompositionString();
      } else {
        insertAtCursor(" ");
        candidates = [];
      }
    } else if (k >= "1" && k <= "9" && candidates.length > 0) {
      e.preventDefault();
      const idx = parseInt(k) - 1;
      if (idx < candidates.length) {
        replaceCandidateAtCursor(candidates[idx]);
      }
    } else if (isDirectZhuyin(k)) {
      e.preventDefault();
      handleSymbolInput(k);
    } else if (keyLower in KEY_TO_ZHUYIN) {
      e.preventDefault();
      handleSymbolInput(KEY_TO_ZHUYIN[keyLower]);
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (isModifierOnlyConfig()) {
      const isModifierKey = e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "CapsLock";
      if (isModifierKey) {
        const duration = Date.now() - shiftPressedTime;
        if (duration > 0 && duration < 300 && !otherKeyPressedWhileShift) {
          if (checkHotkeyMatch(e)) {
            toggleKeyboardLayout();
          }
        }
      }
    }

    activeKeys.delete(e.code);
    activeKeys = new Set(activeKeys);
  }

  function handleKeyPress(key: string, symbol: string) {
    if (key === 'CapsLock') {
      if (activeKeys.has('CapsLock')) {
        activeKeys.delete('CapsLock');
      } else {
        activeKeys.add('CapsLock');
      }
      activeKeys = new Set(activeKeys);
      return;
    }
    if (key === 'Shift') {
      if (activeKeys.has('ShiftLeft') || activeKeys.has('ShiftRight')) {
        activeKeys.delete('ShiftLeft');
        activeKeys.delete('ShiftRight');
      } else {
        activeKeys.add('ShiftLeft');
      }
      activeKeys = new Set(activeKeys);
      return;
    }

    if (symbol === '⌫') {
      if (composition.length > 0) {
        if (!engine.isEmpty()) {
          engine.backspace();
        } else if (compositionCursor > 0) {
          stagedSyllables.splice(compositionCursor - 1, 1);
          stagedSyllables = [...stagedSyllables];
          compositionCursor--;
        }
        composition = getCompositionString();
        if (stagedSyllables.length === 0 && engine.isEmpty()) {
          composition = "";
        }
      } else if (selectionStart !== selectionEnd) {
        deleteSelection();
      } else if (cursorPos > 0) {
        const arr = Array.from(text);
        arr.splice(cursorPos - 1, 1);
        text = arr.join("");
        selectionStart = cursorPos - 1;
        selectionEnd = selectionStart;
        cursorPos = selectionStart;
      }
      candidates = [];
    } else if (symbol === 'Enter ↵') {
      if (candidates.length > 0) {
        replaceCandidateAtCursor(candidates[selectedCandidateIndex]);
      } else if (stagedSyllables.length > 0 || !engine.isEmpty()) {
        commitCompositionSentence();
      } else {
        insertAtCursor("\n");
      }
      candidates = [];
    } else {
      if (keyboardLayout === "zhuyin") {
        // Map virtual keyboard punctuation keys
        const normalMap: Record<string, string> = {
          '[': '「',
          ']': '」',
          '\\': '、',
          "'": '、'
        };
        if (symbol in normalMap) {
          if (composition) {
            commitCompositionSentence();
          }
          insertAtCursor(normalMap[symbol]);
          candidates = [];
          return;
        }
      } else {
        // English layout: insert key directly!
        insertAtCursor(symbol);
        return;
      }

      handleSymbolInput(symbol);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(text);
    showToast("已複製");
  }

  function handleClear() {
    text = "";
    engine.reset();
    stagedSyllables = [];
    compositionCursor = 0;
    composition = "";
    candidates = [];
    selectionStart = 0;
    selectionEnd = 0;
    cursorPos = 0;
    showToast("已清空");
  }

  onMount(() => {
    dictLoader.loadExternalDict();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });
</script>

<main class="min-h-screen p-6 flex flex-col justify-between transition-all duration-500
  {backgroundStyle === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}
">
  <!-- Header -->
  <header class="w-full max-w-3xl mx-auto flex justify-between items-center mb-6 select-none border-b pb-3
    {backgroundStyle === 'dark' ? 'border-zinc-800/40' : 'border-zinc-200'}
  ">
    <div class="flex items-center gap-2.5">
      <img src="/favicon.svg" alt="FlowTyping Logo" class="h-6 w-6 pointer-events-none select-none" />
      <span class="text-sm font-bold tracking-wider uppercase opacity-90">{t[lang].title}</span>
      <span class="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-semibold border select-none
        {backgroundStyle === 'dark' ? 'bg-zinc-900/80 text-zinc-400 border-zinc-800' : 'bg-zinc-100/80 text-zinc-650 border-zinc-200'}
      ">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-[0.75rem] w-[0.75rem] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span>
          {activePreset === 'charcoalDark' ? t[lang].presets.charcoalDark : 
           activePreset === 'charcoalLight' ? t[lang].presets.charcoalLight : 
           activePreset === 'cyber' ? t[lang].presets.cyber : 
           activePreset === 'retro' ? t[lang].presets.retro : 
           activePreset === 'wood' ? t[lang].presets.wood : 
           activePreset === 'sakura' ? t[lang].presets.sakura : t[lang].custom}
        </span>
      </span>
    </div>

    <!-- Right side controls (i18n & Settings) -->
    <div class="flex items-center gap-1.5">
      <!-- Keyboard Layout Switcher -->
      <button
        type="button"
        on:click={toggleKeyboardLayout}
        class="text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer select-none flex items-center gap-1
          {backgroundStyle === 'dark' 
            ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border-zinc-800 hover:text-white' 
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-750 border-zinc-200 hover:text-zinc-900'}"
        title={lang === 'zh' ? `切換輸入法 (${shortcutDisplayLabel})` : `Switch Input Method (${shortcutDisplayLabel})`}
        aria-label="Toggle keyboard layout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span>{keyboardLayout === 'zhuyin' ? (lang === 'zh' ? '注音' : 'Zhuyin') : 'English'}</span>
      </button>

      <!-- Language Toggle Switcher -->
      <button
        type="button"
        on:click={toggleLanguage}
        class="text-xs font-semibold px-2 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer select-none
          {backgroundStyle === 'dark' 
            ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border-zinc-800 hover:text-zinc-200' 
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-650 border-zinc-200 hover:text-zinc-800'}"
        title={lang === 'zh' ? 'Switch to English' : '切換至中文'}
        aria-label="Toggle language"
      >
        {lang === 'zh' ? 'EN' : '中'}
      </button>

      <!-- Toggle Settings Button -->
      <button
        type="button"
        on:click={() => isSettingsOpen = !isSettingsOpen}
        class="p-1.5 rounded-lg border transition-all duration-200 cursor-pointer
          {isSettingsOpen 
            ? (backgroundStyle === 'dark' ? 'bg-zinc-100 border-zinc-100 text-zinc-900' : 'bg-zinc-900 border-zinc-900 text-zinc-100')
            : (backgroundStyle === 'dark' ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-650 border-zinc-200')}"
        aria-label="打開設定"
        title={lang === 'zh' ? '個人化設定' : 'Settings'}
      >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  </div>
</header>

  <!-- Content Area -->
  <div class="flex-1 flex flex-col justify-center relative">
    <!-- Floating Theme Control Panel -->
    {#if isSettingsOpen}
      <div class="absolute top-0 right-0 z-50 w-full max-w-[320px]">
        <ThemeSelector
          {activePreset}
          {keyboardStyle}
          {keycapColor}
          {inputBoxStyle}
          {material}
          {backgroundStyle}
          {rgbEnabled}
          {systemFontSize}
          {inputFontSize}
          {lang}
          {shortcutConfig}
          {autoSpacingEnabled}
          {wordWrap}
          onPresetChange={(p) => applyPreset(p as any)}
          onKeyboardStyleChange={(s) => { keyboardStyle = s; handleCustomChange(); }}
          onKeycapColorChange={(k) => { keycapColor = k as any; handleCustomChange(); }}
          onInputBoxStyleChange={(i) => { inputBoxStyle = i as any; handleCustomChange(); }}
          onMaterialChange={(m) => { material = m as any; handleCustomChange(); }}
          onBackgroundStyleChange={(b) => { backgroundStyle = b as any; handleCustomChange(); }}
          onRgbToggle={() => { rgbEnabled = !rgbEnabled; handleCustomChange(); }}
          onSystemFontSizeChange={(s) => { systemFontSize = s as any; handleCustomChange(); }}
          onInputFontSizeChange={(f) => { inputFontSize = f; handleCustomChange(); }}
          onShortcutConfigChange={(config) => { shortcutConfig = config; handleCustomChange(); }}
          onAutoSpacingToggle={() => { autoSpacingEnabled = !autoSpacingEnabled; handleCustomChange(); }}
          onWordWrapToggle={() => { wordWrap = !wordWrap; handleCustomChange(); }}
        />
      </div>
    {/if}

    <!-- Typing Output Area -->
    <InputArea
      bind:text
      {composition}
      {selectionStart}
      {selectionEnd}
      {inputBoxStyle}
      {inputFontSize}
      {lang}
      {compositionCursor}
      {wordWrap}
      onSelectionChange={handleSelectionChange}
      onCompositionCursorChange={handleCompositionCursorChange}
      onCopy={handleCopy}
      onClear={handleClear}
    />

    <!-- Candidate Selection Box -->
    <CandidateBox
      {candidates}
      selectedIndex={selectedCandidateIndex}
      theme={inputBoxStyle === 'crt-terminal' ? 'retro' : (inputBoxStyle === 'minimal-light' ? 'low-profile' : (inputBoxStyle === 'minimal-dark' ? 'minimal-dark' : 'esports'))}
      onSelect={(c) => replaceCandidateAtCursor(c)}
    />

    <!-- Virtual Keyboard -->
    <Keyboard
      {activeKeys}
      theme={keyboardStyle}
      {rgbEnabled}
      {material}
      {keycapColor}
      {lang}
      layout={keyboardLayout}
      onKeyPress={handleKeyPress}
      onToggleEmoji={() => { isEmojiOpen = true; pickerMode = "emoji"; }}
      onToggleSymbols={() => { isEmojiOpen = true; pickerMode = "symbol"; }}
    />
  </div>

  <!-- Footer -->
  <footer class="w-full max-w-3xl mx-auto text-center mt-8 py-4 text-[11px] opacity-40 font-medium select-none border-t flex flex-col sm:flex-row items-center justify-between gap-2
    {backgroundStyle === 'dark' ? 'border-zinc-800/30 text-zinc-400' : 'border-zinc-200/60 text-zinc-500'}
  ">
    <p>© 2026 Darrin Lin.</p>
    <a 
      href="https://github.com/Darrin-Lin/FlowTyping" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="hover:underline transition-all hover:opacity-100 flex items-center gap-1.5 cursor-pointer font-semibold"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 opacity-80 fill-current" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <span>GitHub</span>
    </a>
    <a 
      href="https://github.com/sparanoid/chinese-copywriting-guidelines" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="hover:underline transition-all hover:opacity-100 flex items-center gap-1 cursor-pointer"
    >
      <span>{lang === 'zh' ? '延伸閱讀：中文文案排版指北' : 'Further Reading: Chinese Copywriting Guidelines'}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  </footer>

  <!-- Emoji Picker Modal -->
  <EmojiPicker
    isOpen={isEmojiOpen}
    theme={inputBoxStyle === 'crt-terminal' ? 'retro' : (inputBoxStyle === 'minimal-light' ? 'low-profile' : (inputBoxStyle === 'minimal-dark' ? 'minimal-dark' : 'esports'))}
    mode={pickerMode}
    {lang}
    onSelectEmoji={(emoji) => insertAtCursor(emoji)}
    onClose={() => (isEmojiOpen = false)}
  />

  <!-- Toast Notification Overlay -->
  {#if toastMessage}
    <div class="fixed bottom-10 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-bold shadow-2xl transition-all duration-300 z-50 animate-pulse
      {inputBoxStyle === 'cyber-glow' || inputBoxStyle === 'cyberpunk-red' ? 'bg-cyan-500 text-slate-955 shadow-cyan-500/40 border border-cyan-300' : ''}
      {inputBoxStyle === 'crt-terminal' ? 'bg-[#76ff03] text-slate-955 border-4 border-black rounded-none shadow-[6px_6px_0_#000] font-mono' : ''}
      {inputBoxStyle === 'minimal-light' || inputBoxStyle === 'minimal-dark' ? 'bg-zinc-900 text-white border border-zinc-800' : ''}
    ">
      {toastMessage}
    </div>
  {/if}
</main>
