import fs from 'fs';
import path from 'path';
import https from 'https';

const url = 'https://raw.githubusercontent.com/chinese-opendesktop/cin-tables/master/bopomofo.cin';

const keyMap = {
  ',': 'ㄝ',
  '-': 'ㄦ',
  '.': 'ㄡ',
  '/': 'ㄥ',
  '0': 'ㄢ',
  '1': 'ㄅ',
  '2': 'ㄉ',
  '3': 'ˇ',
  '4': 'ˋ',
  '5': 'ㄓ',
  '6': 'ˊ',
  '7': '˙',
  '8': 'ㄚ',
  '9': 'ㄞ',
  ';': 'ㄤ',
  'a': 'ㄇ',
  'b': 'ㄖ',
  'c': '橫', // placeholder, will be replaced with ㄏ below
  'd': 'ㄎ',
  'e': 'ㄍ',
  'f': 'ㄑ',
  'g': 'ㄕ',
  'h': 'ㄘ',
  'i': 'ㄛ',
  'j': 'ㄨ',
  'k': 'ㄜ',
  'l': 'ㄠ',
  'm': 'ㄩ',
  'n': 'ㄙ',
  'o': 'ㄟ',
  'p': 'ㄣ',
  'q': 'ㄆ',
  'r': 'ㄐ',
  's': 'ㄋ',
  't': 'ㄔ',
  'u': 'ㄧ',
  'v': 'ㄒ',
  'w': 'ㄊ',
  'x': 'ㄌ',
  'y': 'ㄗ',
  'z': 'ㄈ'
};
keyMap['c'] = 'ㄏ'; // Explicit correction

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function keystrokeToZhuyinKey(keystroke) {
  let chars = Array.from(keystroke);
  if (chars.length === 0) return null;
  
  let lastChar = chars[chars.length - 1];
  let tone = '1';
  let baseChars = chars;
  
  if (['3', '4', '6', '7'].includes(lastChar)) {
    baseChars = chars.slice(0, -1);
    if (lastChar === '3') tone = '3';
    else if (lastChar === '4') tone = '4';
    else if (lastChar === '6') tone = '2';
    else if (lastChar === '7') tone = '7';
  }
  
  let bopomofoStr = '';
  for (let c of baseChars) {
    if (keyMap[c]) {
      bopomofoStr += keyMap[c];
    } else {
      return null;
    }
  }
  
  return bopomofoStr + tone;
}

async function main() {
  console.log('Downloading bopomofo.cin from OpenVanilla database...');
  let content;
  try {
    content = await downloadFile(url);
    console.log('Download complete. Processing...');
  } catch (err) {
    console.error('Error downloading cin file:', err.message);
    process.exit(1);
  }

  const lines = content.split('\n');
  let inChardef = false;
  const dict = {};

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    if (line === '%chardef begin') {
      inChardef = true;
      continue;
    }
    if (line === '%chardef end') {
      inChardef = false;
      break;
    }

    if (inChardef) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const keystroke = parts[0];
        const char = parts[1];

        // Only map single Chinese characters
        if (char.length === 1) {
          const zhuyinKey = keystrokeToZhuyinKey(keystroke);
          if (zhuyinKey) {
            if (!dict[zhuyinKey]) {
              dict[zhuyinKey] = [];
            }
            if (!dict[zhuyinKey].includes(char)) {
              dict[zhuyinKey].push(char);
            }
          }
        }
      }
    }
  }

  // Prepend high frequency characters to ensure top quality default choice
  const highFreqCustom = {
    "ㄉㄜ7": ["的"],
    "ㄕ4": ["是", "事", "市", "示", "世", "試", "式", "飾", "視", "室", "勢"],
    "ㄨㄛ3": ["我"],
    "ㄋㄧ3": ["你", "擬", "泥", "倪", "妮", "尼"],
    "ㄏㄠ3": ["好"],
    "ㄧ1": ["一"],
    "ㄅㄨ4": ["不"],
    "ㄗㄞ4": ["在", "再"],
    "ㄧㄡ3": ["有", "友"],
    "ㄊㄚ1": ["他", "她", "牠", "它"],
    "ㄉㄚ4": ["大"],
    "ㄍㄨㄛ2": ["國"],
    "ㄇㄣ7": ["們"]
  };

  for (let key in highFreqCustom) {
    if (dict[key]) {
      const customChars = highFreqCustom[key];
      // Filter out high freq from existing, then prepend
      const filtered = dict[key].filter(c => !customChars.includes(c));
      dict[key] = [...customChars, ...filtered];
    } else {
      dict[key] = highFreqCustom[key];
    }
  }

  const outputPath = path.resolve('public', 'dict.json');
  fs.writeFileSync(outputPath, JSON.stringify(dict, null, 2), 'utf-8');
  console.log(`Successfully generated dict.json with ${Object.keys(dict).length} syllables mapping to Traditional Chinese characters!`);
  console.log(`Saved output file at: ${outputPath}`);
}

main();
