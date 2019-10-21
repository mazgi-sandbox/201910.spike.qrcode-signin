export const concatSignInTokenAndPassphrase = (
  token: string,
  passphrase: string
): string => {
  return `${token}:${passphrase ? passphrase : ''}`
}

export const splitSignInTokenAndPassphrase = (
  text: string
): [string, string] => {
  const ary = text.split(':')
  return [ary[0], ary[1]]
}
