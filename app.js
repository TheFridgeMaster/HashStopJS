const sysinfo = require('systeminformation')
const fs = require('fs')
const crypto = require('crypto')

const buttface = sysinfo.processes()
	.then(data => {
		const procs = {}
		for (dood of data.list){
			if (dood.name && dood.executablepath){
				procs[dood.name] = dood.executablepath
			}
		}
		return procs
	})
	.then(procs => {
		for (var item in procs){
			fileHash(procs[item], item)
				.then(hash => console.log(hash))
				.catch(error => console.error(error))
		}
	})
	.catch(error => console.error(error))

function fileHash(filename, processname, algorithm = 'sha256') {
	return new Promise((resolve, reject) => {
		let shasum = crypto.createHash(algorithm)
		try {
		let s = fs.ReadStream(filename)
		s.on('data', function (data) {
			shasum.update(data)
		})
		// making digest
		s.on('end', function () {
			const hash = shasum.digest('hex')
			return resolve(processname + ' ---> ' + hash)
		})
		} catch (error) {
		return reject('calc fail')
		}
	})
}