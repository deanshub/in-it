import fs from 'fs-extra'
import path from 'path'

test('stats exists', async() => {
    const statsFilePath = path.join(__dirname, '../dist/stats.json')
    expect(await fs.exists(statsFilePath)).toBe(true)
    expect(await fs.readJson(statsFilePath)).toMatchSnapshot()
})