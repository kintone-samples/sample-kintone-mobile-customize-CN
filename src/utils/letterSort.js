import pinyin from 'js-pinyin'
import romaji from 'romaji'

pinyin.setOptions({ checkPolyphone: false, charCase: 0 })
const locale = kintone.getLoginUser().language

export const firstLetterSort = (data, field) => {
  const letterReg = /^[A-Zあ-わ]$/
  const list = {}
  data.map((v) => {
    let letter = ''
    if (locale === 'ja') {
      letter = firstLetterPronunciationJa(v[field])
    } else {
      letter = firstLetterPronunciationEnZh(v[field])
    }

    // console.log(`从${v[field]}到${letter}`)
    if (!letterReg.test(letter)) {
      letter = '#'
    }
    if (!(letter in list)) {
      list[letter] = []
    }
    list[letter].push(v)

    if (v.subscribed) {
      if (!('⭐️' in list)) {
        list['⭐️'] = []
      }
      list['⭐️'].push(v)
    }
    return v
  })

  const result = []

  Object.keys(list).forEach((key) => {
    const nameList = list[key]
    nameList.sort((item1, item2) => {
      return item1.name.localeCompare(item2.name)
    })
    result.push({
      name: key,
      item: nameList,
    })
  })

  result.sort((x, y) => {
    const order = [
      '⭐️',
      'あ',
      'か',
      'さ',
      'た',
      'な',
      'は',
      'ま',
      'や',
      'ら',
      'わ',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '#',
    ]
    return order.indexOf(x.name) - order.indexOf(y.name)
  })

  return result
}

const firstLetterPronunciationEnZh = (item) => {
  let indexes = item.charAt(0).toUpperCase()
  if (indexes.match(/[\u4e00-\u9fa5]/) !== null) {
    indexes = pinyin.getCamelChars(indexes)
  } else if (indexes.match(/[A-Z]/) == null) {
    //非字母
    indexes = '#'
  } else {
    //A-Z
  }
  return indexes
}

const firstLetterPronunciationJa = (item) => {
  let indexes = item.charAt(0).toUpperCase()
  // 首字符是日文       平假名       片假名        半角片假名
  if (indexes.match(/[\u3040-\u309f\u30a0-\u30ff\uff66-\uff9f]/) !== null) {
    // 转全角片假名(如果有半角片假名时) 借助kana.js
    //（https://github.com/shogo4405/KanaXS）
    //indexes = indexes.toZenkanaCase();
    let roma = romaji.fromKana(indexes) //转罗马音
    if (indexes == roma) {
      //fail roma
      indexes = item.slice(0, 2)
      roma = romaji.fromKana(indexes) //转罗马音
    }
    if (roma.length == 3) {
      //lqxy
      roma = roma[0] + roma[2]
    }
    // 特殊发音 特殊处理
    roma = roma.replace('f', 'h')
    roma = roma.replace('c', 't')
    roma = roma.replace('j', 's')
    // vi ve we 归u音 a行
    roma = roma.replace(/[wv]/, '')
    // 浊辅音转清辅音
    roma = roma.replace('g', 'k')
    roma = roma.replace('z', 's')
    roma = roma.replace('d', 't')
    roma = roma.replace('b', 'h')
    roma = roma.replace('p', 'h')
    // a i u e o 列合并到a列
    roma = roma.replace(/[iueo]/, 'a')
    indexes = romaji.toHiragana(roma) //索引 平假名
  } else if (indexes.match(/[A-Z]/) == null) {
    //非字母
    indexes = '#'
  } else {
    //A-Z
  }
  return indexes
}
