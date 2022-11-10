import _ from 'lodash'

export const purchaseNameToEmojiMapper = (purchaseName: string) => {
  const beerEmoji = '🍺'
  const sparklingWineEmoji = '🥂'
  const moneyEmoji = '💸'
  const veikkaus = '🎰'
  const sports = '🏅'
  const burgerEmoji = '🍔'
  const wingsEmoji = '🐔'
  const drinkEmoji = '🍹'
  const siduEmoji = '🥛'
  const nuuskaEmoji = '🚬'
  const pizzaEmoji = '🍕'

  if (
    includesAny(purchaseName, [
      'bier',
      'beer',
      'aura',
      'bdvr',
      'bud',
      'koff',
      'kukko',
      'light',
      'lonkero',
      'kalja',
      'pyynikki',
      'punk ipa',
      'punk',
      'ale goc',
      'brown ale',
      'karhu',
      'kivimies',
      'sandels',
      'uruquell',
      'urquell',
      'happy',
    ])
  ) {
    return beerEmoji
  }
  if (includesAny(purchaseName, ['prosecco'])) {
    return sparklingWineEmoji
  }
  if (includesAny(purchaseName, ['saldo', 'almu', 'nollaus', 'transfer', 'uuuberrr'])) {
    return moneyEmoji
  }
  if (includesAny(purchaseName, ['happiness', 'gämble', 'joker', 'jokka', 'winnings', 'tuplis', 'Very happy', 'jokpok', 'tupla'])) {
    return veikkaus
  }
  if (includesAny(purchaseName, ['betsaus', 'supersystem'])) {
    return sports
  }
  if (includesAny(purchaseName, ['brgr', 'burger'])) {
    return burgerEmoji
  }
  if (includesAny(purchaseName, ['wings', 'wingz'])) {
    return wingsEmoji
  }
  if (includesAny(purchaseName, ['napue', 'captain morgan'])) {
    return drinkEmoji
  }
  if (includesAny(purchaseName, ['katy', 'sidu', 'bulmers', 'coke', 'happy joe', 'haze', 'hazy', 'lonkero', 'sidukka', 'thatchers'])) {
    return siduEmoji
  }
  if (includesAny(purchaseName, ['kapten', 'ettan', 'kessu', 'nuusk', 'snuus', 'snögö', 'spaddendeeros', 'r42', 'rolls royce'])) {
    return nuuskaEmoji
  }
  if (includesAny(purchaseName, ['piza', 'pizza', 'pitsa', 'piza'])) {
    return nuuskaEmoji
  }
}

const includesAny = (stringToTest: string, tests: string[]) =>
  _.some(tests, string => stringToTest.toLowerCase().includes(string.toLowerCase()))
