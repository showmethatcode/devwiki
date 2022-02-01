export function encodeCursor(cursor) {
  return Buffer.from(JSON.stringify(cursor)).toString('base64')
}

export function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'))
}

export function shollowCleanObject(obj) {
  return Object.entries(obj)
    .filter(([, value]) => (value !== undefined) | null)
    .reduce((prev, [k, v]) => ({ ...prev, [k]: v }), {})
}
