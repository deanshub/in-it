import fs from 'fs-extra';
import path from 'path';

test('stats exists (after build)', async () => {
  const statsFilePath = path.join(__dirname, '../dist/stats.json');
  expect(await fs.exists(statsFilePath)).toBe(true);
  const stats = await fs.readJson(statsFilePath);
  expect(stats).toEqual({
    name: 'test-app',
    assets: {},
    chunks: {
      index: {
        modules: [
          {
            id: expect.any(String),
            name: 'index.js',
            rendered: [],
            size: 154,
          },
        ],
        size: 155,
      },
    },
    entry: 'main.js',
    environment: expect.stringMatching(/^(ci|local)$/),
  });
});
