export const CONSONANTS = new Set(['ㄅ','ㄆ','ㄇ','ㄈ','ㄉ','ㄊ','ㄋ','ㄌ','ㄍ','ㄎ','ㄏ','ㄐ','ㄑ','ㄒ','ㄓ','ㄔ','ㄕ','ㄖ','ㄗ','ㄘ','ㄙ']);
export const MEDIALS = new Set(['ㄧ','ㄨ','ㄩ']);
export const VOWELS = new Set(['ㄚ','ㄛ','ㄜ','ㄝ','ㄞ','ㄟ','ㄠ','ㄡ','ㄢ','ㄣ','ㄤ','ㄥ','ㄦ']);
export const TONES: Record<string, string> = {
  ' ': '1', // 1st tone (陰平)
  'ˊ': '2', // 2nd tone (陽平)
  'ˇ': '3', // 3rd tone (上聲)
  'ˋ': '4', // 4th tone (去聲)
  '˙': '7'  // Neutral tone (輕聲)
};

export interface ZhuyinSyllable {
  raw: string; // e.g. ㄅㄚˋ
  pinyinKey: string; // e.g. ㄅㄚ4
}

export class ZhuyinEngine {
  private currentConsonant = "";
  private currentMedial = "";
  private currentVowel = "";

  public reset() {
    this.currentConsonant = "";
    this.currentMedial = "";
    this.currentVowel = "";
  }

  public getCompositionString(): string {
    return this.currentConsonant + this.currentMedial + this.currentVowel;
  }

  public isEmpty(): boolean {
    return !this.currentConsonant && !this.currentMedial && !this.currentVowel;
  }

  public backspace(): boolean {
    if (this.currentVowel) {
      this.currentVowel = "";
      return true;
    }
    if (this.currentMedial) {
      this.currentMedial = "";
      return true;
    }
    if (this.currentConsonant) {
      this.currentConsonant = "";
      return true;
    }
    return false;
  }

  public input(symbol: string): { finalized: boolean; syllable?: ZhuyinSyllable; rawSymbol?: string } {
    if (CONSONANTS.has(symbol)) {
      this.currentConsonant = symbol;
      return { finalized: false };
    }

    if (MEDIALS.has(symbol)) {
      this.currentMedial = symbol;
      return { finalized: false };
    }

    if (VOWELS.has(symbol)) {
      this.currentVowel = symbol;
      return { finalized: false };
    }

    if (symbol in TONES) {
      if (this.isEmpty()) {
        return { finalized: false, rawSymbol: symbol };
      }

      const toneNum = TONES[symbol];
      const raw = this.getCompositionString() + (symbol === ' ' ? '' : symbol);
      const pinyinKey = this.getCompositionString() + toneNum;

      this.reset();
      return { finalized: true, syllable: { raw, pinyinKey } };
    }

    return { finalized: false, rawSymbol: symbol };
  }
}
