const sysinfo = require('systeminformation')
const fs = require('fs')
const crypto = require('crypto')
const fkill = require('fkill')
const sql = require('sequelize')
const dotenv = require('dotenv')

class ProcessInfo {
	constructor(processname, exepath, processid, processhash = ""){
		this.processname = processname
		this.exepath = exepath
		this.processhash = processhash
		this.processid = processid
	}
	get getProcessname(){
		return this.processname
	}
	get getProcesshash(){
		return this.processhash
	}
	get getProcessid(){
		return this.processid
	}
	set setProcessname(value){
		this.processname = value
	}
	set setProcessid(value){
		this.processid = value
	}
	set setProcesshash(value){
		this.processhash = value
	}

	fileHash(algorithm = 'sha256') {
		return new Promise((resolve, reject) => {
			let shasum = crypto.createHash(algorithm)
			try {
			let s = fs.ReadStream(this.exepath)
			s.on('data', function (data) {
				shasum.update(data)
			})
			s.on('end', function () {
				const hash = shasum.digest('hex')
				this.processhash = hash
				resolve(hash)
			})
			} catch (error) {
				reject('calc fail')
			}
		})
	}

	killDatShit(){
		let hash = this.processhash
			.then(response => {
				if ( hashes.includes(response.toUpperCase()) ){
					fkill(this.processid)
				}
			})
	}
}

let hashes = []

let processes = []

dotenv.config()

const dbUser = process.env.dbuser
const dbPass = process.env.dbpass

const buttface = sysinfo.processes()
	.then( data => {
		for ( dood of data.list ){
			if ( dood.name && dood.executablepath ){
				let specimen = new ProcessInfo(dood.name,dood.executablepath,dood.pid)
				specimen.processhash = specimen.fileHash()
				processes.push(specimen)
			}else{
				console.log("No name or executablepath.")
			}
		}
		return processes
	})
	.then( procs => {
		const sequelize = new sql(`postgres://$(dbUser):$(dbPass)@fourbythree.com.au/hashlist`)
		sequelize
			.query('SELECT hash FROM hashes')
			.then(response => {
				for (entry in response[1].rows){
					hashes.push(response[1].rows[entry].hash)
				}
			})
		let promises = []
		for ( item in procs ){
			promises.push(procs[item].fileHash())
		}
		Promise.all(promises).then(response => {
			for (guy of processes){
				guy.killDatShit()
			}
		})
	})
	.catch( error => console.error(error) )
