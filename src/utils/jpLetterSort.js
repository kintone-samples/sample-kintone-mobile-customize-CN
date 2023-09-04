const jpConvert = async (data, field) => {
  const url = process.env.VUE_APP_CONVERT_SERVER
  const contacts = data.map((v) => v[field])
  const body = {
    names: contacts,
  }
  const headers = { 'Content-Type': 'application/json' }
  try {
    const result = await kintone.proxy(url, 'POST', headers, body)
    return JSON.parse(result[0])
  } catch (err) {
    console.log(err)
    return null
  }
}

export const jpFirstLetterSort = async (data, field) => {
  const letterReg = /^[A-Zあかさたなはまやらわ]$/
  const list = {}
  //转成平假名读音
  const kuroshiroData = await jpConvert(data, field)
  data.map((v) => {
    let letter = kuroshiroData[v[field]].charAt(0).toUpperCase()
    console.log(v[field], letter)

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
