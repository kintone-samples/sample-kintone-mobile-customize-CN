import pinyin from 'js-pinyin'

pinyin.setOptions({ checkPolyphone: false, charCase: 0 })

export default function firstLetterSort(data, field) {
  const letterReg = /^[A-Z]$/
  const list = {}
  data.map((v) => {
    let letter = pinyin.getCamelChars(v[field]).substr(0, 1).toUpperCase()
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
