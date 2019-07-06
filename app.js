const sysinfo = require('systeminformation')
const fs = require('fs')
const crypto = require('crypto')
const fkill = require('fkill')

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
		if ( hashes.includes(this.processhash) ){
			fkill(this.processid)
		}
	}
}

const hashes = [
	"441AC6D180BCBF76997234978E5B4399E4907401E71B938E7221BB7D4AD1426A",
	"E51860E69E69EF452691199A7C1D4279694310510CEBEB9C9472CE3E36ECCEB4",
	"BA7BBB73B984572FEFE9049714C043D5C818CD88FFD9DF9CAAC2BE37515CA267",
	"45D65E53B5B7C3F160702ACBD8864D2D9E69D417A639BA9F97EED8CFAE242F6F",
	"69DA1F4E878142C6CA1BC7425F9F4A4DAD16E50407007DBFE8AED1D81C1D937B",
	"A258D90A07A16E9AC89FAA7C804308E45F17A67FA4EC0E141EA4D09D6371DB39",
	"A5B046B1ED649103C5D3A790099DF5701D661007BB0D023076328265DB52F185",
	"565441492778D259CA6E43CB1470417933F85C8D6083C4699369CBFDED1B4F0C",
	"9F83F1B27EFB24EE5DD4569B432876D97388FC462CD477FB9E45817B6D817595",
	"7E94D681C40A433C2B265CD6D4249BEC04051233460C7103A0DD08883ACE4F83",
	"C02CEB56AEE92B87EFC3F122ECA3903441538897AB767E82559D23DDE9329CCD",
	"98AE4631DED8E519208907F2C13E11B610A55D91B136EB0692D19B5C556CEF6D"
]

let processes = []

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
		let promises = []
		for ( item in procs ){
			promises.push(procs[item].fileHash())
		}
		Promise.all(promises).then(respons => {
			for (guy of processes){
				console.log(guy)
			}
		})
	})
	.catch( error => console.error(error) )


function killProcess(processPID){

}