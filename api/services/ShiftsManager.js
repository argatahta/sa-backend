const moment = require('moment');

const API_ERRORS = require('../constants/APIErrors');
const Utils = require('./Utils');

module.exports = {

	/**
	 * Creates a new shift
	 * @param payload
	 * @returns {Promise}
	 */
	createShift: (payload) => {
		return new Promise(async (resolve, reject) => {
			try {
				await ShiftsManager.checkTime(payload.startTime);
				await ShiftsManager.checkTime(payload.endTime);
				await ShiftsManager.checkDate(payload.date);

				if(parseInt(payload.startTime) >= parseInt(payload.endTime)) {
					reject("Start time must be less than End time")
				}
				await ShiftsManager.validateTime(payload);

				const createShift = await Shifts.create(payload)
				console.log({createShift})
				resolve(payload)
			} catch (error) {
				console.log({error})
				reject(error)
			}
		});
	},
	updateShift: (values) => {
		const shiftsId = values.id
		return new Promise(async (resolve, reject) => {
			//this comparison should be refactored
			if(values.startTime && values.endTime) {
				if(parseInt(values.startTime) >= parseInt(values.endTime)) {
					reject("Start time must be less than End time")
				}
			} else {
				reject("Update should have startTime, endTime, and Date")
			}

			try {
				const updatedShift = await Shifts.updateOne({ id: shiftsId })
					.set(values)
				if (updatedShift) {
					resolve(updatedShift);
				} else {
					reject("The database does not contain a user with id " + userId);
				}
			} catch (error) {
				reject(error)
			}
		});
	},
	getShifts: (values) => {
		return new Promise(async (resolve, reject) => {
			try {
				const payload = {
					startTime: "0900",
					endTime: "1220"
				}
				const result = await ShiftsManager.validateTime(payload);
				const shifts = await Shifts.find()
				if (shifts) {
					resolve(shifts);
				} else {
					reject("No shifts data");
				}
			} catch (error) {
				reject(error)
			}
		});
	},
	deleteShift: (values) => {
		return new Promise(async (resolve, reject) => {
			try {
				console.log("here")
				await Shifts.destroyOne({ id: values.id })
				resolve("Data successfully deleted");
			} catch (error) {
				console.log({error})
				reject(error)
			}
		});
	},

	checkTime: (value) => {
		console.log({value})
		return new Promise((resolve, reject)=> {
			if(parseInt(value) < 0000 && parseInt(value) > 2359) {
				reject("time must be more or equal to 0000 and less or equal to 2359")
			}

			resolve()
		})
	},

	checkDate: (value) => {
		return new Promise((resolve, reject)=>{
			const isValidDate = moment(value, "MM/DD/YYYY").isValid();; 
			if(!isValidDate) {
				reject("date must be in MM/DD/YYYY format")
			}

			resolve()
		})
	},

	validateTime: async (payload) => {
		return new Promise(async (resolve, reject)=>{
			try {
				const db = Shifts.getDatastore().manager;
				const result = await db.collection('shifts').find({date: payload.date}).toArray()
				if(result.length > 0) {
					const find = result.filter((el)=> (parseInt(el.startTime) <= parseInt(payload.endTime)) && (parseInt(el.endTime) >= parseInt(payload.endTime)) || (parseInt(el.startTime) <= parseInt(payload.startTime)) && (parseInt(el.endTime) >= parseInt(payload.startTime)))
					if(find.length > 0) {
						reject("The shift you are creating is clashing to the existing shift ")
					}
				}
				resolve()
			} catch (error) {
				reject(error)
			}
		})
	}
};