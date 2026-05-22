import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
const DIR = 'static/log/garden-party'
const files = await readdir(DIR)
for (const f of files) {
	if (!f.endsWith('.png')) continue
	const src = `${DIR}/${f}`
	const dest = src.replace(/\.png$/, '.webp')
	await sharp(src).resize(960).webp({ quality: 75 }).toFile(dest)
	console.log(`${f} → ${f.replace(/\.png$/, '.webp')}`)
}
