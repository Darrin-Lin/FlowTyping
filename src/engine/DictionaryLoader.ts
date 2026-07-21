export interface DictionaryData {
  [pinyinKey: string]: string[];
}

// Built-in high frequency Zhuyin dictionary for zero-latency instant startup
const DEFAULT_DICT: DictionaryData = {
  "ㄅㄚ1": ["八", "巴", "芭", "疤", "叭", "芭"],
  "ㄅㄚ2": ["拔", "跋"],
  "ㄅㄚ3": ["把", "靶"],
  "ㄅㄚ4": ["爸", "霸", "罷", "壩"],
  "ㄋㄧ3": ["你", "擬", "霓", "泥", "倪", "妮", "尼"],
  "ㄏㄠ3": ["好", "郝"],
  "ㄏㄠ4": ["號", "耗", "浩", "皓"],
  "ㄇㄚ1": ["媽", "摩", "抹"],
  "ㄇㄚ2": ["麻", "蟆"],
  "ㄇㄚ3": ["馬", "碼", "瑪"],
  "ㄇㄚ4": ["罵"],
  "ㄇㄚ7": ["嗎", "嘛"],
  "ㄨㄛ3": ["我"],
  "ㄇㄣ7": ["們"],
  "ㄕ4": ["是", "事", "市", "示", "世", "試", "式", "飾", "視", "室", "勢"],
  "ㄉㄜ7": ["的"],
  "ㄅㄨ4": ["不"],
  "ㄖㄣ2": ["人"],
  "ㄗㄞ4": ["在", "再"],
  "ㄧ1": ["一", "伊", "依", "醫", "衣"],
  "ㄧ3": ["以", "已", "椅", "乙"],
  "ㄧ4": ["意", "億", "義", "藝", "易", "益", "異", "役"],
  "ㄧㄡ3": ["有", "友", "酉"],
  "ㄊㄚ1": ["他", "她", "牠", "它"],
  "ㄓㄨㄥ1": ["中", "鐘", "衷", "終"],
  "ㄒㄧㄠ3": ["小"],
  "ㄉㄚ4": ["大"],
  "ㄍㄨㄛ2": ["國"],
  "ㄒㄧㄝ2": ["協"],
  "ㄒㄧㄝ4": ["寫", "謝", "洩"],
  "ㄊㄞ2": ["台", "臺", "颱"],
  "ㄨㄢ1": ["灣"]
};

export class DictionaryLoader {
  private dict: DictionaryData = { ...DEFAULT_DICT };
  public isLoaded = false;

  public async loadExternalDict(url: string = "/dict.json") {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const fullDict: DictionaryData = await res.json();
        this.dict = { ...this.dict, ...fullDict };
        this.isLoaded = true;
      }
    } catch (e) {
      // Gracefully fall back to built-in dict
    }
  }

  public getCandidates(pinyinKey: string): string[] {
    return this.dict[pinyinKey] || [];
  }
}
